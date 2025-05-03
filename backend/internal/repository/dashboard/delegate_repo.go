package dashboard

import (
	"backend/internal/model/dashboard"
	"backend/pkg/utils/logger"
	"fmt"
	"strings"

	"github.com/jmoiron/sqlx"
)

type delegateRepo struct {
	db *sqlx.DB
}

func (r *delegateRepo) GetDelegateByEmail(email string) (*dashboard.MUNDelegates, error) {
	var delegate dashboard.MUNDelegates
	query := `SELECT * FROM mun_delegates WHERE mun_delegate_email = $1`
	err := r.db.Get(&delegate, query, email)
	if err != nil {
		logger.LogError(err, "Failed to get delegate by email", map[string]interface{}{"layer": "repository", "operation": "repo.GetDelegateByEmail", "email": email})
		return nil, err
	}
	logger.LogDebug("Delegate retrieved successfully", map[string]interface{}{"layer": "repository", "operation": "repo.GetDelegateByEmail", "email": email})
	return &delegate, nil
}

func (r *delegateRepo) GetDelegatesByTeamID(teamID int) ([]dashboard.MUNDelegates, error) {
	var delegates []dashboard.MUNDelegates
	query := `SELECT md.type, md.mun_delegate_email
	, md.council
	, md.country
	, md.confirmed 
	FROM mun_delegates md 
	JOIN mun_team_members mtm ON md.mun_delegate_email = mtm.mun_delegate_email WHERE mtm.mun_team_id = $1`
	err := r.db.Select(&delegates, query, teamID)
	if err != nil {
		logger.LogError(err, "Failed to get delegates by team ID", map[string]interface{}{"layer": "repository", "operation": "repo.GetDelegatesByTeamID", "teamID": teamID})
		return nil, err
	}
	logger.LogDebug("Delegates retrieved successfully", map[string]interface{}{"layer": "repository", "operation": "repo.GetDelegatesByTeamID", "teamID": teamID})
	return delegates, nil
}

func (r *delegateRepo) InsertDelegate(tx *sqlx.Tx, delegate dashboard.MUNDelegates) (int, error) {
	query := `INSERT INTO mun_delegates (mun_delegate_email, type, council, country, confirmed, confirmed_date) 
              VALUES ($1, $2, $3, $4, $5, $6) RETURNING mun_delegate_id`
	var id int
	err := tx.QueryRow(
		query,
		delegate.MUNDelegateEmail,
		delegate.Type,
		delegate.Council,
		delegate.Country,
		delegate.Confirmed,
		delegate.ConfirmedDate,
	).Scan(&id)
	if err != nil {
		logger.LogError(err, "Failed to insert delegate", map[string]interface{}{
			"email": delegate.MUNDelegateEmail,
		})
		return 0, err
	}
	return id, nil
}

func (r *delegateRepo) InsertDelegates(tx *sqlx.Tx, delegates []dashboard.MUNDelegates) error {
	if len(delegates) == 0 {
		return nil
	}

	query := `INSERT INTO mun_delegates (mun_delegate_email, type, council, country, confirmed) VALUES `
	args := []interface{}{}
	valueStrings := []string{}

	for i, d := range delegates {
		valueStrings = append(valueStrings, fmt.Sprintf("($%d,$%d,$%d,$%d,$%d)",
			i*5+1, i*5+2, i*5+3, i*5+4, i*5+5,
		))
		args = append(args,
			d.MUNDelegateEmail,
			d.Type,
			d.Council,
			d.Country,
			d.Confirmed,
		)
	}

	query += strings.Join(valueStrings, ",")
	_, err := tx.Exec(query, args...)
	if err != nil {
		logger.LogError(err, "Failed to insert delegates", map[string]interface{}{"layer": "repository", "operation": "repo.InsertDelegates"})
		return err
	}
	logger.LogDebug("Delegates inserted successfully", map[string]interface{}{"layer": "repository", "operation": "repo.InsertDelegates"})
	return nil
}

func (r *delegateRepo) UpdateDelegateStatus(tx *sqlx.Tx, delegate dashboard.MUNDelegates) error {
	query := `UPDATE mun_delegates SET confirmed = $1 WHERE mun_delegate_email = $2`
	_, err := tx.Exec(query, delegate.Confirmed, delegate.MUNDelegateEmail)
	if err != nil {
		logger.LogError(err, "Failed to update delegate status", map[string]interface{}{
			"layer":         "repository",
			"operation":     "repo.UpdateDelegateStatus",
			"delegateEmail": delegate.MUNDelegateEmail,
		})
		return err
	}
	logger.LogDebug("Delegate status updated successfully", map[string]interface{}{
		"layer":         "repository",
		"operation":     "repo.UpdateDelegateStatus",
		"delegateEmail": delegate.MUNDelegateEmail,
	})

	return nil
}
