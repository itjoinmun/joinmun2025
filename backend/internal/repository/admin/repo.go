package admin

import (
	"backend/internal/model/dashboard"
	"backend/internal/model/payment"
	"backend/internal/model/position"
	"backend/pkg/utils/logger"
	"fmt"
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
	GetDelegateMUNResponses(limit, offset int) ([]dashboard.MUNResponseWithQuestion, error)
	GetDelegateBiodataResponses(delegateType string, limit, offset int) ([]dashboard.BiodataResponseWithQuestion, error)
	GetDelegatePaymentResponsesWithTeam(delegateType string, startDate, endDate *time.Time, limit, offset int) ([]payment.PaymentResponseWithTeam, error)
	GetTeamPaymentSummaries(delegateType string, startDate, endDate *time.Time, limit, offset int) ([]payment.TeamPaymentSummary, error)
	GetDelegates(delegateType string, limit, offset int) ([]dashboard.MUNDelegates, error)
	GetPositionPapers(limit, offset int) ([]position.PositionPaper, error)
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
	res1, err := tx.Exec(query1, pairingEmail, "double_delegate", delegateEmail)
	if err != nil {
		logger.LogError(err, "Failed to update pairing", map[string]interface{}{
			"layer":         "repository",
			"operation":     "repo.UpdatePairing",
			"delegateEmail": delegateEmail,
		})
		return err
	}
	rows1, _ := res1.RowsAffected()
	if rows1 == 0 {
		logger.LogError(nil, "No rows affected while updating pairing", map[string]interface{}{
			"layer":         "repository",
			"operation":     "repo.UpdatePairing",
			"delegateEmail": delegateEmail,
		})
		return nil
	}

	query2 := `UPDATE mun_delegates SET pair = $1, type = $2 WHERE mun_delegate_email = $3`
	res2, err := tx.Exec(query2, delegateEmail, "double_delegate", pairingEmail)
	if err != nil {
		logger.LogError(err, "Failed to update pairing", map[string]interface{}{
			"layer":         "repository",
			"operation":     "repo.UpdatePairing",
			"delegateEmail": pairingEmail,
		})
	}
	rows2, _ := res2.RowsAffected()
	if rows2 == 0 {
		logger.LogError(nil, "No rows affected while updating pairing", map[string]interface{}{
			"layer":         "repository",
			"operation":     "repo.UpdatePairing",
			"delegateEmail": pairingEmail,
		})
		return nil
	}
	logger.LogDebug("Pairing updated successfully", map[string]interface{}{
		"layer":         "repository",
		"operation":     "repo.UpdatePairing",
		"delegateEmail": delegateEmail,
	})
	return nil
}

func (r *adminRepo) UpdatePaymentStatus(delegateEmail string) error {
	query := `UPDATE payment SET payment_status = 'paid' WHERE mun_delegate_email = $1`
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
		ORDER BY r.delegate_email;
	`
	err := r.db.Select(&responses, query)
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
		ORDER BY r.delegate_email
	`
	err := r.db.Select(&responses, query)
	return responses, err
}

