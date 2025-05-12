package position

import (
	positionModel "backend/internal/model/position"
	"backend/internal/s3"
	"fmt"
	"path/filepath"

	positionService "backend/internal/service/position"
	"backend/pkg/utils/dashboard"
	"net/http"

	"github.com/gin-gonic/gin"
)

type PositionHandler struct {
	positionService positionService.PositionService
	uploader        *s3.S3Uploader
}

func NewPositionHandler(positionService positionService.PositionService, uploader *s3.S3Uploader) (*PositionHandler, error) {
	return &PositionHandler{
		positionService: positionService,
		uploader:        uploader,
	}, nil
}

// GetPositionPaperHandler retrieves the position paper for the authenticated user
func (h *PositionHandler) GetPositionPaperHandler(c *gin.Context) {
	userContext, ok := dashboard.GetUserFromContext(c)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	userEmail := userContext.Email

	paper, err := h.positionService.GetPositionPaperByDelegateEmail(userEmail)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve position paper", "details": err.Error()})
		return
	}
	if paper == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Position paper not found"})
		return
	}

	paperUrl, err := h.uploader.GeneratePresignedURL(paper.SubmissionFile) // 15 minutes expiration
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate presigned URL", "details": err.Error()})
		return
	}

	c.JSON(http.StatusOK, paperUrl)
}

// insert position paper
// SubmitPositionPaperHandler handles position paper submission
func (h *PositionHandler) SubmitPositionPaperHandler(c *gin.Context) {
	userContext, ok := dashboard.GetUserFromContext(c)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	userEmail := userContext.Email

	// Parse the multipart form
	const maxFileSize = 2 << 20 // 5 MB
	if err := c.Request.ParseMultipartForm(maxFileSize); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid multipart form or file too large"})
		return
	}

	// Get the file from the form
	fileHeader, err := c.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Missing position paper file"})
		return
	}

	if fileHeader.Size > maxFileSize {
		c.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("File size exceeds limit of %d bytes", maxFileSize)})
		return
	}

	// Check allowed extensions
	ext := filepath.Ext(fileHeader.Filename)
	allowedExts := map[string]bool{
		".pdf": true,
	}
	if !allowedExts[ext] {
		c.JSON(http.StatusBadRequest, gin.H{"error": "File format not allowed. Please upload a PDF file"})
		return
	}

	// Open the file
	file, err := fileHeader.Open()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to read file", "details": err.Error()})
		return
	}
	defer file.Close()

	// Upload to S3 or your object storage
	key, err := h.uploader.UploadFile(file, fileHeader, userEmail, "position_papers")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to upload to storage", "details": err.Error()})
		return
	}

	// Create the position paper entry
	positionPaper := &positionModel.PositionPaper{
		MUNDelegateEmail: userEmail,
		SubmissionFile:   key,
	}

	// Save to the database
	if err := h.positionService.InsertPositionPaper(positionPaper); err != nil {
		_ = h.uploader.DeleteFile(key) // Clean up on failure
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save position paper", "details": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":         "Position paper submitted successfully",
		"submission_file": positionPaper.SubmissionFile,
	})
}
