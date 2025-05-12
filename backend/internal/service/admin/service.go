package admin

import (
	adminRepo "backend/internal/repository/admin"
	delegateRepo "backend/internal/repository/dashboard"
	paymentRepo "backend/internal/repository/payment"
	"backend/pkg/utils"
	"backend/pkg/utils/logger"
	"fmt"

	"github.com/jmoiron/sqlx"
)

type AdminService interface {
	UpdateParticipantStatus(email string) error
	UpdateDelegateCountryAndCouncil(country, council, delegateEmail string) error
	MakePairing(delegateEmail, pair string) error
	UpdatePaymentStatus(email string) error
}

type adminService struct {
	delegateRepo delegateRepo.DelegateRepo
	adminRepo    adminRepo.AdminRepo
	paymentRepo  paymentRepo.PaymentRepo
}

func NewAdminService(adminRepo adminRepo.AdminRepo, delegateRepo delegateRepo.DelegateRepo, paymentRepo paymentRepo.PaymentRepo) AdminService {
	return &adminService{
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

	err = s.adminRepo.UpdatePaymentStatus(delegateEmail)
	if err != nil {
		logger.LogError(err, "Failed to update payment status", map[string]interface{}{"delegateEmail": delegateEmail, "layer": "service", "operation": "UpdatePaymentStatus"})
		return err
	}

	logger.LogDebug("Payment status updated successfully", map[string]interface{}{"delegateEmail": delegateEmail, "layer": "service", "operation": "UpdatePaymentStatus"})
	return nil
}
