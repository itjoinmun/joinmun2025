package dashboard

import "time"

type BiodataQuestions struct {
	BiodataQuestionID   int    `json:"biodata_question_id" db:"biodata_question_id" binding:"required"`
	QuestionType        string `json:"biodata_question_type" db:"biodata_question_type" binding:"required,oneof=file text dropdown"`
	BiodataQuestionText string `json:"biodata_question_text" db:"biodata_question_text" binding:"required"`
}

type BiodataResponses struct {
	BiodataQuestionID int    `json:"biodata_question_id" db:"biodata_question_id" binding:"required"`
	DelegateEmail     string `json:"delegate_email" db:"delegate_email" binding:"required,email"` // Changed from int to string
	BiodataAnswerText string `json:"biodata_answer_text" db:"biodata_answer_text" binding:"required"`
}

type HealthResponses struct {
	HealthQuestionsID int    `json:"health_questions_id" db:"health_questions_id" binding:"required"`
	DelegateEmail     string `json:"delegate_email" db:"delegate_email" binding:"required,email"` // Changed from int to string
	HealthAnswerText  string `json:"health_answer_text" db:"health_answer_text" binding:"required"`
}

type HealthQuestions struct {
	HealthQuestionID   int    `json:"health_question_id" db:"health_question_id" binding:"required"`
	QuestionType       string `json:"health_question_type" db:"health_question_type" binding:"required,oneof=file text dropdown"`
	HealthQuestionText string `json:"health_question_text" db:"health_question_text" binding:"required"`
}

type MUNQuestions struct {
	MUNQuestionID   int    `json:"mun_question_id" db:"mun_question_id" binding:"required"`
	QuestionType    string `json:"mun_question_type" db:"mun_question_type" binding:"required,oneof=file text dropdown"`
	MUNQuestionText string `json:"mun_question_text" db:"mun_question_text" binding:"required"`
}

type MUNResponses struct {
	DelegateEmail string `json:"delegate_email" db:"delegate_email" binding:"required,email"` // Changed from int to string
	MUNQuestionID int    `json:"mun_question_id" db:"mun_question_id" binding:"required"`
	MUNAnswerText string `json:"mun_answer_text" db:"mun_answer_text" binding:"required"`
}

type MUNDelegates struct {
	MUNDelegateEmail string     `json:"mun_delegate_email" db:"mun_delegate_email" binding:"email"` // Changed from int to string
	Type             *string    `json:"type" db:"type" binding:"omitempty,oneof=single_delegate double_delegate"`
	Pair             *string    `json:"pair" db:"pair" binding:"email,omitempty"`
	Council          *string    `json:"council" db:"council" binding:"omitempty,oneof=UNWOMEN WHO UNSC ECOFIN CRISIS BRICS+ Press"`
	Country          *string    `json:"country" db:"country"`
	Confirmed        *bool      `json:"confirmed" db:"confirmed"`
	ConfirmedDate    *time.Time `json:"confirmed_date" db:"confirmed_date"`
	CouncilDate      *time.Time `json:"council_date" db:"council_date"`
	InsertDate       *time.Time `json:"insert_date" db:"insert_date"`
	ParticipantType  *string    `json:"participant_type" db:"participant_type" binding:"omitempty,oneof=delegate observer faculty_advisor"`
}

type MUNTeams struct {
	MUNTeamID   string `json:"mun_team_id" db:"mun_team_id"`
	MUNTeamLead string `json:"mun_team_lead" db:"mun_team_lead" binding:"required,email"` // Changed from int to string
}

type MUNTeamMembers struct {
	MUNTeamID        string `json:"mun_team_id" db:"mun_team_id" binding:"required"`
	MUNDelegateEmail string `json:"mun_delegate_email" db:"mun_delegate_email" binding:"required,email"`
}

type BiodataResponseWithQuestion struct {
	BiodataQuestionID   int    `db:"biodata_question_id"`
	DelegateEmail       string `db:"delegate_email"`
	BiodataAnswerText   string `db:"biodata_answer_text"`
	BiodataQuestionType string `db:"biodata_question_type"`
	BiodataQuestionText string `db:"biodata_question_text"`
	ParticipantType     string `db:"participant_type"`
}

type HealthResponseWithQuestion struct {
	HealthQuestionsID  int    `db:"health_questions_id"`
	DelegateEmail      string `db:"delegate_email"`
	HealthAnswerText   string `db:"health_answer_text"`
	HealthQuestionType string `db:"health_question_type"`
	HealthQuestionText string `db:"health_question_text"`
	ParticipantType    string `db:"participant_type"`
}

type MUNResponseWithQuestion struct {
	MUNQuestionID   int    `db:"mun_question_id"`
	DelegateEmail   string `db:"delegate_email"`
	MUNAnswerText   string `db:"mun_answer_text"`
	MUNQuestionType string `db:"mun_question_type"`
	MUNQuestionText string `db:"mun_question_text"`
}
