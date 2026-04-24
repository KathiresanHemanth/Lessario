import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';

/**
 * ================================
 *  LESSARIO STUDIOS — API SERVER
 * ================================
 * 
 * This is the entry point for the Node.js backend.
 * 
 * WHAT EACH DEPENDENCY DOES:
 * - express:       Web framework — handles HTTP requests and routing
 * - cors:          Cross-Origin Resource Security — allows the React frontend to talk to this server
 * - helmet:        Security headers — protects against common attacks (XSS, clickjacking, etc.)
 * - express-rate-limit:  Brute-force protection — limits how many requests an IP can make
 * - cookie-parser: Reads cookies from incoming requests (used for JWT auth tokens)
 * - dotenv:        Loads .env file into process.env so we can access secrets safely
 */

// ─── Load environment variables ───
dotenv.config();

// ─── Initialize Express ───
const app = express();


// ═══════════════════════════════════
//  MIDDLEWARE (runs on every request)
// ═══════════════════════════════════

/**
 * 1. HELMET — Security Headers
 * 
 * Automatically sets headers like:
 * - X-Content-Type-Options: nosniff    (prevents MIME type sniffing)
 * - X-Frame-Options: DENY              (prevents clickjacking via iframes)
 * - Strict-Transport-Security          (forces HTTPS)
 * - ...and more
 */
app.use(helmet());


/**
 * 2. CORS — Cross-Origin Resource Sharing
 * 
 * Without this, the browser would BLOCK requests from your React app
 * (running on localhost:5173) to this server (running on localhost:5000)
 * because they're on different ports = different "origins".
 * 
 * We restrict 'origin' to only allow YOUR frontend URL.
 * 'credentials: true' allows cookies to be sent cross-origin (needed for JWT).
 */
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true    // Allow cookies to be sent with requests
}));


/**
 * 3. RATE LIMITER — Brute-Force Protection
 * 
 * Limits each IP address to 100 requests per 15-minute window.
 * If someone tries to spam your API (e.g., guessing passwords),
 * they'll get a 429 "Too Many Requests" error after 100 attempts.
 */
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,  // 15 minutes
    max: 100,                   // 100 requests per window per IP
    message: {
        error: 'Too many requests from this IP. Please try again after 15 minutes.'
    },
    standardHeaders: true,      // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false        // Disable the `X-RateLimit-*` headers
});
app.use(limiter);


/**
 * 4. BODY PARSERS — Read JSON and Cookie Data
 * 
 * express.json():  Parses incoming JSON request bodies (e.g., { email: "...", password: "..." })
 *                  The 'limit' prevents someone from sending a massive payload to crash the server.
 * cookieParser():  Parses Cookie headers so we can read auth tokens from req.cookies
 */
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());


// ═══════════════════════════════
//  ROUTES
// ═══════════════════════════════

/**
 * Health check endpoint
 * 
 * A simple endpoint that returns 200 OK.
 * Useful for monitoring services (like Uptime Robot) to verify the server is alive.
 * Also great for testing that your server is running locally.
 */
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        message: 'Lessario Studios API is running',
        timestamp: new Date().toISOString()
    });
});

// Auth routes
app.use('/api/auth', authRoutes);


// ═══════════════════════════════
//  START SERVER
// ═══════════════════════════════

const PORT = process.env.PORT || 5000;

/**
 * STARTUP SEQUENCE:
 * 1. Connect to MongoDB first (if it fails, the server won't start)
 * 2. Then start listening for HTTP requests
 * 
 * This ensures we never serve requests without a database connection.
 */
const startServer = async () => {
    await connectDB();

    app.listen(PORT, () => {
        console.log(`\n🚀 Lessario API Server running on http://localhost:${PORT}`);
        console.log(`📋 Health check: http://localhost:${PORT}/api/health`);
        console.log(`🔗 Frontend URL: ${process.env.CLIENT_URL || 'http://localhost:5173'}\n`);
    });
};

startServer();
