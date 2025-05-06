package dashboard

import (
	"backend/internal/model/dashboard"
	"backend/pkg/utils/logger"
	"time"

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
		logger.LogError(err, "Failed to get observer", map[string]interface{}{"email": email, "layer": "repository", "operation": "repo.GetObserverByEmail"})
		return nil, err
	}
	logger.LogDebug("Observer retrieved successfully", map[string]interface{}{"email": email, "layer": "repository", "operation": "repo.GetObserverByEmail"})
	return &observer, nil
}

func (r *observerRepo) InsertObserver(observer *dashboard.Observer) (int, error) {
	query := `INSERT INTO observers (observer_email) 
              VALUES ($1) RETURNING observer_id`
	var id int
	err := r.db.QueryRow(
		query,
		observer.ObserverEmail,
	).Scan(&id)
	if err != nil {
		logger.LogError(err, "Failed to insert observer", map[string]interface{}{
			"email": observer.ObserverEmail,
			"layer": "repository", "operation": "repo.InsertObserver",
		})
		return 0, err
	}
	logger.LogDebug("Observer inserted successfully", map[string]interface{}{"email": observer.ObserverEmail, "layer": "repository", "operation": "repo.InsertObserver"})
	return id, nil
}

func (r *observerRepo) UpdateObserverStatus(observerEmail, status string) error {
	query := `UPDATE observers SET status = $1, confirmed_date = $2 WHERE observer_email = $3`
	_, err := r.db.Exec(query, status, time.Now(), observerEmail)
	if err != nil {
		logger.LogError(err, "Failed to update observer status", map[string]interface{}{
			"email": observerEmail,
			"layer": "repository", "operation": "repo.UpdateObserverStatus",
		})
		return err
	}
	logger.LogDebug("Observer status updated successfully", map[string]interface{}{"email": observerEmail, "layer": "repository", "operation": "repo.UpdateObserverStatus"})
	return nil
}
