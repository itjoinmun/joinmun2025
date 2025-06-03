package payment

import (
	paymentModel "backend/internal/model/payment"
	delegateRepo "backend/internal/repository/dashboard"
	paymentRepo "backend/internal/repository/payment"
	"backend/pkg/utils"
	"backend/pkg/utils/logger"
	"fmt"

	"github.com/jmoiron/sqlx"
)

type PaymentService interface {
	GetPaymentByDelegateEmail(delegateEmail string) (*paymentModel.PaymentWithTeamMembers, error)
	InsertPayment(payment *paymentModel.Payment) error
}

type paymentService struct {
	delegateRepo delegateRepo.DelegateRepo
	paymentRepo  paymentRepo.PaymentRepo
}

func NewPaymentService(delegateRepo delegateRepo.DelegateRepo, paymentRepo paymentRepo.PaymentRepo) PaymentService {
	return &paymentService{
		delegateRepo: delegateRepo,
		paymentRepo:  paymentRepo,
	}
}

func (s *paymentService) GetPaymentByDelegateEmail(delegateEmail string) (*paymentModel.PaymentWithTeamMembers, error) {
	payment, err := s.paymentRepo.GetPaymentWithTeamByDelegateEmail(delegateEmail)
	if err != nil {
		logger.LogError(err, "Failed to get payment with team by email", map[string]interface{}{"delegateEmail": delegateEmail, "layer": "service", "operation": "GetPaymentByDelegateEmail"})
		return nil, err
	}
	logger.LogDebug("Payment with team retrieved successfully", map[string]interface{}{"delegateEmail": delegateEmail, "layer": "service", "operation": "GetPaymentByDelegateEmail"})
	return payment, nil
}

func (s *paymentService) InsertPayment(payment *paymentModel.Payment) error {
	// check if user is already approved
	user, err := s.delegateRepo.GetDelegateByEmail(payment.MUNDelegateEmail)
	if err != nil {
		logger.LogError(err, "Failed to get user by email", map[string]interface{}{"delegateEmail": payment.MUNDelegateEmail, "layer": "service", "operation": "InsertPayment"})
		return err
	}
	if user == nil {
		logger.LogError(nil, "User not found", map[string]interface{}{"delegateEmail": payment.MUNDelegateEmail, "layer": "service", "operation": "InsertPayment"})
		return fmt.Errorf("user not found with email: %s", payment.MUNDelegateEmail)
	}

	var userConfirmedStatus string
	if user.Confirmed != nil {
		userConfirmedStatus = *user.Confirmed
	}

	if userConfirmedStatus != "confirmed" {
		logger.LogError(nil, "User not confirmed", map[string]interface{}{"delegateEmail": payment.MUNDelegateEmail, "layer": "service", "operation": "InsertPayment"})
		return fmt.Errorf("user not confirmed with email: %s", payment.MUNDelegateEmail)
	}

	// Check if the user has a participant type
	var participantType string
	if user.ParticipantType != nil {
		participantType = *user.ParticipantType
	} else {
		logger.LogError(nil, "Participant type is nil", map[string]interface{}{"delegateEmail": payment.MUNDelegateEmail, "layer": "service", "operation": "InsertPayment"})
		return fmt.Errorf("participant type is nil for user: %s", payment.MUNDelegateEmail)
	}

	// Handle team requirements based on participant type
	if participantType == "faculty_advisor" {
		// Faculty advisors must have a team
		teamID, err := s.delegateRepo.GetTeamIDByDelegateEmail(payment.MUNDelegateEmail)
		if err != nil {
			logger.LogError(err, "Failed to get team ID by delegate email", map[string]interface{}{"delegateEmail": payment.MUNDelegateEmail, "layer": "service", "operation": "InsertPayment"})
			return err
		}
		if teamID == "" {
			logger.LogError(nil, "Faculty advisor must join a team first", map[string]interface{}{"delegateEmail": payment.MUNDelegateEmail, "layer": "service", "operation": "InsertPayment"})
			return fmt.Errorf("faculty advisor must join a team first: %s", payment.MUNDelegateEmail)
		}
		payment.MUNTeamID = &teamID
	} else if participantType == "observer" {
		// Observers don't need a team
		payment.MUNTeamID = nil
	} else {
		// For other participant types, get team ID
		teamID, err := s.delegateRepo.GetTeamIDByDelegateEmail(payment.MUNDelegateEmail)
		if err != nil {
			logger.LogError(err, "Failed to get team ID by delegate email", map[string]interface{}{"delegateEmail": payment.MUNDelegateEmail, "layer": "service", "operation": "InsertPayment"})
			return err
		}
		payment.MUNTeamID = &teamID
	}

	return utils.WithTransaction(s.paymentRepo.DB(), func(tx *sqlx.Tx) error {
		// Insert the payment
		err := s.paymentRepo.UploadPayment(tx, payment)
		if err != nil {
			logger.LogError(err, "Failed to insert payment", map[string]interface{}{"delegateEmail": payment.MUNDelegateEmail, "layer": "service", "operation": "InsertPayment"})
			return err
		}
		logger.LogDebug("Payment inserted successfully", map[string]interface{}{"delegateEmail": payment.MUNDelegateEmail, "layer": "service", "operation": "InsertPayment"})
		return nil
	})
}
