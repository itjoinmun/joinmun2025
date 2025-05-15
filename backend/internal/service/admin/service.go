package admin

import (
	delegateModel "backend/internal/model/dashboard"
	paymentModel "backend/internal/model/payment"
	adminRepo "backend/internal/repository/admin"
	delegateRepo "backend/internal/repository/dashboard"
	paymentRepo "backend/internal/repository/payment"
	"backend/internal/s3"

	"backend/pkg/utils"
	emailUtils "backend/pkg/utils/email"
	"backend/pkg/utils/logger"
	"fmt"

	"github.com/jmoiron/sqlx"
)

type AdminService interface {
	UpdateParticipantStatus(email string) error
	UpdateDelegateCountryAndCouncil(country, council, delegateEmail string) error
	MakePairing(delegateEmail, pair string) error
	UpdatePaymentStatus(email string) error
	GetDelegateHealthResponses(delegateType string, limit, offset int) ([]delegateModel.HealthResponseWithQuestion, error)
	GetDelegateMUNResponses(delegateType string, limit, offset int) ([]delegateModel.MUNResponseWithQuestion, error)
	GetDelegateBiodataResponses(delegateType string, limit, offset int) ([]delegateModel.BiodataResponseWithQuestion, error)
	GetDelegatePaymentResponses(delegateType string, limit, offset int) ([]paymentModel.PaymentResponse, error)
	GetDelegates(delegateType string, limit, offset int) ([]delegateModel.MUNDelegates, error)
}

type adminService struct {
	uploader     *s3.S3Uploader
	delegateRepo delegateRepo.DelegateRepo
	adminRepo    adminRepo.AdminRepo
	paymentRepo  paymentRepo.PaymentRepo
}

func NewAdminService(uploader *s3.S3Uploader, adminRepo adminRepo.AdminRepo, delegateRepo delegateRepo.DelegateRepo, paymentRepo paymentRepo.PaymentRepo) AdminService {
	return &adminService{
		uploader:     uploader,
		delegateRepo: delegateRepo,
		adminRepo:    adminRepo,
		paymentRepo:  paymentRepo,
	}
}

func (s *adminService) UpdateParticipantStatus(email string) (retErr error) {
	participant, err := s.delegateRepo.GetDelegateByEmail(email)
	if err != nil {
		logger.LogError(err, "Failed to get participant by email", map[string]interface{}{
			"layer":     "service",
			"operation": "service.UpdateParticipantStatus",
			"error":     err,
		})
		retErr = err
		return retErr
	}
	var participantStatus bool
	var participantTap string
	if participant.Confirmed != nil {
		participantStatus = *participant.Confirmed
	}
	if participant.ParticipantType != nil {
		participantTap = *participant.ParticipantType
	}
	if participantStatus {
		logger.LogError(nil, "Participant already confirmed", map[string]interface{}{
			"layer":     "service",
			"operation": "service.UpdateParticipantStatus",
			"error":     "participant already confirmed",
			"email":     email,
		})
		retErr = fmt.Errorf("email %s is already confirmed", email)
		return retErr
	}
	if participant.ParticipantType == nil || participantTap != "delegate" {
		logger.LogError(nil, "Participant is not a delegate", map[string]interface{}{
			"layer":     "service",
			"operation": "service.UpdateParticipantStatus",
			"error":     "participant is not a delegate",
			"email":     email,
		})
		retErr = fmt.Errorf("email %s is not a delegate", email)
		return retErr
	}
	err = emailUtils.SendBiodataApprovalEmail(email)
	if err != nil {
		logger.LogError(err, "Failed to send biodata approval email", map[string]interface{}{
			"layer":     "service",
			"operation": "service.UpdateParticipantStatus",
			"error":     err,
		})
		retErr = err
		return retErr
	}
	err = s.adminRepo.UpdateDelegateStatus(email)
	if err != nil {
		logger.LogError(err, "Failed to update participant status", map[string]interface{}{
			"layer":     "service",
			"operation": "service.UpdateParticipantStatus",
			"error":     err,
		})
		retErr = err
		return retErr
	}
	return nil
}

