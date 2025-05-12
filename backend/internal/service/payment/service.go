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
	GetPaymentByDelegateEmail(delegateEmail string) (*paymentModel.Payment, error)
	InsertPayment(payment *paymentModel.Payment) error
	UpdatePaymentStatus(delegateEmail string) error
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

func (s *paymentService) GetPaymentByDelegateEmail(delegateEmail string) (*paymentModel.Payment, error) {
	payment, err := s.paymentRepo.GetPaymentByDelegateEmail(delegateEmail)
	if err != nil {
		logger.LogError(err, "Failed to get payment by delegate email", map[string]interface{}{"delegateEmail": delegateEmail, "layer": "service", "operation": "GetPaymentByDelegateEmail"})
		return nil, err
	}
	logger.LogDebug("Payment retrieved successfully", map[string]interface{}{"delegateEmail": delegateEmail, "layer": "service", "operation": "GetPaymentByDelegateEmail"})
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

	var userConfirmed bool
	if user.Confirmed != nil {
		userConfirmed = *user.Confirmed
	}

	if !userConfirmed {
		logger.LogError(nil, "User not confirmed", map[string]interface{}{"delegateEmail": payment.MUNDelegateEmail, "layer": "service", "operation": "InsertPayment"})
		return fmt.Errorf("user not confirmed with email: %s", payment.MUNDelegateEmail)
	}
	// Check if the payment already exists
	existingPayment, err := s.paymentRepo.GetPaymentByDelegateEmail(payment.MUNDelegateEmail)
	if err != nil {
		logger.LogError(err, "Failed to check existing payment", map[string]interface{}{"delegateEmail": payment.MUNDelegateEmail, "layer": "service", "operation": "InsertPayment"})
		return err
	}

	if existingPayment != nil {
		return fmt.Errorf("payment already exists for delegate email: %s", payment.MUNDelegateEmail)
	}

	return utils.WithTransaction(s.paymentRepo.DB(), func(tx *sqlx.Tx) error {
		// Insert the payment
		_, err := s.paymentRepo.MakeInitialPayment(tx, payment, payment.MUNDelegateEmail)
		if err != nil {
			logger.LogError(err, "Failed to insert payment", map[string]interface{}{"delegateEmail": payment.MUNDelegateEmail, "layer": "service", "operation": "InsertPayment"})
			return err
		}
		logger.LogDebug("Payment inserted successfully", map[string]interface{}{"delegateEmail": payment.MUNDelegateEmail, "layer": "service", "operation": "InsertPayment"})
		return nil
	})
}

func (s *paymentService) UpdatePaymentStatus(delegateEmail string) error {
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

	err = s.paymentRepo.UpdatePaymentStatus(delegateEmail)
	if err != nil {
		logger.LogError(err, "Failed to update payment status", map[string]interface{}{"delegateEmail": delegateEmail, "layer": "service", "operation": "UpdatePaymentStatus"})
		return err
	}

	logger.LogDebug("Payment status updated successfully", map[string]interface{}{"delegateEmail": delegateEmail, "layer": "service", "operation": "UpdatePaymentStatus"})
	return nil
}
