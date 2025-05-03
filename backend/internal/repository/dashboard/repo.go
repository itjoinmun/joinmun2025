package dashboard

import (
	"backend/internal/model/dashboard"

	"github.com/jmoiron/sqlx"
)

// QuestionRepo handles access to all question-related models
type QuestionRepo interface {
	GetBiodataQuestions() ([]dashboard.BiodataQuestions, error)
	GetHealthQuestions() ([]dashboard.HealthQuestions, error)
	GetMUNQuestions() ([]dashboard.MUNQuestions, error)
}

// ResponseRepo handles access to all response-related models
type ResponseRepo interface {
	// Get responses by delegate email
	GetBiodataResponsesByDelegateEmail(delegateEmail string) ([]dashboard.BiodataResponses, error)
	GetHealthResponsesByDelegateEmail(delegateEmail string) ([]dashboard.HealthResponses, error)
	GetMUNResponsesByDelegateEmail(delegateEmail string) ([]dashboard.MUNResponses, error)

	// Insert new responses
	InsertBiodataResponses(tx *sqlx.Tx, biodataResponse []dashboard.BiodataResponses) error
	InsertHealthResponses(tx *sqlx.Tx, healthResponse []dashboard.HealthResponses) error
	InsertMUNResponses(tx *sqlx.Tx, munResponse []dashboard.MUNResponses) error
}

// DelegateRepo handles delegate-specific operations
type DelegateRepo interface {
	GetDelegateByEmail(email string) (*dashboard.MUNDelegates, error)
	GetDelegatesByTeamID(teamID int) ([]dashboard.MUNDelegates, error)
	InsertDelegate(tx *sqlx.Tx, delegate dashboard.MUNDelegates) (int, error)
	UpdateDelegateStatus(tx *sqlx.Tx, delegate dashboard.MUNDelegates) error
}

// TeamRepo handles team operations and associations
type TeamRepo interface {
	GetTeamByID(teamID int) (*dashboard.MUNTeams, error)
	InsertTeam(tx *sqlx.Tx, team dashboard.MUNTeams) (int, error)

	// Team member operations
	GetTeamMembers(teamID int) ([]dashboard.MUNTeamMembers, error)
}

// FacultyAdvisorRepo handles faculty advisor operations
type FacultyAdvisorRepo interface {
	GetFacultyAdvisorByEmail(email string) (*dashboard.FacultyAdvisor, error)
	InsertFacultyAdvisor(advisor dashboard.FacultyAdvisor) (int, error)

	// Team associations
	GetFacultyAdvisorsByTeamID(teamID int) ([]dashboard.MUNFacultyAdvisors, error)
	AddFacultyAdvisorToTeam(teamAdvisor dashboard.MUNFacultyAdvisors) error
}

// ObserverRepo handles observer operations
type ObserverRepo interface {
	GetObserverByEmail(email string) (*dashboard.Observer, error)
	InsertObserver(observer dashboard.Observer) (int, error)
}

// PositionPaperRepo handles position paper operations
type PositionPaperRepo interface {
	GetPositionPaperByDelegateEmail(email string) (*dashboard.PositionPaper, error)
	InsertPositionPaper(positionPaper dashboard.PositionPaper) (int, error)
	UpdatePositionPaper(positionPaper dashboard.PositionPaper) error
}

// PaymentRepo handles payment operations
type PaymentRepo interface {
	GetPaymentByID(paymentID int) (*dashboard.Payment, error)
	GetPaymentsByTeamID(teamID int) ([]dashboard.Payment, error)
	InsertPayment(payment dashboard.Payment) (int, error)
	UpdatePayment(payment dashboard.Payment) error
}

// Factory functions to create repository implementations
func NewQuestionRepo(db *sqlx.DB) QuestionRepo {
	return &questionRepo{db: db}
}

func NewResponseRepo(db *sqlx.DB) ResponseRepo {
	return &responseRepo{db: db}
}

func NewTeamRepo(db *sqlx.DB) TeamRepo {
	return &teamRepo{db: db}
}

func NewPositionPaperRepo(db *sqlx.DB) PositionPaperRepo {
	return &positionPaperRepo{db: db}
}

func NewDelegateRepo(db *sqlx.DB) DelegateRepo {
	return &delegateRepo{db: db}
}

func NewFacultyAdvisorRepo(db *sqlx.DB) FacultyAdvisorRepo {
	return &facultyAdvisorRepo{db: db}
}

func NewObserverRepo(db *sqlx.DB) ObserverRepo {
	return &observerRepo{db: db}
}

func NewPaymentRepo(db *sqlx.DB) PaymentRepo {
	return &paymentRepo{db: db}
}
