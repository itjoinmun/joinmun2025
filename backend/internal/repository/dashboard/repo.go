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
	BeginTransaction() (*sqlx.Tx, error) // Begin a transaction
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
	DB() *sqlx.DB                                                                                                      // Get the database connection
	GetDelegateByEmail(email string) (*dashboard.MUNDelegates, error)                                                  // Use this for the delegate dashboard
	GetDelegatesByTeamID(teamID string) ([]dashboard.MUNDelegates, error)                                              // We join with team members to get the delegates
	GetTeamByID(teamID string) (*dashboard.MUNTeams, error)                                                            // Get team by ID
	GetTeamIDByDelegateEmail(delegateEmail string) (string, error)                                                     // Get teams by delegate email (this is used for the team dashboard)
	InsertOneDelegate(tx *sqlx.Tx, delegate *dashboard.MUNDelegates) (string, error)                                   // Insert a new delegate
	InsertDelegates(tx *sqlx.Tx, delegates []dashboard.MUNDelegates) error                                             // batch insert delegates
	InsertTeam(tx *sqlx.Tx, team *dashboard.MUNTeams) (string, error)                                                  // Insert a new team (this will be used for the team dashboard, triggered by the delegates insertion also)
	InsertTeamWithDelegates(tx *sqlx.Tx, team *dashboard.MUNTeams, delegates []dashboard.MUNDelegates) (string, error) // create  a relationship between team and delegates (using insert team and insert delegates)
	InsertMeToTeam(teamID string, delegateEmail string) error                                                          // add a delegate to a team (this is used for the team dashboard)
}

// Factory functions to create repository implementations
func NewQuestionRepo(db *sqlx.DB) QuestionRepo {
	return &questionRepo{db: db}
}

func NewResponseRepo(db *sqlx.DB) ResponseRepo {
	return &responseRepo{db: db}
}

func NewDelegateRepo(db *sqlx.DB) DelegateRepo {
	return &delegateRepo{db: db}
}
