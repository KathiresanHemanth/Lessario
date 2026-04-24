import React, { createContext, useState, useContext, useEffect } from 'react';

// Create the context
const AuthContext = createContext();

/**
 * AuthProvider
 * 
 * This component wraps your entire App and provides the 'auth state' to every component.
 * It handles login, signup, logout, and checking if the user is already logged in on refresh.
 */
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 1. Persist session on app load
    useEffect(() => {
        const checkUser = async () => {
            try {
                // We'll create this /me endpoint to check the JWT cookie
                const res = await fetch('/api/auth/me');
                const data = await res.json();
                
                if (res.ok) {
                    setUser(data.user);
                }
            } catch (err) {
                console.log('Session check failed:', err);
            } finally {
                setLoading(false);
            }
        };
        checkUser();
    }, []);

    // 2. Custom Login
    const login = async (email, password) => {
        setError(null);
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            
            if (!res.ok) throw new Error(data.error || 'Login failed');
            
            setUser(data.user);
            return { success: true };
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        }
    };

    // 3. Custom Signup
    const signup = async (name, email, password) => {
        setError(null);
        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            });
            const data = await res.json();
            
            if (!res.ok) throw new Error(data.error || 'Signup failed');
            
            setUser(data.user);
            return { success: true };
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        }
    };

    // 4. Google Login (accepts token from frontend Google button)
    const googleLogin = async (idToken) => {
        setError(null);
        try {
            const res = await fetch('/api/auth/google', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ idToken })
            });
            const data = await res.json();
            
            if (!res.ok) throw new Error(data.error || 'Google login failed');
            
            setUser(data.user);
            return { success: true };
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        }
    };

    // 5. Logout
    const logout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            setUser(null);
        } catch (err) {
            console.error('Logout failed:', err);
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            error,
            login,
            signup,
            googleLogin,
            logout,
            setError
        }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook for easier access to auth context
export const useAuth = () => useContext(AuthContext);
