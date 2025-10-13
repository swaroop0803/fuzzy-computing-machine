const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // 1. Get token from header
      token = req.headers.authorization.split(' ')[1];

      // 2. Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 3. Find user by email from the token's payload
      req.user = await User.findByEmail(decoded.email);

      // --- 4. CRITICAL FIX ADDED ---
      // If we decoded a valid token but that user no longer exists, reject the request.
      if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, user for this token no longer exists' });
      }

      // 5. Proceed to the protected route
      next();
    } catch (error) {
      console.error('Token verification error:', error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

module.exports = { protect };

