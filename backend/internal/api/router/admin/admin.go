package admin

import (
	"backend/internal/api/handler/admin"
	"backend/internal/api/middleware"

	"github.com/gin-gonic/gin"
)

func InitializeAdminRoutes(r *gin.Engine, adminHandler *admin.AdminHandler) *gin.Engine {
	// admin routes
	admin := r.Group("/api/v1/admin")
	admin.Use(middleware.ValidateAccessTokenMiddleware())
	admin.Use(middleware.ValidateAdminMiddleware())
	adminDashboard := admin.Group("/dashboard")
	{
		adminDashboard.POST("/update-participant-status", adminHandler.UpdateParticipantStatusHandler)
		adminDashboard.POST("/update-participant-cc", adminHandler.UpdateDelegateCountryAndCouncilHandler)
		adminDashboard.POST("/make-pairing", adminHandler.MakePairingHandler)
	}

	adminPayment := admin.Group("/payment")
	{
		adminPayment.POST("/update-payment-status", adminHandler.UpdatePaymentStatusHandler)
	}

	adminPage := admin.Group("/page")
	{
		adminPage.GET("/biodata", adminHandler.GetDelegateBiodataResponsesHandler)
		adminPage.GET("/health", adminHandler.GetDelegateHealthResponsesHandler)
		adminPage.GET("/mun", adminHandler.GetDelegateMUNResponsesHandler)
		adminPage.GET("/position-paper", adminHandler.GetDelegatePositionPaperHandler)
		adminPage.GET("/payments", adminHandler.GetDelegatesPaymentHandler)
		adminPage.GET("/delegates", adminHandler.GetDelegatesHandler)
	}
	return r
}
