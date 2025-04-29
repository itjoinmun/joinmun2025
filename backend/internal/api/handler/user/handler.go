package user

import (
	userModel "backend/internal/model/user"
	userService "backend/internal/service/user"
	"backend/pkg/utils/auth"

	"net/http"

	"github.com/gin-gonic/gin"
)

type UserHandler struct {
	authService  userService.UserService
	tokenService userService.RefreshTokenService
}

func NewUserHandler(authService userService.UserService, tokenService userService.RefreshTokenService) *UserHandler {
	return &UserHandler{
		authService:  authService,
		tokenService: tokenService,
	}
}

func (h *UserHandler) RegisterHandler(c *gin.Context) {
	var req userModel.RegisterStruct

	// bind the json request to the user struct
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input", "details": err.Error()})
		return
	}

	// check if the password is too long
	if len(req.Password) > 72 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Password too long"})
		return
	}

	user := &userModel.User{
		Username: req.Username,
		Email:    req.Email,
		Password: req.Password,
	}

	// call the register user service
	if err := h.authService.CreateUser(user); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user", "details": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "User created successfully"})
}

func (h *UserHandler) LoginHandler(c *gin.Context) {
	var req userModel.LoginStruct

	// bind the json request to the user struct
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input", "details": err.Error()})
		return
	}

	// call the login user function from the service
	accessToken, refreshToken, err := h.authService.LoginUser(req.Email, req.Password)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials", "details": err.Error()})
		return
	}

	if err := auth.SetAccessAndRefreshCookies(c, accessToken, refreshToken); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to set cookies", "details": err.Error()})
		return
	}

	// if the login is successful, return a success message
	c.JSON(http.StatusOK, gin.H{"message": "Login successful"})
}

func (h *UserHandler) LogoutHandler(c *gin.Context) {
	// get the refresh token from the cookie
	refreshToken, err := c.Cookie("refresh_token")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to get refresh token from cookie", "details": err.Error()})
		return
	}

	// blacklist the refresh token
	err = h.tokenService.BlacklistRefreshToken(refreshToken)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to blacklist refresh token", "details": err.Error()})
		return
	}

	// clear the cookies from the browser
	auth.ClearCookie(c, "access_token")
	auth.ClearCookie(c, "refresh_token")

	// return a success message
	c.JSON(http.StatusOK, gin.H{"message": "Logout successful"})
}

func (h *UserHandler) RefreshTokenHandler(c *gin.Context) {
	// get the refresh token from cookie
	refreshToken, err := c.Cookie("refresh_token")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to get refresh token from cookie", "details": err.Error()})
		return
	}
	if refreshToken == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Refresh token is empty"})
		return
	}

	// validate the refresh token and generate a new access token
	newAccessToken, newRefreshToken, err := h.tokenService.ValidateAndReRefreshToken(refreshToken)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to refresh token", "details": err.Error()})
		return
	}

	// set the new access and refresh tokens in cookies
	if err := auth.SetAccessAndRefreshCookies(c, newAccessToken, newRefreshToken); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to set cookies", "details": err.Error()})
		return
	}

	// return a success message
	c.JSON(http.StatusOK, gin.H{"message": "Token refreshed successfully"})
}

func (h *UserHandler) ValidateAndGetUserInfo(c *gin.Context) {
	// get the user info from the context
	user, exits := c.Get("user")
	if !exits {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found in context"})
		return
	}

	// return the user info
	c.JSON(http.StatusOK, gin.H{"message": "Authorized", "user": user})
}

func (h *UserHandler) RequestPasswordResetHandler(c *gin.Context) {
	// get the email from the request
	var req struct {
		Email string `json:"email" binding:"required,email"`
	}

	// bind the json request to the user struct
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input", "details": err.Error()})
		return
	}

	// call the request password reset function from the service
	if err := h.authService.RequestPasswordReset(req.Email); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to request password reset", "details": err.Error()})
		return
	}

	// return a success message
	c.JSON(http.StatusOK, gin.H{"message": "Password reset requested successfully, check your email and follow the instructions (check the spam folder if you receive none)"})
}

func (h *UserHandler) ResetPasswordHandler(c *gin.Context) {
	// get the reset token and new password from the request
	var req struct {
		ResetToken  string `json:"reset_token" binding:"required"`
		NewPassword string `json:"new_password" binding:"required"`
	}

	// bind the json request to the user struct
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input", "details": err.Error()})
		return
	}

	// call the reset password function from the service
	if err := h.authService.ResetPassword(req.NewPassword, req.ResetToken); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to reset password", "details": err.Error()})
		return
	}

	// return a success message
	c.JSON(http.StatusOK, gin.H{"message": "Password reset successfully"})
}
