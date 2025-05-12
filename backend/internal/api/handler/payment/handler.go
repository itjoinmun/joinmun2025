package payment

import (
	paymentModel "backend/internal/model/payment"
	"backend/internal/s3"
	paymentService "backend/internal/service/payment"
	"backend/pkg/utils/dashboard"
	"encoding/json"
	"fmt"
	"path/filepath"
	"time"

	"net/http"

	"github.com/gin-gonic/gin"
)

type PaymentHandler struct {
	paymentService paymentService.PaymentService
	uploader       *s3.S3Uploader
}

func NewPaymentHandler(paymentService paymentService.PaymentService, uploader *s3.S3Uploader) (*PaymentHandler, error) {
	return &PaymentHandler{
		paymentService: paymentService,
		uploader:       uploader,
	}, nil
}

// GetPaymentHandler retrieves payment information for the authenticated user
func (h *PaymentHandler) GetPaymentHandler(c *gin.Context) {
	userContext, ok := dashboard.GetUserFromContext(c)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	userEmail := userContext.Email

	payment, err := h.paymentService.GetPaymentByDelegateEmail(userEmail)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve payment information", "details": err.Error()})
		return
	}

	c.JSON(http.StatusOK, payment)
}

// SubmitPaymentHandler handles payment proof submission
func (h *PaymentHandler) SubmitPaymentHandler(c *gin.Context) {
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

	// Get payment information
	var payment paymentModel.Payment
	if jsonData := c.Request.FormValue("payment"); jsonData != "" {
		if err := json.Unmarshal([]byte(jsonData), &payment); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid payment data", "details": err.Error()})
			return
		}
	}

	// Set the delegate email from the authenticated user
	payment.MUNDelegateEmail = userEmail
	payment.PaymentStatus = "pending"
	payment.PaymentDate = time.Now()

	// Process payment proof image
	fileHeader, err := c.FormFile("payment_proof")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Missing payment proof image"})
		return
	}

	if fileHeader.Size > maxFileSize {
		c.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("File size exceeds limit of %d bytes", maxFileSize)})
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

	// Open the file
	file, err := fileHeader.Open()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to read file", "details": err.Error()})
		return
	}
	defer file.Close()

	// Upload the file to S3
	key, err := h.uploader.UploadFile(file, fileHeader, userEmail, "payment_proof")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to upload to S3", "details": err.Error()})
		return
	}

	// Set payment file path
	payment.PaymentFile = key

	// Save payment information
	if err := h.paymentService.InsertPayment(&payment); err != nil {
		// Try to clean up the uploaded file if DB operation fails
		_ = h.uploader.DeleteFile(key)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save payment information", "details": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":      "Payment proof submitted successfully",
		"payment_id":   payment.PaymentID,
		"payment_file": payment.PaymentFile,
	})
}

// UpdatePaymentStatusHandler allows admins to update payment status
func (h *PaymentHandler) UpdatePaymentStatusHandler(c *gin.Context) {
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
	if err := h.paymentService.UpdatePaymentStatus(req.DelegateEmail); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update payment status", "details": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Payment status updated successfully"})
}
