package dashboard

import (
	dashboardModel "backend/internal/model/dashboard"
	"backend/internal/s3"
	dashboardService "backend/internal/service/dashboard"
	"backend/pkg/utils/dashboard"
	"encoding/json"
	"fmt"
	"path/filepath"

	"net/http"

	"github.com/gin-gonic/gin"
)

type DashboardHandler struct {
	dashboardService dashboardService.DashboardService
	uploader         *s3.S3Uploader
}

func NewDashboardHandler(dashboardService dashboardService.DashboardService, uploader *s3.S3Uploader) (*DashboardHandler, error) {
	return &DashboardHandler{
		dashboardService: dashboardService,
		uploader:         uploader,
	}, nil
}

// register the delegates will accept
func (h *DashboardHandler) InsertDelegatesHandler(c *gin.Context) {
	// Initialize the struct to hold the request data
	type DelegateWithResponses struct {
		MUNDelegates     dashboardModel.MUNDelegates       `json:"mun_delegates"`
		BiodataResponses []dashboardModel.BiodataResponses `json:"biodata_responses"`
		HealthResponses  []dashboardModel.HealthResponses  `json:"health_responses"`
		MUNResponses     []dashboardModel.MUNResponses     `json:"mun_responses"`
	}
	// Request struct that holds the delegates and team
	var req struct {
		Delegates []DelegateWithResponses `json:"delegates"`
		Team      dashboardModel.MUNTeams `json:"team"`
	}

	// Parse the multipart form, limit file size to 2MB
	const maxFileSize = 2 << 20 // 2 MB
	form, err := c.MultipartForm()
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid multipart form"})
		return
	}

	// Parse JSON part
	jsonPart := form.Value["json"]
	if len(jsonPart) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Missing JSON part"})
		return
	}

	// Unmarshal the JSON part
	if err := json.Unmarshal([]byte(jsonPart[0]), &req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON", "details": err.Error()})
		return
	}

	// Check if the delegates list is empty
	if len(req.Delegates) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Delegates list cannot be empty"})
		return
	}

	// Get the biodata questions from the service
	biodataQuestions, _, _, err := h.dashboardService.GetQuestions()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get questions", "details": err.Error()})
		return
	}

	// Create a map for faster question type lookup
	questionTypeMap := make(map[int]string)
	for _, q := range biodataQuestions {
		questionTypeMap[q.BiodataQuestionID] = q.QuestionType
	}

	// Track uploaded files for cleanup if needed
	var uploadedFiles []string

	// Prepare the delegates and responses for insertion
	delegates := make([]dashboardModel.MUNDelegates, 0, len(req.Delegates))
	var biodataResponses []dashboardModel.BiodataResponses
	var healthResponses []dashboardModel.HealthResponses
	var munResponses []dashboardModel.MUNResponses

	// Process each delegate
	for _, d := range req.Delegates {
		delegateEmail := d.MUNDelegates.MUNDelegateEmail
		delegates = append(delegates, d.MUNDelegates)

		// Process biodata responses
		for _, b := range d.BiodataResponses {
			// Ensure email is set
			b.DelegateEmail = delegateEmail

			// Check if this is a file question
			questionType, exists := questionTypeMap[b.BiodataQuestionID]
			if !exists {
				c.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("Unknown question ID: %d", b.BiodataQuestionID)})
				cleanupFiles(h.uploader, uploadedFiles)
				return
			}

			if questionType == "file" {
				// Process file upload
				fileKey := fmt.Sprintf("%s_%d", delegateEmail, b.BiodataQuestionID)
				files, exists := form.File[fileKey]

				if !exists || len(files) == 0 {
					c.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("Missing file for delegate %s, question %d", delegateEmail, b.BiodataQuestionID)})
					cleanupFiles(h.uploader, uploadedFiles)
					return
				}

				fileHeader := files[0]
				if fileHeader.Size > maxFileSize {
					c.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("File size exceeds limit of %d bytes for question %d", maxFileSize, b.BiodataQuestionID)})
					cleanupFiles(h.uploader, uploadedFiles)
					return
				}

				// Check if it's an allowed image format
				ext := filepath.Ext(fileHeader.Filename)
				allowedExts := map[string]bool{
					".jpg": true, ".jpeg": true, ".png": true, ".pdf": true,
				}
				if !allowedExts[ext] {
					c.JSON(http.StatusBadRequest, gin.H{"error": "File format not allowed. Please upload JPG, JPEG, PNG, or PDF"})
					return
				}

				file, err := fileHeader.Open()
				if err != nil {
					c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to read file", "details": err.Error()})
					cleanupFiles(h.uploader, uploadedFiles)
					return
				}

				// Upload file to S3
				key, err := h.uploader.UploadFile(file, fileHeader, delegateEmail, "delegate_biodata")
				file.Close()
				if err != nil {
					c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to upload to S3", "details": err.Error()})
					cleanupFiles(h.uploader, uploadedFiles)
					return
				}

				uploadedFiles = append(uploadedFiles, key)
				fmt.Printf("Uploaded file to S3 with key: %s\n", key)
				b.BiodataAnswerText = key
			}

			biodataResponses = append(biodataResponses, b)
		}

		// Process health responses
		for _, h := range d.HealthResponses {
			h.DelegateEmail = delegateEmail
			healthResponses = append(healthResponses, h)
		}

		// Process MUN responses
		for _, m := range d.MUNResponses {
			m.DelegateEmail = delegateEmail
			munResponses = append(munResponses, m)
		}
	}

	// Insert delegates with all responses
	team := req.Team
	if err := h.dashboardService.InsertDelegates(delegates, &team, biodataResponses, healthResponses, munResponses); err != nil {
		// If database insertion fails, clean up the uploaded files
		cleanupFiles(h.uploader, uploadedFiles)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to insert delegates", "details": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Delegates inserted successfully"})
}

