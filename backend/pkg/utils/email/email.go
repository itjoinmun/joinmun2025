package email

import (
	"context"
	"errors"
	"fmt"
	"os"
	"strconv"
	"time"

	"github.com/wneessen/go-mail"
)

func SendPasswordResetEmail(to, resetLink string) error {
	// Set the emailer configuration
	emailSender := "OmahTryOut <noreply-password-reset@omahti.web.id>"

	// Validate SMTP credentials
	smtpUser := os.Getenv("BREVO_SMTP_USER")
	smtpPass := os.Getenv("BREVO_SMTP_PASS")
	smtpHost := os.Getenv("BREVO_SMTP_HOST")
	smtpPort := getSMTPPort()

	// Check if SMTP credentials are set
	if smtpUser == "" || smtpPass == "" || smtpHost == "" {
		return errors.New("SMTP credentials are missing")
	}

	// create a new mailer
	mailer, err := mail.NewClient(
		smtpHost,
		mail.WithPort(smtpPort),
		mail.WithSMTPAuth(mail.SMTPAuthPlain),
		mail.WithUsername(smtpUser),
		mail.WithPassword(smtpPass),
		mail.WithTLSPortPolicy(mail.TLSMandatory),
	)
	if err != nil {
		return err
	}

	// Set the sender's email address,
	msg := mail.NewMsg()
	if err := msg.From(emailSender); err != nil {
		return err
	}
	if err := msg.To(to); err != nil {
		return err
	}

	msg.Subject("Password Reset Request - OmahTryOut")

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
				<p>If you didn’t request this, please ignore this email or contact us on Instagram @omahti_ugm.</p>
				<div class="footer">
					<p>Best regards,<br>OmahTI</p>
				</div>
			</div>
		</body>
		</html>`, resetLink)

	msg.SetBodyString(mail.TypeTextPlain, fmt.Sprintf("Click this link to reset your password: %s", resetLink))
	msg.SetBodyString(mail.TypeTextHTML, htmlBody)

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	// make channel to wait for the email to be sent, the channel will accept an error
	done := make(chan error, 1)
	// make a goroutine to send the email
	go func() {
		// send the email and send the result to the done channel
		done <- mailer.DialAndSend(msg)
	}()

	// wait for the email to be sent or for a timeout
	select {
	// if an error is received from the done channel, return the error
	case err := <-done:
		if err != nil {
			return errors.New("failed to send email")
		}
		// timeout reached, send an error
	case <-ctx.Done():
		return errors.New("timeout reached while sending email")
	}

	return nil
}

func SendBiodataApprovalEmail(to string) error {
	// Set the emailer configuration
	emailSender := "JoinMUN 2025 <noreply@joinmun.web.id>"

	// Validate SMTP credentials
	smtpUser := os.Getenv("BREVO_SMTP_USER")
	smtpPass := os.Getenv("BREVO_SMTP_PASS")
	smtpHost := os.Getenv("BREVO_SMTP_HOST")
	smtpPort := getSMTPPort()

	// Check if SMTP credentials are set
	if smtpUser == "" || smtpPass == "" || smtpHost == "" {
		return errors.New("SMTP credentials are missing")
	}

	// create a new mailer
	mailer, err := mail.NewClient(
		smtpHost,
		mail.WithPort(smtpPort),
		mail.WithSMTPAuth(mail.SMTPAuthPlain),
		mail.WithUsername(smtpUser),
		mail.WithPassword(smtpPass),
		mail.WithTLSPortPolicy(mail.TLSMandatory),
	)
	if err != nil {
		return err
	}

	// Set the sender's email address
	msg := mail.NewMsg()
	if err := msg.From(emailSender); err != nil {
		return err
	}
	if err := msg.To(to); err != nil {
		return err
	}

	msg.Subject("Biodata Approval - JoinMUN 2025")

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
					<p>Congratulations! Your biodata for JoinMUN 2025 has been approved.</p>
					<p>Your application is progressing well. Please continue with the next steps of the registration process.</p>
				</div>
				<div class="next-steps">
					<h3>Next Steps:</h3>
					<p>Please proceed with the payment to complete your registration. You can find payment details in your account dashboard.</p>
				</div>
				<div class="footer">
					<p>Best regards,<br>JoinMUN 2025 Organizing Committee</p>
					<p>If you have any questions, please contact us at <a href="mailto:joinmun@example.com">joinmun@example.com</a></p>
				</div>
			</div>
		</body>
		</html>`

	msg.SetBodyString(mail.TypeTextPlain, "Congratulations! Your biodata for JoinMUN 2025 has been approved. Please proceed with the payment to complete your registration.")
	msg.SetBodyString(mail.TypeTextHTML, htmlBody)

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	// make channel to wait for the email to be sent, the channel will accept an error
	done := make(chan error, 1)
	// make a goroutine to send the email
	go func() {
		// send the email and send the result to the done channel
		done <- mailer.DialAndSend(msg)
	}()

	// wait for the email to be sent or for a timeout
	select {
	// if an error is received from the done channel, return the error
	case err := <-done:
		if err != nil {
			return errors.New("failed to send biodata approval email")
		}
		// timeout reached, send an error
	case <-ctx.Done():
		return errors.New("timeout reached while sending biodata approval email")
	}

	return nil
}

