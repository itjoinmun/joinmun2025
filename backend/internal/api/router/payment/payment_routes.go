package payment

import (
	"backend/internal/api/handler/payment"
	"backend/internal/api/middleware"

	"github.com/gin-gonic/gin"
)

func InitializePaymentRoutes(r *gin.Engine, paymentHandler *payment.PaymentHandler) *gin.Engine {
	// Payment routes
	paymentGroup := r.Group("/api/v1/payment")
	paymentGroup.Use(middleware.ValidateAccessTokenMiddleware())
	{
		paymentGroup.GET("/", paymentHandler.GetPaymentHandler)
		paymentGroup.POST("/", paymentHandler.SubmitPaymentHandler)
	}
	return r
}
