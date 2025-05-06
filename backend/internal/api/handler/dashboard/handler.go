package dashboard

import (
	dashboardModel "backend/internal/model/dashboard"
	"backend/internal/s3"
	dashboardService "backend/internal/service/dashboard"
	"backend/pkg/utils/dashboard"
	"encoding/json"
	"fmt"
	"os"

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
		MUNDelegates     dashboardModel.MUNDelegates       `json:"mun_delegates"`
		BiodataResponses []dashboardModel.BiodataResponses `json:"biodata_responses"`
		HealthResponses  []dashboardModel.HealthResponses  `json:"health_responses"`
		MUNResponses     []dashboardModel.MUNResponses     `json:"mun_responses"`
	}
	var req struct {
		Delegates []DelegateWithResponses
		Team      dashboardModel.MUNTeams
	}
	bucketName := os.Getenv("AWS_BUCKET_NAME")
	uploader, err := s3.NewS3Uploader(bucketName)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to initialize S3 uploader"})
		return
	}

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
	if err := json.Unmarshal([]byte(jsonPart[0]), &req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON", "details": err.Error()})
		return
	}

	biodataQuestions, _, _, err := h.dashboardService.GetQuestions()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get questions", "details": err.Error()})
		return
	}

	// Handle file uploads
	for di, d := range req.Delegates {
		for bi, b := range d.BiodataResponses {
			// Get the question type from the biodata questions
			// We need to look up the question type for this question ID
			questionType := ""

			for _, q := range biodataQuestions {
				if q.BiodataQuestionID == b.BiodataQuestionID {
					questionType = q.QuestionType
					break
				}
			}

			if questionType == "file" {
				fileKey := fmt.Sprintf("%s_%d", b.DelegateEmail, b.BiodataQuestionID)
				files, exists := form.File[fileKey]
				if !exists || len(files) == 0 {
					c.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("Missing file for question %d", b.BiodataQuestionID)})
					return
				}

				fileHeader := files[0]
				file, err := fileHeader.Open()
				if err != nil {
					c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to read file"})
					return
				}
				defer file.Close()

				key, err := uploader.UploadFile(file, fileHeader, b.DelegateEmail)
				if err != nil {
					c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to upload to S3", "details": err.Error()})
					return
				}
				req.Delegates[di].BiodataResponses[bi].BiodataAnswerText = key
			}
		}
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
