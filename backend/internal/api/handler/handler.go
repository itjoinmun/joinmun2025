package handler

import (
	userHandlerI "backend/internal/api/handler/user"
	userRepoI "backend/internal/repository/user"
	userServiceI "backend/internal/service/user"

	"github.com/jmoiron/sqlx"
)

type HandlerContainer struct {
	UserHandler *userHandlerI.UserHandler
}

func NewHandlerContainer(db *sqlx.DB) *HandlerContainer {
	tokenRepo := userRepoI.NewRefreshTokenRepo(db)
	userRepo := userRepoI.NewUserRepo(db)
	tokenService := userServiceI.NewRefreshTokenService(tokenRepo, userRepo)
	userService := userServiceI.NewUserService(userRepo, tokenService)
	userHandler := userHandlerI.NewUserHandler(userService, tokenService)

	return &HandlerContainer{
		UserHandler: userHandler,
	}
}
