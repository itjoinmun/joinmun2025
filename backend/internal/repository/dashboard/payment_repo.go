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
		logger.LogError(err, "Failed to get payment", map[string]interface{}{"paymentID": paymentID})
		return nil, err
	}
	return &payment, nil
}

func (r *paymentRepo) GetPaymentsByTeamID(teamID int) ([]dashboard.Payment, error) {
	var payments []dashboard.Payment
	query := `SELECT * FROM payments WHERE mun_team_id = $1`
	err := r.db.Select(&payments, query, teamID)
	if err != nil {
		logger.LogError(err, "Failed to get payments for team", map[string]interface{}{"teamID": teamID})
		return nil, err
	}
	return payments, nil
}

func (r *paymentRepo) InsertPayment(payment dashboard.Payment) (int, error) {
	query := `INSERT INTO payments (mun_team_id, package, payment_file, payment_status, payment_date, payment_amount) 
              VALUES ($1, $2, $3, $4, $5, $6) RETURNING payment_id`
	var id int
	err := r.db.QueryRow(
		query,
		payment.MUNTeamID,
		payment.Package,
		payment.PaymentFile,
		payment.PaymentStatus,
		payment.PaymentDate,
		payment.PaymentAmount,
	).Scan(&id)
	if err != nil {
		logger.LogError(err, "Failed to insert payment", map[string]interface{}{
			"teamID": payment.MUNTeamID,
		})
		return 0, err
	}
	return id, nil
}

func (r *paymentRepo) UpdatePayment(payment dashboard.Payment) error {
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
