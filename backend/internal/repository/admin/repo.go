package admin

import (
	"backend/internal/model/dashboard"
	"backend/internal/model/payment"
	"backend/pkg/utils/logger"
	"time"

	"github.com/jmoiron/sqlx"
)

type AdminRepo interface {
	DB() *sqlx.DB // Get the database connection
	UpdateDelegateStatus(delegateEmail string) error
	UpdateDelegateCountryAndCouncil(country, council, delegateEmail string) error
	UpdatePairing(tx *sqlx.Tx, delegateEmail, pairingEmail string) error
	UpdatePaymentStatus(delegateEmail string) error
	GetDelegateHealthResponses(delegateType string, limit, offset int) ([]dashboard.HealthResponseWithQuestion, error)
	GetDelegateMUNResponses(delegateType string, limit, offset int) ([]dashboard.MUNResponseWithQuestion, error)
	GetDelegateBiodataResponses(delegateType string, limit, offset int) ([]dashboard.BiodataResponseWithQuestion, error)
	GetDelegatePaymentResponses(delegateType string, limit, offset int) ([]payment.PaymentResponse, error)
	GetDelegates(delegateType string, limit, offset int) ([]dashboard.MUNDelegates, error)
}

type adminRepo struct {
	db *sqlx.DB
}

func NewAdminRepo(db *sqlx.DB) AdminRepo {
	return &adminRepo{db: db}
}

func (r *adminRepo) DB() *sqlx.DB {
	return r.db
}

func (r *adminRepo) UpdateDelegateStatus(delegateEmail string) error {
	query := `UPDATE mun_delegates SET confirmed = $1, confirmed_date = $2 WHERE mun_delegate_email = $3`
	_, err := r.db.Exec(query, true, time.Now(), delegateEmail)
	if err != nil {
		logger.LogError(err, "Failed to update delegate status", map[string]interface{}{
			"layer":         "repository",
			"operation":     "repo.UpdateDelegateStatus",
			"delegateEmail": delegateEmail,
		})
		return err
	}
	logger.LogDebug("Delegate status updated successfully", map[string]interface{}{
		"layer":         "repository",
		"operation":     "repo.UpdateDelegateStatus",
		"delegateEmail": delegateEmail,
	})

	return nil
}

func (r *adminRepo) UpdateDelegateCountryAndCouncil(country, council, delegateEmail string) error {
	query := `UPDATE mun_delegates SET country = $1, council = $2, council_date = $3, type = $4 WHERE mun_delegate_email = $5`
	_, err := r.db.Exec(query, country, council, time.Now(), "single_delegate", delegateEmail)
	if err != nil {
		logger.LogError(err, "Failed to update delegate country and council", map[string]interface{}{
			"layer":         "repository",
			"operation":     "repo.UpdateDelegateCountryAndCouncil",
			"delegateEmail": delegateEmail,
		})
		return err
	}
	logger.LogDebug("Delegate country and council updated successfully", map[string]interface{}{
		"layer":         "repository",
		"operation":     "repo.UpdateDelegateCountryAndCouncil",
		"delegateEmail": delegateEmail,
	})
	return nil
}

func (r *adminRepo) UpdatePairing(tx *sqlx.Tx, delegateEmail, pairingEmail string) error {
	query1 := `UPDATE mun_delegates SET pair = $1, type = $2 WHERE mun_delegate_email = $3`
	_, err := tx.Exec(query1, pairingEmail, "double_delegate", delegateEmail)
	if err != nil {
		logger.LogError(err, "Failed to update pairing", map[string]interface{}{
			"layer":         "repository",
			"operation":     "repo.UpdatePairing",
			"delegateEmail": delegateEmail,
		})
		return err
	}

	query2 := `UPDATE mun_delegates SET pair = $1, type = $2 WHERE mun_delegate_email = $3`
	_, err = tx.Exec(query2, delegateEmail, "double_delegate", pairingEmail)
	if err != nil {
		logger.LogError(err, "Failed to update pairing", map[string]interface{}{
			"layer":         "repository",
			"operation":     "repo.UpdatePairing",
			"delegateEmail": pairingEmail,
		})
	}
	logger.LogDebug("Pairing updated successfully", map[string]interface{}{
		"layer":         "repository",
		"operation":     "repo.UpdatePairing",
		"delegateEmail": delegateEmail,
	})
	return nil
}

