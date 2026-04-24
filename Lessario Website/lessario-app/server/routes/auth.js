import express from 'express';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const router = express.Router();

/**
 * GET /api/auth/me
 * 
 * Returns the currently logged in user profile.
 * Protected by JWT verify middleware.
 */
router.get('/me', protect, async (req, res) => {
    res.json({
        success: true,
        user: req.user
    });
});

/**
 * UTILITY: Generate JWT Token
 * 
 * We sign the token with the User's ID and our secret key.
 * Expiry is set to 7 days.
 */
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '7d'
    });
};

/**
 * POST /api/auth/register
 * 
 * Registers a new user with email and password.
 */
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // 1. Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ error: 'User already exists with this email' });
        }

        // 2. Create user (Hashing happens automatically in User model pre-save hook)
        const user = await User.create({
            name,
            email,
            password,
            provider: 'local'
        });

        // 3. Generate token and set cookie
        const token = generateToken(user._id);

        res.cookie('token', token, {
            httpOnly: true,                  // Prevents JavaScript from reading the cookie (XSS protection)
            secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production
            sameSite: 'strict',              // Protects against CSRF
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        // 4. Return user info (excluding password)
        res.status(201).json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                provider: user.provider
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * POST /api/auth/login
 * 
 * Verifies credentials and issues a cookie.
 */
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Find user and explicitly select password (since we excluded it by default in schema)
        const user = await User.findOne({ email }).select('+password');

        if (!user || user.provider !== 'local') {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // 2. Verify password using the method we defined in User.js
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // 3. Generate token and set cookie
        const token = generateToken(user._id);

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                provider: user.provider
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * POST /api/auth/logout
 * 
 * Clears the auth cookie.
 */
router.post('/logout', (req, res) => {
    res.cookie('token', '', {
        httpOnly: true,
        expires: new Date(0) // Expire immediately
    });
    res.json({ success: true, message: 'Logged out successfully' });
});

/**
 * POST /api/auth/google
 * 
 * Verifies a Google ID Token from the frontend.
 */
router.post('/google', async (req, res) => {
    try {
        const { idToken } = req.body;

        // 1. Verify Google token server-side
        const ticket = await client.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID
        });
        const { sub: providerId, name, email, picture: avatar } = ticket.getPayload();

        // 2. Find or create user
        let user = await User.findOne({ email });

        if (!user) {
            // New user via Google
            user = await User.create({
                name,
                email,
                avatar,
                provider: 'google',
                providerId
            });
        } else if (user.provider !== 'google') {
            // Existing local/apple user trying to login via Google
            return res.status(400).json({ error: `Account exists via ${user.provider}. Please use that login method.` });
        }

        // 3. Generate token and set cookie
        const token = generateToken(user._id);

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                provider: user.provider
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
