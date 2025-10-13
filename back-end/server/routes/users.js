const express = require('express');
const db = require('../config/db');
const router = express.Router();
const jwt = require('jsonwebtoken'); // ADDED: To decode the token
const { protect } = require('../middleware/authMiddleware'); // Import the middleware

// --- PROTECTED ROUTE ---
// @route   GET /api/users/profile
// @desc    Get logged-in user's profile
// @access  Private (uses the 'protect' middleware)
router.get('/profile', protect, (req, res) => {
  // The middleware already verified the token and attached the user to req.user.
  // We can decode the token again here (without verification) to get expiry details.
  const token = req.headers.authorization.split(' ')[1];
  const decodedToken = jwt.decode(token);

  const userDetails = {
    id: req.user.id,
    username: req.user.username,
    email: req.user.email,
    tokenIssuedAt: new Date(decodedToken.iat * 1000).toLocaleString(),
    tokenExpiresAt: new Date(decodedToken.exp * 1000).toLocaleString()
  };

  // Return the user details nested under a custom message
  res.status(200).json({
    message: "This is your Profile",
    users: userDetails
  });
});


// --- PUBLIC ROUTES ---

// @route   GET /api/users
// @desc    Get all users
// @access  Public
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, username, email FROM users');
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error while fetching users.' });
  }
});

// @route   GET /api/users/:id
// @desc    Get a single user by ID
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.query('SELECT id, username, email FROM users WHERE id = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }
        res.status(200).json(rows[0]);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ message: 'Server error while fetching user.' });
    }
});

// @route   PUT /api/users/:id
// @desc    Update a user's information
// @access  Public (should be protected in a real app)
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { username, email } = req.body;
        if (!username || !email) {
            return res.status(400).json({ message: 'Please provide username and email.' });
        }
        const [result] = await db.query('UPDATE users SET username = ?, email = ? WHERE id = ?', [username, email, id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }
        res.status(200).json({ id: parseInt(id), username, email });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Server error while updating user.' });
    }
});

// @route   DELETE /api/users/:id
// @desc    Delete a user
// @access  Public (should be protected in a real app)
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await db.query('DELETE FROM users WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }
        res.status(200).json({ message: 'User deleted successfully.' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Server error while deleting user.' });
    }
});

module.exports = router;

