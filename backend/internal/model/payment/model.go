package payment

import "time"

type Payment struct {
	PaymentID        int       `json:"payment_id" db:"payment_id" binding:"required"`
	MUNTeamID        *string   `json:"mun_team_id" db:"mun_team_id" binding:"required"`
	MUNDelegateEmail string    `json:"mun_delegate_email" db:"mun_delegate_email" binding:"required,email"` // Changed from int to string
	Package          string    `json:"package" db:"package" binding:"omitempty"`
	PaymentFile      string    `json:"payment_file" db:"payment_file"`
	PaymentStatus    string    `json:"payment_status" db:"payment_status" binding:"omitempty,oneof=pending paid failed"`
	PaymentDate      time.Time `json:"payment_date" db:"payment_date"`
	PaymentAmount    int       `json:"payment_amount" db:"payment_amount" binding:"omitempty"`
}

type PaymentResponseWithTeam struct {
	PaymentID        int       `json:"payment_id" db:"payment_id" binding:"required"`
	MUNTeamID        string    `json:"mun_team_id" db:"mun_team_id" binding:"required"`
	MUNDelegateEmail string    `json:"mun_delegate_email" db:"mun_delegate_email" binding:"required,email"`
	Package          string    `json:"package" db:"package" binding:"omitempty"`
	PaymentFile      string    `json:"payment_file" db:"payment_file"`
	PaymentStatus    string    `json:"payment_status" db:"payment_status" binding:"omitempty,oneof=pending paid failed"`
	PaymentDate      time.Time `json:"payment_date" db:"payment_date"`
	PaymentAmount    int       `json:"payment_amount" db:"payment_amount" binding:"omitempty"`
	ParticipantType  string    `json:"participant_type" db:"participant_type" binding:"omitempty,oneof=faculty_advisor observer single_delegate team_delegate"`
	MUNTeamLead      string    `json:"mun_team_lead" db:"mun_team_lead"`
}

type PaymentWithTeamMembers struct {
	PaymentID        int       `json:"payment_id" db:"payment_id"`
	MUNTeamID        *string   `json:"mun_team_id" db:"mun_team_id"`
	MUNDelegateEmail string    `json:"mun_delegate_email" db:"mun_delegate_email"`
	Package          string    `json:"package" db:"package"`
	PaymentFile      string    `json:"payment_file" db:"payment_file"`
	PaymentStatus    string    `json:"payment_status" db:"payment_status"`
	PaymentDate      time.Time `json:"payment_date" db:"payment_date"`
	PaymentAmount    int       `json:"payment_amount" db:"payment_amount"`
	// Delegate information
	MUNDelegateName string     `json:"mun_delegate_name" db:"mun_delegate_name"`
	Confirmed       *bool      `json:"confirmed" db:"confirmed"`
	InsertDate      *time.Time `json:"insert_date" db:"insert_date"`
	ParticipantType *string    `json:"participant_type" db:"participant_type"`
	// Team information
	MUNTeamLead string           `json:"mun_team_lead" db:"mun_team_lead"`
	TeamMembers []TeamMemberInfo `json:"team_members,omitempty"`
}

type TeamMemberInfo struct {
	MUNDelegateEmail string  `json:"mun_delegate_email" db:"mun_delegate_email"`
	MUNDelegateName  string  `json:"mun_delegate_name" db:"mun_delegate_name"`
	ParticipantType  *string `json:"participant_type" db:"participant_type"`
	Confirmed        *bool   `json:"confirmed" db:"confirmed"`
	// Add payment information
	PaymentStatus string `json:"payment_status" db:"payment_status"`
	PaymentAmount int    `json:"payment_amount" db:"payment_amount"`
	Package       string `json:"package" db:"package"`
}
