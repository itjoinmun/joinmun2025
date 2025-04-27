package user

import (
	"time"
)

type RefreshToken struct {
	RefreshTokenID int       `db:"refresh_token_id" json:"refresh_token_id"`
	RefreshToken   string    `db:"refresh_token" json:"refresh_token" binding:"required"`
	Expiry         time.Time `db:"expiry" json:"expiry" binding:"required"`
	UserID         int       `db:"user_id" json:"user_id"`
	CreatedAt      time.Time `db:"created_at" json:"created_at" binding:"required" default:"CURRENT_TIMESTAMP"`
	Revoked        bool      `db:"revoked" json:"revoked"`
}
