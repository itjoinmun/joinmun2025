package payment

import (
	"backend/internal/model/payment"
	"backend/pkg/utils/logger"
	"errors"
	"fmt"
	"strings"
	"time"

	"github.com/jmoiron/sqlx"
)

type PaymentRepo interface {
	DB() *sqlx.DB                                                                         // Get the database connection
	MakeInitialPayment(tx *sqlx.Tx, delegateEmail, teamID string) (int, error)            // initial payment for the team
	MakeInitialPaymentsForTeam(tx *sqlx.Tx, delegateEmails []string, teamID string) error // initial payments for all team members at once
	GetPaymentByDelegateEmail(delegateEmail string) (*payment.Payment, error)             // Get payments by team ID, for the team payment
	GetPaymentWithTeamByDelegateEmail(delegateEmail string) (*payment.PaymentWithTeamMembers, error)
	UploadPayment(tx *sqlx.Tx, payment *payment.Payment) error // update payment for uploading the payment receipt (delegate function)
	UpdatePaymentTeam(tx *sqlx.Tx, teamID, delegateEmail string) error
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
		logger.LogError(err, "Failed to get payment", map[string]any{"paymentID": paymentID, "layer": "repository", "operation": "repo.GetPaymentByID"})
		return nil, err
	}
	logger.LogDebug("Payment retrieved successfully", map[string]any{"paymentID": paymentID, "layer": "repository", "operation": "repo.GetPaymentByID"})
	return &payment, nil
}

func (r *paymentRepo) GetPaymentByDelegateEmail(delegateEmail string) (*payment.Payment, error) {
	var payments payment.Payment
	query := `
	SELECT 
		p.* 
	FROM payment p
	WHERE p.mun_delegate_email = $1`
	err := r.db.Get(&payments, query, delegateEmail)
	if err != nil {
		logger.LogError(err, "Failed to get payments for delegate", map[string]any{"delegateEmail": delegateEmail, "layer": "repository", "operation": "repo.GetPaymentsBydelegateEmail"})
		return nil, err
	}
	logger.LogDebug("Payments retrieved successfully", map[string]any{"delegateEmail": delegateEmail, "layer": "repository", "operation": "repo.GetPaymentsBydelegateEmail"})
	return &payments, nil
}

func (r *paymentRepo) GetPaymentWithTeamByDelegateEmail(delegateEmail string) (*payment.PaymentWithTeamMembers, error) {
	var paymentData payment.PaymentWithTeamMembers

	// First get the payment with basic delegate and team info
	query := `
    SELECT 
        p.payment_id,
        p.mun_team_id,
        p.mun_delegate_email,
        p.package,
        p.payment_file,
        p.payment_status,
        p.payment_date,
        p.payment_amount,
        d.mun_delegate_name,
        d.confirmed,
        d.insert_date,
        d.participant_type
    FROM payment p
    JOIN mun_delegates d ON p.mun_delegate_email = d.mun_delegate_email
    LEFT JOIN mun_teams t ON p.mun_team_id = t.mun_team_id
    WHERE p.mun_delegate_email = $1`

	err := r.db.Get(&paymentData, query, delegateEmail)
	if err != nil {
		logger.LogError(err, "Failed to get payment with team for delegate", map[string]any{"delegateEmail": delegateEmail, "layer": "repository", "operation": "repo.GetPaymentWithTeamByDelegateEmail"})
		return nil, err
	}

	// Get all payments for the same team (instead of team members)
	var munTeamID string
	if paymentData.MUNTeamID != nil {
		munTeamID = *paymentData.MUNTeamID
	}
	if munTeamID != "" {
		teamPaymentsQuery := `
        SELECT 
            p.mun_delegate_email,
            d.mun_delegate_name,
            d.participant_type,
            d.confirmed,
            p.payment_status,
            p.payment_amount,
            p.package
        FROM payment p
        JOIN mun_delegates d ON p.mun_delegate_email = d.mun_delegate_email
        WHERE p.mun_team_id = $1`

		var teamMembers []payment.TeamMemberInfo
		err = r.db.Select(&teamMembers, teamPaymentsQuery, paymentData.MUNTeamID)
		if err != nil {
			logger.LogError(err, "Failed to get team payments", map[string]any{"teamID": paymentData.MUNTeamID, "layer": "repository", "operation": "repo.GetPaymentWithTeamByDelegateEmail"})
			return nil, err
		}
		paymentData.TeamMembers = teamMembers
	}

	logger.LogDebug("Payment with team members retrieved successfully", map[string]any{"delegateEmail": delegateEmail, "teamID": paymentData.MUNTeamID, "memberCount": len(paymentData.TeamMembers), "layer": "repository", "operation": "repo.GetPaymentWithTeamByDelegateEmail"})
	return &paymentData, nil
}

