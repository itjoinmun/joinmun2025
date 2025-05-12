package logger

import (
	"log"
	"os"
	"path/filepath"
	"runtime"
	"time"

	"github.com/rs/zerolog"
)

var (
	Log      zerolog.Logger
	ErrorLog zerolog.Logger
)

func InitLogger() {
	// Set log level based on environment
	if os.Getenv("ENVIRONMENT") == "production" {
		zerolog.SetGlobalLevel(zerolog.InfoLevel)
	} else {
		zerolog.SetGlobalLevel(zerolog.DebugLevel)
	}

	// Create a sampler for log entries
	// This configuration:
	// - Keeps the first N logs (initial burst)
	// - After that, samples logs at the given interval (1 out of every M)
	sampler := &zerolog.BurstSampler{
		Burst:       5,                             // Allow first 5 messages without sampling
		Period:      300 * time.Second,             // Reset counter every 30 seconds
		NextSampler: &zerolog.BasicSampler{N: 100}, // After burst, sample 1 in 50 messages
	}

	// Local or other environments → Log to both file and stdout
	logPath := "/var/log/joinmun_backend"
	if err := os.MkdirAll(logPath, os.ModePerm); err != nil {
		log.Printf("ERROR: Failed to create log directory '%s': %v", logPath, err)
		return
	}

	appLogFile, err := os.OpenFile(logPath+"/app.log", os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0666)
	if err != nil {
		log.Printf("ERROR: Failed to open app log file '%s': %v", logPath+"/app.log", err)
		return
	}
	errorLogFile, err := os.OpenFile(logPath+"/error.log", os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0666)
	if err != nil {
		log.Printf("ERROR: Failed to open error log file '%s': %v", logPath+"/error.log", err)
		return
	}

	var multiAppWriter, multiErrorWriter zerolog.LevelWriter

	if appLogFile != nil {
		multiAppWriter = zerolog.MultiLevelWriter(os.Stdout, appLogFile)
	} else {
		multiAppWriter = zerolog.MultiLevelWriter(os.Stdout)
	}

	if errorLogFile != nil {
		multiErrorWriter = zerolog.MultiLevelWriter(os.Stdout, errorLogFile)
	} else {
		multiErrorWriter = zerolog.MultiLevelWriter(os.Stdout)
	}

	Log = zerolog.New(multiAppWriter).Sample(sampler).With().
		Timestamp().
		Str("service", "joinmun_backend").
		Logger()

	// Don't sample error logs
	ErrorLog = zerolog.New(multiErrorWriter).With().
		Timestamp().
		Str("service", "joinmun_backend").
		Logger()
}

// LogDebug to create debug log with function name and line number
func LogDebug(message string, fields ...map[string]interface{}) {
	// Get function name, file name, and line number of the caller
	pc, file, line, _ := runtime.Caller(1)
	// Get function name from the program counter (if u took OS class u'll know program counter lmao)
	funcName := runtime.FuncForPC(pc).Name()
	// Create log event with function name, file name, line number, and log type
	event := Log.Debug().
		Str("function", funcName).
		Str("file", filepath.Base(file)).
		Int("line", line).
		Str("log_type", "debug")

	// Add fields to the log event using the addField helper function
	if len(fields) > 0 {
		for key, value := range fields[0] {
			event = addField(event, key, value)
		}
	}
	// Log the debug message
	event.Msg(message)
}

// LogError creates an error log with function name
func LogError(err error, message string, fields ...map[string]interface{}) {
	pc, _, _, _ := runtime.Caller(1)
	funcName := runtime.FuncForPC(pc).Name()

	event := ErrorLog.Error().
		Str("function", funcName).
		Err(err)

	if len(fields) > 0 {
		for key, value := range fields[0] {
			event = addField(event, key, value)
		}
	}
	// Log the error message
	event.Msg(message)
}

// addField adds a field to the log event based on its type (we will specify the fields in the code later)
func addField(event *zerolog.Event, key string, value interface{}) *zerolog.Event {
	// Switch on the type of the value and add it to the log event
	switch v := value.(type) {
	case string:
		return event.Str(key, v)
	case int:
		return event.Int(key, v)
	case float64:
		return event.Float64(key, v)
	default:
		return event.Interface(key, v)
	}
}
