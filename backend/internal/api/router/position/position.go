package position

import (
	"backend/internal/api/handler/position"
	"backend/internal/api/middleware"

	"github.com/gin-gonic/gin"
)

func InitializePositionRoutes(r *gin.Engine, positionHandler *position.PositionHandler) *gin.Engine {
	// position routes
	positionGroup := r.Group("/api/v1/position")
	positionGroup.Use(middleware.ValidateAccessTokenMiddleware())
	{
		positionGroup.GET("/position", positionHandler.GetPositionPaperHandler)
		positionGroup.POST("/position", positionHandler.SubmitPositionPaperHandler)
	}
	return r
}
