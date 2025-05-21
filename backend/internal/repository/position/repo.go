package position

import (
	"backend/internal/model/position"
	"backend/pkg/utils/logger"

	"github.com/jmoiron/sqlx"
)

type PositionPaperRepo interface {
	GetPositionPaperByDelegateEmail(email string) (*position.PositionPaper, error) // useful for the delegate dashboard
	InsertPositionPaper(positionPaper *position.PositionPaper) error               // insert a new position paper (delegate function)
}

type positionPaperRepo struct {
	db *sqlx.DB
}

func NewPositionPaperRepo(db *sqlx.DB) PositionPaperRepo {
	return &positionPaperRepo{db: db}
}

func (r *positionPaperRepo) GetPositionPaperByDelegateEmail(email string) (*position.PositionPaper, error) {
	var paper position.PositionPaper
	query := `SELECT * FROM position_paper WHERE mun_delegate_email = $1`
	err := r.db.Get(&paper, query, email)
	if err != nil {
		logger.LogError(err, "Failed to get position paper", map[string]interface{}{"delegateEmail": email})
		return nil, err
	}
	return &paper, nil
}

func (r *positionPaperRepo) InsertPositionPaper(positionPaper *position.PositionPaper) error {
	query := `INSERT INTO position_paper (mun_delegate_email, submission_file, submission_date, submission_status) 
              VALUES ($1, $2, $3, $4)`

	_, err := r.db.Exec(
		query,
		positionPaper.MUNDelegateEmail,
		positionPaper.SubmissionFile,
		positionPaper.SubmissionDate,
		positionPaper.SubmissionStatus,
	)
	if err != nil {
		logger.LogError(err, "Failed to insert position paper", map[string]interface{}{
			"delegateEmail": positionPaper.MUNDelegateEmail,
		})
		return err
	}
	return nil
}