func (r *adminRepo) GetDelegateMUNResponses(limit, offset int) ([]dashboard.MUNResponseWithQuestion, error) {
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
		ORDER BY r.delegate_email;
	`
	err := r.db.Select(&responses, query)
	return responses, err
}

func (r *adminRepo) GetDelegatePaymentResponsesWithTeam(delegateType string, startDate, endDate *time.Time, limit, offset int) ([]payment.PaymentResponseWithTeam, error) {
	var payments []payment.PaymentResponseWithTeam

	query := `
		SELECT 
			p.payment_id,
			p.mun_delegate_email,
			p.mun_team_id,
			p.package,
			p.payment_file,
			p.payment_status,
			p.payment_date,
			p.payment_amount,
			d.participant_type
		FROM payment p
		JOIN mun_delegates d ON p.mun_delegate_email = d.mun_delegate_email
		LEFT JOIN mun_teams t ON p.mun_team_id = t.mun_team_id
		WHERE ($1 = '' OR d.participant_type = $1)
	`

	args := []interface{}{delegateType}

	// Append time filtering if provided
	if startDate != nil && endDate != nil {
		query += " AND p.payment_date BETWEEN $2 AND $3"
		args = append(args, *startDate, *endDate)
		query += " ORDER BY p.mun_team_id, p.mun_delegate_email LIMIT $4 OFFSET $5"
		args = append(args, limit, offset)
	} else {
		query += " ORDER BY p.mun_team_id, p.mun_delegate_email LIMIT $2 OFFSET $3"
		args = append(args, limit, offset)
	}

	err := r.db.Select(&payments, query, args...)
	return payments, err
}

func (r *adminRepo) GetTeamPaymentSummaries(delegateType string, startDate, endDate *time.Time, limit, offset int) ([]payment.TeamPaymentSummary, error) {
	var teamSummaries []payment.TeamPaymentSummary

	// First, get unique teams with pagination
	teamQuery := `
		WITH team_info AS (
			SELECT DISTINCT 
				p.mun_team_id,
				COALESCE(t.mun_team_lead, p.mun_delegate_email) as mun_team_lead,
				MIN(p.payment_date) as earliest_payment
			FROM payment p
			JOIN mun_delegates d ON p.mun_delegate_email = d.mun_delegate_email
			LEFT JOIN mun_teams t ON p.mun_team_id = t.mun_team_id
			WHERE ($1 = '' OR d.participant_type = $1)
	`

	args := []interface{}{delegateType}
	argIndex := 2

	if startDate != nil && endDate != nil {
		teamQuery += fmt.Sprintf(" AND p.payment_date BETWEEN $%d AND $%d", argIndex, argIndex+1)
		args = append(args, *startDate, *endDate)
		argIndex += 2
	}

	teamQuery += fmt.Sprintf(`
			GROUP BY p.mun_team_id, t.mun_team_lead, p.mun_delegate_email
		)
		SELECT mun_team_id, mun_team_lead
		FROM team_info
		ORDER BY earliest_payment
		LIMIT $%d OFFSET $%d`, argIndex, argIndex+1)

	args = append(args, limit, offset)

	type TeamInfo struct {
		MUNTeamID   *string `db:"mun_team_id"`
		MUNTeamLead string  `db:"mun_team_lead"`
	}

	var teams []TeamInfo
	err := r.db.Select(&teams, teamQuery, args...)
	if err != nil {
		logger.LogError(err, "Failed to get team payment summaries", map[string]interface{}{
			"layer":     "repository",
			"operation": "repo.GetTeamPaymentSummaries",
		})
		return nil, err
	}

	// For each team, get all payments
	for _, team := range teams {
		var teamPayments []payment.PaymentResponseWithTeam

		paymentQuery := `
			SELECT 
				p.payment_id,
				p.mun_delegate_email,
				p.mun_team_id,
				p.package,
				p.payment_file,
				p.payment_status,
				p.payment_date,
				p.payment_amount,
				d.participant_type
			FROM payment p
			JOIN mun_delegates d ON p.mun_delegate_email = d.mun_delegate_email
			WHERE (p.mun_team_id = $1 OR ($1 IS NULL AND p.mun_delegate_email = $2))
		`

		paymentArgs := []interface{}{team.MUNTeamID, team.MUNTeamLead}

		if startDate != nil && endDate != nil {
			paymentQuery += " AND p.payment_date BETWEEN $3 AND $4"
			paymentArgs = append(paymentArgs, *startDate, *endDate)
		}

		paymentQuery += " ORDER BY p.payment_date"

		err := r.db.Select(&teamPayments, paymentQuery, paymentArgs...)
		if err != nil {
			logger.LogError(err, "Failed to get payments for team", map[string]interface{}{
				"layer":     "repository",
				"operation": "repo.GetTeamPaymentSummaries",
				"teamId":    team.MUNTeamID,
			})
			continue
		}

		// Calculate summary statistics
		var totalAmount, pendingCount, paidCount, failedCount int
		for _, payment := range teamPayments {
			totalAmount += payment.PaymentAmount
			switch payment.PaymentStatus {
			case "pending":
				pendingCount++
			case "paid":
				paidCount++
			case "failed":
				failedCount++
			}
		}

		teamSummary := payment.TeamPaymentSummary{
			MUNTeamID:    team.MUNTeamID,
			MUNTeamLead:  team.MUNTeamLead,
			TeamPayments: teamPayments,
			TotalAmount:  totalAmount,
			PaymentCount: len(teamPayments),
			PendingCount: pendingCount,
			PaidCount:    paidCount,
			FailedCount:  failedCount,
		}

		teamSummaries = append(teamSummaries, teamSummary)
	}

	return teamSummaries, nil
}

func (r *adminRepo) GetDelegates(delegateType string, limit, offset int) ([]dashboard.MUNDelegates, error) {
	var delegates []dashboard.MUNDelegates
	query := `
		SELECT 
			md.mun_delegate_email,
			md.type,
			md.council,
			md.council_date,
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
	err := r.db.Select(&delegates, query, delegateType, limit, offset)
	if err != nil {
		logger.LogError(err, "Failed to get delegates", map[string]interface{}{
			"layer":     "repository",
			"operation": "repo.GetDelegates",
		})
		return nil, err
	}
	return delegates, nil
}

func (r *adminRepo) GetPositionPapers(limit, offset int) ([]position.PositionPaper, error) {
	var papers []position.PositionPaper
	query := `
		SELECT 
			pp.mun_delegate_email,
			pp.submission_file,
			pp.submission_date,
			pp.submission_status
		FROM position_paper pp
		ORDER BY pp.mun_delegate_email
		LIMIT $1 OFFSET $2;
	`
	err := r.db.Select(&papers, query, limit, offset)
	if err != nil {
		logger.LogError(err, "Failed to get position papers", map[string]interface{}{
			"layer":     "repository",
			"operation": "repo.GetPositionPapers",
		})
		return nil, err
	}
	return papers, nil
}
