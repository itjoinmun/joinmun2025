package dashboard

import (
	"backend/internal/model/dashboard"
	"backend/pkg/utils/logger"

	"github.com/jmoiron/sqlx"
)

type facultyAdvisorRepo struct {
	db *sqlx.DB
}

func (r *facultyAdvisorRepo) GetFacultyAdvisorByEmail(email string) (*dashboard.FacultyAdvisor, error) {
	var advisor dashboard.FacultyAdvisor
	query := `SELECT * FROM faculty_advisors WHERE faculty_advisor_email = $1`
	err := r.db.Get(&advisor, query, email)
	if err != nil {
		logger.LogError(err, "Failed to get faculty advisor", map[string]interface{}{"email": email})
		return nil, err
	}
	return &advisor, nil
}

func (r *facultyAdvisorRepo) InsertFacultyAdvisor(advisor *dashboard.FacultyAdvisor) (int, error) {
	query := `INSERT INTO faculty_advisors (faculty_advisor_email, biodata_responses_id) 
              VALUES ($1, $2) RETURNING faculty_advisor_id`
	var id int
	err := r.db.QueryRow(
		query,
		advisor.FacultyAdvisorEmail,
		advisor.BiodataResponsesID,
	).Scan(&id)
	if err != nil {
		logger.LogError(err, "Failed to insert faculty advisor", map[string]interface{}{
			"email": advisor.FacultyAdvisorEmail,
		})
		return 0, err
	}
	return id, nil
}

func (r *facultyAdvisorRepo) GetFacultyAdvisorsByTeamID(teamID int) ([]dashboard.MUNFacultyAdvisors, error) {
	var advisors []dashboard.MUNFacultyAdvisors
	query := `SELECT * FROM mun_faculty_advisors WHERE mun_team_id = $1`
	err := r.db.Select(&advisors, query, teamID)
	if err != nil {
		logger.LogError(err, "Failed to get faculty advisors for team", map[string]interface{}{"teamID": teamID})
		return nil, err
	}
	return advisors, nil
}

func (r *facultyAdvisorRepo) AddFacultyAdvisorToTeam(teamAdvisor *dashboard.MUNFacultyAdvisors) error {
	query := `INSERT INTO mun_faculty_advisors (faculty_advisor_email, mun_team_id) VALUES ($1, $2)`
	_, err := r.db.Exec(query, teamAdvisor.FacultyAdvisorEmail, teamAdvisor.MUNTeamID)
	if err != nil {
		logger.LogError(err, "Failed to add faculty advisor to team", map[string]interface{}{
			"teamID": teamAdvisor.MUNTeamID,
			"email":  teamAdvisor.FacultyAdvisorEmail,
		})
	}
	return err
}
