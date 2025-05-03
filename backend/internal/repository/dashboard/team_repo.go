package dashboard

import (
	"backend/internal/model/dashboard"
	"backend/pkg/utils/logger"

	"github.com/jmoiron/sqlx"
)

type teamRepo struct {
	db *sqlx.DB
}

func (r *teamRepo) GetTeamByID(teamID int) (*dashboard.MUNTeams, error) {
	var team dashboard.MUNTeams
	query := `SELECT * FROM mun_teams WHERE mun_team_id = $1`
	err := r.db.Get(&team, query, teamID)
	if err != nil {
		logger.LogError(err, "Failed to get team by ID", map[string]interface{}{"layer": "repository", "operation": "repo.GetTeamByID", "teamID": teamID})
		return nil, err
	}
	return &team, nil
}

func (r *teamRepo) InsertTeam(tx *sqlx.Tx, team dashboard.MUNTeams) (int, error) {
	query := `INSERT INTO mun_teams (mun_team_id, faculty_advisor_email, payment_id) VALUES ($1, $2, $3) RETURNING mun_team_id`
	var teamID int
	err := tx.QueryRow(query, team.MUNTeamID, team.FacultyAdvisorEmail, team.PaymentID).Scan(&teamID)
	if err != nil {
		logger.LogError(err, "Failed to insert team", map[string]interface{}{
			"teamID":    team.MUNTeamID,
			"email":     team.FacultyAdvisorEmail,
			"paymentID": team.PaymentID,
			"layer":     "repository",
			"operation": "repo.InsertTeam",
		})
		return 0, err
	}
	logger.LogDebug("Team inserted successfully", map[string]interface{}{
		"layer":     "repository",
		"operation": "repo.InsertTeam",
		"teamID":    teamID,
	})
	return teamID, nil
}

func (r *teamRepo) GetTeamMembers(teamID int) ([]dashboard.MUNTeamMembers, error) {
	var members []dashboard.MUNTeamMembers
	query := `SELECT * FROM mun_team_members WHERE mun_team_id = $1`
	err := r.db.Select(&members, query, teamID)
	if err != nil {
		logger.LogError(err, "Failed to get team members", map[string]interface{}{"teamID": teamID, "layer": "repository", "operation": "repo.GetTeamMembers"})
		return nil, err
	}
	logger.LogDebug("Team members retrieved successfully", map[string]interface{}{
		"layer":     "repository",
		"operation": "repo.GetTeamMembers",
		"teamID":    teamID,
	})
	return members, nil
}
