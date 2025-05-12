package admin

import (
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
