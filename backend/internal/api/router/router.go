package router

import (
	"backend/internal/api/handler"
	adminRoutes "backend/internal/api/router/admin"
	dashboardRoutes "backend/internal/api/router/dashboard"
	paymentRoutes "backend/internal/api/router/payment"
	userRoutes "backend/internal/api/router/user"

	"github.com/gin-gonic/gin"
)

func InitializeRoutes(r *gin.Engine, h *handler.HandlerContainer) *gin.Engine {
	// Ping endpoint for health check
	ping := r.Group("/ping")
	ping.GET("", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "pong",
		})
	})

	// User routes
	userRoutes.InitalizeUserRoutes(r, h.UserHandler)

	// Dashboard routes
	dashboardRoutes.InitializeDashboardRoutes(r, h.DashboardHandler)

	// Payment routes
	paymentRoutes.InitializePaymentRoutes(r, h.PaymentHandler)

	// Admin routes
	adminRoutes.InitializeAdminRoutes(r, h.AdminHandler)
	return r
}
