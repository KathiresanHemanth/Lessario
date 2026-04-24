import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

/**
 * User Schema
 * 
 * This defines the shape of every user document in MongoDB.
 * 
 * FIELDS:
 * - name:       Display name (required for all users)
 * - email:      Unique identifier — indexed for fast lookups. Stored lowercase.
 * - password:   Hashed with bcrypt. Only required for 'local' provider (email/password signups).
 *               OAuth users (Google/Apple) won't have a password.
 * - provider:   How the user signed up — 'local', 'google', or 'apple'
 * - providerId: The unique ID from the OAuth provider (Google/Apple user ID)
 * - avatar:     Profile picture URL (populated from OAuth or set manually)
 * - createdAt:  Auto-set timestamp
 */
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        maxlength: [50, 'Name cannot exceed 50 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,      // Always store emails in lowercase
        trim: true,
        match: [
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            'Please provide a valid email address'
        ]
    },
    password: {
        type: String,
        minlength: [8, 'Password must be at least 8 characters'],
        select: false          // IMPORTANT: Never return password in queries by default
    },
    provider: {
        type: String,
        enum: ['local', 'google', 'apple'],
        default: 'local'
    },
    providerId: {
        type: String,
        default: null
    },
    avatar: {
        type: String,
        default: null
    }
}, {
    timestamps: true           // Adds createdAt and updatedAt automatically
});


/**
 * PRE-SAVE HOOK — Password Hashing
 * 
 * This runs automatically BEFORE every .save() call.
 * 
 * HOW BCRYPT WORKS:
 * 1. bcrypt.genSalt(12) generates a random salt with 12 rounds of computation
 *    - Higher rounds = slower hashing = harder to brute-force
 *    - 12 rounds takes ~250ms, which is intentional (makes attacks expensive)
 * 2. bcrypt.hash() combines the salt with the password to produce a one-way hash
 * 3. The original plaintext password is NEVER stored — only the hash
 * 
 * The `isModified('password')` check ensures we only re-hash when the password
 * actually changes, not on every save (e.g., when updating a user's name).
 */
userSchema.pre('save', async function (next) {
    // Only hash if the password field was modified (or is new)
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(12);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});


/**
 * INSTANCE METHOD — comparePassword()
 * 
 * Used during login to verify a plaintext password against the stored hash.
 * 
 * HOW IT WORKS:
 * bcrypt.compare() takes the plaintext password, applies the same salt
 * (which is embedded in the hash string), and checks if the result matches.
 * This means we never need to decrypt the hash — it's a one-way comparison.
 * 
 * Returns: true if password matches, false otherwise
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};


const User = mongoose.model('User', userSchema);

export default User;
