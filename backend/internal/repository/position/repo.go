package position

import (
	"backend/internal/model/position"
	"backend/pkg/utils/logger"

	"github.com/jmoiron/sqlx"
)

type PositionPaperRepo interface {
	GetPositionPaperByDelegateEmail(email string) (*position.PositionPaper, error) // useful for the delegate dashboard
	InsertPositionPaper(positionPaper *position.PositionPaper) (int, error)        // insert a new position paper (delegate function)
	UpdatePositionPaper(positionPaper *position.PositionPaper) error               // not necessary, no need for update
}

type positionPaperRepo struct {
	db *sqlx.DB
}

func NewPositionPaperRepo(db *sqlx.DB) PositionPaperRepo {
	return &positionPaperRepo{db: db}
}

func (r *positionPaperRepo) GetPositionPaperByDelegateEmail(email string) (*position.PositionPaper, error) {
	var paper position.PositionPaper
	query := `SELECT * FROM position_papers WHERE mun_delegate_email = $1`
	err := r.db.Get(&paper, query, email)
	if err != nil {
		logger.LogError(err, "Failed to get position paper", map[string]interface{}{"delegateEmail": email})
		return nil, err
	}
	return &paper, nil
}

func (r *positionPaperRepo) InsertPositionPaper(positionPaper *position.PositionPaper) (int, error) {
	query := `INSERT INTO position_papers (mun_delegate_email, submission_file, submission_date, submission_status) 
              VALUES ($1, $2, $3, $4) RETURNING position_paper_id`
	var id int
	err := r.db.QueryRow(
		query,
		positionPaper.MUNDelegateEmail,
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

func (r *positionPaperRepo) UpdatePositionPaper(positionPaper *position.PositionPaper) error {
	query := `UPDATE position_papers 
              SET submission_file = $1, submission_date = $2, submission_status = $3 
              WHERE mun_delegate_email = $4`
	_, err := r.db.Exec(
		query,
		positionPaper.SubmissionFile,
		positionPaper.SubmissionDate,
		positionPaper.SubmissionStatus,
		positionPaper.MUNDelegateEmail,
	)
	if err != nil {
		logger.LogError(err, "Failed to update position paper", map[string]interface{}{
			"delegateEmail": positionPaper.MUNDelegateEmail,
		})
	}
	return err
}
