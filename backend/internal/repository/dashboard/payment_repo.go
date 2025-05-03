package dashboard

import (
	"backend/internal/model/dashboard"
	"backend/pkg/utils/logger"

	"github.com/jmoiron/sqlx"
)

type paymentRepo struct {
	db *sqlx.DB
}

func (r *paymentRepo) GetPaymentByID(paymentID int) (*dashboard.Payment, error) {
	var payment dashboard.Payment
	query := `SELECT * FROM payments WHERE payment_id = $1`
	err := r.db.Get(&payment, query, paymentID)
	if err != nil {
		logger.LogError(err, "Failed to get payment", map[string]interface{}{"paymentID": paymentID, "layer": "repository", "operation": "repo.GetPaymentByID"})
		return nil, err
	}
	logger.LogDebug("Payment retrieved successfully", map[string]interface{}{"paymentID": paymentID, "layer": "repository", "operation": "repo.GetPaymentByID"})
	return &payment, nil
}

func (r *paymentRepo) GetPaymentsByMUNTeamID(teamID string) (*dashboard.Payment, error) {
	var payments dashboard.Payment
	query := `SELECT * FROM payments WHERE mun_team_id = $1`
	err := r.db.Select(&payments, query, teamID)
	if err != nil {
		logger.LogError(err, "Failed to get payments for team", map[string]interface{}{"teamID": teamID, "layer": "repository", "operation": "repo.GetPaymentsByteamID"})
		return nil, err
	}
	logger.LogDebug("Payments retrieved successfully", map[string]interface{}{"teamID": teamID, "layer": "repository", "operation": "repo.GetPaymentsByteamID"})
	return &payments, nil
}

func (r *paymentRepo) UpdatePaymentStatus(teamID int) error {
	query := `UPDATE payments SET payment_status = 'Paid' WHERE mun_team_id = $1`
	_, err := r.db.Exec(query, teamID)
	if err != nil {
		logger.LogError(err, "Failed to update payment status", map[string]interface{}{"teamID": teamID, "layer": "repository", "operation": "repo.UpdatePaymentStatus"})
	}
	logger.LogDebug("Payment status updated successfully", map[string]interface{}{"teamID": teamID, "layer": "repository", "operation": "repo.UpdatePaymentStatus"})
	return err
}

func (r *paymentRepo) UpdatePaymentForTeam(payment *dashboard.Payment) error {
	query := `UPDATE payments 
              SET package = $1, payment_file = $2, payment_status = $3, payment_date = $4, payment_amount = $5 
              WHERE payment_id = $6 AND mun_team_id = $7`
	_, err := r.db.Exec(
		query,
		payment.Package,
		payment.PaymentFile,
		payment.PaymentStatus,
		payment.PaymentDate,
		payment.PaymentAmount,
		payment.PaymentID,
		payment.MUNTeamID,
	)
	if err != nil {
		logger.LogError(err, "Failed to update payment", map[string]interface{}{
			"paymentID": payment.PaymentID,
			"teamID":    payment.MUNTeamID,
		})
	}
	return err
}
