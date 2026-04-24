import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const { signup, googleLogin, error, setError } = useAuth();
    const navigate = useNavigate();

    // ─── Initialize Google Sign-In ───
    useEffect(() => {
        /* global google */
        if (window.google) {
            google.accounts.id.initialize({
                client_id: "651379318187-g13l4vfmugn6a9jar33eoaapj87i2lgq.apps.googleusercontent.com",
                callback: handleGoogleCallback
            });

            google.accounts.id.renderButton(
                document.getElementById("googleSignUpButton"),
                { theme: "outline", size: "large", width: "100%", text: "signup_with", shape: "circle" }
            );
        }
    }, []);

    const handleGoogleCallback = async (response) => {
        setIsSubmitting(true);
        const result = await googleLogin(response.credential);
        if (result.success) {
            navigate('/');
        }
        setIsSubmitting(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (password !== confirmPassword) {
            return setError('Passwords do not match');
        }

        setIsSubmitting(true);
        const result = await signup(name, email, password);
        
        if (result.success) {
            navigate('/');
        }
        setIsSubmitting(false);
    };

    return (
        <div style={{ paddingTop: '120px', minHeight: '100vh', backgroundColor: 'var(--bg-page)', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '1rem 2rem' }}>
            <div className="card" style={{ maxWidth: '440px', width: '100%', padding: '3rem 2.5rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <img src="/favicon.svg" alt="Lessario Logo" style={{ height: '48px', marginBottom: '1rem' }} />
                    <h1 style={{ fontSize: '2rem', fontWeight: 600, letterSpacing: '-0.03em', marginBottom: '0.5rem' }}>Join Lessario</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Create your studio collaborator account</p>
                </div>

                {error && (
                    <div style={{ backgroundColor: '#fff2f2', color: '#ff3b30', padding: '12px 16px', borderRadius: '12px', fontSize: '0.9rem', marginBottom: '1.5rem', border: '1px solid rgba(255,59,48,0.1)' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1rem' }}>
                        <input
                            type="text"
                            placeholder="Full Name"
                            value={name}
                            onChange={(e) => { setName(e.target.value); setError(null); }}
                            required
                            style={{
                                width: '100%', padding: '14px 18px', borderRadius: '12px', border: '1px solid var(--border-color)',
                                backgroundColor: 'var(--bg-page)', fontSize: '1rem', outline: 'none',
                                boxSizing: 'border-box'
                            }}
                        />
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => { setEmail(e.target.value); setError(null); }}
                            required
                            style={{
                                width: '100%', padding: '14px 18px', borderRadius: '12px', border: '1px solid var(--border-color)',
                                backgroundColor: 'var(--bg-page)', fontSize: '1rem', outline: 'none',
                                boxSizing: 'border-box'
                            }}
                        />
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => { setPassword(e.target.value); setError(null); }}
                            required
                            style={{
                                width: '100%', padding: '14px 18px', borderRadius: '12px', border: '1px solid var(--border-color)',
                                backgroundColor: 'var(--bg-page)', fontSize: '1rem', outline: 'none',
                                boxSizing: 'border-box'
                            }}
                        />
                    </div>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => { setConfirmPassword(e.target.value); setError(null); }}
                            required
                            style={{
                                width: '100%', padding: '14px 18px', borderRadius: '12px', border: '1px solid var(--border-color)',
                                backgroundColor: 'var(--bg-page)', fontSize: '1rem', outline: 'none',
                                boxSizing: 'border-box'
                            }}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn"
                        style={{ width: '100%', padding: '14px', marginBottom: '1.5rem' }}
                    >
                        {isSubmitting ? 'Creating account...' : 'Create Account'}
                    </button>
                </form>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '1.5rem 0', color: 'var(--text-muted)' }}>
                    <div style={{ height: '1px', flex: 1, backgroundColor: 'var(--border-color)' }}></div>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>OR</span>
                    <div style={{ height: '1px', flex: 1, backgroundColor: 'var(--border-color)' }}></div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                    <div id="googleSignUpButton" style={{ width: '100%' }}></div>
                    
                    <button
                        className="btn btn-outline"
                        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', borderColor: 'var(--border-color)' }}
                    >
                        <svg width="18" height="18" viewBox="0 0 384 512" fill="currentColor"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-31.4-79-114.7-14.7-151.4zM245.7 34c-22.8 31.2-17 73 16.2 103.4 31.4-23.5 18.4-78.3-16.2-103.4z"></path></svg>
                        Sign up with Apple
                    </button>
                </div>

                <div style={{ textAlign: 'center', marginTop: '2.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    Already have an account? <Link to="/login" style={{ color: 'var(--accent-blue)', textDecoration: 'none', fontWeight: 600 }}>Sign in</Link>
                </div>
            </div>
        </div>
    );
}
