package router

import (
	"backend/internal/api/handler/dashboard"
	"backend/internal/api/middleware"

	"github.com/gin-gonic/gin"
)

func InitializeDashboardRoutes(r *gin.Engine, dashboardHandler *dashboard.DashboardHandler) *gin.Engine {
	// Dashboard routes
	dashboardGroup := r.Group("/api/v1/dashboard")
	dashboardGroup.Use(middleware.ValidateAccessTokenMiddleware())
	{
		dashboardGroup.GET("/participants", dashboardHandler.ParticipantDataHandler)
		dashboardGroup.GET("/questions", dashboardHandler.GetQuestionsHandler)
		dashboardGroup.POST("/delegates", dashboardHandler.InsertDelegatesHandler)
		dashboardGroup.POST("/advisor-or-observer", dashboardHandler.InsertAdvisorOrObserverHandler)
		dashboardGroup.POST("/join-team", dashboardHandler.LinkToTeamHandler)
	}

	// admin routes
	adminGroup := r.Group("/api/v1/dashboard/admin")
	adminGroup.Use(middleware.ValidateAccessTokenMiddleware())
	adminGroup.Use(middleware.ValidateAdminMiddleware())
	{
		adminGroup.POST("/update-participant-status", dashboardHandler.UpdateParticipantStatusHandler)
		adminGroup.POST("/update-participant-cc", dashboardHandler.UpdateDelegateCountryAndCouncilHandler)
		adminGroup.POST("/make-pairing", dashboardHandler.MakePairingHandler)
	}
	return r
}
