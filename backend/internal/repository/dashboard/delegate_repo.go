package dashboard

import (
	"backend/internal/model/dashboard"
	"backend/pkg/utils/logger"
	"fmt"
	"strings"
	"time"

	"github.com/jmoiron/sqlx"
)

type delegateRepo struct {
	db *sqlx.DB
}

func (r *delegateRepo) DB() *sqlx.DB {
	return r.db
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

func (r *delegateRepo) GetDelegatesByTeamID(teamID string) ([]dashboard.MUNDelegates, error) {
	var delegates []dashboard.MUNDelegates
	query := `SELECT md.type, md.mun_delegate_email
	, md.council
	, md.country
	, md.confirmed 
	, md.confirmed_date
	, md.participant_type
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
func (r *delegateRepo) InsertOneDelegate(tx *sqlx.Tx, delegate *dashboard.MUNDelegates) (string, error) {
	query := `INSERT INTO mun_delegates (mun_delegate_email, type, council, country, confirmed, confirmed_date, insert_date, participant_type) 
			  VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING mun_delegate_email`
	var id string
	err := tx.QueryRow(
		query,
		delegate.MUNDelegateEmail,
		nil,
		nil,
		nil,
		false,
		time.Time{},
		time.Now(),
		delegate.ParticipantType,
	).Scan(&id)
	if err != nil {
		logger.LogError(err, "Failed to insert delegate", map[string]interface{}{
			"email": delegate.MUNDelegateEmail,
			"layer": "repository", "operation": "repo.InsertOneDelegate",
		})
		return "", err
	}
	logger.LogDebug("Delegate inserted successfully", map[string]interface{}{"email": delegate.MUNDelegateEmail, "layer": "repository", "operation": "repo.InsertOneDelegate"})
	return id, nil
}

func (r *delegateRepo) InsertDelegates(tx *sqlx.Tx, delegates []dashboard.MUNDelegates) error {
	if len(delegates) == 0 {
		return nil
	}

	query := `INSERT INTO mun_delegates (mun_delegate_email, type, council, country, confirmed, confirmed_date, insert_date, participant_type) VALUES `
	args := []interface{}{}
	valueStrings := []string{}

	for i, d := range delegates {
		valueStrings = append(valueStrings, fmt.Sprintf("($%d,$%d,$%d,$%d,$%d,$%d,$%d,$%d)",
			i*8+1, i*8+2, i*8+3, i*8+4, i*8+5, i*8+6, i*8+7, i*8+8,
		))
		args = append(args,
			d.MUNDelegateEmail,
			nil,
			nil,
			nil,
			false,
			time.Time{},
			time.Now(),
			d.ParticipantType,
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

func (r *delegateRepo) GetTeamByID(teamID string) (*dashboard.MUNTeams, error) {
	var team dashboard.MUNTeams
	query := `SELECT * FROM mun_teams WHERE mun_team_id = $1`
	err := r.db.Get(&team, query, teamID)
	if err != nil {
		logger.LogError(err, "Failed to get team by ID", map[string]interface{}{"layer": "repository", "operation": "repo.GetTeamByID", "teamID": teamID})
		return nil, err
	}
	return &team, nil
}

func (r *delegateRepo) GetTeamIDByDelegateEmail(delegateEmail string) (string, error) {
	var teamID string
	query := `SELECT mun_team_id FROM mun_team_members WHERE mun_delegate_email = $1`
	err := r.db.Get(&teamID, query, delegateEmail)
	if err != nil {
		logger.LogError(err, "Failed to get team by delegate email", map[string]interface{}{"layer": "repository", "operation": "repo.GetTeamsByDelegateEmail", "delegateEmail": delegateEmail})
		return "", err
	}
	logger.LogDebug("Team retrieved successfully", map[string]interface{}{"layer": "repository", "operation": "repo.GetTeamsByDelegateEmail", "delegateEmail": delegateEmail})
	return teamID, nil
}

func (r *delegateRepo) InsertTeam(tx *sqlx.Tx, team *dashboard.MUNTeams) (string, error) {
	query := `INSERT INTO mun_teams (mun_team_id, mun_team_lead) VALUES ($1, $2) RETURNING mun_team_id`
	var teamID string
	err := tx.QueryRow(query, team.MUNTeamID, team.MUNTeamLead).Scan(&teamID)
	if err != nil {
		logger.LogError(err, "Failed to insert team", map[string]interface{}{
			"teamID":    team.MUNTeamID,
			"layer":     "repository",
			"operation": "repo.InsertTeam",
		})
		return "", err
	}
	logger.LogDebug("Team inserted successfully", map[string]interface{}{
		"layer":     "repository",
		"operation": "repo.InsertTeam",
		"teamID":    teamID,
	})
	return teamID, nil
}

func (r *delegateRepo) InsertTeamWithDelegates(tx *sqlx.Tx, team *dashboard.MUNTeams, delegates []dashboard.MUNDelegates) (string, error) {
	// 1. Insert the team
	teamID, err := r.InsertTeam(tx, team)
	if err != nil {
		logger.LogError(err, "Failed to insert team", map[string]interface{}{
			"teamID":    team.MUNTeamID,
			"layer":     "repository",
			"operation": "repo.InsertTeam",
		})
		return "", err
	}

	// 2. Insert the delegates
	err = r.InsertDelegates(tx, delegates)
	if err != nil {
		logger.LogError(err, "Failed to insert delegates", map[string]interface{}{
			"teamID":    teamID,
			"layer":     "repository",
			"operation": "repo.InsertDelegates",
		})
		return "", err
	}

	// 3. Link each delegate to the team
	query := `INSERT INTO mun_team_members (mun_team_id, mun_delegate_email) VALUES `
	args := []interface{}{}
	valueStrings := []string{}

	for i, d := range delegates {
		valueStrings = append(valueStrings, fmt.Sprintf("($%d, $%d)", i*2+1, i*2+2))
		args = append(args, teamID, d.MUNDelegateEmail)
	}

	query += strings.Join(valueStrings, ",")
	_, err = tx.Exec(query, args...)
	if err != nil {
		logger.LogError(err, "Failed to insert team members", map[string]interface{}{
			"teamID":    teamID,
			"layer":     "repository",
			"operation": "InsertTeamWithDelegates",
		})
		return "", err
	}

	logger.LogDebug("Team and delegates inserted successfully", map[string]interface{}{
		"teamID":    teamID,
		"layer":     "repository",
		"operation": "InsertTeamWithDelegates",
	})

	return teamID, nil
}

func (r *delegateRepo) InsertMeToTeam(teamID, delegateEmail string) error {
	query := `INSERT INTO mun_team_members (mun_team_id, mun_delegate_email) VALUES ($1, $2)`
	_, err := r.db.Exec(query, teamID, delegateEmail)
	if err != nil {
		logger.LogError(err, "Failed to insert me to team", map[string]interface{}{
			"layer":         "repository",
			"operation":     "repo.InsertMeToTeam",
			"delegateEmail": delegateEmail,
		})
		return err
	}
	logger.LogDebug("Me inserted to team successfully", map[string]interface{}{
		"layer":         "repository",
		"operation":     "repo.InsertMeToTeam",
		"delegateEmail": delegateEmail,
	})
	return nil
}