func (r *paymentRepo) UploadPayment(tx *sqlx.Tx, payment *payment.Payment) error {
	query := `UPDATE payment
              SET package = $1, payment_file = $2, payment_status = $3, payment_date = $4, payment_amount = $5, mun_team_id = $6
              WHERE mun_delegate_email = $7`
	_, err := tx.Exec(
		query,
		payment.Package,
		payment.PaymentFile,
		payment.PaymentStatus,
		payment.PaymentDate,
		payment.PaymentAmount,
		payment.MUNTeamID,
		payment.MUNDelegateEmail,
	)
	if err != nil {
		logger.LogError(err, "Failed to update payment", map[string]any{
			"paymentID":     payment.PaymentID,
			"delegateEmail": payment.MUNDelegateEmail,
			"teamID":        payment.MUNTeamID,
			"layer":         "repository",
			"operation":     "repo.UploadPayment",
		})
		return err
	}
	logger.LogDebug("Payment updated successfully", map[string]any{
		"paymentID":     payment.PaymentID,
		"delegateEmail": payment.MUNDelegateEmail,
		"teamID":        payment.MUNTeamID,
		"layer":         "repository",
		"operation":     "repo.UploadPayment",
	})
	return err
}

func (r *paymentRepo) MakeInitialPayment(tx *sqlx.Tx, delegateEmail, teamID string) (int, error) {
	query := `INSERT INTO payment (mun_delegate_email, mun_team_id, package, payment_file, payment_status, payment_date, payment_amount) 
			  VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING payment_id`
	var id int
	err := tx.QueryRowx(
		query,
		delegateEmail,
		nil,
		"",
		"",
		"pending",
		time.Time{},
		0,
	).Scan(&id)
	if err != nil {
		logger.LogError(err, "Failed to insert initial payment", map[string]any{
			"delegateEmail": delegateEmail,
			"teamID":        teamID,
			"layer":         "repository",
			"operation":     "repo.MakeInitialPayment",
		})
		return 0, err
	}
	logger.LogDebug("Initial payment inserted successfully", map[string]any{
		"layer":     "repository",
		"operation": "repo.MakeInitialPayment",
		"teamID":    teamID,
	})
	return id, nil
}

func (r *paymentRepo) MakeInitialPaymentsForTeam(tx *sqlx.Tx, delegateEmails []string, teamID string) error {
	if len(delegateEmails) == 0 {
		return errors.New("no delegate emails provided for initial payments")
	}

	// Build bulk insert query
	query := `INSERT INTO payment (mun_delegate_email, mun_team_id, package, payment_file, payment_status, payment_date, payment_amount) VALUES `

	args := make([]any, 0, len(delegateEmails)*7)
	placeholders := make([]string, 0, len(delegateEmails))
	now := time.Now()
	for i, email := range delegateEmails {
		placeholder := fmt.Sprintf("($%d, $%d, $%d, $%d, $%d, $%d, $%d)",
			i*7+1, i*7+2, i*7+3, i*7+4, i*7+5, i*7+6, i*7+7)
		placeholders = append(placeholders, placeholder)

		args = append(args, email, teamID, "", "", "pending", now, 0)
	}

	query += strings.Join(placeholders, ", ")

	_, err := tx.Exec(query, args...)
	if err != nil {
		logger.LogError(err, "Failed to insert initial payments for team", map[string]any{
			"teamID":         teamID,
			"delegateEmails": delegateEmails,
			"layer":          "repository",
			"operation":      "repo.MakeInitialPaymentsForTeam",
		})
		return err
	}

	logger.LogDebug("Initial payments inserted successfully for team", map[string]any{
		"teamID":        teamID,
		"delegateCount": len(delegateEmails),
		"layer":         "repository",
		"operation":     "repo.MakeInitialPaymentsForTeam",
	})
	return nil
}

func (r *paymentRepo) UpdatePaymentTeam(tx *sqlx.Tx, teamID, delegateEmail string) error {
	query := `UPDATE payment
			  SET mun_team_id = $1
			  WHERE mun_delegate_email = $2 AND mun_team_id IS NULL`
	_, err := tx.Exec(query, teamID, delegateEmail)
	if err != nil {
		logger.LogError(err, "Failed to update payment team", map[string]any{
			"teamID":        teamID,
			"delegateEmail": delegateEmail,
			"layer":         "repository",
			"operation":     "repo.UpdatePaymentTeam",
		})
		return err
	}
	logger.LogDebug("Payment team updated successfully", map[string]any{
		"teamID":        teamID,
		"delegateEmail": delegateEmail,
		"layer":         "repository",
		"operation":     "repo.UpdatePaymentTeam",
	})
	return nil
}
