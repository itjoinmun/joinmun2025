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

	"backend/internal/s3"

	"github.com/jmoiron/sqlx"
)

type HandlerContainer struct {
	UserHandler      *userHandlerI.UserHandler
	DashboardHandler *dashboardHandlerI.DashboardHandler
	PaymentHandler   *paymentHandlerI.PaymentHandler
}

func NewHandlerContainer(db *sqlx.DB, uploader *s3.S3Uploader) *HandlerContainer {
	tokenRepo := userRepoI.NewRefreshTokenRepo(db)
	userRepo := userRepoI.NewUserRepo(db)
	delegateRepo := dashboardRepoI.NewDelegateRepo(db)
	responseRepo := dashboardRepoI.NewResponseRepo(db)
	questionRepo := dashboardRepoI.NewQuestionRepo(db)
	paymentRepo := paymentRepoI.NewPaymentRepo(db)
	tokenService := userServiceI.NewRefreshTokenService(tokenRepo, userRepo)
	userService := userServiceI.NewUserService(userRepo, tokenService)
	userHandler := userHandlerI.NewUserHandler(userService, tokenService)

	dashboardService := dashboardServiceI.NewDashboardService(
		questionRepo,
		delegateRepo,
		responseRepo,
	)
	dashboardHandler, err := dashboardHandlerI.NewDashboardHandler(dashboardService, uploader)
	if err != nil {
		panic(err)
	}

	paymentService := paymentServiceI.NewPaymentService(delegateRepo, paymentRepo)
	paymentHandler, err := paymentHandlerI.NewPaymentHandler(paymentService, uploader)
	if err != nil {
		panic(err)
	}

	return &HandlerContainer{
		UserHandler:      userHandler,
		DashboardHandler: dashboardHandler,
		PaymentHandler:   paymentHandler,
	}
}
