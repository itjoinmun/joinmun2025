package helper

import (
	"time"
)

type RegistrationPhase string

const (
	EarlyBirdPhase RegistrationPhase = "early_bird"
	RegularPhase   RegistrationPhase = "regular"
	LatePhase      RegistrationPhase = "late"
	DefaultPhase   RegistrationPhase = "no_phase"
)

func TimeValidator(timeNow time.Time) (bool, RegistrationPhase, error) {
	// Use Asia/Jakarta timezone
	loc := time.FixedZone("Bangkok", 7*60*60) // UTC+7

	// Define the registration windows in Jakarta time
	earlyBirdStart := time.Date(2025, 5, 16, 0, 0, 0, 0, loc)
	earlyBirdEnd := time.Date(2025, 7, 15, 21, 30, 0, 0, loc)

	regularStart := time.Date(2025, 7, 28, 0, 0, 0, 0, loc)
	regularEnd := time.Date(2025, 8, 24, 23, 59, 59, 0, loc)

	lateStart := time.Date(2025, 9, 8, 0, 0, 0, 0, loc)
	lateEnd := time.Date(2025, 9, 29, 23, 59, 59, 0, loc)

	// Convert incoming time to Asia/Jakarta
	now := timeNow.In(loc)

	switch {
	case now.After(earlyBirdStart) && now.Before(earlyBirdEnd):
		return true, EarlyBirdPhase, nil
	case now.After(regularStart) && now.Before(regularEnd):
		return true, RegularPhase, nil
	case now.After(lateStart) && now.Before(lateEnd):
		return true, LatePhase, nil
	default:
		return false, DefaultPhase, nil
	}
}

func GetWaveDates(wave string) (*time.Time, *time.Time, error) {
	loc := time.FixedZone("Bangkok", 7*60*60) // UTC+7

	var start, end time.Time

	switch wave {
	case "earlybird":
		start = time.Date(2025, 6, 16, 0, 0, 0, 0, loc)
		end = time.Date(2025, 7, 15, 21, 30, 59, 0, loc)
	case "regular":
		start = time.Date(2025, 7, 28, 0, 0, 0, 0, loc)
		end = time.Date(2025, 8, 24, 23, 59, 59, 0, loc)
	case "late":
		start = time.Date(2025, 9, 1, 0, 0, 0, 0, loc)
		end = time.Date(2025, 9, 29, 23, 59, 59, 0, loc)
	default:
		return nil, nil, nil // No filtering if invalid or unspecified wave
	}

	return &start, &end, nil
}
