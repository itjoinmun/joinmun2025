package dashboard

import (
	"backend/internal/model/dashboard"
	dashboardRepo "backend/internal/repository/dashboard"
	"backend/pkg/utils"
	dashboardUtils "backend/pkg/utils/dashboard"
	"backend/pkg/utils/logger"
	"fmt"
	"sync"

	"github.com/jmoiron/sqlx"
)

type DashboardService interface {
	InsertDelegates(
		delegates []dashboard.MUNDelegates,
		team *dashboard.MUNTeams,
		biodataResponses []dashboard.BiodataResponses,
		healthResponses []dashboard.HealthResponses,
		munResponses []dashboard.MUNResponses) (retErr error)
	InsertOneDelegateForFAOrObserver(
		participant *dashboard.MUNDelegates,
		healthResponse []dashboard.HealthResponses,
		biodataResponse []dashboard.BiodataResponses,
	) (retErr error)
	LinkMeToTeam(teamID string, delegateEmail string) (retErr error)
	GetParticipantData(email string) ([]dashboard.MUNDelegates, error)
	GetQuestions() (biodataQuestions []dashboard.BiodataQuestions, healthQuestions []dashboard.HealthQuestions, munQuestions []dashboard.MUNQuestions, err error)
	UpdateParticipantStatus(email string) (retErr error)
	UpdateDelegateCountryAndCouncil(country, council, delegateEmail string) error
	MakePairing(delegateEmail, pair string) (retErr error)
}

type dashboardService struct {
	questionRepo dashboardRepo.QuestionRepo
	delegateRepo dashboardRepo.DelegateRepo
	responseRepo dashboardRepo.ResponseRepo
}

func NewDashboardService(
	questionRepo dashboardRepo.QuestionRepo,
	delegateRepo dashboardRepo.DelegateRepo,
	responseRepo dashboardRepo.ResponseRepo,
) DashboardService {
	return &dashboardService{
		questionRepo: questionRepo,
		delegateRepo: delegateRepo,
		responseRepo: responseRepo,
	}
}

func (s *dashboardService) InsertDelegates(
	delegates []dashboard.MUNDelegates,
	team *dashboard.MUNTeams,
	biodataResponses []dashboard.BiodataResponses,
	healthResponses []dashboard.HealthResponses,
	munResponses []dashboard.MUNResponses,
) (retErr error) {
	// check if delegate already exists
	for _, d := range delegates {
		potentialExistingEmail := d.MUNDelegateEmail
		exists, _ := s.delegateRepo.GetDelegateByEmail(potentialExistingEmail)
		if exists != nil {
			logger.LogError(nil, "Delegate already exists", map[string]interface{}{
				"layer":     "service",
				"operation": "service.InsertDelegates",
				"error":     "Delegate already exists",
				"email":     potentialExistingEmail,
			})
			return fmt.Errorf("email %s is already registered for the delegate", potentialExistingEmail)
		}
	}

	teamCode, err := dashboardUtils.GenerateTeamCode()
	if err != nil {
		logger.LogError(err, "utils Failed to generate team code", map[string]interface{}{
			"layer":     "service",
			"operation": "utils.GenerateTeamCode",
			"error":     err,
		})
		return err
	}
	team.MUNTeamID = teamCode
	team.MUNTeamLead = delegates[0].MUNDelegateEmail

	// Use utils.WithTransaction to handle transaction management
	return utils.WithTransaction(s.delegateRepo.DB(), func(tx *sqlx.Tx) error {
		// insert delegates and make teams
		_, err := s.delegateRepo.InsertTeamWithDelegates(tx, team, delegates)
		if err != nil {
			logger.LogError(err, "Failed to insert team with delegates", map[string]interface{}{
				"delegates": delegates,
				"team":      team,
				"layer":     "service",
				"operation": "service.InsertDelegates",
				"error":     err,
			})
			return err
		}

		// Create error channel and wait group for concurrent operations
		errChan := make(chan error, 3)
		var wg sync.WaitGroup
		wg.Add(3)

		// Concurrently insert biodata responses
		go func() {
			defer wg.Done()
			err := s.responseRepo.InsertBiodataResponses(tx, biodataResponses)
			if err != nil {
				logger.LogError(err, "Failed to insert biodata responses", map[string]interface{}{
					"layer":     "service",
					"operation": "service.InsertDelegates",
					"error":     err,
				})
				errChan <- err
			}
		}()

		// Concurrently insert health responses
		go func() {
			defer wg.Done()
			err := s.responseRepo.InsertHealthResponses(tx, healthResponses)
			if err != nil {
				logger.LogError(err, "Failed to insert health responses", map[string]interface{}{
					"layer":     "service",
					"operation": "service.InsertDelegates",
					"error":     err,
				})
				errChan <- err
			}
		}()

		// Concurrently insert MUN responses
		go func() {
			defer wg.Done()
			err := s.responseRepo.InsertMUNResponses(tx, munResponses)
			if err != nil {
				logger.LogError(err, "Failed to insert MUN responses", map[string]interface{}{
					"layer":     "service",
					"operation": "service.InsertDelegates",
					"error":     err,
				})
				errChan <- err
			}
		}()

		// Wait for all goroutines to complete
		wg.Wait()
		close(errChan)

		// Check if any errors occurred during concurrent operations
		for err := range errChan {
			return err
		}

		logger.LogDebug("Inserting delegates", map[string]interface{}{"delegates": delegates, "team": team, "layer": "service", "operation": "InsertDelegates"})
		return nil
	})
}

