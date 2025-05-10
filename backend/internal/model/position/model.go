package position

import "time"

type PositionPaper struct {
	MUNDelegateEmail string    `json:"mun_delegate_email" db:"mun_delegate_email" binding:"required,email"`
	SubmissionFile   string    `json:"submission_file" db:"submission_file" binding:"required"`
	SubmissionDate   time.Time `json:"submission_date" db:"submission_date"`
	SubmissionStatus string    `json:"submission_status" db:"submission_status" binding:"required oneof=pending accepted rejected"`
}
