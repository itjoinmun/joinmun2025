package admin

import (
	"backend/internal/api/handler/dashboard"
	"backend/internal/api/handler/payment"
	"backend/internal/api/middleware"

	"github.com/gin-gonic/gin"
)

func InitializeAdminRoutes(r *gin.Engine, dashboardHandler *dashboard.DashboardHandler, paymentHandler *payment.PaymentHandler) *gin.Engine {
	// admin routes
	admin := r.Group("/api/v1/admin")
	admin.Use(middleware.ValidateAccessTokenMiddleware())
	admin.Use(middleware.ValidateAdminMiddleware())
	adminDashboard := admin.Group("/dashboard")
	{
		adminDashboard.POST("/update-participant-status", dashboardHandler.UpdateParticipantStatusHandler)
		adminDashboard.POST("/update-participant-cc", dashboardHandler.UpdateDelegateCountryAndCouncilHandler)
		adminDashboard.POST("/make-pairing", dashboardHandler.MakePairingHandler)
	}

	adminPayment := admin.Group("/payment")
	{
		adminPayment.POST("/update-payment-status", paymentHandler.UpdatePaymentStatusHandler)
	}

	return r
}
