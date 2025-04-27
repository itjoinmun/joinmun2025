package auth

import (
	"os"
	"time"

	"crypto/rand"
	"encoding/hex"

	"github.com/golang-jwt/jwt/v5"
)

var jwtAccessTokenSecret = []byte(os.Getenv("JWT_ACCESS_TOKEN_SECRET"))

type AccessTokenClaims struct {
	UserID   int    `json:"user_id"`
	Email    string `json:"email"`
	Username string `json:"username"`
	Role     string `json:"role"`
	jwt.RegisteredClaims
}

func GenerateAccessToken(userID int, email, username, role string) (string, error) {
	expiresAt := time.Now().Add(15 * time.Minute)
	issuedAt := time.Now()

	// Create the claims for the access token
	claims := AccessTokenClaims{
		UserID:   userID,
		Email:    email,
		Username: username,
		Role:     role,
		RegisteredClaims: jwt.RegisteredClaims{
			Issuer:    "your_app_name",
			IssuedAt:  jwt.NewNumericDate(issuedAt),
			ExpiresAt: jwt.NewNumericDate(expiresAt),
		},
	}

	// Generate the token with the claims and signs with the secret key using HMAC SHA256
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(jwtAccessTokenSecret)
}

func GenerateRefreshToken() (string, error) {
	bytes := make([]byte, 32)

	// Generate a random 32-byte token
	_, err := rand.Read(bytes)
	if err != nil {
		return "", err
	}

	// Convert the bytes to a hex string
	// This will be the opaque refresh token
	return hex.EncodeToString(bytes), nil
}

func ValidateAccessToken(accessToken string) (*AccessTokenClaims, error) {
	// Parse the token
	token, err := jwt.ParseWithClaims(accessToken, &AccessTokenClaims{}, func(token *jwt.Token) (interface{}, error) {
		return jwtAccessTokenSecret, nil
	})
	if err != nil {
		return nil, err
	}

	// Validate the token and return the claims
	if claims, ok := token.Claims.(*AccessTokenClaims); ok && token.Valid {
		return claims, nil
	}

	// If the token is not valid, return an error
	return nil, jwt.ErrInvalidKey
}

func CreateResetToken() (string, time.Time, error) {
	bytes := make([]byte, 32)

	// Generate a random 32-byte token
	_, err := rand.Read(bytes)
	if err != nil {
		return "", time.Time{}, err
	}

	// The expiry time for the reset token
	resetTokenExpiredAt := time.Now().Add(15 * time.Minute)

	// Convert the bytes to a hex string
	return hex.EncodeToString(bytes), resetTokenExpiredAt, nil
}
