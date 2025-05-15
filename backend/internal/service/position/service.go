package position

import (
	positionModel "backend/internal/model/position"
	delegateRepo "backend/internal/repository/dashboard"
	paymentRepo "backend/internal/repository/payment"
	positionRepo "backend/internal/repository/position"
	"backend/internal/s3"
	"backend/pkg/utils/logger"
	"fmt"
	"time"
)

type PositionService interface {
	GetPositionPaperByDelegateEmail(delegateEmail string) (*positionModel.PositionPaper, error)
	InsertPositionPaper(positionPaper *positionModel.PositionPaper) error
}

type positionService struct {
	uploader     *s3.S3Uploader
	positionRepo positionRepo.PositionPaperRepo
	paymentRepo  paymentRepo.PaymentRepo
	delegateRepo delegateRepo.DelegateRepo
}

func NewPositionService(
	uploader *s3.S3Uploader,
	positionRepo positionRepo.PositionPaperRepo,
	paymentRepo paymentRepo.PaymentRepo,
	delegateRepo delegateRepo.DelegateRepo,
) PositionService {
	return &positionService{
		uploader:     uploader,
		positionRepo: positionRepo,
		paymentRepo:  paymentRepo,
		delegateRepo: delegateRepo,
	}
}

func (s *positionService) GetPositionPaperByDelegateEmail(delegateEmail string) (*positionModel.PositionPaper, error) {
	paper, err := s.positionRepo.GetPositionPaperByDelegateEmail(delegateEmail)
	if err != nil {
		logger.LogError(err, "Failed to get position paper by delegate email", map[string]interface{}{"delegateEmail": delegateEmail, "layer": "service", "operation": "GetPositionPaperByDelegateEmail"})
		return nil, err
	}
	paperUrl, err := s.uploader.GeneratePresignedURL(paper.SubmissionFile)
	if err != nil {
		logger.LogError(err, "Failed to generate presigned URL", map[string]interface{}{"delegateEmail": delegateEmail, "layer": "service", "operation": "GetPositionPaperByDelegateEmail"})
		return nil, err
	}

	paper.SubmissionFile = paperUrl
	logger.LogDebug("Position paper retrieved successfully", map[string]interface{}{"delegateEmail": delegateEmail, "layer": "service", "operation": "GetPositionPaperByDelegateEmail"})
	return paper, nil
}

func (s *positionService) InsertPositionPaper(positionPaper *positionModel.PositionPaper) error {
	// check if user is already approved
	user, err := s.delegateRepo.GetDelegateByEmail(positionPaper.MUNDelegateEmail)
	if err != nil {
		logger.LogError(err, "Failed to get user by email", map[string]interface{}{"delegateEmail": positionPaper.MUNDelegateEmail, "layer": "service", "operation": "InsertPositionPaper"})
		return err
	}
	if user == nil {
		logger.LogError(nil, "User not found", map[string]interface{}{"delegateEmail": positionPaper.MUNDelegateEmail, "layer": "service", "operation": "InsertPositionPaper"})
		return fmt.Errorf("user not found with email: %s", positionPaper.MUNDelegateEmail)
	}

	var userConfirmed bool
	if user.Confirmed != nil {
		userConfirmed = *user.Confirmed
	}

	if !userConfirmed {
		logger.LogError(nil, "User biodata not confirmed", map[string]interface{}{"delegateEmail": positionPaper.MUNDelegateEmail, "layer": "service", "operation": "InsertPositionPaper"})
		return fmt.Errorf("user not confirmed with email: %s", positionPaper.MUNDelegateEmail)
	}

	// check if payment is already approved
	payment, err := s.paymentRepo.GetPaymentByDelegateEmail(positionPaper.MUNDelegateEmail)
	if err != nil {
		logger.LogError(err, "Failed to get payment by delegate email", map[string]interface{}{"delegateEmail": positionPaper.MUNDelegateEmail, "layer": "service", "operation": "InsertPositionPaper"})
		return err
	}
	if payment.PaymentStatus != "paid" {
		logger.LogError(nil, "Payment not approved", map[string]interface{}{"delegateEmail": positionPaper.MUNDelegateEmail, "layer": "service", "operation": "InsertPositionPaper"})
		return fmt.Errorf("payment not approved for delegate email: %s", positionPaper.MUNDelegateEmail)
	}

	positionPaper.SubmissionDate = time.Now()
	positionPaper.SubmissionStatus = "pending"

	id, err := s.positionRepo.InsertPositionPaper(positionPaper)
	if err != nil {
		logger.LogError(err, "Failed to insert position paper", map[string]interface{}{"delegateEmail": positionPaper.MUNDelegateEmail, "layer": "service", "operation": "InsertPositionPaper"})
		return err
	}
	logger.LogDebug("Position paper inserted successfully", map[string]interface{}{"positionPaperID": id, "layer": "service", "operation": "InsertPositionPaper"})
	return nil
}
