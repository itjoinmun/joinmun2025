package emailer

import (
	"context"
	"errors"
	"fmt"
	"os"
	"strconv"
	"time"

	"github.com/wneessen/go-mail"
)

// EmailService handles all email communication
type EmailService struct {
	mailer      *mail.Client
	defaultFrom string
}

// NewEmailService creates a new email service with configured client
func NewEmailService() (*EmailService, error) {
	// Validate SMTP credentials
	smtpUser := os.Getenv("BREVO_SMTP_USER")
	smtpPass := os.Getenv("BREVO_SMTP_PASS")
	smtpHost := os.Getenv("BREVO_SMTP_HOST")
	smtpPort := getSMTPPort()

	// Check if SMTP credentials are set
	if smtpUser == "" || smtpPass == "" || smtpHost == "" {
		return nil, errors.New("SMTP credentials are missing")
	}

	// Create a new mailer
	mailer, err := mail.NewClient(
		smtpHost,
		mail.WithPort(smtpPort),
		mail.WithSMTPAuth(mail.SMTPAuthPlain),
		mail.WithUsername(smtpUser),
		mail.WithPassword(smtpPass),
		mail.WithTLSPortPolicy(mail.TLSMandatory),
	)
	if err != nil {
		return nil, err
	}

	return &EmailService{
		mailer:      mailer,
		defaultFrom: "JOINMUN 2025 <info@joinmun.id>",
	}, nil
}

// SendEmail is a helper function to send emails with timeout handling
func (s *EmailService) SendEmail(msg *mail.Msg) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Make channel to wait for the email to be sent
	done := make(chan error, 1)

	// Send email in a goroutine
	go func() {
		done <- s.mailer.DialAndSend(msg)
	}()

	// Wait for the email to be sent or for a timeout
	select {
	case err := <-done:
		if err != nil {
			return fmt.Errorf("failed to send email: %w", err)
		}
	case <-ctx.Done():
		return errors.New("timeout reached while sending email")
	}

	return nil
}

// SendPasswordResetEmail sends password reset email to user
func (s *EmailService) SendPasswordResetEmail(to, resetLink string) error {
	msg := mail.NewMsg()
	if err := msg.From(s.defaultFrom); err != nil {
		return err
	}
	if err := msg.To(to); err != nil {
		return err
	}

	msg.Subject("Password Reset Request - JOINMUN")

	// Create a formatted HTML body
	htmlBody := fmt.Sprintf(`
		<!DOCTYPE html>
		<html>
		<head>
			<title>Password Reset</title>
			<style>
				.container {
					width: 100%%;
					max-width: 500px;
					margin: 0 auto;
					padding: 20px;
					border-radius: 10px;
					box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
					font-family: Arial, sans-serif;
					background-color: #ffffff;
				}
				.button {
					display: inline-block;
					padding: 12px 20px;
					margin: 20px 0;
					font-size: 16px;
					color: #fff;
					background-color: #007BFF;
					text-decoration: none;
					border-radius: 5px;
				}
				.footer {
					margin-top: 20px;
					font-size: 12px;
					color: #666;
				}
			</style>
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

	msg.SetBodyString(mail.TypeTextPlain, fmt.Sprintf("Click this link to reset your password: %s", resetLink))
	msg.SetBodyString(mail.TypeTextHTML, htmlBody)

	return s.SendEmail(msg)
}

// SendBiodataApprovalEmail sends biodata approval confirmation to user
func (s *EmailService) SendBiodataApprovalEmail(to string) error {
	// Override default sender for this email
	emailSender := "JOINMUN 2025 <noreply@joinmun.web.id>"

	msg := mail.NewMsg()
	if err := msg.From(emailSender); err != nil {
		return err
	}
	if err := msg.To(to); err != nil {
		return err
	}

	msg.Subject("Biodata Approval - JOINMUN 2025")

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
					<p>Please proceed with the payment to complete your registration. You can find payment details in your account dashboard.</p>
				</div>
				<div class="footer">
					<p>Best regards,<br>JOINMUN 2025 Organizing Committee</p>
					<p>If you have any questions, please contact us at <a href="mailto:eventjoinmun2025@gmail.com">eventjoinmun2025@gmail.com</a></p>
				</div>
			</div>
		</body>
		</html>`

	msg.SetBodyString(mail.TypeTextPlain, "Congratulations! Your biodata for JOINMUN 2025 has been approved. Please proceed with the payment to complete your registration.")
	msg.SetBodyString(mail.TypeTextHTML, htmlBody)

	return s.SendEmail(msg)
}

// SendPaymentApprovalEmail sends payment approval confirmation to user
func (s *EmailService) SendPaymentApprovalEmail(to string) error {
	msg := mail.NewMsg()
	if err := msg.From(s.defaultFrom); err != nil {
		return err
	}
	if err := msg.To(to); err != nil {
		return err
	}

	msg.Subject("Payment Approved - JOINMUN2025")

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
					<p>Please check your email regularly for updates about the event schedule, preparation materials, and other important information.</p>
				</div>
				<div class="footer">
					<p>Best regards,<br>JOINMUN 2025 Organizing Committee</p>
					<p>If you have any questions, please contact us at <a href="mailto:eventjoinmun2025@gmail.com">eventjoimun2025@gmail.com</a></p>
				</div>
			</div>
		</body>
		</html>`

	msg.SetBodyString(mail.TypeTextPlain, "Great news! Your payment for JOINMUN 2025 has been verified and approved. Your registration is now complete. You are officially registered as a participant for JOINMUN 2025.")
	msg.SetBodyString(mail.TypeTextHTML, htmlBody)

	return s.SendEmail(msg)
}

// Helper function to get SMTP port from environment
func getSMTPPort() int {
	port := os.Getenv("BREVO_SMTP_PORT")
	if port == "" {
		return 587
	}
	parsedPort, err := strconv.Atoi(port)
	if err != nil {
		return 587
	}
	return parsedPort
}
