CREATE DATABASE IF NOT EXISTS performance_reviews;
USE performance_reviews;


CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'employee') DEFAULT 'employee'
);


CREATE TABLE reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    reviewee_id INT NOT NULL,
    performance_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (reviewee_id) REFERENCES users(id) ON DELETE CASCADE
);


CREATE TABLE feedback (
    id INT AUTO_INCREMENT PRIMARY KEY,
    review_id INT NOT NULL,
    reviewer_id INT NOT NULL,
    feedback_text TEXT,
    is_submitted BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (review_id) REFERENCES reviews(id) ON DELETE CASCADE,
    FOREIGN KEY (reviewer_id) REFERENCES users(id) ON DELETE CASCADE
);
