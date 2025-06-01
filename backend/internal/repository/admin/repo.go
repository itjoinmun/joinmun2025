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
	GetTeamPaymentSummaries(delegateType string, startDate, endDate *time.Time, limit, offset int) ([]payment.TeamPaymentSummary, error)
	GetDelegates(delegateType string, startDate, endDate *time.Time, limit, offset int) ([]dashboard.MUNDelegates, error)
	GetPositionPapers(startDate, endDate *time.Time, limit, offset int) ([]position.PositionPaper, error)
	GetDelegatesByTeam(delegateType string, startDate, endDate *time.Time, limit, offset int) ([]dashboard.TeamDelegateGroup, error)
	GetPositionPapersByTeam(startDate, endDate *time.Time, limit, offset int) ([]position.TeamPositionPaperGroup, error)
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

// vibe coded, haven't tested and reviewed yetx
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

func (r *adminRepo) GetDelegates(delegateType string, startDate, endDate *time.Time, limit, offset int) ([]dashboard.MUNDelegates, error) {
	var delegates []dashboard.MUNDelegates

	// First, get unique teams/individuals with pagination (similar to payment approach)
	teamQuery := `
		WITH delegate_info AS (
			SELECT DISTINCT 
				COALESCE(tm.mun_team_id, 'individual_' || md.mun_delegate_email) as group_identifier,
				tm.mun_team_id,
				COALESCE(t.mun_team_lead, md.mun_delegate_email) as group_lead,
				MIN(md.insert_date) as earliest_registration
			FROM mun_delegates md
			LEFT JOIN mun_team_members tm ON md.mun_delegate_email = tm.mun_delegate_email
			LEFT JOIN mun_teams t ON tm.mun_team_id = t.mun_team_id
			WHERE ($1 = '' OR md.participant_type = $1)
	`

	args := []interface{}{delegateType}
	argIndex := 2

	if startDate != nil && endDate != nil {
		teamQuery += fmt.Sprintf(" AND md.insert_date BETWEEN $%d AND $%d", argIndex, argIndex+1)
		args = append(args, *startDate, *endDate)
		argIndex += 2
	}

	teamQuery += fmt.Sprintf(`
			GROUP BY group_identifier, tm.mun_team_id, t.mun_team_lead, md.mun_delegate_email
		)
		SELECT mun_team_id, group_lead
		FROM delegate_info
		ORDER BY earliest_registration DESC
		LIMIT $%d OFFSET $%d`, argIndex, argIndex+1)

	args = append(args, limit, offset)

	type GroupInfo struct {
		MUNTeamID *string `db:"mun_team_id"`
		GroupLead string  `db:"group_lead"`
	}

	var groups []GroupInfo
	err := r.db.Select(&groups, teamQuery, args...)
	if err != nil {
		logger.LogError(err, "Failed to get delegate groups", map[string]interface{}{
			"layer":     "repository",
			"operation": "repo.GetDelegates",
		})
		return nil, err
	}

	// For each group, get all delegates
	for _, group := range groups {
		var groupDelegates []dashboard.MUNDelegates

		delegateQuery := `
			SELECT 
				md.mun_delegate_email,
				md.mun_delegate_name,
				md.type,
				md.council,
				md.council_date,
				md.country,
				md.confirmed,
				md.confirmed_date,
				md.insert_date,
				md.participant_type
			FROM mun_delegates md
			LEFT JOIN mun_team_members tm ON md.mun_delegate_email = tm.mun_delegate_email
			WHERE (tm.mun_team_id = $1 OR ($1 IS NULL AND md.mun_delegate_email = $2))
		`

		delegateArgs := []interface{}{group.MUNTeamID, group.GroupLead}

		if startDate != nil && endDate != nil {
			delegateQuery += " AND md.insert_date BETWEEN $3 AND $4"
			delegateArgs = append(delegateArgs, *startDate, *endDate)
		}

		delegateQuery += " ORDER BY md.insert_date DESC"

		err := r.db.Select(&groupDelegates, delegateQuery, delegateArgs...)
		if err != nil {
			logger.LogError(err, "Failed to get delegates for group", map[string]interface{}{
				"layer":     "repository",
				"operation": "repo.GetDelegates",
				"groupId":   group.MUNTeamID,
			})
			continue
		}

		delegates = append(delegates, groupDelegates...)
	}

	return delegates, nil
}

