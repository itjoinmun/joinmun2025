package admin

import (
	adminService "backend/internal/service/admin"
	"backend/pkg/utils/dashboard"
	"net/http"

	"github.com/gin-gonic/gin"
)

type AdminHandler struct {
	adminService adminService.AdminService
}

func NewAdminHandler(adminService adminService.AdminService) (*AdminHandler, error) {
	return &AdminHandler{
		adminService: adminService,
	}, nil
}

func (h *AdminHandler) UpdateParticipantStatusHandler(c *gin.Context) {
	var req struct {
		ParticipantEmail string `json:"participant_email" binding:"required,email"`
	}

	// Get the email from the request context
	userContext, ok := dashboard.GetUserFromContext(c)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	if userContext.Role != "admin" {
		c.JSON(http.StatusForbidden, gin.H{"error": "Forbidden"})
		return
	}

	// Get the delegate email and status from the request body
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request", "details": err.Error()})
		return
	}

	delegateEmail := req.ParticipantEmail

	// Update the delegate status in the service
	err := h.adminService.UpdateParticipantStatus(delegateEmail)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update delegate status", "details": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Delegate status updated successfully"})
}

func (h *AdminHandler) UpdateDelegateCountryAndCouncilHandler(c *gin.Context) {
	var req struct {
		DelegateEmail string `json:"delegate_email" binding:"required,email"`
		Country       string `json:"country" binding:"required"`
		Council       string `json:"council" binding:"required"`
	}

	// Get the email from the request context
	userContext, ok := dashboard.GetUserFromContext(c)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	if userContext.Role != "admin" {
		c.JSON(http.StatusForbidden, gin.H{"error": "Forbidden"})
		return
	}

	// Get the delegate email and status from the request body
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request", "details": err.Error()})
		return
	}

	delegateEmail := req.DelegateEmail

	// Update the delegate status in the service
	err := h.adminService.UpdateDelegateCountryAndCouncil(req.Country, req.Council, delegateEmail)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update delegate country and council", "details": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Delegate country and council updated successfully"})
}

func (h *AdminHandler) MakePairingHandler(c *gin.Context) {
	var req struct {
		DelegateEmail string `json:"delegate_email" binding:"required,email"`
		PairEmail     string `json:"pair_email" binding:"required"`
	}

	// Get the email from the request context
	userContext, ok := dashboard.GetUserFromContext(c)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	if userContext.Role != "admin" {
		c.JSON(http.StatusForbidden, gin.H{"error": "Forbidden"})
		return
	}

	// Get the delegate email and status from the request body
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request", "details": err.Error()})
		return
	}

	delegateEmail := req.DelegateEmail

	// Update the delegate status in the service
	err := h.adminService.MakePairing(delegateEmail, req.PairEmail)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update delegate status", "details": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Delegate pairing updated successfully"})
}

// UpdatePaymentStatusHandler allows admins to update payment status
func (h *AdminHandler) UpdatePaymentStatusHandler(c *gin.Context) {
	userContext, ok := dashboard.GetUserFromContext(c)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	// Only admins can update payment status
	if userContext.Role != "admin" {
		c.JSON(http.StatusForbidden, gin.H{"error": "Forbidden: Admin access required"})
		return
	}

	var req struct {
		DelegateEmail string `json:"delegate_email" binding:"required,email"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request", "details": err.Error()})
		return
	}

	// Update payment status
	if err := h.adminService.UpdatePaymentStatus(req.DelegateEmail); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update payment status", "details": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Payment status updated successfully"})
}
