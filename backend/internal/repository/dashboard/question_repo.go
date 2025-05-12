package dashboard

import (
	"backend/internal/model/dashboard"
	"backend/pkg/utils/logger"

	"github.com/jmoiron/sqlx"
)

type questionRepo struct {
	db *sqlx.DB
}

func (r *questionRepo) GetBiodataQuestions() ([]dashboard.BiodataQuestions, error) {
	var questions []dashboard.BiodataQuestions
	query := `SELECT * FROM biodata_questions`
	err := r.db.Select(&questions, query)
	if err != nil {
		logger.LogError(err, "Failed to get biodata questions", map[string]interface{}{"layer": "repository", "operation": "repo.GetBiodataQuestions"})
		return nil, err
	}

	logger.LogDebug("Biodata questions retrieved successfully", map[string]interface{}{"layer": "repository", "operation": "repo.GetBiodataQuestions"})
	return questions, nil
}

func (r *questionRepo) GetHealthQuestions() ([]dashboard.HealthQuestions, error) {
	var questions []dashboard.HealthQuestions
	query := `SELECT * FROM health_questions`
	err := r.db.Select(&questions, query)
	if err != nil {
		logger.LogError(err, "Failed to get health questions", map[string]interface{}{"layer": "repository", "operation": "repo.GetHealthQuestions"})
		return nil, err
	}

	logger.LogDebug("Health questions retrieved successfully", map[string]interface{}{"layer": "repository", "operation": "repo.GetHealthQuestions"})
	return questions, nil
}

func (r *questionRepo) GetMUNQuestions() ([]dashboard.MUNQuestions, error) {
	var questions []dashboard.MUNQuestions
	query := `SELECT * FROM mun_questions`
	err := r.db.Select(&questions, query)
	if err != nil {
		logger.LogError(err, "Failed to get MUN questions", map[string]interface{}{"layer": "repository", "operation": "repo.GetMUNQuestions"})
		return nil, err
	}

	logger.LogDebug("MUN questions retrieved successfully", map[string]interface{}{"layer": "repository", "operation": "repo.GetMUNQuestions"})
	return questions, nil
}