func (r *adminRepo) GetPositionPapers(startDate, endDate *time.Time, limit, offset int) ([]position.PositionPaper, error) {
	var papers []position.PositionPaper

	// Get position papers coupled with delegate team info
	paperQuery := `
		WITH paper_info AS (
			SELECT DISTINCT 
				COALESCE(tm.mun_team_id, 'individual_' || pp.mun_delegate_email) as group_identifier,
				tm.mun_team_id,
				COALESCE(t.mun_team_lead, pp.mun_delegate_email) as group_lead,
				MIN(pp.submission_date) as earliest_submission
			FROM position_paper pp
			JOIN mun_delegates md ON pp.mun_delegate_email = md.mun_delegate_email
			LEFT JOIN mun_team_members tm ON md.mun_delegate_email = tm.mun_delegate_email
			LEFT JOIN mun_teams t ON tm.mun_team_id = t.mun_team_id
			WHERE 1=1
	`

	args := []interface{}{}
	argIndex := 1

	if startDate != nil && endDate != nil {
		paperQuery += fmt.Sprintf(" AND pp.submission_date BETWEEN $%d AND $%d", argIndex, argIndex+1)
		args = append(args, *startDate, *endDate)
		argIndex += 2
	}

	paperQuery += fmt.Sprintf(`
			GROUP BY group_identifier, tm.mun_team_id, t.mun_team_lead, pp.mun_delegate_email
		)
		SELECT mun_team_id, group_lead
		FROM paper_info
		ORDER BY earliest_submission DESC
		LIMIT $%d OFFSET $%d`, argIndex, argIndex+1)

	args = append(args, limit, offset)

	type GroupInfo struct {
		MUNTeamID *string `db:"mun_team_id"`
		GroupLead string  `db:"group_lead"`
	}

	var groups []GroupInfo
	err := r.db.Select(&groups, paperQuery, args...)
	if err != nil {
		logger.LogError(err, "Failed to get position paper groups", map[string]interface{}{
			"layer":     "repository",
			"operation": "repo.GetPositionPapers",
		})
		return nil, err
	}

	// For each group, get all position papers
	for _, group := range groups {
		var groupPapers []position.PositionPaper

		positionQuery := `
			SELECT 
				pp.mun_delegate_email,
				pp.submission_file,
				pp.submission_date,
				pp.submission_status
			FROM position_paper pp
			JOIN mun_delegates md ON pp.mun_delegate_email = md.mun_delegate_email
			LEFT JOIN mun_team_members tm ON md.mun_delegate_email = tm.mun_delegate_email
			WHERE (tm.mun_team_id = $1 OR ($1 IS NULL AND pp.mun_delegate_email = $2))
		`

		positionArgs := []interface{}{group.MUNTeamID, group.GroupLead}

		if startDate != nil && endDate != nil {
			positionQuery += " AND pp.submission_date BETWEEN $3 AND $4"
			positionArgs = append(positionArgs, *startDate, *endDate)
		}

		positionQuery += " ORDER BY pp.submission_date DESC"

		err := r.db.Select(&groupPapers, positionQuery, positionArgs...)
		if err != nil {
			logger.LogError(err, "Failed to get position papers for group", map[string]interface{}{
				"layer":     "repository",
				"operation": "repo.GetPositionPapers",
				"groupId":   group.MUNTeamID,
			})
			continue
		}

		papers = append(papers, groupPapers...)
	}

	return papers, nil
}

