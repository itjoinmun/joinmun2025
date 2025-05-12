package user

import (
	userModel "backend/internal/model/user"
	userRepository "backend/internal/repository/user"
	"backend/pkg/utils/auth"
	emailUtils "backend/pkg/utils/email"
	"backend/pkg/utils/logger"
	"errors"
	"fmt"
	"os"

	"golang.org/x/sync/errgroup"
)

type UserService interface {
	// Create a new user
	CreateUser(user *userModel.User) error

	// Login a user
	LoginUser(email, password string) (string, string, error)

	// Request a password reset
	RequestPasswordReset(email string) error

	// Reset a user's password
	ResetPassword(newPassword, resetToken string) error
}

type userService struct {
	userRepo     userRepository.UserRepo
	tokenService RefreshTokenService
}

func NewUserService(userRepo userRepository.UserRepo, tokenService RefreshTokenService) UserService {
	return &userService{
		userRepo:     userRepo,
		tokenService: tokenService,
	}
}

func (s *userService) CreateUser(user *userModel.User) error {
	// Set the user role based on the email
	if user.Email != os.Getenv("ADMIN_EMAIL") {
		user.Role = "user"
	} else {
		user.Role = "admin"
	}

	// check if the user already exists
	if existingUser, _ := s.userRepo.GetUserByEmail(user.Email); existingUser != nil {
		errorMessage := "User already exists"
		logger.LogError(errors.New("user exists"), errorMessage, map[string]interface{}{"layer": "service", "operation": "service.CreateUser"})
		return fmt.Errorf("user already exists: %w", errors.New("user exists"))
	}

	// Hash the password
	hashedPassword, err := auth.HashPassword(user.Password)
	if err != nil {
		errorMessage := "Utils Failed to hash password"
		logger.LogError(err, errorMessage, map[string]interface{}{"layer": "service", "operation": "service.CreateUser"})
		return fmt.Errorf("failed to hash password: %w", err)
	}

	// Set the user password and verification token
	user.Password = hashedPassword

	if err := s.userRepo.CreateUser(user); err != nil {
		errorMessage := "Failed to create user"
		logger.LogError(err, errorMessage, map[string]interface{}{"layer": "service", "operation": "service.CreateUser"})
		return fmt.Errorf("failed to create user: %w", err)
	}
	return nil
}

func (s *userService) LoginUser(email, password string) (string, string, error) {
	// Get the user by email from the database
	user, err := s.userRepo.GetUserByEmail(email)
	if err != nil {
		errorMessage := "Failed to get user by email"
		logger.LogError(err, errorMessage, map[string]interface{}{"layer": "service", "operation": "service.LoginUser"})
		return "", "", fmt.Errorf("failed to get user by email: %w", err)
	}

	// Check if the password is correct
	if !auth.CheckHash(password, user.Password) {
		errorMessage := "Invalid password hash check"
		logger.LogError(err, errorMessage, map[string]interface{}{"layer": "service", "operation": "service.LoginUser", "email": email})
		return "", "", fmt.Errorf("invalid password: %w", err)
	}

	// Generate access and refresh tokens
	accessToken, refreshToken, err := s.tokenService.GenerateAccessAndRefreshToken(user.UserID)
	if err != nil {
		errorMessage := "Token service failed to generate access and refresh token"
		logger.LogError(err, errorMessage, map[string]interface{}{"layer": "service", "operation": "service.LoginUser"})
		return "", "", fmt.Errorf("failed to generate access and refresh token: %w", err)
	}

	return accessToken, refreshToken, nil
}

func (s *userService) RequestPasswordReset(email string) error {
	// create a new errgroup to handle concurrent operations
	var g errgroup.Group

	// Get the user by email
	user, err := s.userRepo.GetUserByEmail(email)
	if err != nil {
		errorMessage := "Repo Failed to get user by email"
		logger.LogError(err, errorMessage, map[string]interface{}{"layer": "service", "operation": "service.RequestPasswordReset"})
		return err
	}
	if user == nil {
		errorMessage := "User not found"
		logger.LogError(err, errorMessage, map[string]interface{}{"layer": "service", "operation": "service.RequestPasswordReset"})
		return fmt.Errorf("user not found: %w", err)
	}

	// Generate a password reset token
	resetToken, expiry, err := auth.CreateResetToken()
	if err != nil {
		errorMessage := "Utils Failed to create reset token"
		logger.LogError(err, errorMessage, map[string]interface{}{"layer": "service", "operation": "service.RequestPasswordReset"})
		return err
	}

	// generate the resetLink
	var resetLink string
	if os.Getenv("ENVIRONMENT") == "production" {
		resetLink = fmt.Sprintf("https://%s/forgot-password/%s", os.Getenv("FRONTEND_URL"), resetToken)
	} else {
		resetLink = fmt.Sprintf("https://joinmun.localhost/forgot-password/%s", resetToken)
	}

	// run the password reset request and email sending concurrently
	// blacklist the refresh token
	g.Go(func() error {
		if err := s.tokenService.BlacklistTokenOnEmail(email); err != nil {
			errorMessage := "Service Failed to blacklist refresh token"
			logger.LogError(err, errorMessage, map[string]interface{}{"layer": "service", "operation": "service.RequestPasswordReset"})
			return err
		}
		return nil
	})

	// call the repo to update the reset token and its expiration time
	g.Go(func() error {
		if err := s.userRepo.RequestPasswordReset(email, resetToken, expiry); err != nil {
			errorMessage := "Repo Failed to request password reset"
			logger.LogError(err, errorMessage, map[string]interface{}{"layer": "service", "operation": "service.RequestPasswordReset"})
			return err
		}
		return nil
	})

	// send the email with the reset link
	g.Go(func() error {
		if err := emailUtils.SendPasswordResetEmail(email, resetLink); err != nil {
			errorMessage := "Utils Failed to send password reset email"
			logger.LogError(err, errorMessage, map[string]interface{}{"layer": "service", "operation": "service.RequestPasswordReset"})
			return err
		}
		return nil
	})

	// wait for all goroutines to finish, if there is an error, return the first occurrence
	if err := g.Wait(); err != nil {
		return err
	}

	return nil
}

func (s *userService) ResetPassword(newPassword, resetToken string) error {
	// Hash the new password
	newHashedPassword, err := auth.HashPassword(newPassword)
	if err != nil {
		errorMessage := "Utils Failed to hash password"
		logger.LogError(err, errorMessage, map[string]interface{}{"layer": "service", "operation": "service.ResetPassword"})
		return fmt.Errorf("failed to hash password: %w", err)
	}

	// Reset the password in the database
	if err := s.userRepo.ResetPassword(newHashedPassword, resetToken); err != nil {
		errorMessage := "Repo Failed to reset password"
		logger.LogError(err, errorMessage, map[string]interface{}{"layer": "service", "operation": "service.ResetPassword"})
		return fmt.Errorf("failed to reset password: %w", err)
	}

	return nil
}