func SendPaymentApprovalEmail(to string) error {
	// Set the emailer configuration
	emailSender := "JoinMUN 2025 <noreply@joinmun.web.id>"

	// Validate SMTP credentials
	smtpUser := os.Getenv("BREVO_SMTP_USER")
	smtpPass := os.Getenv("BREVO_SMTP_PASS")
	smtpHost := os.Getenv("BREVO_SMTP_HOST")
	smtpPort := getSMTPPort()

	// Check if SMTP credentials are set
	if smtpUser == "" || smtpPass == "" || smtpHost == "" {
		return errors.New("SMTP credentials are missing")
	}

	// create a new mailer
	mailer, err := mail.NewClient(
		smtpHost,
		mail.WithPort(smtpPort),
		mail.WithSMTPAuth(mail.SMTPAuthPlain),
		mail.WithUsername(smtpUser),
		mail.WithPassword(smtpPass),
		mail.WithTLSPortPolicy(mail.TLSMandatory),
	)
	if err != nil {
		return err
	}

	// Set the sender's email address
	msg := mail.NewMsg()
	if err := msg.From(emailSender); err != nil {
		return err
	}
	if err := msg.To(to); err != nil {
		return err
	}

	msg.Subject("Payment Approved - JoinMUN 2025")

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
					<p>Great news! Your payment for JoinMUN 2025 has been verified and approved.</p>
					<p>Your registration is now complete. You are officially registered as a participant for JoinMUN 2025.</p>
				</div>
				<div class="confirmation">
					<h3>What's Next?</h3>
					<p>Please check your email regularly for updates about the event schedule, preparation materials, and other important information.</p>
				</div>
				<div class="footer">
					<p>Best regards,<br>JoinMUN 2025 Organizing Committee</p>
					<p>If you have any questions, please contact us at <a href="mailto:joinmun@example.com">joinmun@example.com</a></p>
				</div>
			</div>
		</body>
		</html>`

	msg.SetBodyString(mail.TypeTextPlain, "Great news! Your payment for JoinMUN 2025 has been verified and approved. Your registration is now complete. You are officially registered as a participant for JoinMUN 2025.")
	msg.SetBodyString(mail.TypeTextHTML, htmlBody)

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	// make channel to wait for the email to be sent, the channel will accept an error
	done := make(chan error, 1)
	// make a goroutine to send the email
	go func() {
		// send the email and send the result to the done channel
		done <- mailer.DialAndSend(msg)
	}()

	// wait for the email to be sent or for a timeout
	select {
	// if an error is received from the done channel, return the error
	case err := <-done:
		if err != nil {
			return errors.New("failed to send payment approval email")
		}
		// timeout reached, send an error
	case <-ctx.Done():
		return errors.New("timeout reached while sending payment approval email")
	}

	return nil
}

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
