package user

import (
	"backend/internal/model/user"
	"backend/pkg/utils/logger"
	"time"

	"github.com/jmoiron/sqlx"
)

type RefreshTokenRepo interface {
	StoreRefreshToken(refreshToken *user.RefreshToken) error
	RevokeRefreshToken(refreshToken string) error
	GetValidRefreshToken(refreshToken string) (*user.RefreshToken, error)
	RevokeAllRefreshTokenBasedOnUserID(userID int) error
}

type refreshTokenRepo struct {
	db *sqlx.DB
}

func NewRefreshTokenRepo(db *sqlx.DB) RefreshTokenRepo {
	return &refreshTokenRepo{db: db}
}

func (r *refreshTokenRepo) StoreRefreshToken(refreshToken *user.RefreshToken) error {
	// Query for inserting a new refresh token into the database
	query := `INSERT INTO refresh_tokens (refresh_token, expiry, user_id) VALUES($1, $2, $3) RETURNING refresh_token_id`

	// Params that will be passed to the query
	params := []any{refreshToken.RefreshToken, refreshToken.Expiry, refreshToken.UserID}

	// Execute the query
	err := r.db.QueryRow(query, params...).Scan(&refreshToken.RefreshTokenID)
	if err != nil {
		errorMessage := "Failed to insert refresh token into refresh_tokens table"
		logger.LogError(err, errorMessage, map[string]interface{}{"layer": "repository", "operation": "repo.StoreRefreshToken"})
		return err
	}

	// Log the successful creation of the refresh token
	debugMessage := "Refresh token inserted successfully"
	logger.LogDebug(debugMessage, map[string]interface{}{"layer": "repository", "operation": "repo.StoreRefreshToken"})
	return nil
}

func (r *refreshTokenRepo) RevokeRefreshToken(refreshToken string) error {
	// Query for revoking a refresh token
	query := `UPDATE refresh_tokens SET revoked = true WHERE refresh_token = $1 AND revoked = $2 AND expiry > $3`

	// Params that will be passed to the query
	params := []any{refreshToken, false, time.Now()}

	// Execute the query
	_, err := r.db.Exec(query, params...)
	if err != nil {
		errorMessage := "Failed to update table to revoke refresh token"
		logger.LogError(err, errorMessage, map[string]interface{}{"layer": "repository", "operation": "repo.RevokeRefreshToken"})
		return err
	}

	// Log the successful revocation of the refresh token
	debugMessage := "Refresh token revoked successfully"
	logger.LogDebug(debugMessage, map[string]interface{}{"layer": "repository", "operation": "repo.RevokeRefreshToken"})
	return nil
}

func (r *refreshTokenRepo) GetValidRefreshToken(refreshToken string) (*user.RefreshToken, error) {
	// Query for selecting a valid refresh token
	query := `SELECT refresh_token_id, refresh_token, expiry, user_id, created_at, revoked FROM refresh_tokens WHERE refresh_token = $1 AND revoked = $2 AND expiry > $3`

	// Params that will be passed to the query
	params := []any{refreshToken, false, time.Now()}

	// Execute the query
	var rt user.RefreshToken
	err := r.db.Get(&rt, query, params...)
	if err != nil {
		errorMessage := "Failed to execute query to get valid refresh token"
		logger.LogError(err, errorMessage, map[string]interface{}{"layer": "repository", "operation": "repo.GetValidRefreshToken"})
		return nil, err
	}

	// Log the successful retrieval of the valid refresh token
	debugMessage := "Valid refresh token retrieved successfully"
	logger.LogDebug(debugMessage, map[string]interface{}{"layer": "repository", "operation": "repo.GetValidRefreshToken"})
	return &rt, nil
}

func (r *refreshTokenRepo) RevokeAllRefreshTokenBasedOnUserID(userID int) error {
	// Query for revoking all refresh tokens based on user ID
	query := `UPDATE refresh_tokens SET revoked = true WHERE user_id = $1 AND revoked = $2 AND expiry > $3`

	// Params that will be passed to the query
	params := []any{userID, false, time.Now()}

	// Execute the query
	_, err := r.db.Exec(query, params...)
	if err != nil {
		errorMessage := "Failed to update table to revoke all refresh tokens based on user ID"
		logger.LogError(err, errorMessage, map[string]interface{}{"layer": "repository", "operation": "repo.RevokeAllRefreshTokenBasedOnUserID"})
		return err
	}

	// Log the successful revocation of all refresh tokens based on user ID
	debugMessage := "All refresh tokens revoked successfully for user ID"
	logger.LogDebug(debugMessage, map[string]interface{}{"layer": "repository", "operation": "repo.RevokeAllRefreshTokenBasedOnUserID"})
	return nil
}
