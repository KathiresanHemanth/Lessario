import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import useScrollReveal from '../hooks/useScrollReveal';
import blogs from '../data/blogs';

export default function Home() {
    useScrollReveal();

    // To implement safe SPA scrolling
    useEffect(() => {
        if (window.location.hash) {
            const elmnt = document.getElementById(window.location.hash.substring(1));
            if (elmnt) elmnt.scrollIntoView({ behavior: 'smooth' });
        } else {
            window.scrollTo(0, 0);
        }
    }, []);

    return (
        <div className="lessario-wrapper">
            {/* Hero Section */}
            <section className="hero">
                <h1>Dynamic Game Co-Production<br />& Creative Studio</h1>
                <p>Specializing in primary PC game development, immersive VR simulators, high-end 3D animation, and strategic VFX directly from Chennai, India.</p>
                <a href="#contact" className="btn">Collaborate With Us</a>
                <a href="#training" className="btn btn-outline" style={{ marginLeft: '10px' }}>Explore Courses</a>
            </section>

            {/* About Section */}
            <section id="about" className="section">
                <h2 className="section-title">Who We Are</h2>
                <div className="about-content">
                    <div className="about-text">
                        <p>Founded in 2024, Lessario Studios is a dynamic co-production and service-based studio operating out of Chennai. We are heavily focused on PC Game Development, VR Simulation, and advanced VFX pipelines, bringing imagination to life through interactive media.</p>
                        <p>Our portfolio includes primary PC game development with <strong><a href="https://zorbagames.com" target="_blank" rel="noreferrer" style={{ color: 'var(--accent-blue)', textDecoration: 'none' }}>Zorba Games</a></strong> (publishing the acclaimed "Destination Fury"), enterprise VR training simulators for <strong><a href="https://ivwtech.com" target="_blank" rel="noreferrer" style={{ color: 'var(--accent-blue)', textDecoration: 'none' }}>IVW Tech</a></strong>, and strategic final VFX contributions for Upendra's <strong>UI Movie</strong> alongside our talented team.</p>
                    </div>
                    <div>
                        <div className="stat-box">
                            <h3>Our Scale</h3>
                            <p>A thriving team of 11-50 employees, including over 40 dedicated professionals spanning diverse creative disciplines.</p>
                        </div>
                        <div className="stat-box">
                            <h3>Collaborations</h3>
                            <p>Proud partners on major projects including <a href="https://kingdomscollidemobile.com/" target="_blank" rel="noreferrer" style={{ color: 'var(--accent-blue)', textDecoration: 'none' }}><strong>Kingdoms Collide</strong></a> with Silverglint Games, <a href="https://oceaninteraction.com" target="_blank" rel="noreferrer" style={{ color: 'var(--accent-blue)', textDecoration: 'none' }}><strong>Ocean Interactions</strong></a>, "Pied Pipers", and advanced gambling game frameworks. Trusted by corporate partners like <a href="https://aaga.one" target="_blank" rel="noreferrer" style={{ color: 'var(--accent-blue)', textDecoration: 'none' }}><strong>Aaga Tech</strong></a> and <a href="https://www.wsdigitech.co.in/" target="_blank" rel="noreferrer" style={{ color: 'var(--accent-blue)', textDecoration: 'none' }}><strong>Winn Pvt Ltd</strong></a>.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section id="services" className="section" style={{ backgroundColor: '#f5f5f7', maxWidth: '100%', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
                <div style={{ maxWidth: '980px', margin: '0 auto' }}>
                    <h2 className="section-title">Creative & Technical Services</h2>
                    <div className="grid">
                        <div className="card">
                            <h3>PC Games & B2B VR Training</h3>
                            <p>Specializing in primary PC games and custom B2B Virtual Reality training simulators. From "Destination Fury" co-productions to IVW Tech corporate frameworks, we build immersive interactive software.</p>
                        </div>
                        <div className="card">
                            <h3>3D Animation & VFX</h3>
                            <p>Delivering theatrical grade 3D production modeling, animation, and final post-effects, as seen in our collaborative VFX pipeline for Upendra's major motion picture, UI Movie.</p>
                        </div>
                        <div className="card">
                            <h3>Commercial & AI Ads</h3>
                            <p>Harnessing the power of AI to generate dynamic video and image animations. We craft striking 3D commercials and AI-driven interactive ads for modern brands.</p>
                        </div>
                        <div className="card">
                            <h3>Specialized Game Ecosystems</h3>
                            <p>Building mechanical and systemic frameworks ranging from advanced <a href="https://oceaninteraction.com" target="_blank" rel="noreferrer" style={{ color: 'var(--accent-blue)', textDecoration: 'none' }}>Ocean Interactions</a> logic and <a href="https://kingdomscollidemobile.com/" target="_blank" rel="noreferrer" style={{ color: 'var(--accent-blue)', textDecoration: 'none' }}>Kingdoms Collide</a> features to robust architectures for the Gambling games industry.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Project Section */}
            <section id="destination-fury" className="section">
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: 600, letterSpacing: '0.05em', color: 'var(--accent-blue)', textTransform: 'uppercase' }}>Featured Title</span>
                    <h2 style={{ fontSize: '3.5rem', fontWeight: 600, letterSpacing: '-0.04em', color: 'var(--text-main)', marginTop: '0.5rem', marginBottom: '1rem' }}>Destination Fury</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '700px', margin: '0 auto' }}>Co-produced alongside our partners at Zorba Studios, experience our upcoming 3D action-adventure available on mobile and PC.</p>
                </div>
                
                <div className="about-content" style={{ gap: '4rem', alignItems: 'flex-start' }}>
                    <div className="about-text">
                        <p style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>Control mighty animal heroes—Osun the bear, Kato the cat, or Mongo the monkey—as you battle an evil crow sorcerer manipulating giants to seize the world's sacred water reserves.</p>
                        
                        <ul style={{ listStyle: 'none', padding: 0, marginBottom: '2.5rem' }}>
                            <li style={{ marginBottom: '1.2rem', display: 'flex', alignItems: 'flex-start' }}>
                                <span style={{ color: 'var(--accent-blue)', fontSize: '1.2rem', marginRight: '12px' }}>✦</span>
                                <span><strong>Dynamic Combat:</strong> Visceral melee combat with unique hero abilities, character leveling, and coin-based weapon upgrades.</span>
                            </li>
                            <li style={{ marginBottom: '1.2rem', display: 'flex', alignItems: 'flex-start' }}>
                                <span style={{ color: 'var(--accent-blue)', fontSize: '1.2rem', marginRight: '12px' }}>✦</span>
                                <span><strong>Epic Exploration:</strong> Traverse 5 vast themed environments (including radiation and pollution zones) uncovering hidden treasures.</span>
                            </li>
                            <li style={{ marginBottom: '1.2rem', display: 'flex', alignItems: 'flex-start' }}>
                                <span style={{ color: 'var(--accent-blue)', fontSize: '1.2rem', marginRight: '12px' }}>✦</span>
                                <span><strong>Gaming for Good:</strong> A portion of all in-game purchases directly supports Amazon rainforest charities.</span>
                            </li>
                        </ul>
                        
                        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                            <a href="https://apps.apple.com/in/app/destinationfury/id6741739288" target="_blank" rel="noreferrer" className="btn">App Store</a>
                            <a href="https://play.google.com/store/apps/details?id=com.ZorbaStudios.destinationfury" target="_blank" rel="noreferrer" className="btn">Google Play</a>
                            <a href="https://www.youtube.com/watch?v=WESnB2CAoQY" target="_blank" rel="noreferrer" className="btn btn-outline">Watch Trailer</a>
                        </div>
                    </div>
                    
                    <div className="media-card" style={{ background: 'var(--bg-card)', borderRadius: '20px', boxShadow: '0 4px 24px rgba(0,0,0,0.04)', padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ width: '100%', aspectRatio: '16/9', borderRadius: '12px', overflow: 'hidden', position: 'relative', backgroundColor: '#1a1a1a' }}>
                            <a href="https://www.youtube.com/watch?v=-XtwKLkGNy4" target="_blank" rel="noreferrer" style={{ display: 'block', width: '100%', height: '100%', textDecoration: 'none' }}>
                                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '64px', height: '64px', backgroundColor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.2s ease' }}>
                                    <div style={{ width: 0, height: 0, borderTop: '10px solid transparent', borderBottom: '10px solid transparent', borderLeft: '16px solid white', marginLeft: '5px' }}></div>
                                </div>
                                <div style={{ position: 'absolute', bottom: '15px', width: '100%', textAlign: 'center', color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '2px' }}>GAMEPLAY OVERVIEW</div>
                            </a>
                        </div>
                        <div style={{ paddingTop: '2rem', paddingBottom: '1rem', textAlign: 'center' }}>
                            <h3 style={{ fontSize: '1.3rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.5rem', letterSpacing: '-0.01em' }}>Action-Packed Combat</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Experience intense 3D offline action (~597MB). No internet required to save the environment.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Project Section 2 */}
            <section id="kingdoms-collide" className="section" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '6rem', marginTop: '2rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: 600, letterSpacing: '0.05em', color: 'var(--accent-blue)', textTransform: 'uppercase' }}>Co-Production Spotlight</span>
                    <h2 style={{ fontSize: '3.5rem', fontWeight: 600, letterSpacing: '-0.04em', color: 'var(--text-main)', marginTop: '0.5rem', marginBottom: '1rem' }}>Kingdoms Collide Mobile</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '700px', margin: '0 auto' }}>A real-time multiplayer strategy experience set in a medieval fantasy world, developed with our partners at Silverglint Gaming Ltd.</p>
                </div>
                
                <div className="about-content" style={{ gap: '4rem', alignItems: 'flex-start' }}>
                    <div className="media-card" style={{ background: 'var(--bg-card)', borderRadius: '20px', boxShadow: '0 4px 24px rgba(0,0,0,0.04)', padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ width: '100%', aspectRatio: '16/9', borderRadius: '12px', overflow: 'hidden', position: 'relative', backgroundColor: '#1a1a1a' }}>
                            <a href="https://kingdomscollidemobile.com" target="_blank" rel="noreferrer" style={{ display: 'block', width: '100%', height: '100%', textDecoration: 'none' }}>
                                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '64px', height: '64px', backgroundColor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.2s ease' }}>
                                    <span style={{ fontSize: '1.5rem', color: '#ffffff' }}>⚔️</span>
                                </div>
                                <div style={{ position: 'absolute', bottom: '15px', width: '100%', textAlign: 'center', color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '2px' }}>VISIT OFFICIAL SITE</div>
                            </a>
                        </div>
                        <div style={{ paddingTop: '2rem', paddingBottom: '1rem', textAlign: 'center' }}>
                            <h3 style={{ fontSize: '1.3rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.5rem', letterSpacing: '-0.01em' }}>Competitive Multiplayer</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Join competitive tournaments and outmaneuver your opponents.</p>
                        </div>
                    </div>

                    <div className="about-text">
                        <p style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>Create heroes and command minions to conquer lanes and destroy the enemy castle in real-time strategic warfare.</p>
                        
                        <ul style={{ listStyle: 'none', padding: 0, marginBottom: '2.5rem' }}>
                            <li style={{ marginBottom: '1.2rem', display: 'flex', alignItems: 'flex-start' }}>
                                <span style={{ color: 'var(--accent-blue)', fontSize: '1.2rem', marginRight: '12px' }}>✦</span>
                                <span><strong>Strategic Depth:</strong> Deploy custom minion configurations with unique lane-shifting mechanics.</span>
                            </li>
                            <li style={{ marginBottom: '1.2rem', display: 'flex', alignItems: 'flex-start' }}>
                                <span style={{ color: 'var(--accent-blue)', fontSize: '1.2rem', marginRight: '12px' }}>✦</span>
                                <span><strong>Hero Spells:</strong> Traverse the map to collect shields and unleash devastating hero abilities to turn the tide.</span>
                            </li>
                            <li style={{ marginBottom: '1.2rem', display: 'flex', alignItems: 'flex-start' }}>
                                <span style={{ color: 'var(--accent-blue)', fontSize: '1.2rem', marginRight: '12px' }}>✦</span>
                                <span><strong>Legacy IP:</strong> Evolved from an iconic PC prototype into an ambitious cross-platform mobile titan.</span>
                            </li>
                        </ul>
                        
                        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                            <a href="https://apps.apple.com/us/app/kingdoms-collide-mobile/id6446848751" target="_blank" rel="noreferrer" className="btn">App Store</a>
                            <a href="https://play.google.com/store/apps/details?id=com.kc.kingdomscollide" target="_blank" rel="noreferrer" className="btn">Google Play</a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Training Section */}
            <section id="training" className="section">
                <h2 className="section-title">Training Programs</h2>
                <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '3rem', maxWidth: '800px', marginLeft: 'auto', marginRight: 'auto' }}>We offer comprehensive training programs designed for businesses, students, and individuals looking to break into the creative tech industry.</p>
                <div className="grid">
                    <div className="card">
                        <h3>Game Development & Design</h3>
                        <p>Master the tools and pipelines used in modern game creation, from concept to deployment.</p>
                    </div>
                    <div className="card">
                        <h3>VFX & Video Editing</h3>
                        <p>Learn industry-standard compositing, visual effects techniques, and professional post-production workflows.</p>
                    </div>
                    <div className="card">
                        <h3>Graphic & Interior Design</h3>
                        <p>Courses covering foundational graphic design, as well as advanced CAD and interior design software.</p>
                    </div>
                    <div className="card">
                        <h3>AI & Full Stack Web Dev</h3>
                        <p>Stay ahead of the curve with our specialized AI development and full stack web engineering tracks.</p>
                    </div>
                </div>
            </section>

            {/* Software Stack Section */}
            <section id="technologies" className="section" style={{ backgroundColor: 'var(--bg-page)', maxWidth: '980px', textAlign: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '6rem', marginTop: '2rem' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 600, letterSpacing: '0.05em', color: 'var(--accent-blue)', textTransform: 'uppercase' }}>Our Arsenal</span>
                <h2 style={{ fontSize: '3rem', fontWeight: 600, letterSpacing: '-0.04em', color: 'var(--text-main)', marginTop: '0.5rem', marginBottom: '3rem' }}>Technologies We Command</h2>
                
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem', maxWidth: '800px', margin: '0 auto' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: 'var(--bg-card)', borderRadius: '980px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', fontWeight: 500, fontSize: '0.95rem', color: 'var(--text-main)', border: '1px solid rgba(0,0,0,0.05)' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                        Unreal Engine
                    </span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: 'var(--bg-card)', borderRadius: '980px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', fontWeight: 500, fontSize: '0.95rem', color: 'var(--text-main)', border: '1px solid rgba(0,0,0,0.05)' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                        Unity
                    </span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: 'var(--bg-card)', borderRadius: '980px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', fontWeight: 500, fontSize: '0.95rem', color: 'var(--text-main)', border: '1px solid rgba(0,0,0,0.05)' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 22 22 22"></polygon></svg>
                        Maya
                    </span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: 'var(--bg-card)', borderRadius: '980px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', fontWeight: 500, fontSize: '0.95rem', color: 'var(--text-main)', border: '1px solid rgba(0,0,0,0.05)' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="3"></circle></svg>
                        Blender
                    </span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: 'var(--bg-card)', borderRadius: '980px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', fontWeight: 500, fontSize: '0.95rem', color: 'var(--text-main)', border: '1px solid rgba(0,0,0,0.05)' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                        Substance 3D Suite
                    </span>
                    
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: 'var(--bg-card)', borderRadius: '980px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', fontWeight: 500, fontSize: '0.95rem', color: 'var(--text-main)', border: '1px solid rgba(0,0,0,0.05)' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M6.13 1L6 16a2 2 0 0 0 2 2h15"></path><path d="M1 6.13L16 6a2 2 0 0 1 2 2v15"></path></svg>
                        Adobe Photoshop
                    </span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: 'var(--bg-card)', borderRadius: '980px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', fontWeight: 500, fontSize: '0.95rem', color: 'var(--text-main)', border: '1px solid rgba(0,0,0,0.05)' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                        Premiere Pro
                    </span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: 'var(--bg-card)', borderRadius: '980px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', fontWeight: 500, fontSize: '0.95rem', color: 'var(--text-main)', border: '1px solid rgba(0,0,0,0.05)' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="14.31" y1="8" x2="20.05" y2="17.94"></line><line x1="9.69" y1="8" x2="21.17" y2="8"></line><line x1="7.38" y1="12" x2="13.12" y2="2.06"></line><line x1="9.69" y1="16" x2="3.95" y2="6.06"></line><line x1="14.31" y1="16" x2="2.83" y2="16"></line><line x1="16.62" y1="12" x2="10.88" y2="21.94"></line></svg>
                        DaVinci Resolve
                    </span>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem', maxWidth: '800px', margin: '1.5rem auto 0 auto' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: '#1d1d1f', color: '#fff', borderRadius: '980px', boxShadow: '0 6px 16px rgba(0,0,0,0.1)', fontWeight: 600, fontSize: '0.95rem', letterSpacing: '0.02em' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
                        Google Veo 3
                    </span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: '#1d1d1f', color: '#fff', borderRadius: '980px', boxShadow: '0 6px 16px rgba(0,0,0,0.1)', fontWeight: 600, fontSize: '0.95rem', letterSpacing: '0.02em' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
                        Grok Video Gen
                    </span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: '#1d1d1f', color: '#fff', borderRadius: '980px', boxShadow: '0 6px 16px rgba(0,0,0,0.1)', fontWeight: 600, fontSize: '0.95rem', letterSpacing: '0.02em' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
                        Google Flow
                    </span>
                </div>
                
                <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', marginTop: '2.5rem', maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.6 }}>Utilizing industry-standard pipelines for 3D and VFX alongside advanced video & image LLMs to pioneer next-generation interactive media.</p>
            </section>

            {/* Trusted Partners Section */}
            <section id="partners" className="section" style={{ backgroundColor: 'var(--bg-card)', maxWidth: '980px', textAlign: 'center', borderRadius: '30px', padding: '4rem 2rem', margin: '4rem auto', boxShadow: '0 4px 24px rgba(0,0,0,0.03)' }}>
                <h2 className="section-title" style={{ marginBottom: '2rem' }}>Trusted Partners & Collaborators</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', marginBottom: '3rem', maxWidth: '700px', marginLeft: 'auto', marginRight: 'auto' }}>We are proud to co-produce, develop, and deliver high-end experiences alongside these incredible studios and corporate clients.</p>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', justifyContent: 'center', alignItems: 'stretch' }}>
                    <a href="https://zorbagames.com" target="_blank" rel="noreferrer" className="partner-card">
                        <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>Zorba Games</span>
                        <span style={{ fontSize: '0.85rem', color: 'var(--accent-blue)', marginTop: '8px', fontWeight: 500 }}>PC Game Co-Production</span>
                    </a>
                    
                    <a href="https://ivwtech.com" target="_blank" rel="noreferrer" className="partner-card">
                        <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>IVW Tech</span>
                        <span style={{ fontSize: '0.85rem', color: 'var(--accent-blue)', marginTop: '8px', fontWeight: 500 }}>B2B VR Simulators</span>
                    </a>
                    
                    <a href="https://kingdomscollidemobile.com" target="_blank" rel="noreferrer" className="partner-card">
                        <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>Silverglint Games</span>
                        <span style={{ fontSize: '0.85rem', color: 'var(--accent-blue)', marginTop: '8px', fontWeight: 500 }}>Mobile Strategy</span>
                    </a>
                    
                    <a href="https://oceaninteraction.com" target="_blank" rel="noreferrer" className="partner-card">
                        <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>Ocean Interactions</span>
                        <span style={{ fontSize: '0.85rem', color: 'var(--accent-blue)', marginTop: '8px', fontWeight: 500 }}>Interactive Media</span>
                    </a>
                    
                    <a href="https://aaga.one" target="_blank" rel="noreferrer" className="partner-card">
                        <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>Aaga Tech</span>
                        <span style={{ fontSize: '0.85rem', color: 'var(--accent-blue)', marginTop: '8px', fontWeight: 500 }}>Tech Solutions</span>
                    </a>
                    
                    <a href="https://www.wsdigitech.co.in" target="_blank" rel="noreferrer" className="partner-card">
                        <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>WS Digitech / Winn</span>
                        <span style={{ fontSize: '0.85rem', color: 'var(--accent-blue)', marginTop: '8px', fontWeight: 500 }}>Digital Solutions</span>
                    </a>
                    
                    <div className="partner-card">
                        <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>UI Movie (Upendra Sir)</span>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '8px', fontWeight: 500 }}>VFX Collaboration</span>
                    </div>
                    
                    <div className="partner-card">
                        <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>Pied Pipers</span>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '8px', fontWeight: 500 }}>Creative Partnership</span>
                    </div>
                </div>

                <h3 style={{ fontSize: '2rem', fontWeight: 600, color: 'var(--text-main)', marginTop: '4rem', marginBottom: '2rem', letterSpacing: '-0.03em' }}>Co-Production Feedback</h3>
                <div className="grid" style={{ textAlign: 'left' }}>
                    <div className="card testimonial-card">
                        <div className="quote-icon">“</div>
                        <p className="quote">Collaborating with Lessario on Destination Fury was an absolute game-changer. Their sheer mastery of Unreal Engine and the 3D pipeline brought a visceral, theatrical impact to our action sequences.</p>
                        <div className="author">
                            <strong>Zorba Games</strong>
                            <span>PC Game Co-Production Leads</span>
                        </div>
                    </div>
                    <div className="card testimonial-card">
                        <div className="quote-icon">“</div>
                        <p className="quote">The strategic backend mechanics they architected for Kingdoms Collide showcased an elite pedigree. Lessario doesn't just write code; they build seamless competitive ecosystems.</p>
                        <div className="author">
                            <strong>Silverglint Gaming Ltd</strong>
                            <span>Mobile Strategy Partners</span>
                        </div>
                    </div>
                    <div className="card testimonial-card">
                        <div className="quote-icon">“</div>
                        <p className="quote">Their enterprise VR simulators entirely redefined our B2B training structure. It was a completely immersive, technically flawless execution from concept presentation to final deployment.</p>
                        <div className="author">
                            <strong>IVW Tech</strong>
                            <span>Corporate VR Clients</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* News Preview Section */}
            <section id="news" className="section">
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: 600, letterSpacing: '0.05em', color: 'var(--accent-blue)', textTransform: 'uppercase' }}>Insights</span>
                    <h2 className="section-title" style={{ marginBottom: '1rem' }}>Industry News & Blogs</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '700px', margin: '0 auto' }}>Stay updated on our latest R&D breakthroughs, tech stack methodologies, and industry shifts.</p>
                </div>
                
                <div className="grid">
                    {blogs.slice(0, 3).map(blog => (
                        <Link
                            key={blog.id}
                            to={`/blogs/${blog.category}/${blog.id}`}
                            className="card news-card"
                            style={{ textDecoration: 'none', color: 'inherit' }}
                        >
                            <span className="tag">{blog.tag}</span>
                            <h3>{blog.title}</h3>
                            <p style={{ color: 'var(--text-muted)' }}>{blog.summary}</p>
                            <span className="read-more">Read Article →</span>
                        </Link>
                    ))}
                </div>

                <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
                    <Link to="/blogs" className="btn btn-outline">View All Articles →</Link>
                </div>
            </section>

            {/* Team Section */}
            <section id="team" className="section">
                <h2 className="section-title">Meet the Team</h2>
                <div className="team-grid">
                    <div className="team-member">
                        <div style={{ width: '100px', height: '100px', background: 'var(--border-color)', borderRadius: '50%', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', color: 'var(--text-muted)' }}>HK</div>
                        <h3>Hemanth Kumar K</h3>
                        <p>Studio Lead & Founder</p>
                        <div className="desc">Spearheading vision, outreach, and operations.</div>
                    </div>
                    <div className="team-member">
                        <div style={{ width: '100px', height: '100px', background: 'var(--border-color)', borderRadius: '50%', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', color: 'var(--text-muted)' }}>BD</div>
                        <h3>Blessing D</h3>
                        <p>3D Artist</p>
                        <div className="desc">BSc in Game Design & 3D Pipeline. Expert in crafting stunning 3D assets.</div>
                    </div>
                    <div className="team-member">
                        <div style={{ width: '100px', height: '100px', background: 'var(--border-color)', borderRadius: '50%', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', color: 'var(--text-muted)' }}>ST</div>
                        <h3>Sam Thesigan</h3>
                        <p>Social Media Manager</p>
                        <div className="desc">Driving our digital presence and community engagement.</div>
                    </div>
                </div>
            </section>
        </div>
    );
}
