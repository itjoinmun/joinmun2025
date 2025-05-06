package dashboard

import (
	"backend/internal/model/dashboard"
	dashboardRepo "backend/internal/repository/dashboard"
	dashboardUtils "backend/pkg/utils/dashboard"
	"backend/pkg/utils/logger"
)

type DashboardService interface {
	InsertDelegates(
		delegates []dashboard.MUNDelegates,
		team *dashboard.MUNTeams,
		biodataResponses []dashboard.BiodataResponses,
		healthResponses []dashboard.HealthResponses,
		munResponses []dashboard.MUNResponses) (retErr error)

	GetParticipantData(email string) ([]dashboard.MUNDelegates, error)
}

type dashboardService struct {
	positionRepo       dashboardRepo.PositionPaperRepo
	observerRepo       dashboardRepo.ObserverRepo
	questionRepo       dashboardRepo.QuestionRepo
	facultyAdvisorRepo dashboardRepo.FacultyAdvisorRepo
	delegateRepo       dashboardRepo.DelegateRepo
	paymentRepo        dashboardRepo.PaymentRepo
	responseRepo       dashboardRepo.ResponseRepo
}

func NewDashboardService(
	positionRepo dashboardRepo.PositionPaperRepo,
	observerRepo dashboardRepo.ObserverRepo,
	questionRepo dashboardRepo.QuestionRepo,
	facultyAdvisorRepo dashboardRepo.FacultyAdvisorRepo,
	delegateRepo dashboardRepo.DelegateRepo,
	paymentRepo dashboardRepo.PaymentRepo,
	responseRepo dashboardRepo.ResponseRepo,
) DashboardService {
	return &dashboardService{
		positionRepo:       positionRepo,
		observerRepo:       observerRepo,
		questionRepo:       questionRepo,
		facultyAdvisorRepo: facultyAdvisorRepo,
		delegateRepo:       delegateRepo,
		paymentRepo:        paymentRepo,
		responseRepo:       responseRepo,
	}
}

func (s *dashboardService) InsertDelegates(
	delegates []dashboard.MUNDelegates,
	team *dashboard.MUNTeams,
	biodataResponses []dashboard.BiodataResponses,
	healthResponses []dashboard.HealthResponses,
	munResponses []dashboard.MUNResponses,
) (retErr error) {
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

	tx, err := s.delegateRepo.BeginTransaction()
	if err != nil {
		logger.LogError(err, "Failed to begin transaction", map[string]interface{}{
			"layer":     "service",
			"operation": "service.InsertDelegates",
			"error":     err,
		})
		return err
	}
	// Defer rollback if error occurs, if something returns an error
	defer func() {
		if retErr != nil {
			if rbErr := tx.Rollback(); rbErr != nil {
				logger.LogError(rbErr, "Failed to rollback transaction", map[string]interface{}{
					"layer":     "service",
					"operation": "service.InsertDelegates",
					"error":     retErr,
				})
			}
		}
	}()

	// insert biodata responses
	err = s.responseRepo.InsertBiodataResponses(tx, biodataResponses)
	if err != nil {
		logger.LogError(err, "Failed to insert biodata responses", map[string]interface{}{
			"layer":     "service",
			"operation": "service.InsertDelegates",
			"error":     err,
		})
		retErr = err
		return retErr
	}

	// insert health responses
	err = s.responseRepo.InsertHealthResponses(tx, healthResponses)
	if err != nil {
		logger.LogError(err, "Failed to insert health responses", map[string]interface{}{
			"layer":     "service",
			"operation": "service.InsertDelegates",
			"error":     err,
		})
		retErr = err
		return retErr
	}

	// insert mun responses
	err = s.responseRepo.InsertMUNResponses(tx, munResponses)
	if err != nil {
		logger.LogError(err, "Failed to insert MUN responses", map[string]interface{}{
			"layer":     "service",
			"operation": "service.InsertDelegates",
			"error":     err,
		})
		retErr = err
		return retErr
	}

	// insert delegates and make teams
	_, err = s.delegateRepo.InsertTeamWithDelegates(tx, team, delegates)
	if err != nil {
		logger.LogError(err, "Failed to insert team with delegates", map[string]interface{}{
			"delegates": delegates,
			"team":      team,
			"layer":     "service",
			"operation": "service.InsertDelegates",
			"error":     err,
		})
		retErr = err
		return retErr
	}

	if err := tx.Commit(); err != nil {
		logger.LogError(err, "Failed to commit transaction", map[string]interface{}{
			"layer":     "service",
			"operation": "service.InsertDelegates",
			"error":     err,
		})
		return err
	}

	logger.LogDebug("Inserting delegates", map[string]interface{}{"delegates": delegates, "team": team, "layer": "service", "operation": "InsertDelegates"})
	return nil
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