// Helper function to clean up uploaded files in case of error
func cleanupFiles(uploader *s3.S3Uploader, fileKeys []string) {
	for _, key := range fileKeys {
		_ = uploader.DeleteFile(key) // Best effort deletion
	}
}

func (h *DashboardHandler) InsertAdvisorOrObserverHandler(c *gin.Context) {
	type AdvisorOrObserverStruct struct {
		AdvisorOrObserver *dashboardModel.MUNDelegates      `json:"advisor_or_observer"`
		BiodataResponses  []dashboardModel.BiodataResponses `json:"biodata_responses"`
		HealthResponses   []dashboardModel.HealthResponses  `json:"health_responses"`
	}

	var req struct {
		AdvisorOrObserver AdvisorOrObserverStruct `json:"advisor_or_observer"`
	}

	// Parse the multipart form, limit file size to 2MB
	const maxFileSize = 2 << 20 // 2 MB
	form, err := c.MultipartForm()
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid multipart form"})
		return
	}
	// Parse JSON part
	jsonPart := form.Value["json"]
	if len(jsonPart) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Missing JSON part"})
		return
	}

	// Unmarshal the JSON part
	if err := json.Unmarshal([]byte(jsonPart[0]), &req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON", "details": err.Error()})
		return
	}
	// Check if advisor or observer is nil
	if req.AdvisorOrObserver.AdvisorOrObserver == nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Advisor or observer cannot be empty"})
		return
	}
	// Get the biodata questions from the service
	biodataQuestions, _, _, err := h.dashboardService.GetQuestions()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get questions", "details": err.Error()})
		return
	}
	// Create a map for faster question type lookup
	questionTypeMap := make(map[int]string)
	for _, q := range biodataQuestions {
		questionTypeMap[q.BiodataQuestionID] = q.QuestionType
	}
	// Track uploaded files for cleanup if needed
	var uploadedFiles []string
	advisorOrObserverEmail := req.AdvisorOrObserver.AdvisorOrObserver.MUNDelegateEmail
	// Process biodata responses
	for i := range req.AdvisorOrObserver.BiodataResponses {
		// Ensure email is set
		req.AdvisorOrObserver.BiodataResponses[i].DelegateEmail = advisorOrObserverEmail

		// Check if this is a file question
		questionType, exists := questionTypeMap[req.AdvisorOrObserver.BiodataResponses[i].BiodataQuestionID]
		if !exists {
			c.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("Unknown question ID: %d", req.AdvisorOrObserver.BiodataResponses[i].BiodataQuestionID)})
			cleanupFiles(h.uploader, uploadedFiles)
			return
		}

		if questionType == "file" {
			// Process file upload
			fileKey := fmt.Sprintf("%s_%d", advisorOrObserverEmail, req.AdvisorOrObserver.BiodataResponses[i].BiodataQuestionID)
			files, exists := form.File[fileKey]

			if !exists || len(files) == 0 {
				c.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("Missing file for advisor %s, question %d", advisorOrObserverEmail, req.AdvisorOrObserver.BiodataResponses[i].BiodataQuestionID)})
				cleanupFiles(h.uploader, uploadedFiles)
				return
			}

			fileHeader := files[0]
			if fileHeader.Size > maxFileSize {
				c.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("File size exceeds limit of %d bytes for question %d", maxFileSize, req.AdvisorOrObserver.BiodataResponses[i].BiodataQuestionID)})
				cleanupFiles(h.uploader, uploadedFiles)
				return
			}

			file, err := fileHeader.Open()
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to read file", "details": err.Error()})
				cleanupFiles(h.uploader, uploadedFiles)
				return
			}

			// Upload file to S3
			key, err := h.uploader.UploadFile(file, fileHeader, advisorOrObserverEmail, "facc_biodata")
			file.Close()
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to upload to S3", "details": err.Error()})
				cleanupFiles(h.uploader, uploadedFiles)
				return
			}

			uploadedFiles = append(uploadedFiles, key)
			req.AdvisorOrObserver.BiodataResponses[i].BiodataAnswerText = key
		}
	}

	// Process health responses
	for i := range req.AdvisorOrObserver.HealthResponses {
		req.AdvisorOrObserver.HealthResponses[i].DelegateEmail = advisorOrObserverEmail
	}

	// Insert faculty advisor with all responses
	if err := h.dashboardService.InsertOneDelegateForFAOrObserver(
		req.AdvisorOrObserver.AdvisorOrObserver,
		req.AdvisorOrObserver.HealthResponses,
		req.AdvisorOrObserver.BiodataResponses); err != nil {
		// If database insertion fails, clean up the uploaded files
		cleanupFiles(h.uploader, uploadedFiles)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to insert faculty advisor", "details": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Faculty advisor inserted successfully"})

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

