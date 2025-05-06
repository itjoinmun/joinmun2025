package handler

import (
	userHandlerI "backend/internal/api/handler/user"
	userRepoI "backend/internal/repository/user"
	userServiceI "backend/internal/service/user"

	dashboardHandlerI "backend/internal/api/handler/dashboard"
	dashboardRepoI "backend/internal/repository/dashboard"
	dashboardServiceI "backend/internal/service/dashboard"

	"github.com/jmoiron/sqlx"
)

type HandlerContainer struct {
	UserHandler      *userHandlerI.UserHandler
	DashboardHandler *dashboardHandlerI.DashboardHandler
}

func NewHandlerContainer(db *sqlx.DB) *HandlerContainer {
	tokenRepo := userRepoI.NewRefreshTokenRepo(db)
	userRepo := userRepoI.NewUserRepo(db)
	delegateRepo := dashboardRepoI.NewDelegateRepo(db)
	facultyAdvisorRepo := dashboardRepoI.NewFacultyAdvisorRepo(db)
	observerRepo := dashboardRepoI.NewObserverRepo(db)
	responseRepo := dashboardRepoI.NewResponseRepo(db)
	positionPaperRepo := dashboardRepoI.NewPositionPaperRepo(db)
	paymentRepo := dashboardRepoI.NewPaymentRepo(db)
	questionRepo := dashboardRepoI.NewQuestionRepo(db)
	tokenService := userServiceI.NewRefreshTokenService(tokenRepo, userRepo)
	userService := userServiceI.NewUserService(userRepo, tokenService)
	userHandler := userHandlerI.NewUserHandler(userService, tokenService)

	dashboardService := dashboardServiceI.NewDashboardService(
		positionPaperRepo,
		observerRepo,
		questionRepo,
		facultyAdvisorRepo,
		delegateRepo,
		paymentRepo,
		responseRepo,
	)

	dashboardHandler := dashboardHandlerI.NewDashboardHandler(dashboardService)

	return &HandlerContainer{
		UserHandler:      userHandler,
		DashboardHandler: dashboardHandler,
	}
}
