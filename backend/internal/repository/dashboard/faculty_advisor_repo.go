package dashboard

import (
	"backend/internal/model/dashboard"
	"backend/pkg/utils/logger"
	"time"

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
		logger.LogError(err, "Failed to get faculty advisor", map[string]interface{}{"email": email, "layer": "repository", "operation": "repo.GetFacultyAdvisorByEmail"})
		return nil, err
	}
	logger.LogDebug("Faculty advisor retrieved successfully", map[string]interface{}{"email": email, "layer": "repository", "operation": "repo.GetFacultyAdvisorByEmail"})
	return &advisor, nil
}

func (r *facultyAdvisorRepo) InsertFacultyAdvisor(advisor *dashboard.FacultyAdvisor) (int, error) {
	query := `INSERT INTO faculty_advisors (faculty_advisor_email) 
              VALUES ($1) RETURNING faculty_advisor_id`
	var id int
	err := r.db.QueryRow(
		query,
		advisor.FacultyAdvisorEmail,
	).Scan(&id)
	if err != nil {
		logger.LogError(err, "Failed to insert faculty advisor", map[string]interface{}{
			"email": advisor.FacultyAdvisorEmail,
			"layer": "repository", "operation": "repo.InsertFacultyAdvisor",
		})
		return 0, err
	}
	logger.LogDebug("Faculty advisor inserted successfully", map[string]interface{}{"email": advisor.FacultyAdvisorEmail, "layer": "repository", "operation": "repo.InsertFacultyAdvisor"})
	return id, nil
}

func (r *facultyAdvisorRepo) GetFacultyAdvisorsByTeamID(teamID string) ([]dashboard.MUNFacultyAdvisors, error) {
	var advisors []dashboard.MUNFacultyAdvisors
	query := `SELECT * FROM mun_faculty_advisors WHERE mun_team_id = $1`
	err := r.db.Select(&advisors, query, teamID)
	if err != nil {
		logger.LogError(err, "Failed to get faculty advisors for team", map[string]interface{}{"teamID": teamID, "layer": "repository", "operation": "repo.GetFacultyAdvisorsByTeamID"})
		return nil, err
	}
	logger.LogDebug("Faculty advisors retrieved successfully", map[string]interface{}{"teamID": teamID, "layer": "repository", "operation": "repo.GetFacultyAdvisorsByTeamID"})
	return advisors, nil
}

func (r *facultyAdvisorRepo) AddFacultyAdvisorToTeam(teamAdvisor *dashboard.MUNFacultyAdvisors) error {
	query := `INSERT INTO mun_faculty_advisors (faculty_advisor_email, mun_team_id) VALUES ($1, $2)`
	_, err := r.db.Exec(query, teamAdvisor.FacultyAdvisorEmail, teamAdvisor.MUNTeamID)
	if err != nil {
		logger.LogError(err, "Failed to add faculty advisor to team", map[string]interface{}{
			"teamID": teamAdvisor.MUNTeamID,
			"email":  teamAdvisor.FacultyAdvisorEmail,
			"layer":  "repository", "operation": "repo.AddFacultyAdvisorToTeam",
		})
	}
	logger.LogDebug("Faculty advisor added to team successfully", map[string]interface{}{"teamID": teamAdvisor.MUNTeamID, "email": teamAdvisor.FacultyAdvisorEmail, "layer": "repository", "operation": "repo.AddFacultyAdvisorToTeam"})
	return err
}

func (r *facultyAdvisorRepo) UpdateFacultyAdvisorStatus(advisorEmail, status string) error {
	query := `UPDATE faculty_advisors SET status = $1, confirmed_date = $2 WHERE faculty_advisor_email = $3`
	_, err := r.db.Exec(query, status, time.Now(), advisorEmail)
	if err != nil {
		logger.LogError(err, "Failed to update faculty advisor status", map[string]interface{}{
			"email": advisorEmail,
			"layer": "repository", "operation": "repo.UpdateFacultyAdvisorStatus",
		})
		return err
	}
	logger.LogDebug("Faculty advisor status updated successfully", map[string]interface{}{"email": advisorEmail, "layer": "repository", "operation": "repo.UpdateFacultyAdvisorStatus"})

	return nil
}

func (r *facultyAdvisorRepo) MakeFacultyAdvisorPayment(tx *sqlx.Tx, payment *dashboard.Payment) error {
	query := `INSERT INTO payments (package, payment_file, payment_status, payment_date, payment_amount) 
			  VALUES ($1, $2, $3, $4, $5) RETURNING payment_id`
	var id int
	err := tx.QueryRow(
		query,
		payment.Package,
		payment.PaymentFile,
		payment.PaymentStatus,
		payment.PaymentDate,
		payment.PaymentAmount,
	).Scan(&id)
	if err != nil {
		logger.LogError(err, "Failed to make faculty advisor payment", map[string]interface{}{
			"layer":     "repository",
			"operation": "repo.MakeFacultyAdvisorPayment",
		})
		return err
	}
	logger.LogDebug("Faculty advisor payment made successfully", map[string]interface{}{"layer": "repository", "operation": "repo.MakeFacultyAdvisorPayment"})
	return nil
}