func (r *adminRepo) UpdatePaymentStatus(delegateEmail string) error {
	query := `UPDATE payments SET payment_status = 'paid' WHERE mun_delegate_email = $1`
	_, err := r.db.Exec(query, delegateEmail)
	if err != nil {
		logger.LogError(err, "Failed to update payment status", map[string]interface{}{"delegateEmail": delegateEmail, "layer": "repository", "operation": "repo.UpdatePaymentStatus"})
	}
	logger.LogDebug("Payment status updated successfully", map[string]interface{}{"delegateEmail": delegateEmail, "layer": "repository", "operation": "repo.UpdatePaymentStatus"})
	return err
}

func (r *adminRepo) GetDelegateBiodataResponses(delegateType string, limit, offset int) ([]dashboard.BiodataResponseWithQuestion, error) {
	var responses []dashboard.BiodataResponseWithQuestion
	query := `
		SELECT 
			r.biodata_question_id,
			r.delegate_email,
			r.biodata_answer_text,
			q.biodata_question_type,
			q.biodata_question_text
		FROM biodata_responses r
		JOIN biodata_questions q ON r.biodata_question_id = q.biodata_question_id
		JOIN mun_delegates d ON r.delegate_email = d.mun_delegate_email
		WHERE d.participant_type = $1
		ORDER BY r.delegate_email
		LIMIT $2 OFFSET $3;
	`
	err := r.db.Select(&responses, delegateType, query, limit, offset)
	return responses, err
}

func (r *adminRepo) GetDelegateHealthResponses(delegateType string, limit, offset int) ([]dashboard.HealthResponseWithQuestion, error) {
	var responses []dashboard.HealthResponseWithQuestion
	query := `
		SELECT 
			r.health_question_id,
			r.delegate_email,
			r.health_answer_text,
			q.health_question_type,
			q.health_question_text
		FROM health_responses r
		JOIN health_questions q ON r.health_question_id = q.health_question_id
		JOIN mun_delegates d ON r.delegate_email = d.mun_delegate_email
		WHERE d.participant_type = $1
		ORDER BY r.delegate_email
		LIMIT $2 OFFSET $3;
	`
	err := r.db.Select(&responses, delegateType, query, limit, offset)
	return responses, err
}

func (r *adminRepo) GetDelegateMUNResponses(delegateType string, limit, offset int) ([]dashboard.MUNResponseWithQuestion, error) {
	var responses []dashboard.MUNResponseWithQuestion
	query := `
		SELECT 
			r.mun_question_id,
			r.delegate_email,
			r.mun_answer_text,
			q.mun_question_type,
			q.mun_question_text
		FROM mun_responses r
		JOIN mun_questions q ON r.mun_question_id = q.mun_question_id
		JOIN mun_delegates d ON r.delegate_email = d.mun_delegate_email
		WHERE d.participant_type = $1
		ORDER BY r.delegate_email
		LIMIT $2 OFFSET $3;
	`
	err := r.db.Select(&responses, delegateType, query, limit, offset)
	return responses, err
}

func (r *adminRepo) GetDelegatePaymentResponses(delegateType string, limit, offset int) ([]payment.PaymentResponse, error) {
	var payments []payment.PaymentResponse
	query := `
		SELECT 
			p.payment_id,
			p.mun_delegate_email,
			p.package,
			p.payment_file,
			p.payment_status,
			p.payment_date,
			p.payment_amount,
			d.participant_type
		FROM payments p
		JOIN mun_delegates d ON p.mun_delegate_email = d.mun_delegate_email
		WHERE d.participant_type = $1
		ORDER BY p.mun_delegate_email
		LIMIT $2 OFFSET $3;
	`
	err := r.db.Select(&payments, delegateType, query, limit, offset)
	return payments, err
}

func (r *adminRepo) GetDelegates(delegateType string, limit, offset int) ([]dashboard.MUNDelegates, error) {
	var delegates []dashboard.MUNDelegates
	query := `
		SELECT 
			md.mun_delegate_email,
			md.type,
			md.council,
			md.country,
			md.confirmed,
			md.confirmed_date,
			md.insert_date,
			md.participant_type
		FROM mun_delegates md
		WHERE md.participant_type = $1
		ORDER BY md.mun_delegate_email
		LIMIT $2 OFFSET $3;
	`
	err := r.db.Select(&delegates, delegateType, query, limit, offset)
	if err != nil {
		logger.LogError(err, "Failed to get delegates", map[string]interface{}{
			"layer":     "repository",
			"operation": "repo.GetDelegates",
		})
		return nil, err
	}
	return delegates, nil
}
