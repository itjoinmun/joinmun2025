package dashboard

import (
	"backend/internal/model/dashboard"

	"github.com/jmoiron/sqlx"
)

// QuestionRepo handles access to all question-related models
type QuestionRepo interface {
	// Get questions for biodata, health, and MUN, used for registration
	GetBiodataQuestions() ([]dashboard.BiodataQuestions, error)
	GetHealthQuestions() ([]dashboard.HealthQuestions, error)
	GetMUNQuestions() ([]dashboard.MUNQuestions, error)
}

// ResponseRepo handles access to all response-related models
type ResponseRepo interface {
	// Get responses by delegate email (this is used for the delegate dashboard)
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
	GetDelegateByEmail(email string) (*dashboard.MUNDelegates, error)                                                                                     // Use this for the delegate dashboard
	GetDelegatesByTeamID(teamID int) ([]dashboard.MUNDelegates, error)                                                                                    // We join with team members to get the delegates
	InsertDelegate(tx *sqlx.Tx, delegate *dashboard.MUNDelegates) (int, error)                                                                            // insert a new delegate
	InsertDelegates(tx *sqlx.Tx, delegates []dashboard.MUNDelegates) error                                                                                // batch insert delegates
	UpdateDelegateStatus(tx *sqlx.Tx, delegate *dashboard.MUNDelegates) error                                                                             // update the status, for ADMIN
	GetTeamByID(teamID int) (*dashboard.MUNTeams, error)                                                                                                  // Get team by ID
	InsertTeam(tx *sqlx.Tx, team *dashboard.MUNTeams) (int, error)                                                                                        // Insert a new team (this will be used for the team dashboard, triggered by the delegates insertion also)
	InsertTeamAndPaymentWithDelegates(tx *sqlx.Tx, team *dashboard.MUNTeams, delegates []dashboard.MUNDelegates, payment *dashboard.Payment) (int, error) // create  a relationship between team and delegates (using insert team and insert delegates)
	// Team member operations
	// GetTeamMembers(teamID int) ([]dashboard.MUNTeamMembers, error) // redundant, we can get this from GetDelegatesByTeamID

	// Initial payment operation
	MakeInitialPayment(tx *sqlx.Tx, payment *dashboard.Payment, teamID int) (int, error)
}

// FacultyAdvisorRepo handles faculty advisor operations
type FacultyAdvisorRepo interface {
	GetFacultyAdvisorByEmail(email string) (*dashboard.FacultyAdvisor, error) // Faculty advisor dashboard
	InsertFacultyAdvisor(advisor *dashboard.FacultyAdvisor) (int, error)      // Faculty advisor registration

	// Team associations
	GetFacultyAdvisorsByTeamID(teamID int) ([]dashboard.MUNFacultyAdvisors, error) // useful for the team dsahboard
	AddFacultyAdvisorToTeam(teamAdvisor *dashboard.MUNFacultyAdvisors) error       // later the faculty advisor must add themselves to the team using the team code
}

// ObserverRepo handles observer operations
type ObserverRepo interface {
	GetObserverByEmail(email string) (*dashboard.Observer, error) // Observer dashboard
	InsertObserver(observer *dashboard.Observer) (int, error)     // Observer registration
}

// PositionPaperRepo handles position paper operations
type PositionPaperRepo interface {
	GetPositionPaperByDelegateEmail(email string) (*dashboard.PositionPaper, error) // useful for the delegate dashboard
	InsertPositionPaper(positionPaper *dashboard.PositionPaper) (int, error)        // insert a new position paper (delegate function)
	UpdatePositionPaper(positionPaper *dashboard.PositionPaper) error               // not necessary, no need for update
}

// PaymentRepo handles payment operations
type PaymentRepo interface {
	GetPaymentByID(paymentID int) (*dashboard.Payment, error)         // Get payment by ID, for the payment page
	GetPaymentsByMUNTeamID(teamID string) (*dashboard.Payment, error) // Get payments by team ID, for the team dashboard
	// must make a function for initial payment (maybe in the delegate repo)
	UpdatePaymentStatus(teamID int) error                  // update payment status (ADMIN function)
	UpdatePaymentForTeam(payment *dashboard.Payment) error // update payment for uploading the payment receipt (delegate function)
}

// Factory functions to create repository implementations
func NewQuestionRepo(db *sqlx.DB) QuestionRepo {
	return &questionRepo{db: db}
}

func NewResponseRepo(db *sqlx.DB) ResponseRepo {
	return &responseRepo{db: db}
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
