package dashboard

import (
	dashboardModel "backend/internal/model/dashboard"
	dashboardService "backend/internal/service/dashboard"
	"backend/pkg/utils/dashboard"

	"net/http"

	"github.com/gin-gonic/gin"
)

type DashboardHandler struct {
	dashboardService dashboardService.DashboardService
}

func NewDashboardHandler(dashboardService dashboardService.DashboardService) *DashboardHandler {
	return &DashboardHandler{
		dashboardService: dashboardService,
	}
}

// register the delegates will accept
func (h *DashboardHandler) InsertDelegatesHandler(c *gin.Context) {
	type DelegateWithResponses struct {
		dashboardModel.MUNDelegates
		BiodataResponses []dashboardModel.BiodataResponses
		HealthResponses  []dashboardModel.HealthResponses
		MUNResponses     []dashboardModel.MUNResponses
	}

	var req struct {
		Delegates []DelegateWithResponses
		Team      dashboardModel.MUNTeams
	}

	delegates := make([]dashboardModel.MUNDelegates, 0, len(req.Delegates))
	for _, d := range req.Delegates {
		delegates = append(delegates, d.MUNDelegates)
	}

	var biodataResponses []dashboardModel.BiodataResponses
	var healthResponses []dashboardModel.HealthResponses
	var munResponses []dashboardModel.MUNResponses

	for _, d := range req.Delegates {
		for _, b := range d.BiodataResponses {
			b.DelegateEmail = d.MUNDelegates.MUNDelegateEmail // ensure email is set
			biodataResponses = append(biodataResponses, b)
		}
		for _, h := range d.HealthResponses {
			h.DelegateEmail = d.MUNDelegates.MUNDelegateEmail
			healthResponses = append(healthResponses, h)
		}
		for _, m := range d.MUNResponses {
			m.DelegateEmail = d.MUNDelegates.MUNDelegateEmail
			munResponses = append(munResponses, m)
		}
	}

	// Bind the JSON request to the struct
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input", "details": err.Error()})
		return
	}

	if len(req.Delegates) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Delegates list cannot be empty"})
		return
	}

	team := req.Team

	if err := h.dashboardService.InsertDelegates(delegates, &team, biodataResponses, healthResponses, munResponses); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to insert delegates", "details": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Delegates inserted successfully"})
}

func (h *DashboardHandler) ParticipantDataHandler(c *gin.Context) {
	userContext, ok := dashboard.GetUserFromContext(c)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	userEmail := userContext.Email
	// Get the participant data from the service
	participantData, err := h.dashboardService.GetParticipantData(userEmail)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get participant data", "details": err.Error()})
		return
	}

	c.JSON(http.StatusOK, participantData)
}
