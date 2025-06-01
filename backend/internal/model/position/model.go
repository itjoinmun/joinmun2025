package position

import "time"

type PositionPaper struct {
	MUNDelegateEmail string    `json:"mun_delegate_email" db:"mun_delegate_email"`
	SubmissionFile   string    `json:"submission_file" db:"submission_file"`
	SubmissionDate   time.Time `json:"submission_date" db:"submission_date"`
	SubmissionStatus string    `json:"submission_status" db:"submission_status"`
}

type TeamPositionPaperGroup struct {
	MUNTeamID      *string         `json:"mun_team_id"`
	MUNTeamLead    *string         `json:"mun_team_lead"`
	PositionPapers []PositionPaper `json:"position_papers"`
	PaperCount     int             `json:"paper_count"`
}
