-- Drop the procedure if it exists to allow for re-creation during testing
DROP PROCEDURE IF EXISTS RegisterUser;

-- Drop the table if it exists
DROP TABLE IF EXISTS users;

-- 1. Create the Users Table
CREATE TABLE users (
id INT AUTO_INCREMENT PRIMARY KEY,
username VARCHAR(255) NOT NULL UNIQUE,
email VARCHAR(255) NOT NULL UNIQUE,
password_hash VARCHAR(255) NOT NULL,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Create the RegisterUser Stored Procedure
-- This procedure inserts a new user into the table.
-- It expects the hashed password, which is done in the Node.js backend code.
DELIMITER //

CREATE PROCEDURE RegisterUser(
IN p_username VARCHAR(255),
IN p_email VARCHAR(255),
IN p_password_hash VARCHAR(255)
)
BEGIN
INSERT INTO users (username, email, password_hash)
VALUES (p_username, p_email, p_password_hash);
END //

DELIMITER ;