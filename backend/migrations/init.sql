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

-- Create Tables
CREATE TABLE IF NOT EXISTS mun_teams (
    mun_team_id VARCHAR(6) PRIMARY KEY,
    mun_team_lead VARCHAR(255) NOT NULL UNIQUE CHECK (mun_team_lead ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

CREATE TABLE IF NOT EXISTS mun_delegates (
    mun_delegate_email VARCHAR(255) PRIMARY KEY UNIQUE CHECK (mun_delegate_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    type VARCHAR(16) CHECK (type IN ('single_delegate', 'double_delegate')),
    council VARCHAR(8) CHECK (council IN ('UNWOMEN', 'WHO', 'UNSC', 'ECOFIN', 'CRISIS', 'BRICS+', 'Press')),
    country VARCHAR(255),
    pair VARCHAR(255),
    confirmed BOOLEAN DEFAULT FALSE,
    confirmed_date TIMESTAMP,
    council_date TIMESTAMP
);

CREATE TABLE IF NOT EXISTS mun_team_members (
    mun_team_id VARCHAR(6) REFERENCES mun_teams(mun_team_id),
    mun_delegate_email VARCHAR(255) REFERENCES mun_delegates(mun_delegate_email),
    PRIMARY KEY (mun_team_id, mun_delegate_email)
);

CREATE TABLE IF NOT EXISTS mun_faculty_advisors (
    mun_team_id VARCHAR(6) REFERENCES mun_teams(mun_team_id),
    faculty_advisor_email VARCHAR(255) CHECK (faculty_advisor_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    PRIMARY KEY (mun_team_id, faculty_advisor_email)
);

-- Questionnaire Tables
CREATE TABLE IF NOT EXISTS biodata_questions (
    biodata_question_id SERIAL PRIMARY KEY,
    biodata_question_type VARCHAR(16) CHECK (biodata_question_type IN ('file', 'dropdown', 'text')),
    biodata_question_text TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS biodata_responses (
    biodata_question_id INT REFERENCES biodata_questions(biodata_question_id),
    delegate_email VARCHAR(255) REFERENCES mun_delegates(mun_delegate_email),
    biodata_answer_text TEXT NOT NULL,
    PRIMARY KEY (biodata_question_id, delegate_email)
);

CREATE TABLE IF NOT EXISTS health_questions (
    health_question_id SERIAL PRIMARY KEY,
    health_question_type VARCHAR(16) CHECK (health_question_type IN ('file', 'dropdown', 'text')),
    health_question_text TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS health_responses (
    health_questions_id INT REFERENCES health_questions(health_question_id),
    delegate_email VARCHAR(255) REFERENCES mun_delegates(mun_delegate_email),
    health_answer_text TEXT NOT NULL,
    PRIMARY KEY (health_questions_id, delegate_email)
);

-- MUN Questions/Responses
CREATE TABLE IF NOT EXISTS mun_questions (
    mun_question_id SERIAL PRIMARY KEY,
    mun_question_type VARCHAR(16) CHECK (mun_question_type IN ('file', 'dropdown', 'text')),
    mun_question_text TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS mun_responses (
    delegate_email VARCHAR(255) REFERENCES mun_delegates(mun_delegate_email),
    mun_question_id INT REFERENCES mun_questions(mun_question_id),
    mun_answer_text TEXT NOT NULL,
    PRIMARY KEY (delegate_email, mun_question_id)
);

-- Additional Entities
CREATE TABLE IF NOT EXISTS position_paper (
    mun_delegate_email VARCHAR(255) PRIMARY KEY REFERENCES mun_delegates(mun_delegate_email),
    submission_file TEXT NOT NULL,
    submission_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    submission_status VARCHAR(8) NOT NULL CHECK (submission_status IN ('pending', 'accepted', 'rejected'))
);

CREATE TABLE IF NOT EXISTS observer (
    observer_email VARCHAR(255) PRIMARY KEY CHECK (observer_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    confirmed BOOLEAN DEFAULT FALSE,
    confirmed_date TIMESTAMP
);

CREATE TABLE IF NOT EXISTS faculty_advisor (
    faculty_advisor_email VARCHAR(255) PRIMARY KEY CHECK (faculty_advisor_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    confirmed BOOLEAN DEFAULT FALSE,
    confirmed_date TIMESTAMP
);

CREATE TABLE IF NOT EXISTS payment (
    payment_id SERIAL PRIMARY KEY,
    mun_delegate_email VARCHAR(255) REFERENCES mun_delegates(mun_delegate_email),
    package VARCHAR(255),
    payment_file TEXT,
    payment_status VARCHAR(7) CHECK (payment_status IN ('pending', 'paid', 'failed')),
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    payment_amount INT
);

-- Indexes for common lookup fields
CREATE INDEX idx_delegates_email ON mun_delegates(mun_delegate_email);
CREATE INDEX idx_teams_lead ON mun_teams(mun_team_lead);
CREATE INDEX idx_confirmed_dates ON mun_delegates(confirmed_date);
CREATE INDEX idx_payment_status ON payment(payment_status);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_refresh_token ON refresh_tokens(refresh_token);

INSERT INTO biodata_questions (biodata_question_id, biodata_question_type, biodata_question_text) VALUES
(1,  'text', 'Email address'),
(2,  'text', 'Full name'),
(3,  'file', 'Proof of Identification (berupa gambar kartu identitas)'),
(4,  'text', 'Institution'),
(5,  'text', 'Nationality'),
(6,  'dropdown', 'Gender'),
(7,  'text', 'Active Contact Number'),
(8,  'text', 'Line ID'),
(9,  'text', 'Street Address');

INSERT INTO mun_questions (mun_question_id, mun_question_type, mun_question_text) VALUES
(1,  'text', 'Previous MUN Experience'),
(2,  'dropdown', 'First preference council'),
(3,  'text', 'Reason of your first preference council'),
(4,  'text', 'First preference country (3 Country)'),
(5,  'dropdown', 'Second preference council'),
(6,  'text', 'Reason of your second preference council'),
(7,  'text', 'Second preference country (3 Country)'),
(8,  'dropdown', 'Third preference council'),
(9,  'text', 'Reason of your Third preference council'),
(10, 'text', 'Third preference country (3 Country)'),
(11, 'dropdown', 'Are you registrating for any double delegates council?'),
(12, 'text', 'Your Partner''s Email'),
(13, 'text', 'Your partner''s Name'),
(14, 'text', 'Your Partner''s Institution'),
(15, 'text', 'Emergency Contact');

INSERT INTO health_questions (health_question_id, health_question_type, health_question_text) VALUES
(1,  'text', 'Do you have any track record on your medical condition?'),
(2,  'text', 'At this moment, are you receiving any medical treatment?'),
(3,  'text', 'At this moment, are you consuming any medicine?'),
(4,  'text', 'Have you ever had specific medical issues? (e.g. Asthma, migraine, vertigo, TBC, etc.) If yes, please describe your condition most clearly.'),
(5,  'text', 'Are you registered with any insurance company (e.g., Askes, BPJS, etc)? (Please write the insurance name and number).'),
(6,  'text', 'Do you have a family history of any specific diseases? If yes, please describe.'),
(7,  'text', 'Are you currently taking any medications or supplements? If yes, please list them.'),
(8,  'text', 'Do you have any allergies to medication? If yes, please mention the medicament name.'),
(9,  'text', 'Are you allergic to specific conditions/objects (e.g., cold)?  If yes, please describe it specifically.'),
(10, 'text', 'Do you have any phobia, abstention, or other things you avoid?  If yes, please describe it specifically.'),
(11, 'text', 'At this moment, are you under mental counseling/therapy/assessment?  If yes, please describe your condition');

