CREATE TABLE IF NOT EXISTS users(
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(72) NOT NULL,
    role VARCHAR(50) CHECK (role IN ('admin', 'user')) NOT NULL,
    reset_token VARCHAR(255),
    reset_token_expiry TIMESTAMP
);

CREATE TABLE IF NOT EXISTS refresh_tokens (
    refresh_token_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    refresh_token VARCHAR(255) NOT NULL,
    expiry TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    revoked BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_refresh_token ON refresh_tokens(refresh_token);
