package dashboard

import (
	"backend/internal/model/dashboard"
	"backend/pkg/utils/logger"

	"github.com/jmoiron/sqlx"
)

type positionPaperRepo struct {
	db *sqlx.DB
}

func (r *positionPaperRepo) GetPositionPaperByDelegateEmail(email string) (*dashboard.PositionPaper, error) {
	var paper dashboard.PositionPaper
	query := `SELECT * FROM position_papers WHERE mun_delegate_email = $1`
	err := r.db.Get(&paper, query, email)
	if err != nil {
		logger.LogError(err, "Failed to get position paper", map[string]interface{}{"delegateEmail": email})
		return nil, err
	}
	return &paper, nil
}

func (r *positionPaperRepo) InsertPositionPaper(positionPaper dashboard.PositionPaper) (int, error) {
	query := `INSERT INTO position_papers (mun_delegate_email, mun_team_id, submission_file, submission_date, submission_status) 
              VALUES ($1, $2, $3, $4, $5) RETURNING position_paper_id`
	var id int
	err := r.db.QueryRow(
		query,
		positionPaper.MUNDelegateEmail,
		positionPaper.MUNTeamID,
		positionPaper.SubmissionFile,
		positionPaper.SubmissionDate,
		positionPaper.SubmissionStatus,
	).Scan(&id)
	if err != nil {
		logger.LogError(err, "Failed to insert position paper", map[string]interface{}{
			"delegateEmail": positionPaper.MUNDelegateEmail,
		})
		return 0, err
	}
	return id, nil
}

func (r *positionPaperRepo) UpdatePositionPaper(positionPaper dashboard.PositionPaper) error {
	query := `UPDATE position_papers 
              SET submission_file = $1, submission_date = $2, submission_status = $3 
              WHERE mun_delegate_email = $4 AND mun_team_id = $5`
	_, err := r.db.Exec(
		query,
		positionPaper.SubmissionFile,
		positionPaper.SubmissionDate,
		positionPaper.SubmissionStatus,
		positionPaper.MUNDelegateEmail,
		positionPaper.MUNTeamID,
	)
	if err != nil {
		logger.LogError(err, "Failed to update position paper", map[string]interface{}{
			"delegateEmail": positionPaper.MUNDelegateEmail,
		})
	}
	return err
}
