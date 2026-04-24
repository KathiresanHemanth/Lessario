import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Protect Middleware
 * 
 * This runs before any "protected" route.
 * It reads the token from the cookie, verifies it, and attaches the
 * found user to the request object (req.user).
 */
export const protect = async (req, res, next) => {
    try {
        let token;

        // 1. Get token from cookie
        if (req.cookies.token) {
            token = req.cookies.token;
        }

        // 2. Check if token exists
        if (!token) {
            return res.status(401).json({ error: 'Not authorized, please login' });
        }

        // 3. Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 4. Get user from token and attach to request
        // We exclude the password for security
        req.user = await User.findById(decoded.id).select('-password');
        
        if (!req.user) {
            return res.status(401).json({ error: 'User no longer exists' });
        }

        next();
    } catch (error) {
        res.status(401).json({ error: 'Not authorized, invalid token' });
    }
};
