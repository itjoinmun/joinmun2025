package dashboard

import (
	"backend/internal/model/dashboard"
	"backend/pkg/utils/logger"
	"fmt"
	"strings"

	"github.com/jmoiron/sqlx"
)

type responseRepo struct {
	db *sqlx.DB
}

func (r *responseRepo) BeginTransaction() (*sqlx.Tx, error) {
	tx, err := r.db.Beginx()
	if err != nil {
		logger.LogError(err, "Failed to start transaction", map[string]interface{}{"layer": "repository", "operation": "BeginTransaction"})
		return nil, err
	}

	logger.LogDebug("Transaction started", map[string]interface{}{"layer": "repository", "operation": "BeginTransaction"})
	return tx, nil
}

func (r *responseRepo) GetBiodataResponsesByDelegateEmail(delegateEmail string) ([]dashboard.BiodataResponses, error) {
	var responses []dashboard.BiodataResponses
	query := `SELECT * FROM biodata_responses WHERE delegate_email = $1`
	err := r.db.Select(&responses, query, delegateEmail)
	if err != nil {
		logger.LogError(err, "Failed to get biodata responses", map[string]interface{}{"layer": "repository", "operation": "repo.GetBiodataByDelEmail", "delegateEmail": delegateEmail})
		return nil, err
	}

	logger.LogDebug("Biodata responses retrieved successfully", map[string]interface{}{"layer": "repository", "operation": "repo.GetBiodataByDelEmail", "delegateEmail": delegateEmail})
	return responses, nil
}

func (r *responseRepo) GetHealthResponsesByDelegateEmail(delegateEmail string) ([]dashboard.HealthResponses, error) {
	var responses []dashboard.HealthResponses
	query := `SELECT * FROM health_responses WHERE delegate_email = $1`
	err := r.db.Select(&responses, query, delegateEmail)
	if err != nil {
		logger.LogError(err, "Failed to get health responses", map[string]interface{}{"layer": "repository", "operation": "repo.GetHealthByDelEmail", "delegateEmail": delegateEmail})
		return nil, err
	}

	logger.LogDebug("Health responses retrieved successfully", map[string]interface{}{"layer": "repository", "operation": "repo.GetHealthByDelEmail", "delegateEmail": delegateEmail})
	return responses, nil
}

func (r *responseRepo) GetMUNResponsesByDelegateEmail(delegateEmail string) ([]dashboard.MUNResponses, error) {
	var responses []dashboard.MUNResponses
	query := `SELECT * FROM mun_responses WHERE delegate_email = $1`
	err := r.db.Select(&responses, query, delegateEmail)
	if err != nil {
		logger.LogError(err, "Failed to get MUN responses", map[string]interface{}{"layer": "repository", "operation": "repo.GetMUNByDelEmail", "delegateEmail": delegateEmail})
		return nil, err
	}

	logger.LogDebug("MUN responses retrieved successfully", map[string]interface{}{"layer": "repository", "operation": "repo.GetMUNByDelEmail", "delegateEmail": delegateEmail})
	return responses, nil
}

func (r *responseRepo) InsertBiodataResponses(tx *sqlx.Tx, responses []dashboard.BiodataResponses) error {
	if len(responses) == 0 {
		return nil
	}

	query := `INSERT INTO biodata_responses (delegate_email, biodata_question_id, biodata_answer_text) VALUES `
	args := []interface{}{}
	valueStrings := []string{}

	for i, res := range responses {
		valueStrings = append(valueStrings, fmt.Sprintf("($%d, $%d, $%d)", i*3+1, i*3+2, i*3+3))
		args = append(args, res.DelegateEmail, res.BiodataQuestionID, res.BiodataAnswerText)
	}

	query += strings.Join(valueStrings, ",")
	_, err := tx.Exec(query, args...)
	if err != nil {
		logger.LogError(err, "Failed to insert biodata responses", map[string]interface{}{"layer": "repository", "operation": "repo.InsertBiodataResponses"})
		return err
	}

	logger.LogDebug("Biodata responses inserted successfully", map[string]interface{}{"layer": "repository", "operation": "repo.InsertBiodataResponses"})
	return nil
}

func (r *responseRepo) InsertHealthResponses(tx *sqlx.Tx, responses []dashboard.HealthResponses) error {
	if len(responses) == 0 {
		return nil
	}

	query := `INSERT INTO health_responses (delegate_email, health_questions_id, health_answer_text) VALUES `
	args := []interface{}{}
	valueStrings := []string{}

	for i, res := range responses {
		valueStrings = append(valueStrings, fmt.Sprintf("($%d, $%d, $%d)", i*3+1, i*3+2, i*3+3))
		args = append(args, res.DelegateEmail, res.HealthQuestionID, res.HealthAnswerText)
	}

	query += strings.Join(valueStrings, ",")
	_, err := tx.Exec(query, args...)
	if err != nil {
		logger.LogError(err, "Failed to insert health responses", map[string]interface{}{"layer": "repository", "operation": "repo.InsertHealthResponses"})
		return err
	}
	logger.LogDebug("Health responses inserted successfully", map[string]interface{}{"layer": "repository", "operation": "repo.InsertHealthResponses"})
	return nil
}

func (r *responseRepo) InsertMUNResponses(tx *sqlx.Tx, responses []dashboard.MUNResponses) error {
	if len(responses) == 0 {
		return nil
	}

	query := `INSERT INTO mun_responses (delegate_email, mun_question_id, mun_answer_text) VALUES `
	args := []interface{}{}
	valueStrings := []string{}

	for i, res := range responses {
		valueStrings = append(valueStrings, fmt.Sprintf("($%d, $%d, $%d)", i*3+1, i*3+2, i*3+3))
		args = append(args, res.DelegateEmail, res.MUNQuestionID, res.MUNAnswerText)
	}

	query += strings.Join(valueStrings, ",")
	_, err := tx.Exec(query, args...)
	if err != nil {
		logger.LogError(err, "Failed to insert MUN responses", map[string]interface{}{"layer": "repository", "operation": "repo.InsertMUNResponses"})
		return err
	}
	logger.LogDebug("MUN responses inserted successfully", map[string]interface{}{"layer": "repository", "operation": "repo.InsertMUNResponses"})
	return nil
}
