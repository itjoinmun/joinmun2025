package dashboard

import (
	"backend/internal/model/dashboard"
	"backend/pkg/utils/logger"

	"github.com/jmoiron/sqlx"
)

type observerRepo struct {
	db *sqlx.DB
}

func (r *observerRepo) GetObserverByEmail(email string) (*dashboard.Observer, error) {
	var observer dashboard.Observer
	query := `SELECT * FROM observers WHERE observer_email = $1`
	err := r.db.Get(&observer, query, email)
	if err != nil {
		logger.LogError(err, "Failed to get observer", map[string]interface{}{"email": email})
		return nil, err
	}
	return &observer, nil
}

func (r *observerRepo) InsertObserver(observer dashboard.Observer) (int, error) {
	query := `INSERT INTO observers (observer_email, biodata_responses_id) 
              VALUES ($1, $2) RETURNING observer_id`
	var id int
	err := r.db.QueryRow(
		query,
		observer.ObserverEmail,
		observer.BiodataResponsesID,
	).Scan(&id)
	if err != nil {
		logger.LogError(err, "Failed to insert observer", map[string]interface{}{
			"email": observer.ObserverEmail,
		})
		return 0, err
	}
	return id, nil
}
