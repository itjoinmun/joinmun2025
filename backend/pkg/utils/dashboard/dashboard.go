package dashboard

import (
	"backend/internal/api/middleware"
	"backend/pkg/utils/logger"
	"crypto/rand"
	"math/big"

	"github.com/gin-gonic/gin"
)

func GenerateTeamCode() (string, error) {
	const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
	const codeLength = 6
	code := make([]byte, codeLength)

	for i := 0; i < codeLength; i++ {
		// Generate a random index using crypto/rand
		num, err := rand.Int(rand.Reader, big.NewInt(int64(len(charset))))
		if err != nil {
			return "", err
		}
		code[i] = charset[num.Int64()]
	}
	return string(code), nil
}

// GetUserFromContext retrieves the user from the Gin context
func GetUserFromContext(c *gin.Context) (*middleware.ContextUser, bool) {
	// Get the user from the context
	user, exists := c.Get("user")
	if !exists {
		// Log the error if user is not found in the context
		logger.LogError(nil, "User not found in context", map[string]interface{}{
			"layer":     "middleware",
			"operation": "utils.GetUserFromContext",
		})
		return nil, false
	}

	// Assert the user to the correct type (*ContextUser)
	contextUser, ok := user.(*middleware.ContextUser)
	if !ok {
		// Log an error if the type assertion fails
		logger.LogError(nil, "Failed to assert user to *ContextUser", map[string]interface{}{
			"layer":     "middleware",
			"operation": "utils.GetUserFromContext",
		})
		return nil, false
	}

	return contextUser, true
}