func (s *dashboardService) GetParticipantData(email string) ([]dashboard.MUNDelegates, error) {
	teamID, err := s.delegateRepo.GetTeamIDByDelegateEmail(email)
	if err != nil {
		logger.LogError(err, "Failed to get team by delegate email", map[string]interface{}{
			"layer":     "service",
			"operation": "service.GetParticipantData",
			"error":     err,
		})
		return nil, err
	}

	delegates, err := s.delegateRepo.GetDelegatesByTeamID(teamID)
	if err != nil {
		logger.LogError(err, "Repo Failed to get delegates by team ID", map[string]interface{}{
			"layer":     "service",
			"operation": "service.GetParticipantData",
			"error":     err,
		})
	}

	return delegates, nil
}

// AI GENERATED CODE #VIBECODER
func (s *dashboardService) GetQuestions() (biodataQuestions []dashboard.BiodataQuestions, healthQuestions []dashboard.HealthQuestions, munQuestions []dashboard.MUNQuestions, err error) {
	var wg sync.WaitGroup
	wg.Add(3)

	// Create channels to collect results and errors
	biodataCh := make(chan []dashboard.BiodataQuestions, 1)
	healthCh := make(chan []dashboard.HealthQuestions, 1)
	munCh := make(chan []dashboard.MUNQuestions, 1)
	errCh := make(chan error, 3)

	// Concurrently fetch biodata questions
	go func() {
		defer wg.Done()
		questions, err := s.questionRepo.GetBiodataQuestions()
		if err != nil {
			logger.LogError(err, "Failed to get biodata questions", map[string]interface{}{
				"layer":     "service",
				"operation": "service.GetQuestions",
				"error":     err,
			})
			errCh <- err
			return
		}
		biodataCh <- questions
	}()

	// Concurrently fetch health questions
	go func() {
		defer wg.Done()
		questions, err := s.questionRepo.GetHealthQuestions()
		if err != nil {
			logger.LogError(err, "Failed to get health questions", map[string]interface{}{
				"layer":     "service",
				"operation": "service.GetQuestions",
				"error":     err,
			})
			errCh <- err
			return
		}
		healthCh <- questions
	}()

	// Concurrently fetch MUN questions
	go func() {
		defer wg.Done()
		questions, err := s.questionRepo.GetMUNQuestions()
		if err != nil {
			logger.LogError(err, "Failed to get MUN questions", map[string]interface{}{
				"layer":     "service",
				"operation": "service.GetQuestions",
				"error":     err,
			})
			errCh <- err
			return
		}
		munCh <- questions
	}()

	// Wait for all goroutines to complete
	wg.Wait()
	close(biodataCh)
	close(healthCh)
	close(munCh)
	close(errCh)

	// Check if any errors occurred
	if len(errCh) > 0 {
		return nil, nil, nil, <-errCh // Return the first error
	}

	// Collect results
	if len(biodataCh) > 0 {
		biodataQuestions = <-biodataCh
	}
	if len(healthCh) > 0 {
		healthQuestions = <-healthCh
	}
	if len(munCh) > 0 {
		munQuestions = <-munCh
	}

	return biodataQuestions, healthQuestions, munQuestions, nil
}