func (s *adminService) UpdateDelegateCountryAndCouncil(country, council, delegateEmail string) error {
	participant, err := s.delegateRepo.GetDelegateByEmail(delegateEmail)
	if err != nil {
		logger.LogError(err, "Failed to get participant by email", map[string]interface{}{
			"layer":     "service",
			"operation": "service.UpdateDelegateCountryAndCouncil",
			"error":     err,
		})
		return err
	}

	var participantType, participantCountry, participantCouncil string
	var participantStatus bool

	// dereference the pointers
	if participant.ParticipantType != nil {
		participantType = *participant.ParticipantType
	}

	if participant.Confirmed != nil {
		participantStatus = *participant.Confirmed
	}

	if participant.Country != nil {
		participantCountry = *participant.Country
	}

	if participant.Council != nil {
		participantCouncil = *participant.Council
	}

	if !participantStatus {
		logger.LogError(nil, "Participant is not confirmed", map[string]interface{}{
			"layer":     "service",
			"operation": "service.UpdateDelegateCountryAndCouncil",
			"error":     "participant is not confirmed",
			"email":     delegateEmail,
		})
		return fmt.Errorf("email %s is not confirmed", delegateEmail)
	}
	if participantType != "delegate" {
		logger.LogError(nil, "Participant is not a delegate", map[string]interface{}{
			"layer":     "service",
			"operation": "service.UpdateDelegateCountryAndCouncil",
			"error":     "participant is not a delegate",
			"email":     delegateEmail,
		})
		return fmt.Errorf("email %s is not a delegate", delegateEmail)
	}
	if participantCountry != "" || participantCouncil != "" {
		logger.LogError(nil, "Participant already has a country and council", map[string]interface{}{
			"layer":     "service",
			"operation": "service.UpdateDelegateCountryAndCouncil",
			"error":     "participant already has the same country and council",
			"email":     delegateEmail,
		})
		return fmt.Errorf("email %s already has a country and council", delegateEmail)
	}
	err = s.adminRepo.UpdateDelegateCountryAndCouncil(country, council, delegateEmail)
	if err != nil {
		logger.LogError(err, "Failed to update delegate country and council", map[string]interface{}{
			"layer":     "service",
			"operation": "service.UpdateDelegateCountryAndCouncil",
			"error":     err,
		})
		return err
	}
	return nil
}

func (s *adminService) MakePairing(delegateEmail, pair string) (retErr error) {
	return utils.WithTransaction(s.adminRepo.DB(), func(tx *sqlx.Tx) error {
		err := s.adminRepo.UpdatePairing(tx, delegateEmail, pair)
		if err != nil {
			logger.LogError(err, "Failed to update pairing", map[string]interface{}{
				"layer":     "service",
				"operation": "service.MakePairing",
				"error":     err,
			})
			return err
		}

		logger.LogDebug("Making pairing", map[string]interface{}{
			"delegateEmail": delegateEmail,
			"pair":          pair,
			"layer":         "service",
			"operation":     "service.MakePairing",
		})

		return nil
	})
}

func (s *adminService) UpdatePaymentStatus(delegateEmail string) error {
	// Check if the payment exists
	payment, err := s.paymentRepo.GetPaymentByDelegateEmail(delegateEmail)
	if err != nil {
		logger.LogError(err, "Failed to get payment by delegate email", map[string]interface{}{"delegateEmail": delegateEmail, "layer": "service", "operation": "UpdatePaymentStatus"})
		return err
	}

	if payment.PaymentStatus == "paid" {
		logger.LogError(nil, "Payment already updated", map[string]interface{}{"delegateEmail": delegateEmail, "layer": "service", "operation": "UpdatePaymentStatus"})
		return fmt.Errorf("payment already updated for delegate email: %s", delegateEmail)
	}

	err = emailUtils.SendPaymentApprovalEmail(delegateEmail)
	if err != nil {
		logger.LogError(err, "Failed to send payment approval email", map[string]interface{}{"delegateEmail": delegateEmail, "layer": "service", "operation": "UpdatePaymentStatus"})
		return err
	}

	err = s.adminRepo.UpdatePaymentStatus(delegateEmail)
	if err != nil {
		logger.LogError(err, "Failed to update payment status", map[string]interface{}{"delegateEmail": delegateEmail, "layer": "service", "operation": "UpdatePaymentStatus"})
		return err
	}

	logger.LogDebug("Payment status updated successfully", map[string]interface{}{"delegateEmail": delegateEmail, "layer": "service", "operation": "UpdatePaymentStatus"})
	return nil
}

func (s *adminService) GetDelegateHealthResponses(delegateType string, limit, offset int) ([]delegateModel.HealthResponseWithQuestion, error) {
	responses, err := s.adminRepo.GetDelegateHealthResponses(delegateType, limit, offset)
	if err != nil {
		logger.LogError(err, "Failed to get delegate health responses", map[string]interface{}{"layer": "service", "operation": "GetDelegateHealthResponses"})
		return nil, err
	}

	// Modify file answers to be presigned URLs
	for i := range responses {
		if responses[i].HealthQuestionType == "file" {
			url, err := s.uploader.GeneratePresignedURL(responses[i].HealthAnswerText)
			if err != nil {
				logger.LogError(err, "Failed to generate presigned URL", map[string]interface{}{"key": responses[i].HealthAnswerText})
				responses[i].HealthAnswerText = "" // optionally skip this one or set it to empty
				continue                           // optionally skip this one or set it to empty
			}
			responses[i].HealthAnswerText = url
		}
	}

	logger.LogDebug("Delegate health responses retrieved and processed successfully", map[string]interface{}{"layer": "service", "operation": "GetDelegateHealthResponses"})
	return responses, nil
}

