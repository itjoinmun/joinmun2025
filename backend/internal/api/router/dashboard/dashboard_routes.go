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
		dashboardGroup.POST("/delegates", dashboardHandler.InsertDelegatesHandler)
	}

	return r
}
