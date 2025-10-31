const pool = require('../config/db'); // Assuming the path is correct

class User {
    
    /**
     * Creates a new user by calling the RegisterUser stored procedure.
     * @param {string} username 
     * @param {string} email 
     * @param {string} hashedPassword 
     * @returns {{success: boolean, message: string}}
     */
    static async create(username, email, hashedPassword) {
        // SQL query uses the 'password' column name as per your schema
        const sql = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
        
        try {
            // pool.query returns [results, fields]. We destructure to get the results.
            const [result] = await pool.query(sql, [username, email, hashedPassword]);

            // For INSERTs, we check affectedRows
            if (result.affectedRows === 1) {
                return { success: true, message: 'User created successfully' };
            } else {
                throw new Error("User creation failed or affected zero rows.");
            }

        } catch (error) {
            // Check for MySQL error code 1062 (Duplicate entry)
            if (error.code === 'ER_DUP_ENTRY' || error.errno === 1062) {
                throw new Error("Registration failed: Email or username already exists.");
            }

            console.error('Database Error during user creation:', error);
            throw error; 
        }
    }

    /**
     * Finds a user by their email address. Essential for the login process.
     * @param {string} email 
     * @returns {Promise<object | null>} The user object or null if not found.
     */
    static async findByEmail(email) {
        // FIX: Select 'id' and alias it as 'user_id' for consistency with uth.js
        // Also select 'password' and alias it as 'hashed_password'
        const sql = "SELECT id AS user_id, username, email, password AS hashed_password FROM users WHERE email = ?";
        
        try {
            // pool.query returns [rows, fields]. We destructure to get the rows.
            const [rows] = await pool.query(sql, [email]);
            
            // If rows exist, return the first one. Otherwise, return null.
            return rows.length > 0 ? rows[0] : null;

        } catch (error) {
            console.error('Database Error during user lookup:', error);
            throw error;
        }
    }
}

module.exports = User;