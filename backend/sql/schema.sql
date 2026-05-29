-- Blood Donor Emergency Finder - Database Schema (MySQL)
-- Updated with Professional System Roles and SQL Triggers

CREATE DATABASE IF NOT EXISTS blood_donor_db;
USE blood_donor_db;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('donor', 'admin', 'hospital', 'user', 'requester') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 2. Hospitals Table
CREATE TABLE IF NOT EXISTS hospitals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNIQUE,
    name VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    address TEXT,
    phone VARCHAR(20) NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 3. Inventory Table (Hospital Blood Bank)
CREATE TABLE IF NOT EXISTS inventory (
    id INT AUTO_INCREMENT PRIMARY KEY,
    hospital_id INT NOT NULL,
    blood_group VARCHAR(10) NOT NULL,
    units_available INT DEFAULT 0,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (hospital_id) REFERENCES hospitals(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 4. Blood Compatibility Lookup (Static)
CREATE TABLE IF NOT EXISTS blood_compatibility (
    donor_group VARCHAR(10) NOT NULL,
    recipient_group VARCHAR(10) NOT NULL,
    PRIMARY KEY (donor_group, recipient_group)
) ENGINE=InnoDB;

-- 5. Donors Table (Extends User)
CREATE TABLE IF NOT EXISTS donors (
    user_id INT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    blood_group VARCHAR(10) NOT NULL,
    city VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    available BOOLEAN DEFAULT TRUE,
    donation_count INT DEFAULT 0,
    last_donation DATE NULL,
    verified BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 6. Blood Requests Table
CREATE TABLE IF NOT EXISTS blood_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    requester_id INT NOT NULL,
    hospital_id INT NULL,
    patient_name VARCHAR(255) NOT NULL,
    blood_group VARCHAR(10) NOT NULL,
    hospital VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    units INT NOT NULL,
    urgency ENUM('critical', 'urgent', 'moderate', 'routine') NOT NULL,
    status ENUM('open', 'fulfilled', 'closed') DEFAULT 'open',
    contact_phone VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (requester_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (hospital_id) REFERENCES hospitals(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 7. Donations Table (History)
CREATE TABLE IF NOT EXISTS donations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    donor_id INT NOT NULL,
    request_id INT NULL,
    hospital_id INT NULL,
    hospital VARCHAR(255) NOT NULL,
    units INT NOT NULL,
    date DATE NOT NULL,
    FOREIGN KEY (donor_id) REFERENCES donors(user_id) ON DELETE CASCADE,
    FOREIGN KEY (request_id) REFERENCES blood_requests(id) ON DELETE SET NULL,
    FOREIGN KEY (hospital_id) REFERENCES hospitals(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 8. Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    type VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    related_id INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 9. Request Responses Table
CREATE TABLE IF NOT EXISTS request_responses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    request_id INT NOT NULL,
    donor_id INT NOT NULL,
    status ENUM('pending', 'confirmed', 'rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (request_id) REFERENCES blood_requests(id) ON DELETE CASCADE,
    FOREIGN KEY (donor_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 10. Audit Log Table
CREATE TABLE IF NOT EXISTS request_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    request_id INT,
    old_status VARCHAR(50),
    new_status VARCHAR(50),
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ─────────────────────────────────────────────────────────────────────────────
-- SQL TRIGGERS
-- ─────────────────────────────────────────────────────────────────────────────

DELIMITER //

-- Trigger 1: Automatically Update Donor Stats after a donation is confirmed
CREATE TRIGGER after_donation_insert
AFTER INSERT ON donations
FOR EACH ROW
BEGIN
    UPDATE donors 
    SET donation_count = donation_count + 1,
        last_donation = NEW.date
    WHERE user_id = NEW.donor_id;
END //

-- Trigger 2: Generate Critical Stock Alert Notification for Hospitals
CREATE TRIGGER inventory_stock_alert
AFTER UPDATE ON inventory
FOR EACH ROW
BEGIN
    IF NEW.units_available < 3 AND OLD.units_available >= 3 THEN
        INSERT INTO notifications (user_id, type, message)
        SELECT user_id, 'alert', CONCAT('CRITICAL: Your ', NEW.blood_group, ' blood stock is low (', NEW.units_available, ' units remaining). Please post a request.')
        FROM hospitals 
        WHERE id = NEW.hospital_id;
    END IF;
END //

-- Trigger 3: Audit Trail - Log every change in blood request status
CREATE TRIGGER after_request_status_update
AFTER UPDATE ON blood_requests
FOR EACH ROW
BEGIN
    IF OLD.status <> NEW.status THEN
        INSERT INTO request_logs (request_id, old_status, new_status)
        VALUES (NEW.id, OLD.status, NEW.status);
    END IF;
END //

DELIMITER ;

-- ─────────────────────────────────────────────────────────────────────────────
-- INDEXES & SEED DATA
-- ─────────────────────────────────────────────────────────────────────────────

CREATE INDEX idx_donors_city_blood ON donors(city, blood_group);
CREATE INDEX idx_requests_city_blood ON blood_requests(city, blood_group);
CREATE INDEX idx_requests_status ON blood_requests(status);

-- Seed Compatibility Data
INSERT IGNORE INTO blood_compatibility (donor_group, recipient_group) VALUES 
('O-', 'O-'), ('O-', 'O+'), ('O-', 'A-'), ('O-', 'A+'), ('O-', 'B-'), ('O-', 'B+'), ('O-', 'AB-'), ('O-', 'AB+'),
('O+', 'O+'), ('O+', 'A+'), ('O+', 'B+'), ('O+', 'AB+'),
('A-', 'A-'), ('A-', 'A+'), ('A-', 'AB-'), ('A-', 'AB+'),
('A+', 'A+'), ('A+', 'AB+'),
('B-', 'B-'), ('B-', 'B+'), ('B-', 'AB-'), ('B-', 'AB+'),
('B+', 'B+'), ('B+', 'AB+'),
('AB-', 'AB-'), ('AB-', 'AB+'),
('AB+', 'AB+');
