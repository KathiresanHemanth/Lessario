import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Header() {
    const location = useLocation();
    const isHome = location.pathname === '/';
    const [menuOpen, setMenuOpen] = useState(false);
    
    const { user, logout } = useAuth();

    // Close menu on route change
    useEffect(() => {
        setMenuOpen(false);
    }, [location]);

    // Prevent body scroll when menu is open
    useEffect(() => {
        if (menuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [menuOpen]);

    const getLink = (hash) => {
        return isHome ? hash : `/${hash}`;
    };

    const handleNavClick = () => {
        setMenuOpen(false);
    };

    const handleLogout = () => {
        logout();
        handleNavClick();
    };

    return (
        <header>
            <div className="nav-container">
                <Link to="/" className="logo" onClick={handleNavClick}>
                    <img src="/favicon.svg" alt="Lessario Studios Logo" className="logo-img" />
                    LESSARIO STUDIOS
                </Link>

                {/* Hamburger Button — visible only on mobile via CSS */}
                <button
                    className={`hamburger ${menuOpen ? 'is-active' : ''}`}
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Toggle navigation menu"
                    aria-expanded={menuOpen}
                >
                    <span className="hamburger-line"></span>
                    <span className="hamburger-line"></span>
                    <span className="hamburger-line"></span>
                </button>

                {/* Overlay */}
                <div
                    className={`nav-overlay ${menuOpen ? 'is-active' : ''}`}
                    onClick={() => setMenuOpen(false)}
                ></div>

                {/* Navigation Links */}
                <nav className={`nav-links ${menuOpen ? 'is-open' : ''}`}>
                    <a href={getLink('#about')} onClick={handleNavClick}>Who We Are</a>
                    <a href={getLink('#services')} onClick={handleNavClick}>Services</a>
                    <a href={getLink('#destination-fury')} onClick={handleNavClick}>Projects</a>
                    <Link to="/blogs" onClick={handleNavClick}>News</Link>
                    <a href={getLink('#team')} onClick={handleNavClick}>Team</a>
                    <a href={getLink('#contact')} onClick={handleNavClick}>Contact</a>
                    
                    {/* Auth Section */}
                    <div style={{ 
                        margin: '0', 
                        padding: '0', 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '1rem',
                        borderLeft: '1px solid var(--border-color)',
                        paddingLeft: '1.5rem',
                        marginLeft: '0.5rem'
                    }} className="nav-auth-desktop">
                        {user ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)' }}>{user.name}</span>
                                <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: 'var(--accent-blue)', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', padding: '0' }}>Logout</button>
                            </div>
                        ) : (
                            <Link to="/login" className="btn" style={{ padding: '6px 16px', fontSize: '0.75rem' }}>Sign In</Link>
                        )}
                    </div>

                    {/* Mobile-only Auth Links */}
                    <div className="nav-auth-mobile">
                        {user ? (
                            <>
                                <div style={{ padding: '14px 0', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Logged in as: <strong>{user.name}</strong></div>
                                <a href="#" onClick={(e) => { e.preventDefault(); handleLogout(); }}>Logout</a>
                            </>
                        ) : (
                            <Link to="/login" onClick={handleNavClick}>Sign In</Link>
                        )}
                    </div>
                </nav>
            </div>
        </header>
    );
}
