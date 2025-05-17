package payment

import (
	"backend/internal/model/payment"
	"backend/pkg/utils/logger"

	"github.com/jmoiron/sqlx"
)

type PaymentRepo interface {
	DB() *sqlx.DB                                                                                // Get the database connection
	MakeInitialPayment(tx *sqlx.Tx, payment *payment.Payment, delegateEmail string) (int, error) // initial payment for the team
	GetPaymentByDelegateEmail(delegateEmail string) (*payment.Payment, error)                    // Get payments by team ID, for the team payment

	UploadPayment(payment *payment.Payment) error // update payment for uploading the payment receipt (delegate function)
}

type paymentRepo struct {
	db *sqlx.DB
}

func NewPaymentRepo(db *sqlx.DB) PaymentRepo {
	return &paymentRepo{db: db}
}
func (r *paymentRepo) DB() *sqlx.DB {
	return r.db
}
func (r *paymentRepo) GetPaymentByID(paymentID int) (*payment.Payment, error) {
	var payment payment.Payment
	query := `SELECT * FROM payment WHERE payment_id = $1`
	err := r.db.Get(&payment, query, paymentID)
	if err != nil {
		logger.LogError(err, "Failed to get payment", map[string]interface{}{"paymentID": paymentID, "layer": "repository", "operation": "repo.GetPaymentByID"})
		return nil, err
	}
	logger.LogDebug("Payment retrieved successfully", map[string]interface{}{"paymentID": paymentID, "layer": "repository", "operation": "repo.GetPaymentByID"})
	return &payment, nil
}

func (r *paymentRepo) GetPaymentByDelegateEmail(delegateEmail string) (*payment.Payment, error) {
	var payments payment.Payment
	query := `SELECT * FROM payment WHERE mun_delegate_email = $1`
	err := r.db.Get(&payments, query, delegateEmail)
	if err != nil {
		logger.LogError(err, "Failed to get payments for delegate", map[string]interface{}{"delegateEmail": delegateEmail, "layer": "repository", "operation": "repo.GetPaymentsBydelegateEmail"})
		return nil, err
	}
	logger.LogDebug("Payments retrieved successfully", map[string]interface{}{"delegateEmail": delegateEmail, "layer": "repository", "operation": "repo.GetPaymentsBydelegateEmail"})
	return &payments, nil
}

func (r *paymentRepo) UploadPayment(payment *payment.Payment) error {
	query := `UPDATE payment
              SET package = $1, payment_file = $2, payment_status = $3, payment_date = $4, payment_amount = $5 
              WHERE payment_id = $6 AND mun_delegate_email = $7`
	_, err := r.db.Exec(
		query,
		payment.Package,
		payment.PaymentFile,
		payment.PaymentStatus,
		payment.PaymentDate,
		payment.PaymentAmount,
		payment.PaymentID,
		payment.MUNDelegateEmail,
	)
	if err != nil {
		logger.LogError(err, "Failed to update payment", map[string]interface{}{
			"paymentID":     payment.PaymentID,
			"delegateEmail": payment.MUNDelegateEmail,
			"layer":         "repository",
			"operation":     "repo.UploadPayment",
		})
	}
	logger.LogDebug("Payment updated successfully", map[string]interface{}{
		"paymentID":     payment.PaymentID,
		"delegateEmail": payment.MUNDelegateEmail,
		"layer":         "repository",
		"operation":     "repo.UploadPayment",
	})
	return err
}

func (r *paymentRepo) MakeInitialPayment(tx *sqlx.Tx, payment *payment.Payment, delegateEmail string) (int, error) {
	query := `INSERT INTO payment (mun_delegate_email, package, payment_file, payment_status, payment_date, payment_amount) 
			  VALUES ($1, $2, $3, $4, $5, $6) RETURNING payment_id`
	var id int
	err := tx.QueryRowx(
		query,
		delegateEmail,
		payment.Package,
		payment.PaymentFile,
		"pending",
		payment.PaymentDate,
		payment.PaymentAmount,
	).Scan(&id)
	if err != nil {
		logger.LogError(err, "Failed to insert initial payment", map[string]interface{}{
			"delegateEmail": delegateEmail,
			"layer":         "repository",
			"operation":     "repo.MakeInitialPayment",
		})
		return 0, err
	}
	logger.LogDebug("Initial payment inserted successfully", map[string]interface{}{
		"layer":     "repository",
		"operation": "repo.MakeInitialPayment",
	})
	return id, nil
}