func (s *adminService) GetDelegateMUNResponses(delegateType string, limit, offset int) ([]delegateModel.MUNResponseWithQuestion, error) {
	responses, err := s.adminRepo.GetDelegateMUNResponses(delegateType, limit, offset)
	if err != nil {
		logger.LogError(err, "Failed to get delegate MUN responses", map[string]interface{}{"layer": "service", "operation": "GetDelegateMUNResponses"})
		return nil, err
	}

	// Modify file answers to be presigned URLs
	for i := range responses {
		if responses[i].MUNQuestionType == "file" {
			url, err := s.uploader.GeneratePresignedURL(responses[i].MUNAnswerText)
			if err != nil {
				logger.LogError(err, "Failed to generate presigned URL", map[string]interface{}{"key": responses[i].MUNAnswerText})
				responses[i].MUNAnswerText = "" // optionally skip this one or set it to empty
				continue                        // optionally skip this one or set it to empty
			}
			responses[i].MUNAnswerText = url
		}
	}

	logger.LogDebug("Delegate MUN responses retrieved and processed successfully", map[string]interface{}{"layer": "service", "operation": "GetDelegateMUNResponses"})
	return responses, nil
}

func (s *adminService) GetDelegateBiodataResponses(delegateType string, limit, offset int) ([]delegateModel.BiodataResponseWithQuestion, error) {
	responses, err := s.adminRepo.GetDelegateBiodataResponses(delegateType, limit, offset)
	if err != nil {
		logger.LogError(err, "Failed to get delegate biodata responses", map[string]interface{}{"layer": "service", "operation": "GetDelegateBiodataResponses"})
		return nil, err
	}

	// Modify file answers to be presigned URLs
	for i := range responses {
		if responses[i].BiodataQuestionType == "file" {
			url, err := s.uploader.GeneratePresignedURL(responses[i].BiodataAnswerText)
			if err != nil {
				logger.LogError(err, "Failed to generate presigned URL", map[string]interface{}{"key": responses[i].BiodataAnswerText})
				responses[i].BiodataAnswerText = "" // optionally skip this one or set it to empty
				continue                            // optionally skip this one or set it to empty
			}
			responses[i].BiodataAnswerText = url
		}
	}

	logger.LogDebug("Delegate biodata responses retrieved and processed successfully", map[string]interface{}{"layer": "service", "operation": "GetDelegateBiodataResponses"})
	return responses, nil
}

func (s *adminService) GetDelegatePaymentResponses(delegateType string, limit, offset int) ([]paymentModel.PaymentResponse, error) {
	payments, err := s.adminRepo.GetDelegatePaymentResponses(delegateType, limit, offset)
	if err != nil {
		logger.LogError(err, "Failed to get delegate payment responses", map[string]interface{}{"layer": "service", "operation": "GetDelegatePaymentResponses"})
		return nil, err
	}

	// Modify file answers to be presigned URLs
	for i := range payments {
		if payments[i].PaymentFile != "" {
			url, err := s.uploader.GeneratePresignedURL(payments[i].PaymentFile)
			if err != nil {
				logger.LogError(err, "Failed to generate presigned URL", map[string]interface{}{"key": payments[i].PaymentFile})
				payments[i].PaymentFile = "" // optionally skip this one or set it to empty
				continue                     // optionally skip this one or set it to empty
			}
			payments[i].PaymentFile = url
		}
	}

	logger.LogDebug("Delegate payment responses retrieved and processed successfully", map[string]interface{}{"layer": "service", "operation": "GetDelegatePaymentResponses"})
	return payments, nil
}

func (s *adminService) GetDelegates(delegateType string, limit, offset int) ([]delegateModel.MUNDelegates, error) {
	delegates, err := s.adminRepo.GetDelegates(delegateType, limit, offset)
	if err != nil {
		logger.LogError(err, "Failed to get delegates", map[string]interface{}{"layer": "service", "operation": "GetDelegates"})
		return nil, err
	}

	logger.LogDebug("Delegates retrieved successfully", map[string]interface{}{"layer": "service", "operation": "GetDelegates"})
	return delegates, nil
}
