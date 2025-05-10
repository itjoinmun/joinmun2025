package payment

import "time"

type Payment struct {
	PaymentID        int       `json:"payment_id" db:"payment_id" binding:"required"`
	MUNDelegateEmail string    `json:"mun_delegate_email" db:"mun_delegate_email" binding:"required,email"` // Changed from int to string
	Package          string    `json:"package" db:"package" binding:"omitempty"`
	PaymentFile      string    `json:"payment_file" db:"payment_file"`
	PaymentStatus    string    `json:"payment_status" db:"payment_status" binding:"omitempty,oneof=pending paid failed"`
	PaymentDate      time.Time `json:"payment_date" db:"payment_date"`
	PaymentAmount    int       `json:"payment_amount" db:"payment_amount" binding:"omitempty"`
}
