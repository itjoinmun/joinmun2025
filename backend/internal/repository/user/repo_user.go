package user

import (
	"backend/internal/model/user"
	"backend/pkg/utils/logger"

	"time"

	"github.com/jmoiron/sqlx"
)

type UserRepo interface {
	CreateUser(user *user.User) error
	GetUserByEmail(email string) (*user.User, error)
	GetUserByID(userID int) (*user.User, error)
	ResetPassword(newPassword, resetToken string) error
	RequestPasswordReset(email, resetToken string, resetTokenExpiredAt time.Time) error
	VerifyUserAccount(userID int) error
	UserHasBeenVerified(userID int) bool
}

type userRepo struct {
	db *sqlx.DB
}

func NewUserRepo(db *sqlx.DB) UserRepo {
	return &userRepo{db: db}
}

func (r *userRepo) CreateUser(user *user.User) error {
	// Query for inserting a new user into the database
	query := `INSERT INTO users (username, email, password, verified, role) VALUES($1, $2, $3, $4, $5) RETURNING user_id`

	// Params that will be passed to the query
	params := []any{user.Username, user.Email, user.Password, user.Verified, user.Role}

	// Execute the query
	err := r.db.QueryRow(query, params...).Scan(&user.UserID)
	if err != nil {
		errorMessage := "Failed to insert user into users table"
		logger.LogError(err, errorMessage, map[string]interface{}{"layer": "repository", "operation": "repo.CreateUser"})
		return err
	}

	// Log the successful creation of the user
	debugMessage := "User created successfully"
	logger.LogDebug(debugMessage, map[string]interface{}{"layer": "repository", "operation": "repo.CreateUser"})
	return nil
}

func (r *userRepo) GetUserByEmail(email string) (*user.User, error) {
	// Query for selecting a user by email
	query := `SELECT user_id, username, email, password, verified, role FROM users WHERE email = $1`

	// Params that will be passed to the query
	params := []any{email}

	// Execute the query
	var u user.User
	err := r.db.Get(&u, query, params...)
	if err != nil {
		errorMessage := "Failed to get user by email"
		logger.LogError(err, errorMessage, map[string]interface{}{"layer": "repository", "operation": "repo.GetUserByEmail"})
		return nil, err
	}

	// Log the successful retrieval of the user
	debugMessage := "User retrieved successfully"
	logger.LogDebug(debugMessage, map[string]interface{}{"layer": "repository", "operation": "repo.GetUserByEmail"})
	return &u, nil
}

func (r *userRepo) GetUserByID(userID int) (*user.User, error) {
	// Query for selecting a user by ID
	query := `SELECT user_id, username, email, password, verified, role FROM users WHERE user_id = $1`

	// Params that will be passed to the query
	params := []any{userID}

	// Execute the query
	var user user.User
	err := r.db.Get(&user, query, params...)
	if err != nil {
		errorMessage := "Failed to get user by ID"
		logger.LogError(err, errorMessage, map[string]interface{}{"layer": "repository", "operation": "repo.GetUserByID"})
		return nil, err
	}

	// Log the successful retrieval of the user
	debugMessage := "User retrieved successfully"
	logger.LogDebug(debugMessage, map[string]interface{}{"layer": "repository", "operation": "repo.GetUserByID"})
	return &user, nil
}

func (r *userRepo) ResetPassword(newPassword, resetToken string) error {
	// Query for updating the password of a user
	query := "UPDATE users SET password = $1, reset_token = NULL, reset_token_expired_at = NULL WHERE reset_token = $2 AND reset_token_expired_at > CURRENT_TIMESTAMP"

	// Params that will be passed to the query
	params := []any{newPassword, resetToken}

	// Execute the query
	_, err := r.db.Exec(query, params...)
	if err != nil {
		errorMessage := "Failed to reset password"
		logger.LogError(err, errorMessage, map[string]interface{}{"layer": "repository", "operation": "repo.ResetPassword"})
		return err
	}

	// Log the successful password reset
	debugMessage := "Password reset successfully"
	logger.LogDebug(debugMessage, map[string]interface{}{"layer": "repository", "operation": "repo.ResetPassword"})
	return nil
}

func (r *userRepo) RequestPasswordReset(email, resetToken string, resetTokenExpiredAt time.Time) error {
	// Query for updating the reset token and its expiration time
	query := "UPDATE users SET reset_token = $1, reset_token_expired_at = $2 WHERE email = $3"

	// Params that will be passed to the query
	params := []any{resetToken, resetTokenExpiredAt, email}

	// Execute the query
	_, err := r.db.Exec(query, params...)
	if err != nil {
		errorMessage := "Failed to request password reset"
		logger.LogError(err, errorMessage, map[string]interface{}{"layer": "repository", "operation": "repo.RequestPasswordReset"})
		return err
	}

	// Log the successful password reset request
	debugMessage := "Password reset requested successfully"
	logger.LogDebug(debugMessage, map[string]interface{}{"layer": "repository", "operation": "repo.RequestPasswordReset"})
	return nil
}

func (r *userRepo) VerifyUserAccount(userID int) error {
	// Query for updating the verified status of a user
	query := "UPDATE users SET verified = TRUE WHERE user_id = $1"

	// Params that will be passed to the query
	params := []any{userID}

	// Execute the query
	_, err := r.db.Exec(query, params...)
	if err != nil {
		errorMessage := "Failed to verify user account"
		logger.LogError(err, errorMessage, map[string]interface{}{"layer": "repository", "operation": "repo.VerifyUserAccount"})
		return err
	}

	// Log the successful verification of the user account
	debugMessage := "User account verified successfully"
	logger.LogDebug(debugMessage, map[string]interface{}{"layer": "repository", "operation": "repo.VerifyUserAccount"})
	return nil
}

func (r *userRepo) UserHasBeenVerified(userID int) bool {
	// Query for checking if a user has been verified
	query := "SELECT verified FROM users WHERE user_id = $1"

	// Params that will be passed to the query
	params := []any{userID}

	// Execute the query
	var verified bool
	err := r.db.Get(&verified, query, params...)
	if err != nil {
		errorMessage := "Failed to check if user has been verified"
		logger.LogError(err, errorMessage, map[string]interface{}{"layer": "repository", "operation": "repo.UserHasBeenVerified"})
		return false
	}

	// Log the successful check of the user's verification status
	debugMessage := "User verification status checked successfully"
	logger.LogDebug(debugMessage, map[string]interface{}{"layer": "repository", "operation": "repo.UserHasBeenVerified"})
	return verified
}
