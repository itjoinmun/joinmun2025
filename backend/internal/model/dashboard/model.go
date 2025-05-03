package dashboard

import "time"

type BiodataQuestions struct {
	BiodataQuestionID   int    `json:"biodata_question_id" db:"biodata_question_id" binding:"required"`
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
	HealthQuestionText string `json:"health_question_text" db:"health_question_text" binding:"required"`
}

type MUNQuestions struct {
	MUNQuestionID            int    `json:"mun_question_id" db:"mun_question_id" binding:"required"`
	MUNQuestionPriority      int    `json:"mun_question_priority" db:"mun_question_priority" binding:"required"`
	MUNQuestionCountry       string `json:"mun_question_country" db:"mun_question_country" binding:"required"`
	MUNQuestionCouncil       string `json:"mun_question_council" db:"mun_question_council" binding:"required"`
	MUNCouncilQuestionReason string `json:"mun_council_question_reason" db:"mun_council_question_reason" binding:"required"`
}

type MUNResponses struct {
	DelegateEmail            string `json:"delegate_email" db:"delegate_email" binding:"required,email"` // Changed from int to string
	MUNQuestionID            int    `json:"mun_question_id" db:"mun_question_id" binding:"required"`
	MUNResponsePriority      int    `json:"mun_response_priority" db:"mun_response_priority" binding:"required"`
	MUNResponseCountry       string `json:"mun_response_country" db:"mun_response_country" binding:"required"`
	MUNResponseCouncil       string `json:"mun_response_council" db:"mun_response_council" binding:"required"`
	MUNCouncilResponseReason string `json:"mun_council_response_reason" db:"mun_council_response_reason" binding:"required"`
}

type MUNDelegates struct {
	MUNDelegateEmail string    `json:"mun_delegate_email" db:"mun_delegate_email" binding:"required,email"` // Changed from int to string
	Type             string    `json:"type" db:"type" binding:"required oneof=single_delegate double_delegate"`
	Council          string    `json:"council" db:"council" binding:"required oneof=UNWOMEN WHO UNSC ECOFIN CRISIS BRICS+ Press"`
	Country          string    `json:"country" db:"country" binding:"required"`
	Confirmed        bool      `json:"confirmed" db:"confirmed" binding:"required"`
	ConfirmedDate    time.Time `json:"confirmed_date" db:"confirmed_date"`
}

type MUNTeams struct {
	MUNTeamID           int    `json:"mun_team_id" db:"mun_team_id" binding:"required"`
	FacultyAdvisorEmail string `json:"faculty_advisor_email" db:"faculty_advisor_email"` // Changed from int to string
	PaymentID           int    `json:"payment_id" db:"payment_id"`
}

type MUNTeamMembers struct {
	MUNTeamID        int    `json:"mun_team_id" db:"mun_team_id" binding:"required"`
	MUNDelegateEmail string `json:"mun_delegate_email" db:"mun_delegate_email" binding:"required,email"`
}

type MUNFacultyAdvisors struct {
	MUNTeamID           int    `json:"mun_team_id" db:"mun_team_id" binding:"required"`
	FacultyAdvisorEmail string `json:"faculty_advisor_email" db:"faculty_advisor_email" binding:"required,email"`
}

type PositionPaper struct {
	MUNDelegateEmail string    `json:"mun_delegate_email" db:"mun_delegate_email" binding:"required,email"`
	MUNTeamID        int       `json:"mun_team_id" db:"mun_team_id" binding:"required"`
	SubmissionFile   string    `json:"submission_file" db:"submission_file" binding:"required"`
	SubmissionDate   time.Time `json:"submission_date" db:"submission_date"`
	SubmissionStatus string    `json:"submission_status" db:"submission_status" binding:"required oneof=pending accepted rejected"`
}

type Observer struct {
	ObserverEmail      string `json:"observer_email" db:"observer_email" binding:"required,email"` // Changed from int to string
	BiodataResponsesID int    `json:"biodata_responses_id" db:"biodata_responses_id"`
}

type FacultyAdvisor struct {
	FacultyAdvisorEmail string `json:"faculty_advisor_email" db:"faculty_advisor_email" binding:"required,email"` // Changed from int to string
	BiodataResponsesID  int    `json:"biodata_responses_id" db:"biodata_responses_id"`
}

type Payment struct {
	PaymentID     int       `json:"payment_id" db:"payment_id" binding:"required"`
	MUNTeamID     int       `json:"mun_team_id" db:"mun_team_id" binding:"required"`
	Package       string    `json:"package" db:"package" binding:"required"`
	PaymentFile   string    `json:"payment_file" db:"payment_file"`
	PaymentStatus string    `json:"payment_status" db:"payment_status" binding:"required oneof=pending paid failed"`
	PaymentDate   time.Time `json:"payment_date" db:"payment_date"`
	PaymentAmount int       `json:"payment_amount" db:"payment_amount" binding:"required"`
}
