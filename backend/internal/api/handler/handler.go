package handler

import (
	userHandlerI "backend/internal/api/handler/user"
	userRepoI "backend/internal/repository/user"
	userServiceI "backend/internal/service/user"

	dashboardHandlerI "backend/internal/api/handler/dashboard"
	dashboardRepoI "backend/internal/repository/dashboard"
	dashboardServiceI "backend/internal/service/dashboard"

	paymentHandlerI "backend/internal/api/handler/payment"
	paymentRepoI "backend/internal/repository/payment"
	paymentServiceI "backend/internal/service/payment"

	adminHandlerI "backend/internal/api/handler/admin"
	adminRepoI "backend/internal/repository/admin"
	adminServiceI "backend/internal/service/admin"

	"backend/internal/s3"

	"github.com/jmoiron/sqlx"
)

type HandlerContainer struct {
	UserHandler      *userHandlerI.UserHandler
	DashboardHandler *dashboardHandlerI.DashboardHandler
	PaymentHandler   *paymentHandlerI.PaymentHandler
	AdminHandler     *adminHandlerI.AdminHandler
}

func NewHandlerContainer(db *sqlx.DB, uploader *s3.S3Uploader) *HandlerContainer {
	// USER
	tokenRepo := userRepoI.NewRefreshTokenRepo(db)
	userRepo := userRepoI.NewUserRepo(db)
	tokenService := userServiceI.NewRefreshTokenService(tokenRepo, userRepo)
	userService := userServiceI.NewUserService(userRepo, tokenService)
	userHandler := userHandlerI.NewUserHandler(userService, tokenService)

	// DASHBOARD
	delegateRepo := dashboardRepoI.NewDelegateRepo(db)
	responseRepo := dashboardRepoI.NewResponseRepo(db)
	questionRepo := dashboardRepoI.NewQuestionRepo(db)

	dashboardService := dashboardServiceI.NewDashboardService(
		questionRepo,
		delegateRepo,
		responseRepo,
	)
	dashboardHandler, err := dashboardHandlerI.NewDashboardHandler(dashboardService, uploader)
	if err != nil {
		panic(err)
	}

	// PAYMENT
	paymentRepo := paymentRepoI.NewPaymentRepo(db)
	paymentService := paymentServiceI.NewPaymentService(delegateRepo, paymentRepo)
	paymentHandler, err := paymentHandlerI.NewPaymentHandler(paymentService, uploader)
	if err != nil {
		panic(err)
	}

	// ADMIN
	adminRepo := adminRepoI.NewAdminRepo(db)
	adminService := adminServiceI.NewAdminService(uploader, adminRepo, delegateRepo, paymentRepo)
	adminHandler, err := adminHandlerI.NewAdminHandler(adminService)
	if err != nil {
		panic(err)
	}

	return &HandlerContainer{
		UserHandler:      userHandler,
		DashboardHandler: dashboardHandler,
		PaymentHandler:   paymentHandler,
		AdminHandler:     adminHandler,
	}
}
