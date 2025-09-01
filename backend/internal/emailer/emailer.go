package emailer

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"os"
	"time"
)

// EmailService handles all email communication
type EmailService struct {
	apiKey      string
	defaultFrom string
	httpClient  *http.Client
}

// NewEmailService creates a new email service with configured client
func NewEmailService() (*EmailService, error) {
	apiKey := os.Getenv("BREVO_API_KEY")
	if apiKey == "" {
		return nil, errors.New("BREVO_API_KEY is missing")
	}

	return &EmailService{
		apiKey:      apiKey,
		defaultFrom: "JOINMUN 2025 <info@joinmun.id>",
		httpClient:  &http.Client{Timeout: 10 * time.Second},
	}, nil
}

// SendEmail is a helper function to send emails with timeout handling
func (s *EmailService) SendEmail(to, subject, htmlContent, textContent string) error {
	reqBody := map[string]interface{}{
		"sender": map[string]string{
			"name":  "JOINMUN 2025",
			"email": s.defaultFrom,
		},
		"to": []map[string]string{
			{"email": to},
		},
		"subject":     subject,
		"htmlContent": htmlContent,
		"textContent": textContent,
	}

	bodyBytes, err := json.Marshal(reqBody)
	if err != nil {
		return err
	}

	req, err := http.NewRequest("POST", "https://api.brevo.com/v3/smtp/email", bytes.NewBuffer(bodyBytes))
	if err != nil {
		return err
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("accept", "application/json")
	req.Header.Set("api-key", s.apiKey)

	resp, err := s.httpClient.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode >= 300 {
		return fmt.Errorf("brevo api error: %s", resp.Status)
	}

	return nil
}

func (s *EmailService) SendPasswordResetEmail(to, resetLink string) error {
	htmlBody := fmt.Sprintf(`
		<!DOCTYPE html>
		<html>
		<head>
			<title>Password Reset</title>
			<style> /* same CSS as before */ </style>
		</head>
		<body>
			<div class="container">
				<h2>Password Reset Request</h2>
				<p>We received a request to reset your password. Click the button below to set a new password:</p>
				<p><a class="button" href="%s">Reset Password</a></p>
				<p>If you didn't request this, please ignore this email or contact us on Instagram @joinmun.ugm.</p>
				<div class="footer">
					<p>Best regards,<br>JOINMUN 2025</p>
				</div>
			</div>
		</body>
		</html>`, resetLink)

	textBody := fmt.Sprintf("Click this link to reset your password: %s", resetLink)

	return s.SendEmail(to, "Password Reset Request - JOINMUN 2025", htmlBody, textBody)
}

// SendBiodataApprovalEmail sends biodata approval confirmation to user
func (s *EmailService) SendBiodataApprovalEmail(to string) error {
	// Create formatted HTML body
	htmlBody := `
		<!DOCTYPE html>
		<html>
		<head>
			<title>Biodata Approved</title>
			<style>
				.container {
					width: 100%;
					max-width: 500px;
					margin: 0 auto;
					padding: 20px;
					border-radius: 10px;
					box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
					font-family: Arial, sans-serif;
					background-color: #ffffff;
				}
				.header {
					color: #2E5984;
					text-align: center;
				}
				.content {
					margin: 20px 0;
					line-height: 1.5;
				}
				.next-steps {
					background-color: #f8f8f8;
					padding: 15px;
					border-radius: 5px;
					margin: 20px 0;
				}
				.footer {
					margin-top: 20px;
					font-size: 12px;
					color: #666;
					text-align: center;
				}
			</style>
		</head>
		<body>
			<div class="container">
				<h2 class="header">Biodata Approved!</h2>
				<div class="content">
					<p>Congratulations! Your biodata for JOINMUN 2025 has been approved.</p>
					<p>Your application is progressing well. Please continue with the next steps of the registration process.</p>
				</div>
				<div class="next-steps">
					<h3>Next Steps:</h3>
					<p>If you are registered as a delegation team, make sure all of your teammates has also been confirmed</p>
					<p>Please proceed with the payment to complete your registration. You can find payment details in your account dashboard.</p>
				</div>
				<div class="footer">
					<p>Best regards,<br>JOINMUN 2025 Organizing Committee</p>
					<p>If you have any questions, please contact us at <a href="mailto:eventjoinmun2025@gmail.com">eventjoinmun2025@gmail.com</a></p>
				</div>
			</div>
		</body>
		</html>`

	textBody := "Congratulations! Your biodata for JOINMUN 2025 has been approved. Please proceed with the payment to complete your registration."

	return s.SendEmail(to, "Biodata Approved - JOINMUN 2025", htmlBody, textBody)
}

// SendPaymentApprovalEmail sends payment approval confirmation to user
func (s *EmailService) SendPaymentApprovalEmail(to string) error {
	// Create formatted HTML body
	htmlBody := `
		<!DOCTYPE html>
		<html>
		<head>
			<title>Payment Approved</title>
			<style>
				.container {
					width: 100%;
					max-width: 500px;
					margin: 0 auto;
					padding: 20px;
					border-radius: 10px;
					box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
					font-family: Arial, sans-serif;
					background-color: #ffffff;
				}
				.header {
					color: #2E5984;
					text-align: center;
				}
				.content {
					margin: 20px 0;
					line-height: 1.5;
				}
				.confirmation {
					background-color: #eaf7ea;
					padding: 15px;
					border-radius: 5px;
					margin: 20px 0;
					border-left: 4px solid #5cb85c;
				}
				.footer {
					margin-top: 20px;
					font-size: 12px;
					color: #666;
					text-align: center;
				}
			</style>
		</head>
		<body>
			<div class="container">
				<h2 class="header">Payment Approved!</h2>
				<div class="content">
					<p>Great news! Your payment for JOINMUN 2025 has been verified and approved.</p>
					<p>Your registration is now complete. You are officially registered as a participant for JOINMUN 2025.</p>
				</div>
				<div class="confirmation">
					<h3>What's Next?</h3>
					<p>Please check the website regularly for updates about the event schedule, preparation materials, and other important information.</p>
				</div>
				<div class="footer">
					<p>Best regards,<br>JOINMUN 2025 Organizing Committee</p>
					<p>If you have any questions, please contact us at <a href="mailto:eventjoinmun2025@gmail.com">eventjoinmun2025@gmail.com</a></p>
				</div>
			</div>
		</body>
		</html>`

	textBody := "Great news! Your payment for JOINMUN 2025 has been verified and approved. Your registration is now complete. You are officially registered as a participant for JOINMUN 2025."

	return s.SendEmail(to, "Payment Approved - JOINMUN 2025", htmlBody, textBody)
}

func (s *EmailService) SendRejectionEmail(to string) error {
	// Create formatted HTML body
	htmlBody := `
		<!DOCTYPE html>
		<html>
		<head>
			<title>Registration Rejected</title>
			<style>
				.container {
					width: 100%;
					max-width: 500px;
					margin: 0 auto;
					padding: 20px;
					border-radius: 10px;
					box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
					font-family: Arial, sans-serif;
					background-color: #ffffff;
				}
				.header {
					color: #d9534f;
					text-align: center;
				}
				.content {
					margin: 20px 0;
					line-height: 1.5;
				}
				.footer {
					margin-top: 20px;
					font-size: 12px;
					color: #666;
					text-align: center;
				}
			</style>
		</head>
		<body>
			<div class="container">
				<h2 class="header">Registration Rejected</h2>
				<div class="content">
					<p>We regret to inform you that your registration for JOINMUN 2025 has been rejected.</p>
					<p>Unfortunately, your application did not meet the requirements for participation.</p>
				</div>
				<div class="footer">
					<p>Best regards,<br>JOINMUN 2025 Organizing Committee</p>
					<p>If you have any questions, please contact us at <a href="mailto:eventjoinmun2025@gmail.com">eventjoinmun2025@gmail.com</a></p>
				</div>
			</div>
		</body>
		</html>`

	textBody := "We regret to inform you that your registration for JOINMUN 2025 has been rejected. Unfortunately, your application did not meet the requirements for participation."

	return s.SendEmail(to, "Registration Rejected - JOINMUN 2025", htmlBody, textBody)
}

func (s *EmailService) SendPaymentFailureEmail(to string) error {
	// Create formatted HTML body
	htmlBody := `
		<!DOCTYPE html>
		<html>
		<head>
			<title>Payment Failed</title>
			<style>
				.container {
					width: 100%;
					max-width: 500px;
					margin: 0 auto;
					padding: 20px;
					border-radius: 10px;
					box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
					font-family: Arial, sans-serif;
					background-color: #ffffff;
				}
				.header {
					color: #d9534f;
					text-align: center;
				}
				.content {
					margin: 20px 0;
					line-height: 1.5;
				}
				.footer {
					margin-top: 20px;
					font-size: 12px;
					color: #666;
					text-align: center;
				}
			</style>
		</head>
		<body>
			<div class="container">
				<h2 class="header">Payment Failed</h2>
				<div class="content">
					<p>We regret to inform you that your payment for JOINMUN 2025 has failed.</p>
					<p>Please contact us for assistance.</p>
				</div>
				<div class="footer">
					<p>Best regards,<br>JOINMUN 2025 Organizing Committee</p>
					<p>If you have any questions, please contact us at <a href="mailto:eventjoinmun2025@gmail.com">eventjoinmun2025@gmail.com</a></p>
				</div>
			</div>
		</body>
		</html>`

	textBody := "We regret to inform you that your payment for JOINMUN 2025 has failed. Please contact us for assistance."

	return s.SendEmail(to, "Payment Failed - JOINMUN 2025", htmlBody, textBody)
}

func (s *EmailService) SendPaymentReminderEmail(to string) error {
	// Create formatted HTML body
	htmlBody := `
		<!DOCTYPE html>
		<html>
		<head>
			<title>Payment Reminder - JOINMUN 2025</title>
			<style>
				body {
					background-color: #f9f9f9;
					margin: 0;
					padding: 0;
					font-family: 'Arial', sans-serif;
					color: #1f1f1f;
				}
				.container {
					width: 100%;
					max-width: 600px;
					margin: 40px auto;
					padding: 30px;
					background-color: #ffffff;
					border-radius: 12px;
					box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
				}
				.header {
					color: #f0ad4e;
					text-align: center;
					font-size: 24px;
					font-weight: bold;
					margin-bottom: 20px;
				}
				.content {
					font-size: 15px;
					line-height: 1.7;
				}
				.content p {
					margin-bottom: 16px;
				}
				.highlight {
					background-color: #fff3d4;
					padding: 10px;
					border-left: 4px solid #f0ad4e;
					border-radius: 6px;
					margin: 16px 0;
				}
				.info {
					background-color: #f8f9fa;
					border-radius: 8px;
					padding: 12px 16px;
					margin: 16px 0;
					border-left: 4px solid #f0ad4e;
				}
				.footer {
					text-align: center;
					font-size: 13px;
					color: #777;
					margin-top: 30px;
				}
				a {
					color: #f0ad4e;
					text-decoration: none;
				}
			</style>
		</head>
		<body>
			<div class="container">
				<div class="content">
					<p>Dear JOINMUN 2025 Participants,</p>
					<p>We hope this message finds you well.</p>
					<p>Thank you for your enthusiasm and commitment to participating in Joinmun 2025. We are thrilled to have you join us.</p>
					<p>
					    To secure your place and ensure a smooth preparation process, we kindly urge you to finalize your payment and package selection as soon as possible. This is a friendly reminder that the deadline for selecting your preferred package (Accommodation or Non-accommodation) and completing your payment in
					</p>
					<div class="info">
						🗓  : August 9, 2025
						<br />
						🕒  : 11:59PM WIB
					</div>
					<p>Please be advised that your registration will be considered invalid and will be automatically canceled if payment and package selection are not completed by this deadline.</p>
					<p>Should you have any questions or require assistance, please do not hesitate to contact us.</p>
					<div class="info">
						Ticketing: +62 821-3495-5541 (Raras)<br>
						Accommodation: +62 813-9156-0441 (Rajwa)
					</div>
					<p>Thank you for your prompt attention, and we&apos;re excited to welcome you to <strong>JOINMUN 2025</strong>!</p>
					<p>Warm regards,<br><strong>⚜️JOINMUN 2025 Committee⚜️</strong></p>
				</div>
				<div class="footer">
					Need help? Contact us at <a href="https://instagram.com/joinmun.ugm/">@joinmun.ugm on Instagram</a>
				</div>
			</div>
		</body>
		</html>`

	textBody := "This is a friendly reminder that your payment for JOINMUN 2025 is due soon. Please ensure that you complete the payment to secure your registration."

	return s.SendEmail(to, "Payment Reminder - JOINMUN 2025", htmlBody, textBody)
}