func (h *DashboardHandler) GetQuestionsHandler(c *gin.Context) {
	// Get the questions from the service
	biodataQuestions, healthQuestions, munQuestions, err := h.dashboardService.GetQuestions()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get questions", "details": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"biodata_questions": biodataQuestions,
		"health_questions":  healthQuestions,
		"mun_questions":     munQuestions,
	})
}

func (h *DashboardHandler) LinkToTeamHandler(c *gin.Context) {
	var req struct {
		TeamID string `json:"team_id" binding:"required"`
	}
	// Get the email from the request context
	userContext, ok := dashboard.GetUserFromContext(c)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	userEmail := userContext.Email
	// Get the team ID from the request body
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request", "details": err.Error()})
		return
	}

	teamID := req.TeamID
	// Link the user to the team in the service
	err := h.dashboardService.LinkMeToTeam(userEmail, teamID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to link to team", "details": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Successfully linked to team"})
}

func (h *DashboardHandler) UpdateParticipantStatusHandler(c *gin.Context) {
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
	err := h.dashboardService.UpdateParticipantStatus(delegateEmail)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update delegate status", "details": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Delegate status updated successfully"})
}

func (h *DashboardHandler) UpdateDelegateCountryAndCouncilHandler(c *gin.Context) {
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
	err := h.dashboardService.UpdateDelegateCountryAndCouncil(req.Country, req.Council, delegateEmail)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update delegate country and council", "details": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Delegate country and council updated successfully"})
}

func (h *DashboardHandler) MakePairingHandler(c *gin.Context) {
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
	err := h.dashboardService.MakePairing(delegateEmail, req.PairEmail)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update delegate status", "details": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Delegate pairing updated successfully"})
}
