package user

import (
	userModel "backend/internal/model/user"
	userRepository "backend/internal/repository/user"
	"backend/pkg/utils/auth"
	"backend/pkg/utils/logger"
	"time"
)

type RefreshTokenService interface {
	// Generate an access and refresh token for the user
	GenerateAccessAndRefreshToken(userID int) (string, string, error)

	// Validate the refresh token and generate a new access and refresh token
	ValidateAndReRefreshToken(refreshToken string) (string, string, error)
	BlacklistRefreshToken(refreshToken string) error
	BlacklistTokenOnEmail(email string) error
}

type refreshTokenService struct {
	refreshTokenRepo userRepository.RefreshTokenRepo
	userRepo         userRepository.UserRepo
}

func NewRefreshTokenService(refreshTokenRepo userRepository.RefreshTokenRepo, userRepo userRepository.UserRepo) RefreshTokenService {
	return &refreshTokenService{
		refreshTokenRepo: refreshTokenRepo,
		userRepo:         userRepo,
	}
}

func (s *refreshTokenService) GenerateAccessAndRefreshToken(userID int) (string, string, error) {
	// Get the user by ID from the database
	user, err := s.userRepo.GetUserByID(userID)
	if err != nil {
		errorMessage := "Failed to get user by ID"
		logger.LogError(err, errorMessage, map[string]interface{}{"layer": "service", "operation": "service.GenerateAccessToken"})
		return "", "", err
	}

	// Generate a new access token using the user's details
	accessToken, err := auth.GenerateAccessToken(user.UserID, user.Email, user.Username, user.Role)
	if err != nil {
		errorMessage := "Failed to generate access token because of utils error"
		logger.LogError(err, errorMessage, map[string]interface{}{"layer": "service", "operation": "service.GenerateAccessToken"})
		return "", "", err
	}

	// Generate a new refresh token using the utils package
	refreshToken, err := auth.GenerateRefreshToken()
	if err != nil {
		errorMessage := "Failed to generate refresh token because of utils error"
		logger.LogError(err, errorMessage, map[string]interface{}{"layer": "service", "operation": "service.GenerateAccessToken"})
		return "", "", err
	}

	// Set the expiry time for the refresh token to 7 days from now and the current time
	refreshTokenExpiry := time.Now().Add(7 * 24 * time.Hour)
	refreshTokenCreatedAt := time.Now()

	// Store the refresh token in the database
	err = s.refreshTokenRepo.StoreRefreshToken(&userModel.RefreshToken{
		RefreshToken: refreshToken,
		UserID:       user.UserID,
		Expiry:       refreshTokenExpiry,
		CreatedAt:    refreshTokenCreatedAt,
		Revoked:      false,
	})
	if err != nil {
		errorMessage := "Failed to store refresh token, repo error"
		logger.LogError(err, errorMessage, map[string]interface{}{"layer": "service", "operation": "service.GenerateAccessToken"})
		return "", "", err
	}

	// return the access token and refresh token for handler to sent to the client
	return accessToken, refreshToken, nil
}

func (s *refreshTokenService) ValidateAndReRefreshToken(refreshToken string) (string, string, error) {
	// find the refresh token in the database
	refreshTokenFromDB, err := s.refreshTokenRepo.GetValidRefreshToken(refreshToken)
	if err != nil {
		errorMessage := "Repo failed to find a valid token"
		logger.LogError(err, errorMessage, map[string]interface{}{"layer": "service", "operation": "service.ValidateRefreshToken"})
		return "", "", err
	}

	// re-assign the refreshToken and assign userID for revoking and generating new token
	refreshToken = refreshTokenFromDB.RefreshToken
	userID := refreshTokenFromDB.UserID

	// revoke the refresh token from the parameter
	err = s.refreshTokenRepo.RevokeRefreshToken(refreshToken)
	if err != nil {
		errorMessage := "Repo failed to revoke refresh token"
		logger.LogError(err, errorMessage, map[string]interface{}{"layer": "service", "operation": "service.ValidateRefreshToken"})
		return "", "", err
	}

	// generate new token pair for the user using the userID from the refresh token that was found in the database
	newAccessToken, newRefreshToken, err := s.GenerateAccessAndRefreshToken(userID)
	if err != nil {
		errorMessage := "Service failed to generate new token pair, check the chain service error"
		logger.LogError(err, errorMessage, map[string]interface{}{"layer": "service", "operation": "service.ValidateRefreshToken"})
		return "", "", err
	}

	// return the new access token and refresh token
	return newAccessToken, newRefreshToken, nil
}

func (s *refreshTokenService) BlacklistRefreshToken(refreshToken string) error {
	// make sure the refresh token is valid
	refreshTokenFromDB, err := s.refreshTokenRepo.GetValidRefreshToken(refreshToken)
	if err != nil {
		errorMessage := "Repo failed to find a valid token"
		logger.LogError(err, errorMessage, map[string]interface{}{"layer": "service", "operation": "service.BlacklistRefreshToken"})
	}

	// revoke the refresh token
	refreshToken = refreshTokenFromDB.RefreshToken
	err = s.refreshTokenRepo.RevokeRefreshToken(refreshToken)
	if err != nil {
		errorMessage := "Repo failed to revoke refresh token"
		logger.LogError(err, errorMessage, map[string]interface{}{"layer": "service", "operation": "service.BlacklistRefreshToken"})
	}

	// return nil if the refresh token is revoked successfully
	return nil
}

func (s *refreshTokenService) BlacklistTokenOnEmail(email string) error {
	// get the user by email
	user, err := s.userRepo.GetUserByEmail(email)
	if err != nil {
		errorMessage := "REpo Failed to get user by email"
		logger.LogError(err, errorMessage, map[string]interface{}{"layer": "service", "operation": "service.BlacklistTokenOnEmail"})
		return err
	}

	// revoke all refresh tokens for the user
	err = s.refreshTokenRepo.RevokeAllRefreshTokenBasedOnUserID(user.UserID)
	if err != nil {
		errorMessage := "Repo Failed to revoke all refresh tokens for user"
		logger.LogError(err, errorMessage, map[string]interface{}{"layer": "service", "operation": "service.BlacklistTokenOnEmail"})
		return err
	}

	return nil
}
