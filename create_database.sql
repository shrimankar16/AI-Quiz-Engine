-- QuizForge Database Setup Script
-- Run this script to create the database and all tables

-- Create database
CREATE DATABASE IF NOT EXISTS quizforge CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Use the database
USE quizforge;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('student', 'teacher', 'admin') NOT NULL DEFAULT 'student',
    email_verified_at TIMESTAMP NULL,
    remember_token VARCHAR(100) NULL,
    deleted_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Exams table
CREATE TABLE IF NOT EXISTS exams (
    id INT AUTO_INCREMENT PRIMARY KEY,
    teacher_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NULL,
    duration_minutes SMALLINT UNSIGNED NOT NULL DEFAULT 60,
    passing_score TINYINT UNSIGNED NOT NULL DEFAULT 70,
    is_published BOOLEAN NOT NULL DEFAULT FALSE,
    leaderboard_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    shuffle_questions BOOLEAN NOT NULL DEFAULT FALSE,
    access_code VARCHAR(11) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_teacher (teacher_id),
    INDEX idx_access_code (access_code),
    INDEX idx_published (is_published)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Questions table
CREATE TABLE IF NOT EXISTS questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    exam_id INT NOT NULL,
    question VARCHAR(1000) NOT NULL,
    type ENUM('multiple_choice', 'true_false', 'short_answer') NOT NULL,
    options JSON NULL COMMENT 'For MCQ and True/False questions',
    correct_answer VARCHAR(500) NOT NULL,
    points TINYINT UNSIGNED NOT NULL DEFAULT 1,
    `order` INT UNSIGNED NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE,
    INDEX idx_exam (exam_id),
    INDEX idx_order (`order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Attempts table
CREATE TABLE IF NOT EXISTS attempts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    exam_id INT NOT NULL,
    user_id INT NOT NULL,
    answers JSON NULL COMMENT 'Student answers as JSON object',
    score TINYINT UNSIGNED NULL COMMENT 'Score percentage 0-100',
    results JSON NULL COMMENT 'Detailed grading results',
    started_at TIMESTAMP NOT NULL,
    completed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_exam (exam_id),
    INDEX idx_user (user_id),
    INDEX idx_completed (completed_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- AI Usages table
CREATE TABLE IF NOT EXISTS ai_usages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    provider VARCHAR(255) NOT NULL,
    model VARCHAR(255) NOT NULL,
    prompt_tokens INT UNSIGNED NOT NULL,
    completion_tokens INT UNSIGNED NOT NULL,
    cost DECIMAL(8, 4) NOT NULL COMMENT 'Cost in dollars',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    INDEX idx_user (user_id),
    INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Password Reset Tokens table
CREATE TABLE IF NOT EXISTS password_reset_tokens (
    email VARCHAR(255) PRIMARY KEY,
    token VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_token (token)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Prisma Migrations table (for Prisma tracking)
CREATE TABLE IF NOT EXISTS _prisma_migrations (
    id VARCHAR(36) PRIMARY KEY,
    checksum VARCHAR(64) NOT NULL,
    finished_at DATETIME(3) NULL,
    migration_name VARCHAR(255) NOT NULL,
    logs TEXT NULL,
    rolled_back_at DATETIME(3) NULL,
    started_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    applied_steps_count INT UNSIGNED NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert sample data (optional)
-- Sample teacher account (password: password123)
INSERT INTO users (name, email, password, role) VALUES 
('John Teacher', 'teacher@test.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIwnoK8KJm', 'teacher'),
('Jane Student', 'student@test.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIwnoK8KJm', 'student');

SELECT 'Database created successfully!' AS message;
SELECT 'Tables created: users, exams, questions, attempts, ai_usages, password_reset_tokens' AS info;
SELECT 'Sample accounts created:' AS accounts;
SELECT '  Teacher: teacher@test.com / password123' AS teacher_account;
SELECT '  Student: student@test.com / password123' AS student_account;
