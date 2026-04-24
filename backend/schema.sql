-- ============================================
-- Performance Review System - Database Schema
-- Step 1: Run this in MySQL Workbench or CLI
-- ============================================

CREATE DATABASE IF NOT EXISTS performance_reviews;
USE performance_reviews;

-- ----------------------------------------
-- Table: users
-- Stores both admin and employee accounts
-- ----------------------------------------
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'employee') DEFAULT 'employee'
);

-- ----------------------------------------
-- Table: reviews
-- A review is created by an admin FOR an employee (reviewee)
-- ----------------------------------------
CREATE TABLE reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    reviewee_id INT NOT NULL,
    performance_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (reviewee_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ----------------------------------------
-- Table: feedback
-- Maps a reviewer (employee) to a review; stores their submitted feedback
-- ----------------------------------------
CREATE TABLE feedback (
    id INT AUTO_INCREMENT PRIMARY KEY,
    review_id INT NOT NULL,
    reviewer_id INT NOT NULL,
    feedback_text TEXT,
    is_submitted BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (review_id) REFERENCES reviews(id) ON DELETE CASCADE,
    FOREIGN KEY (reviewer_id) REFERENCES users(id) ON DELETE CASCADE
);
