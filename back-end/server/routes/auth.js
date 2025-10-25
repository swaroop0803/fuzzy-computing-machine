/**
 * Authentication Routes (e.g., /routes/auth.js)
 * This file handles both registration and login endpoints.
 */

const router = require('express').Router();
const User = require('../models/User'); // Your User model
const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken'); // Will be used for actual JWT signing later
const saltRounds = 10;

// Placeholder for a secret key (replace this with a real environment variable later)
const JWT_SECRET = 'your_super_secret_key_that_is_long_and_random'; 

// --- 1. REGISTER ROUTE ---
// POST /api/register
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        // Hash the password before storing it
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Call the User model's create function
        await User.create(username, email, hashedPassword);

        // Send a successful response (201 Created). 
        return res.status(201).json({ message: 'Registration successful. Please log in.' });

    } catch (error) {
        // Handle the specific 'Duplicate entry' error (MySQL error 1062)
        if (error.message.includes("Email or username already exists")) {
            return res.status(409).json({ message: error.message });
        }
        
        // Handle other database or server errors
        console.error('Registration error:', error.message);
        return res.status(500).json({ message: 'Internal server error during registration.' });
    }
});

// --- 2. LOGIN ROUTE ---
// POST /api/login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    try {
        // 1. Find the user by email using the model
        const user = await User.findByEmail(email);

        // 2. Check if user exists
        if (!user) {
            // Use 401 Unauthorized for security (don't reveal if email or password was wrong)
            return res.status(401).json({ message: 'Invalid credentials.' }); 
        }

        // 3. Compare the submitted password with the stored hash
        const isMatch = await bcrypt.compare(password, user.hashed_password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        // 4. Successful Login: Create a JWT token
        // NOTE: This uses a simple string placeholder. Replace with actual JWT signing later.
        // const token = jwt.sign({ userId: user.user_id }, JWT_SECRET, { expiresIn: '1h' });
        const token = `placeholder_token_for_user_${user.user_id}`; // Placeholder token

        // 5. Send success response with token and username
        return res.status(200).json({ 
            message: 'Login successful.',
            token,
            username: user.username // Send username for frontend display
        });

    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ message: 'Internal server error during login.' });
    }
});

module.exports = router;