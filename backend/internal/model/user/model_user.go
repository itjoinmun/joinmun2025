package user

import (
	"time"
)

type User struct {
	UserID           int       `db:"user_id" json:"user_id"`
	Username         string    `db:"username" json:"username" binding:"required,max=100"`
	Email            string    `db:"email" json:"email" binding:"required,email"`
	Password         string    `db:"password" json:"password" binding:"required,min=8,max=72"`
	Role             string    `db:"role" json:"role" binding:"required,oneof=admin user"`
	ResetToken       string    `db:"reset_token" json:"reset_token"`
	ResetTokenExpiry time.Time `db:"reset_token_expiry" json:"reset_token_expiry"`
}

type RegisterStruct struct {
	Username string `json:"username" binding:"required,max=100"`
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=8,max=72"`
}

type LoginStruct struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=8,max=72"`
}