func (s *dashboardService) InsertOneDelegateForFAOrObserver(
	participant *dashboard.MUNDelegates,
	healthResponse []dashboard.HealthResponses,
	biodataResponse []dashboard.BiodataResponses,
) (retErr error) {
	// Check if the participant already exists
	existingDelegate, _ := s.delegateRepo.GetDelegateByEmail(participant.MUNDelegateEmail)
	if existingDelegate != nil {
		logger.LogError(nil, "Participant already exists", map[string]interface{}{
			"layer":     "service",
			"operation": "service.InsertOneDelegateForFAOrObserver",
			"error":     "participant already exists",
			"email":     participant.MUNDelegateEmail,
		})
	}

	// start a transaction and insert the participant and their responses
	return utils.WithTransaction(s.delegateRepo.DB(), func(tx *sqlx.Tx) error {
		// insert the participant
		if _, err := s.delegateRepo.InsertOneDelegate(tx, participant); err != nil {
			logger.LogError(err, "Failed to insert participant", map[string]interface{}{
				"layer":     "service",
				"operation": "service.InsertOneDelegateForFAOrObserver",
				"error":     err,
			})
			return err
		}

		// insert concurrent responses
		errChan := make(chan error, 2)
		var wg sync.WaitGroup
		wg.Add(2)

		// Concurrently insert health responses and biodata responses
		go func() {
			defer wg.Done()
			if err := s.responseRepo.InsertHealthResponses(tx, healthResponse); err != nil {
				logger.LogError(err, "Failed to insert health responses", map[string]interface{}{
					"layer":     "service",
					"operation": "service.InsertOneDelegateForFAOrObserver",
					"error":     err,
				})
				errChan <- err
			}
		}()
		go func() {
			defer wg.Done()
			if err := s.responseRepo.InsertBiodataResponses(tx, biodataResponse); err != nil {
				logger.LogError(err, "Failed to insert biodata responses", map[string]interface{}{
					"layer":     "service",
					"operation": "service.InsertOneDelegateForFAOrObserver",
					"error":     err,
				})
				errChan <- err
			}
		}()
		// Wait for all goroutines to complete, and close the error channel
		wg.Wait()
		close(errChan)
		for err := range errChan {
			if err != nil {
				logger.LogError(err, "Failed to insert responses", map[string]interface{}{
					"layer":     "service",
					"operation": "service.InsertOneDelegateForFAOrObserver",
					"error":     err,
				})
				return err
			}
		}
		return nil
	})
}

func (s *dashboardService) LinkMeToTeam(teamID string, delegateEmail string) (retErr error) {
	// Check if the delegate is a faculty advisor
	me, err := s.delegateRepo.GetDelegateByEmail(delegateEmail)
	if err != nil {
		logger.LogError(err, "Failed to get delegate by email", map[string]interface{}{
			"layer":     "service",
			"operation": "service.LinkMeToTeam",
			"error":     err,
		})
		retErr = err
		return retErr
	}
	var meType string
	if me.ParticipantType != nil {
		meType = *me.ParticipantType
	}
	if meType != "faculty_advisor" {
		logger.LogError(nil, "Participant is not a faculty advisor", map[string]interface{}{
			"layer":     "service",
			"operation": "service.LinkMeToTeam",
			"error":     "participant is not a faculty advisor",
			"email":     delegateEmail,
		})
		retErr = fmt.Errorf("email %s is not a faculty advisor", delegateEmail)
		return retErr
	}

	// Check if the team exists
	if err = s.delegateRepo.InsertMeToTeam(teamID, delegateEmail); err != nil {
		logger.LogError(err, "Failed to insert delegate to team", map[string]interface{}{
			"layer":     "service",
			"operation": "service.LinkMeToTeam",
			"error":     err,
		})
		retErr = err
		return retErr
	}

	logger.LogDebug("Linking delegate to team", map[string]interface{}{
		"teamID":        teamID,
		"delegateEmail": delegateEmail,
		"layer":         "service",
		"operation":     "service.LinkMeToTeam",
	})
	return nil
}

