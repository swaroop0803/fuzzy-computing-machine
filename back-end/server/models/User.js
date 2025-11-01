const pool = require('../config/db'); // Assuming the path is correct

class User {
    
    /**
     * Creates a new user by inserting into the users table.
     * @param {string} username 
     * @param {string} email 
     * @param {string} hashedPassword 
     * @returns {{success: boolean, message: string}}
     */
    static async create(username, email, hashedPassword) {
        // ✅ Use 'password_hash' (not 'password')
        const sql = "INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)";
        
        try {
            const [result] = await pool.query(sql, [username, email, hashedPassword]);

            if (result.affectedRows === 1) {
                return { success: true, message: 'User created successfully' };
            } else {
                throw new Error("User creation failed or affected zero rows.");
            }

        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY' || error.errno === 1062) {
                throw new Error("Registration failed: Email or username already exists.");
            }

            console.error('Database Error during user creation:', error);
            throw error; 
        }
    }

    /**
     * Finds a user by their email address.
     * @param {string} email 
     * @returns {Promise<object | null>} The user object or null if not found.
     */
    static async findByEmail(email) {
        // ✅ Use 'password_hash' instead of 'password'
        const sql = `
            SELECT 
                id AS user_id, 
                username, 
                email, 
                password_hash AS hashed_password 
            FROM users 
            WHERE email = ?
        `;
        
        try {
            const [rows] = await pool.query(sql, [email]);
            return rows.length > 0 ? rows[0] : null;

        } catch (error) {
            console.error('Database Error during user lookup:', error);
            throw error;
        }
    }
}

module.exports = User;
