package middleware

import (
	"backend/pkg/utils/auth"
	"net/http"

	"github.com/gin-gonic/gin"
)

type ContextUser struct {
	UserID   int
	Email    string
	Username string
	Role     string
}

func ValidateAccessTokenMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// if the request is a GET request and the path is /api/v1/auth/logout, skip the middleware
		if c.Request.URL.Path == "/api/v1/auth/logout" {
			c.Next()
			return
		}

		// Check if the request has an access token
		accessToken, err := c.Cookie("access_token")
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Failed to fetch access token", "details": err.Error()})
			c.Abort()
			return
		}
		if accessToken == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Access token is empty"})
			c.Abort()
			return
		}

		// validate the access token using the auth utils
		accessTokenClaims, err := auth.ValidateAccessToken(accessToken)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid access token", "details": err.Error()})
			c.Abort()
			return
		}

		user := &ContextUser{
			UserID:   accessTokenClaims.UserID,
			Email:    accessTokenClaims.Email,
			Username: accessTokenClaims.Username,
			Role:     accessTokenClaims.Role,
		}

		// Set the user in the context
		c.Set("user", user)
		c.Next()
	}
}
