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
}

type MUNTeams struct {
	MUNTeamID   string `json:"mun_team_id" db:"mun_team_id"`
	MUNTeamLead string `json:"mun_team_lead" db:"mun_team_lead" binding:"required,email"` // Changed from int to string
}

type MUNTeamMembers struct {
	MUNTeamID        string `json:"mun_team_id" db:"mun_team_id" binding:"required"`
	MUNDelegateEmail string `json:"mun_delegate_email" db:"mun_delegate_email" binding:"required,email"`
}

type MUNFacultyAdvisors struct {
	MUNTeamID           string `json:"mun_team_id" db:"mun_team_id" binding:"required"`
	FacultyAdvisorEmail string `json:"faculty_advisor_email" db:"faculty_advisor_email" binding:"required,email"`
}

type PositionPaper struct {
	MUNDelegateEmail string    `json:"mun_delegate_email" db:"mun_delegate_email" binding:"required,email"`
	SubmissionFile   string    `json:"submission_file" db:"submission_file" binding:"required"`
	SubmissionDate   time.Time `json:"submission_date" db:"submission_date"`
	SubmissionStatus string    `json:"submission_status" db:"submission_status" binding:"required oneof=pending accepted rejected"`
}

type Observer struct {
	ObserverEmail string    `json:"observer_email" db:"observer_email" binding:"required,email"` // Changed from int to string
	Confirmed     bool      `json:"confirmed" db:"confirmed" binding:"omitempty"`
	ConfirmedDate time.Time `json:"confirmed_date" db:"confirmed_date"`
}

type FacultyAdvisor struct {
	FacultyAdvisorEmail string    `json:"faculty_advisor_email" db:"faculty_advisor_email" binding:"required,email"` // Changed from int to string
	Confirmed           bool      `json:"confirmed" db:"confirmed" binding:"omitempty"`
	ConfirmedDate       time.Time `json:"confirmed_date" db:"confirmed_date"`
}

type Payment struct {
	PaymentID        int       `json:"payment_id" db:"payment_id" binding:"required"`
	MUNDelegateEmail string    `json:"mun_delegate_email" db:"mun_delegate_email" binding:"required,email"` // Changed from int to string
	Package          string    `json:"package" db:"package" binding:"omitempty"`
	PaymentFile      string    `json:"payment_file" db:"payment_file"`
	PaymentStatus    string    `json:"payment_status" db:"payment_status" binding:"omitempty,oneof=pending paid failed"`
	PaymentDate      time.Time `json:"payment_date" db:"payment_date"`
	PaymentAmount    int       `json:"payment_amount" db:"payment_amount" binding:"omitempty"`
}
