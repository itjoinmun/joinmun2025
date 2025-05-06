package main

import (
	"backend/internal/api/handler"
	"backend/internal/api/middleware"
	"backend/internal/api/router"
	"backend/pkg/utils/logger"
	"context"
	"net/http"
	"os"
	"os/signal"
	"strings"
	"syscall"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"
	"github.com/ulule/limiter/v3"
	memory "github.com/ulule/limiter/v3/drivers/store/memory"
)

func main() {
	// Initialize logger early
	logger.InitLogger()

	// Set up context for graceful shutdown
	ctx, stop := signal.NotifyContext(context.Background(),
		os.Interrupt,
		syscall.SIGTERM,
		syscall.SIGINT,
		syscall.SIGQUIT,
	)
	defer stop()

	// Database connection
	dbURL := os.Getenv("DB_URL")
	db, err := sqlx.Connect("postgres", dbURL)
	if err != nil {
		logger.Log.Fatal().Err(err).Msg("Failed to connect to the database")
	}

	// Enhanced connection pool settings
	db.SetMaxOpenConns(10)                  // Max number of open connections
	db.SetMaxIdleConns(5)                   // maximum idle connections
	db.SetConnMaxLifetime(30 * time.Minute) // maximum lifetime of a connection
	db.SetConnMaxIdleTime(5 * time.Minute)  // maximum idle time of a connection

	// Ping check
	if err := db.Ping(); err != nil {
		logger.Log.Fatal().Err(err).Msg("Failed to ping database")
	}

	// cors config
	corsURLs := os.Getenv("CORS_URL")
	allowedOrigins := strings.Split(corsURLs, ",")

	// if the environment is not production, set gin to debug
	if os.Getenv("ENVIRONMENT") == "production" {
		gin.SetMode(gin.ReleaseMode)
	} else {
		gin.SetMode(gin.DebugMode)
	}

	// Setup repositories and services
	allHandler := handler.NewHandlerContainer(db)

	// setup router
	r := gin.New()

	// Gin router setup
	r.Use(gin.Recovery())
	r.Use(middleware.ReqLoggingMiddleware())
	r.Use(securityHeadersMiddleware())
	r.SetTrustedProxies([]string{"0.0.0.0/0"})

	// CORS middleware
	r.Use(cors.New(cors.Config{
		AllowOrigins:     allowedOrigins,
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE"},
		AllowHeaders:     []string{"Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length", "Authorization", "Content-Type"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// security middleware
	r.Use(rateLimiterMiddleware())
	r.Use(requestSizeLimitMiddleware(2 << 20))
	r.Use(timeoutMiddleware(20 * time.Second))

	// initialize the routes
	r = router.InitializeRoutes(r, allHandler)

	// Server configuration
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	// Create a server with more controlled shutdown
	srv := &http.Server{
		Addr:    ":" + port,
		Handler: r,
	}

	// Start server in a goroutine
	go func() {
		logger.Log.Info().Msg("Server starting on port " + port)
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			logger.Log.Fatal().Err(err).Msg("Server failed to start")
		}
	}()

	// Wait for interrupt signal to gracefully shutdown
	<-ctx.Done()
	stop()

	// Create a context with a timeout for graceful shutdown
	shutdownCtx, cancelShutdown := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancelShutdown()

	// Attempt graceful shutdown
	if err := srv.Shutdown(shutdownCtx); err != nil {
		logger.Log.Error().Err(err).Msg("Server shutdown error")
	}

	// Close database connection
	if err := db.Close(); err != nil {
		logger.Log.Error().Err(err).Msg("Database connection close error")
	}

	logger.Log.Info().Msg("Server and database shutdown completed")
}

// securityHeadersMiddleware adds security headers to all responses
func securityHeadersMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("X-Content-Type-Options", "nosniff")
		c.Writer.Header().Set("X-Frame-Options", "DENY")
		c.Writer.Header().Set("X-XSS-Protection", "1; mode=block")
		// c.Writer.Header().Set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload") // Enforce HTTPS
		c.Writer.Header().Set("Content-Security-Policy", "default-src 'self'; frame-ancestors 'none';") // Prevents XSS
		c.Next()
	}
}

func rateLimiterMiddleware() gin.HandlerFunc {
	store := memory.NewStore()
	rate := limiter.Rate{
		Period: 1 * time.Minute,
		Limit:  25, // Allow max 25 requests per minute per IP
	}
	// Create a new rate limiter instance
	instance := limiter.New(store, rate)

	return func(c *gin.Context) {
		ctx, err := instance.Get(c, c.ClientIP())
		// If an error occurred or the limit is reached, abort the request
		if err != nil || ctx.Reached {
			c.AbortWithStatusJSON(429, gin.H{"error": "Too many requests"})
			return
		}
		c.Next()
	}
}

func timeoutMiddleware(timeout time.Duration) gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx, cancel := context.WithTimeout(c.Request.Context(), timeout)
		defer cancel()

		c.Request = c.Request.WithContext(ctx)
		c.Next()
	}
}

func requestSizeLimitMiddleware(maxSize int64) gin.HandlerFunc {
	return func(c *gin.Context) {
		if c.Request.ContentLength > maxSize {
			c.AbortWithStatusJSON(413, gin.H{"error": "Payload too large"})
			return
		}
		c.Next()
	}
}
