package admin

import (
	"backend/internal/emailer"
	delegateModel "backend/internal/model/dashboard"
	paymentModel "backend/internal/model/payment"
	positionModel "backend/internal/model/position"
	adminRepo "backend/internal/repository/admin"
	delegateRepo "backend/internal/repository/dashboard"
	paymentRepo "backend/internal/repository/payment"
	"backend/internal/s3"
	"time"

	"backend/pkg/utils"
	"backend/pkg/utils/logger"
	"fmt"

	"github.com/jmoiron/sqlx"
)

// GroupedResponseItem defines a common interface for grouped responses.
type GroupedResponseItem interface {
	GetDelegateEmail() string
	GetAnswers() map[string]string
}

// GroupedDelegateBiodata holds grouped biodata responses for a delegate.
type GroupedDelegateBiodata struct {
	DelegateEmail string            `json:"delegate_email"`
	Answers       map[string]string `json:"answers"` // question_text -> answer (or presigned URL)
}

func (g GroupedDelegateBiodata) GetDelegateEmail() string      { return g.DelegateEmail }
func (g GroupedDelegateBiodata) GetAnswers() map[string]string { return g.Answers }

// GroupedDelegateHealth holds grouped health responses for a delegate.
type GroupedDelegateHealth struct {
	DelegateEmail string            `json:"delegate_email"`
	Answers       map[string]string `json:"answers"` // question_text -> answer (or presigned URL)
}

func (g GroupedDelegateHealth) GetDelegateEmail() string      { return g.DelegateEmail }
func (g GroupedDelegateHealth) GetAnswers() map[string]string { return g.Answers }

// GroupedDelegateMUN holds grouped MUN responses for a delegate.
type GroupedDelegateMUN struct {
	DelegateEmail string            `json:"delegate_email"`
	Answers       map[string]string `json:"answers"` // question_text -> answer (or presigned URL)
}

func (g GroupedDelegateMUN) GetDelegateEmail() string      { return g.DelegateEmail }
func (g GroupedDelegateMUN) GetAnswers() map[string]string { return g.Answers }

// AmalgamatedDelegateResponse holds combined responses for a delegate.
type AmalgamatedDelegateResponse struct {
	DelegateEmail string            `json:"delegate_email"`
	Answers       map[string]string `json:"answers"` // prefixed_question_text -> answer
}

func (a AmalgamatedDelegateResponse) GetDelegateEmail() string      { return a.DelegateEmail }
func (a AmalgamatedDelegateResponse) GetAnswers() map[string]string { return a.Answers }

type AdminService interface {
	UpdateParticipantStatus(email string) error
	UpdateDelegateCountryAndCouncil(country, council, delegateEmail string) error
	MakePairing(delegateEmail, pair string) error
	UpdatePaymentStatus(email string) error
	GetAmalgamatedResponses(delegateType string, limit, offset int) ([]AmalgamatedDelegateResponse, error)
	GetDelegatePaymentResponses(delegateType, timeWave string, limit, offset int) ([]paymentModel.PaymentResponseWithTeam, error)
	GetDelegates(delegateType string, limit, offset int) ([]delegateModel.MUNDelegates, error)
	GetPositionPapers(limit, offset int) ([]positionModel.PositionPaper, error)
}

type adminService struct {
	uploader     *s3.S3Uploader
	delegateRepo delegateRepo.DelegateRepo
	adminRepo    adminRepo.AdminRepo
	paymentRepo  paymentRepo.PaymentRepo
	emailer      *emailer.EmailService
}