func (r *adminRepo) GetDelegatesByTeam(delegateType string, startDate, endDate *time.Time, limit, offset int) ([]dashboard.TeamDelegateGroup, error) {
	var teamGroups []dashboard.TeamDelegateGroup

	// First, get unique teams with pagination
	teamQuery := `
		WITH team_info AS (
			SELECT DISTINCT 
				COALESCE(tm.mun_team_id, 'individual_' || md.mun_delegate_email) as group_identifier,
				tm.mun_team_id,
				COALESCE(t.mun_team_lead, md.mun_delegate_email) as group_lead,
				MIN(md.insert_date) as earliest_registration,
				COUNT(md.mun_delegate_email) as delegate_count
			FROM mun_delegates md
			LEFT JOIN mun_team_members tm ON md.mun_delegate_email = tm.mun_delegate_email
			LEFT JOIN mun_teams t ON tm.mun_team_id = t.mun_team_id
			WHERE ($1 = '' OR md.participant_type = $1)
	`

	args := []interface{}{delegateType}
	argIndex := 2

	if startDate != nil && endDate != nil {
		teamQuery += fmt.Sprintf(" AND md.insert_date BETWEEN $%d AND $%d", argIndex, argIndex+1)
		args = append(args, *startDate, *endDate)
		argIndex += 2
	}

	teamQuery += fmt.Sprintf(`
			GROUP BY group_identifier, tm.mun_team_id, t.mun_team_lead, md.mun_delegate_email
		)
		SELECT mun_team_id, group_lead, delegate_count
		FROM team_info
		ORDER BY earliest_registration DESC
		LIMIT $%d OFFSET $%d`, argIndex, argIndex+1)

	args = append(args, limit, offset)

	type TeamInfo struct {
		MUNTeamID     *string `db:"mun_team_id"`
		GroupLead     string  `db:"group_lead"`
		DelegateCount int     `db:"delegate_count"`
	}

	var teams []TeamInfo
	err := r.db.Select(&teams, teamQuery, args...)
	if err != nil {
		logger.LogError(err, "Failed to get team delegate groups", map[string]interface{}{
			"layer":     "repository",
			"operation": "repo.GetDelegatesByTeam",
		})
		return nil, err
	}

	// For each team, get all delegates
	for _, team := range teams {
		var teamDelegates []dashboard.MUNDelegates

		delegateQuery := `
			SELECT 
				md.mun_delegate_email,
				md.mun_delegate_name,
				md.type,
				md.council,
				md.council_date,
				md.country,
				md.confirmed,
				md.confirmed_date,
				md.insert_date,
				md.participant_type,
				tm.mun_team_id,
				t.mun_team_lead
			FROM mun_delegates md
			LEFT JOIN mun_team_members tm ON md.mun_delegate_email = tm.mun_delegate_email
			LEFT JOIN mun_teams t ON tm.mun_team_id = t.mun_team_id
			WHERE (tm.mun_team_id = $1 OR ($1 IS NULL AND md.mun_delegate_email = $2))
		`

		delegateArgs := []interface{}{team.MUNTeamID, team.GroupLead}

		if startDate != nil && endDate != nil {
			delegateQuery += " AND md.insert_date BETWEEN $3 AND $4"
			delegateArgs = append(delegateArgs, *startDate, *endDate)
		}

		delegateQuery += " ORDER BY md.insert_date DESC"

		err := r.db.Select(&teamDelegates, delegateQuery, delegateArgs...)
		if err != nil {
			logger.LogError(err, "Failed to get delegates for team", map[string]interface{}{
				"layer":     "repository",
				"operation": "repo.GetDelegatesByTeam",
				"teamId":    team.MUNTeamID,
			})
			continue
		}

		teamGroup := dashboard.TeamDelegateGroup{
			MUNTeamID:     team.MUNTeamID,
			MUNTeamLead:   &team.GroupLead,
			Delegates:     teamDelegates,
			DelegateCount: len(teamDelegates),
		}

		teamGroups = append(teamGroups, teamGroup)
	}

	return teamGroups, nil
}