// ADMIN FUNCTIONS
func (s *dashboardService) UpdateParticipantStatus(email string) (retErr error) {
	participant, err := s.delegateRepo.GetDelegateByEmail(email)
	if err != nil {
		logger.LogError(err, "Failed to get participant by email", map[string]interface{}{
			"layer":     "service",
			"operation": "service.UpdateParticipantStatus",
			"error":     err,
		})
		retErr = err
		return retErr
	}
	var participantStatus bool
	var participantTap string
	if participant.Confirmed != nil {
		participantStatus = *participant.Confirmed
	}
	if participant.ParticipantType != nil {
		participantTap = *participant.ParticipantType
	}
	if participantStatus {
		logger.LogError(nil, "Participant already confirmed", map[string]interface{}{
			"layer":     "service",
			"operation": "service.UpdateParticipantStatus",
			"error":     "participant already confirmed",
			"email":     email,
		})
		retErr = fmt.Errorf("email %s is already confirmed", email)
		return retErr
	}
	if participant.ParticipantType == nil || participantTap != "delegate" {
		logger.LogError(nil, "Participant is not a delegate", map[string]interface{}{
			"layer":     "service",
			"operation": "service.UpdateParticipantStatus",
			"error":     "participant is not a delegate",
			"email":     email,
		})
		retErr = fmt.Errorf("email %s is not a delegate", email)
		return retErr
	}
	err = s.delegateRepo.UpdateDelegateStatus(email)
	if err != nil {
		logger.LogError(err, "Failed to update participant status", map[string]interface{}{
			"layer":     "service",
			"operation": "service.UpdateParticipantStatus",
			"error":     err,
		})
		retErr = err
		return retErr
	}
	return nil
}

func (s *dashboardService) UpdateDelegateCountryAndCouncil(country, council, delegateEmail string) error {
	participant, err := s.delegateRepo.GetDelegateByEmail(delegateEmail)
	if err != nil {
		logger.LogError(err, "Failed to get participant by email", map[string]interface{}{
			"layer":     "service",
			"operation": "service.UpdateDelegateCountryAndCouncil",
			"error":     err,
		})
		return err
	}

	var participantType, participantCountry, participantCouncil string
	var participantStatus bool

	// dereference the pointers
	if participant.ParticipantType != nil {
		participantType = *participant.ParticipantType
	}

	if participant.Confirmed != nil {
		participantStatus = *participant.Confirmed
	}

	if participant.Country != nil {
		participantCountry = *participant.Country
	}

	if participant.Council != nil {
		participantCouncil = *participant.Council
	}

	if !participantStatus {
		logger.LogError(nil, "Participant is not confirmed", map[string]interface{}{
			"layer":     "service",
			"operation": "service.UpdateDelegateCountryAndCouncil",
			"error":     "participant is not confirmed",
			"email":     delegateEmail,
		})
		return fmt.Errorf("email %s is not confirmed", delegateEmail)
	}
	if participantType != "delegate" {
		logger.LogError(nil, "Participant is not a delegate", map[string]interface{}{
			"layer":     "service",
			"operation": "service.UpdateDelegateCountryAndCouncil",
			"error":     "participant is not a delegate",
			"email":     delegateEmail,
		})
		return fmt.Errorf("email %s is not a delegate", delegateEmail)
	}
	if participantCountry != "" || participantCouncil != "" {
		logger.LogError(nil, "Participant already has a country and council", map[string]interface{}{
			"layer":     "service",
			"operation": "service.UpdateDelegateCountryAndCouncil",
			"error":     "participant already has the same country and council",
			"email":     delegateEmail,
		})
		return fmt.Errorf("email %s already has a country and council", delegateEmail)
	}
	err = s.delegateRepo.UpdateDelegateCountryAndCouncil(country, council, delegateEmail)
	if err != nil {
		logger.LogError(err, "Failed to update delegate country and council", map[string]interface{}{
			"layer":     "service",
			"operation": "service.UpdateDelegateCountryAndCouncil",
			"error":     err,
		})
		return err
	}
	return nil
}

func (s *dashboardService) MakePairing(delegateEmail, pair string) (retErr error) {
	return utils.WithTransaction(s.delegateRepo.DB(), func(tx *sqlx.Tx) error {
		err := s.delegateRepo.UpdatePairing(tx, delegateEmail, pair)
		if err != nil {
			logger.LogError(err, "Failed to update pairing", map[string]interface{}{
				"layer":     "service",
				"operation": "service.MakePairing",
				"error":     err,
			})
			return err
		}

		logger.LogDebug("Making pairing", map[string]interface{}{
			"delegateEmail": delegateEmail,
			"pair":          pair,
			"layer":         "service",
			"operation":     "service.MakePairing",
		})

		return nil
	})
}
