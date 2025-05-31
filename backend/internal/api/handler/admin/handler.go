package admin

import (
	adminService "backend/internal/service/admin"
	"backend/pkg/utils/dashboard"
	"bytes"
	"encoding/csv"
	"fmt"
	"net/http"
	"sort"
	"strconv"
	"strings"

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

// convertToCSV generates a CSV string from a slice of GroupedResponseItem.
func convertToCSV(items []adminService.GroupedResponseItem, filenamePrefix string) (string, string, error) {
	if len(items) == 0 {
		return "", filenamePrefix + ".csv", nil // Return empty string and default filename
	}

	var csvBuffer bytes.Buffer
	csvWriter := csv.NewWriter(&csvBuffer)

	questionHeaderSet := make(map[string]struct{})
	for _, item := range items {
		answers := item.GetAnswers()
		for questionText := range answers {
			questionHeaderSet[questionText] = struct{}{}
		}
	}

	sortedQuestionHeaders := make([]string, 0, len(questionHeaderSet))
	for questionText := range questionHeaderSet {
		sortedQuestionHeaders = append(sortedQuestionHeaders, questionText)
	}
	sort.Strings(sortedQuestionHeaders) // Sort for consistent column order

	headers := []string{"delegate_email"}
	headers = append(headers, sortedQuestionHeaders...)

	if err := csvWriter.Write(headers); err != nil {
		return "", "", fmt.Errorf("failed to write CSV headers: %w", err)
	}

	for _, item := range items {
		record := make([]string, len(headers))
		record[0] = item.GetDelegateEmail()
		answers := item.GetAnswers()
		for i, questionHeader := range sortedQuestionHeaders {
			record[i+1] = answers[questionHeader] // map answer to the correct column
		}
		if err := csvWriter.Write(record); err != nil {
			return "", "", fmt.Errorf("failed to write CSV record for %s: %w", item.GetDelegateEmail(), err)
		}
	}

	csvWriter.Flush()
	if err := csvWriter.Error(); err != nil {
		return "", "", fmt.Errorf("failed to flush CSV writer: %w", err)
	}

	finalFilename := strings.ToLower(strings.ReplaceAll(filenamePrefix, " ", "_")) + "_responses.csv"
	return csvBuffer.String(), finalFilename, nil
}

func (h *AdminHandler) GetAmalgamatedResponsesHandler(c *gin.Context) {
	userContext, ok := dashboard.GetUserFromContext(c)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	// Only admins can get amalgamated responses
	if userContext.Role != "admin" {
		c.JSON(http.StatusForbidden, gin.H{"error": "Forbidden: Admin access required"})
		return
	}

	var req struct {
		DelegateType string `json:"delegate_type" binding:"required"` // Can be "all" or a specific type
		Limit        int    `json:"limit" binding:"gte=1"`
		Offset       int    `json:"offset" binding:"gte=0"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request", "details": err.Error()})
		return
	}

	actualDelegateType := req.DelegateType
	if strings.ToLower(req.DelegateType) == "all" {
		actualDelegateType = "" // Pass empty string to service to fetch all types
	}

	responses, err := h.adminService.GetAmalgamatedResponses(actualDelegateType, req.Limit, req.Offset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve amalgamated responses", "details": err.Error()})
		return
	}

	items := make([]adminService.GroupedResponseItem, len(responses))
	for i, r := range responses {
		items[i] = r
	}

	filenamePrefix := "amalgamated"
	if actualDelegateType != "" {
		filenamePrefix += "_" + actualDelegateType
	}

	csvString, filename, errCsv := convertToCSV(items, filenamePrefix)
	if errCsv != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate CSV for amalgamated data", "details": errCsv.Error()})
		return
	}

	c.Header("Content-Disposition", fmt.Sprintf("attachment; filename=\"%s\"", filename))
	c.Data(http.StatusOK, "text/csv; charset=utf-8", []byte(csvString))
}

func (h *AdminHandler) GetDelegatesPaymentHandler(c *gin.Context) {
	userContext, ok := dashboard.GetUserFromContext(c)
	if !ok || userContext.Role != "admin" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	delegateType := c.DefaultQuery("delegate_type", "")
	timeWave := c.Query("time")
	limitStr := c.DefaultQuery("limit", "50")
	offsetStr := c.DefaultQuery("offset", "0")

	limit, err := strconv.Atoi(limitStr)
	if err != nil || limit < 1 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid limit"})
		return
	}
	offset, err := strconv.Atoi(offsetStr)
	if err != nil || offset < 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid offset"})
		return
	}

	responses, err := h.adminService.GetDelegatePaymentResponses(delegateType, timeWave, limit, offset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve delegates payment", "details": err.Error()})
		return
	}

	// Group payments by team for better admin visibility
	teamPayments := make(map[string][]interface{})
	for _, payment := range responses {
		var teamID string
		if payment.MUNTeamID != nil {
			teamID = *payment.MUNTeamID
		} else {
			teamID = "No Team"
		}
		if teamPayments[teamID] == nil {
			teamPayments[teamID] = make([]interface{}, 0)
		}
		teamPayments[teamID] = append(teamPayments[teamID], payment)
	}

	c.JSON(http.StatusOK, gin.H{
		"payments_by_team": teamPayments,
		"total_payments":   len(responses),
	})
}

func (h *AdminHandler) GetDelegatesHandler(c *gin.Context) {
	userContext, ok := dashboard.GetUserFromContext(c)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	// Only admins can get delegates
	if userContext.Role != "admin" {
		c.JSON(http.StatusForbidden, gin.H{"error": "Forbidden: Admin access required"})
		return
	}

	var req struct {
		DelegateType string `json:"delegate_type" binding:"required"`
		Limit        int    `json:"limit" binding:"gte=1"`
		Offset       int    `json:"offset" binding:"gte=0"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request", "details": err.Error()})
		return
	}

	responses, err := h.adminService.GetDelegates(req.DelegateType, req.Limit, req.Offset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve delegates", "details": err.Error()})
		return
	}

	c.JSON(http.StatusOK, responses)
}

func (h *AdminHandler) GetDelegatePositionPaperHandler(c *gin.Context) {
	userContext, ok := dashboard.GetUserFromContext(c)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	// Only admins can get delegate position paper
	if userContext.Role != "admin" {
		c.JSON(http.StatusForbidden, gin.H{"error": "Forbidden: Admin access required"})
		return
	}

	var req struct {
		Limit  int `json:"limit" binding:"gte=1"`
		Offset int `json:"offset" binding:"gte=0"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request", "details": err.Error()})
		return
	}

	responses, err := h.adminService.GetPositionPapers(req.Limit, req.Offset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve delegate position paper", "details": err.Error()})
		return
	}

	c.JSON(http.StatusOK, responses)
}