func (r *adminRepo) GetPositionPapersByTeam(startDate, endDate *time.Time, limit, offset int) ([]position.TeamPositionPaperGroup, error) {
	var teamGroups []position.TeamPositionPaperGroup

	// First, get unique teams with position papers
	teamQuery := `
		WITH team_info AS (
			SELECT DISTINCT 
				COALESCE(tm.mun_team_id, 'individual_' || pp.mun_delegate_email) as group_identifier,
				tm.mun_team_id,
				COALESCE(t.mun_team_lead, pp.mun_delegate_email) as group_lead,
				MIN(pp.submission_date) as earliest_submission,
				COUNT(pp.mun_delegate_email) as paper_count
			FROM position_paper pp
			JOIN mun_delegates md ON pp.mun_delegate_email = md.mun_delegate_email
			LEFT JOIN mun_team_members tm ON md.mun_delegate_email = tm.mun_delegate_email
			LEFT JOIN mun_teams t ON tm.mun_team_id = t.mun_team_id
			WHERE 1=1
	`

	args := []interface{}{}
	argIndex := 1

	if startDate != nil && endDate != nil {
		teamQuery += fmt.Sprintf(" AND pp.submission_date BETWEEN $%d AND $%d", argIndex, argIndex+1)
		args = append(args, *startDate, *endDate)
		argIndex += 2
	}

	teamQuery += fmt.Sprintf(`
			GROUP BY group_identifier, tm.mun_team_id, t.mun_team_lead, pp.mun_delegate_email
		)
		SELECT mun_team_id, group_lead, paper_count
		FROM team_info
		ORDER BY earliest_submission DESC
		LIMIT $%d OFFSET $%d`, argIndex, argIndex+1)

	args = append(args, limit, offset)

	type TeamInfo struct {
		MUNTeamID  *string `db:"mun_team_id"`
		GroupLead  string  `db:"group_lead"`
		PaperCount int     `db:"paper_count"`
	}

	var teams []TeamInfo
	err := r.db.Select(&teams, teamQuery, args...)
	if err != nil {
		logger.LogError(err, "Failed to get team position paper groups", map[string]interface{}{
			"layer":     "repository",
			"operation": "repo.GetPositionPapersByTeam",
		})
		return nil, err
	}

	// For each team, get all position papers
	for _, team := range teams {
		var teamPapers []position.PositionPaper

		paperQuery := `
			SELECT 
				pp.mun_delegate_email,
				pp.submission_file,
				pp.submission_date,
				pp.submission_status
			FROM position_paper pp
			JOIN mun_delegates md ON pp.mun_delegate_email = md.mun_delegate_email
			LEFT JOIN mun_team_members tm ON md.mun_delegate_email = tm.mun_delegate_email
			WHERE (tm.mun_team_id = $1 OR ($1 IS NULL AND pp.mun_delegate_email = $2))
		`

		paperArgs := []interface{}{team.MUNTeamID, team.GroupLead}

		if startDate != nil && endDate != nil {
			paperQuery += " AND pp.submission_date BETWEEN $3 AND $4"
			paperArgs = append(paperArgs, *startDate, *endDate)
		}

		paperQuery += " ORDER BY pp.submission_date DESC"

		err := r.db.Select(&teamPapers, paperQuery, paperArgs...)
		if err != nil {
			logger.LogError(err, "Failed to get position papers for team", map[string]interface{}{
				"layer":     "repository",
				"operation": "repo.GetPositionPapersByTeam",
				"teamId":    team.MUNTeamID,
			})
			continue
		}

		teamGroup := position.TeamPositionPaperGroup{
			MUNTeamID:      team.MUNTeamID,
			MUNTeamLead:    &team.GroupLead,
			PositionPapers: teamPapers,
			PaperCount:     len(teamPapers),
		}

		teamGroups = append(teamGroups, teamGroup)
	}

	return teamGroups, nil
}
