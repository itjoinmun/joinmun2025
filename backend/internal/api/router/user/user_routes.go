package user

import (
	"backend/internal/api/handler/user"
	"backend/internal/api/middleware"

	"github.com/gin-gonic/gin"
)

func InitalizeUserRoutes(r *gin.Engine, userHandler *user.UserHandler) {
	// User routes
	user := r.Group("/api/v1/user")
	{
		user.GET("/refresh", userHandler.RefreshTokenHandler)
		user.POST("/register", userHandler.RegisterHandler)
		user.POST("/login", userHandler.LoginHandler)
		user.POST("/reset-password", userHandler.ResetPasswordHandler)
		user.POST("/request-password-reset", userHandler.RequestPasswordResetHandler)
	}

	// Protected user routes
	protectedUser := r.Group("/api/v1/auth")
	protectedUser.Use(middleware.ValidateAccessTokenMiddleware())
	{
		protectedUser.GET("/me", userHandler.ValidateAndGetUserInfo)
		protectedUser.POST("/logout", userHandler.LogoutHandler)
	}
}
