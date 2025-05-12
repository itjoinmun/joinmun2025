package utils

import (
	"backend/pkg/utils/logger"
	"fmt"

	"github.com/jmoiron/sqlx"
)

func WithTransaction(db *sqlx.DB, operation func(tx *sqlx.Tx) error) error {
	tx, err := db.Beginx()
	if err != nil {
		logger.LogError(err, "Failed to begin transaction", nil)
		return fmt.Errorf("begin transaction: %w", err)
	}

	var opErr error
	defer func() {
		if opErr != nil {
			if rbErr := tx.Rollback(); rbErr != nil {
				logger.LogError(rbErr, "Failed to rollback transaction", nil)
			}
		} else {
			if commitErr := tx.Commit(); commitErr != nil {
				logger.LogError(commitErr, "Failed to commit transaction", nil)
				opErr = commitErr
			}
		}
	}()

	opErr = operation(tx)
	return opErr
}