func NewAdminService(uploader *s3.S3Uploader, adminRepo adminRepo.AdminRepo, delegateRepo delegateRepo.DelegateRepo, paymentRepo paymentRepo.PaymentRepo, emailer *emailer.EmailService) AdminService {
	return &adminService{
		uploader:     uploader,
		delegateRepo: delegateRepo,
		adminRepo:    adminRepo,
		paymentRepo:  paymentRepo,
		emailer:      emailer,
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
	err = s.emailer.SendBiodataApprovalEmail(email)
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

	err = s.emailer.SendPaymentApprovalEmail(delegateEmail)
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

func (s *adminService) GetAmalgamatedResponses(delegateType string, limit, offset int) ([]AmalgamatedDelegateResponse, error) {
	// Note: limit and offset are applied to each category fetch.
	// For true pagination over amalgamated results, a more complex query or post-fetch slicing would be needed.
	// This implementation fetches up to 'limit' from each category and then merges.

	biodata, err := s.adminRepo.GetDelegateBiodataResponses(delegateType, limit, offset)
	if err != nil {
		logger.LogError(err, "Failed to get biodata for amalgamation", map[string]interface{}{"layer": "service"})
		return nil, err
	}
	health, err := s.adminRepo.GetDelegateHealthResponses(delegateType, limit, offset)
	if err != nil {
		logger.LogError(err, "Failed to get health data for amalgamation", map[string]interface{}{"layer": "service"})
		return nil, err
	}
	mun, err := s.adminRepo.GetDelegateMUNResponses(limit, offset) // MUN responses are not filtered by delegateType in repo
	if err != nil {
		logger.LogError(err, "Failed to get MUN data for amalgamation", map[string]interface{}{"layer": "service"})
		return nil, err
	}

	amalgamatedMap := make(map[string]map[string]string) // delegate_email -> {prefixed_question: answer}

	processRawResponses := func(responses interface{}, prefix string) {
		switch rType := responses.(type) {
		case []delegateModel.BiodataResponseWithQuestion:
			for _, r := range rType {
				if _, ok := amalgamatedMap[r.DelegateEmail]; !ok {
					amalgamatedMap[r.DelegateEmail] = make(map[string]string)
				}
				answerText := r.BiodataAnswerText
				if r.BiodataQuestionType == "file" && r.BiodataAnswerText != "" {
					url, errPresign := s.uploader.GeneratePresignedURL(r.BiodataAnswerText, 8*time.Hour)
					if errPresign != nil {
						logger.LogError(errPresign, "Presign URL error", map[string]interface{}{"key": r.BiodataAnswerText})
						answerText = "Error generating URL"
					} else {
						answerText = url
					}
				}
				amalgamatedMap[r.DelegateEmail][prefix+r.BiodataQuestionText] = answerText
			}
		case []delegateModel.HealthResponseWithQuestion:
			for _, r := range rType {
				if _, ok := amalgamatedMap[r.DelegateEmail]; !ok {
					amalgamatedMap[r.DelegateEmail] = make(map[string]string)
				}
				answerText := r.HealthAnswerText
				amalgamatedMap[r.DelegateEmail][prefix+r.HealthQuestionText] = answerText
			}
		case []delegateModel.MUNResponseWithQuestion:
			for _, r := range rType {
				if _, ok := amalgamatedMap[r.DelegateEmail]; !ok {
					amalgamatedMap[r.DelegateEmail] = make(map[string]string)
				}
				answerText := r.MUNAnswerText
				amalgamatedMap[r.DelegateEmail][prefix+r.MUNQuestionText] = answerText
			}
		}
	}

	processRawResponses(biodata, "Biodata: ")
	processRawResponses(health, "Health: ")
	processRawResponses(mun, "MUN: ")

	var result []AmalgamatedDelegateResponse
	for email, answers := range amalgamatedMap {
		result = append(result, AmalgamatedDelegateResponse{
			DelegateEmail: email,
			Answers:       answers,
		})
	}

	logger.LogDebug("Amalgamated responses retrieved", map[string]interface{}{"count": len(result), "layer": "service"})
	return result, nil
}

func (s *adminService) GetDelegatePaymentResponses(delegateType, timeWave string, limit, offset int) ([]paymentModel.PaymentResponseWithTeam, error) {
	var startDate, endDate *time.Time

	switch timeWave {
	case "earlybird":
		start := time.Date(2024, 6, 16, 0, 0, 0, 0, time.UTC)
		end := time.Date(2024, 7, 14, 23, 59, 59, 0, time.UTC)
		startDate, endDate = &start, &end
	case "regularwave":
		start := time.Date(2024, 7, 28, 0, 0, 0, 0, time.UTC)
		end := time.Date(2024, 8, 24, 23, 59, 59, 0, time.UTC)
		startDate, endDate = &start, &end
	case "latewave":
		start := time.Date(2024, 9, 1, 0, 0, 0, 0, time.UTC)
		end := time.Date(2024, 9, 29, 23, 59, 59, 0, time.UTC)
		startDate, endDate = &start, &end
	default:
		// nil means no filter
		startDate, endDate = nil, nil
	}

	payments, err := s.adminRepo.GetDelegatePaymentResponsesWithTeam(delegateType, startDate, endDate, limit, offset)
	if err != nil {
		logger.LogError(err, "Failed to get delegate payment responses", map[string]interface{}{"layer": "service", "operation": "GetDelegatePaymentResponses"})
		return nil, err
	}

	for i := range payments {
		if payments[i].PaymentFile != "" {
			url, err := s.uploader.GeneratePresignedURL(payments[i].PaymentFile, 15*time.Minute)
			if err != nil {
				logger.LogError(err, "Failed to generate presigned URL", map[string]interface{}{"key": payments[i].PaymentFile})
				payments[i].PaymentFile = ""
				continue
			}
			payments[i].PaymentFile = url
		}
	}

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

func (s *adminService) GetPositionPapers(limit, offset int) ([]positionModel.PositionPaper, error) {
	positionPapers, err := s.adminRepo.GetPositionPapers(limit, offset)
	if err != nil {
		logger.LogError(err, "Failed to get position papers", map[string]interface{}{"layer": "service", "operation": "GetPositionPapers"})
		return nil, err
	}

	// Modify file answers to be presigned URLs
	for i := range positionPapers {
		if positionPapers[i].SubmissionFile != "" {
			url, err := s.uploader.GeneratePresignedURL(positionPapers[i].SubmissionFile, 15*time.Minute)
			if err != nil {
				logger.LogError(err, "Failed to generate presigned URL", map[string]interface{}{"key": positionPapers[i].SubmissionFile})
				positionPapers[i].SubmissionFile = "" // optionally skip this one or set it to empty
				continue                              // optionally skip this one or set it to empty
			}
			positionPapers[i].SubmissionFile = url
		}
	}
	logger.LogDebug("Position papers retrieved successfully", map[string]interface{}{"layer": "service", "operation": "GetPositionPapers"})
	return positionPapers, nil
}
