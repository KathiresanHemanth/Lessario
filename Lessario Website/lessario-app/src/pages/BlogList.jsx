import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import blogs from '../data/blogs';
import useScrollReveal from '../hooks/useScrollReveal';

export default function BlogList() {
    useScrollReveal();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    const [activeFilter, setActiveFilter] = useState('all');
    const [activeTag, setActiveTag] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    const categories = [
        { key: 'all', label: 'All' },
        { key: 'studio', label: 'Lessario Studios' },
        { key: 'world', label: 'World' },
        { key: 'india', label: 'India' },
        { key: 'tamil-nadu', label: 'Tamil Nadu' }
    ];

    // Collect all unique tags across all blogs
    const allTags = useMemo(() => {
        const tagSet = new Set();
        blogs.forEach(b => b.tags?.forEach(t => tagSet.add(t)));
        return [...tagSet].sort();
    }, []);

    // Filter logic: category → tag → search
    const filtered = useMemo(() => {
        let result = blogs;

        // Category filter
        if (activeFilter !== 'all') {
            result = result.filter(b => b.category === activeFilter);
        }

        // Tag filter
        if (activeTag) {
            result = result.filter(b => b.tags?.includes(activeTag));
        }

        // Search filter
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            result = result.filter(b =>
                b.title.toLowerCase().includes(q) ||
                b.summary.toLowerCase().includes(q) ||
                b.tag.toLowerCase().includes(q) ||
                b.tags?.some(t => t.toLowerCase().includes(q))
            );
        }

        return result;
    }, [activeFilter, activeTag, searchQuery]);

    const handleTagClick = (tag) => {
        setActiveTag(activeTag === tag ? null : tag);
    };

    const clearFilters = () => {
        setActiveFilter('all');
        setActiveTag(null);
        setSearchQuery('');
    };

    const hasActiveFilters = activeFilter !== 'all' || activeTag || searchQuery.trim();

    return (
        <div style={{ paddingTop: '80px', minHeight: '100vh', backgroundColor: 'var(--bg-page)' }}>
            <section id="news" className="section">
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: 600, letterSpacing: '0.05em', color: 'var(--accent-blue)', textTransform: 'uppercase' }}>Insights</span>
                    <h1 className="section-title" style={{ marginBottom: '1rem', marginTop: '0.5rem' }}>Industry News & Blogs</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '700px', margin: '0 auto' }}>Stay updated on our latest R&D breakthroughs, tech stack methodologies, and industry shifts across the AVGC-XR landscape.</p>
                </div>

                {/* Search Bar */}
                <div style={{ maxWidth: '560px', margin: '0 auto 2rem', position: 'relative' }}>
                    <div style={{ position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    </div>
                    <input
                        type="text"
                        placeholder="Search articles, tags, topics..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '14px 18px 14px 48px',
                            borderRadius: '980px',
                            border: '1px solid var(--border-color)',
                            backgroundColor: 'var(--bg-card)',
                            fontSize: '0.95rem',
                            color: 'var(--text-main)',
                            outline: 'none',
                            transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                            boxSizing: 'border-box'
                        }}
                        onFocus={(e) => {
                            e.target.style.borderColor = 'var(--accent-blue)';
                            e.target.style.boxShadow = '0 0 0 3px rgba(0,113,227,0.1)';
                        }}
                        onBlur={(e) => {
                            e.target.style.borderColor = 'var(--border-color)';
                            e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.03)';
                        }}
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            style={{
                                position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)',
                                background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)',
                                fontSize: '1.2rem', padding: '4px', lineHeight: 1
                            }}
                        >
                            ✕
                        </button>
                    )}
                </div>

                {/* Category Filter Tabs */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                    {categories.map(cat => (
                        <button
                            key={cat.key}
                            onClick={() => setActiveFilter(cat.key)}
                            style={{
                                padding: '8px 20px',
                                borderRadius: '980px',
                                border: activeFilter === cat.key ? '2px solid var(--accent-blue)' : '1px solid var(--border-color)',
                                backgroundColor: activeFilter === cat.key ? 'var(--accent-blue)' : 'var(--bg-card)',
                                color: activeFilter === cat.key ? '#fff' : 'var(--text-main)',
                                fontWeight: 600,
                                fontSize: '0.85rem',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                letterSpacing: '0.02em'
                            }}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>

                {/* Tag Cloud */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', flexWrap: 'wrap', marginBottom: '1rem', maxWidth: '800px', margin: '0 auto 2rem' }}>
                    {allTags.map(tag => (
                        <button
                            key={tag}
                            onClick={() => handleTagClick(tag)}
                            style={{
                                padding: '5px 12px',
                                borderRadius: '980px',
                                border: activeTag === tag ? '1.5px solid var(--accent-blue)' : '1px solid rgba(0,0,0,0.08)',
                                backgroundColor: activeTag === tag ? 'rgba(0,113,227,0.1)' : 'transparent',
                                color: activeTag === tag ? 'var(--accent-blue)' : 'var(--text-muted)',
                                fontWeight: 500,
                                fontSize: '0.75rem',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                letterSpacing: '0.02em'
                            }}
                        >
                            {tag}
                        </button>
                    ))}
                </div>

                {/* Active Filters Info */}
                {hasActiveFilters && (
                    <div style={{ textAlign: 'center', marginBottom: '2rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                            Showing {filtered.length} of {blogs.length} articles
                        </span>
                        <button
                            onClick={clearFilters}
                            style={{
                                padding: '4px 12px', borderRadius: '980px', border: '1px solid var(--border-color)',
                                backgroundColor: 'transparent', color: 'var(--accent-blue)', fontWeight: 600,
                                fontSize: '0.75rem', cursor: 'pointer', transition: 'all 0.2s ease'
                            }}
                        >
                            Clear All ✕
                        </button>
                    </div>
                )}
                
                {/* Results Grid */}
                {filtered.length > 0 ? (
                    <div className="grid">
                        {filtered.map(blog => (
                            <Link
                                key={blog.id}
                                to={`/blogs/${blog.category}/${blog.id}`}
                                className="card news-card"
                                style={{ textDecoration: 'none', color: 'inherit' }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                    <span className="tag">{blog.tag}</span>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{blog.date}</span>
                                </div>
                                <h3>{blog.title}</h3>
                                <p style={{ color: 'var(--text-muted)' }}>{blog.summary}</p>
                                {/* Inline Tags */}
                                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '1rem' }}>
                                    {blog.tags?.slice(0, 4).map(t => (
                                        <span key={t} style={{
                                            padding: '2px 8px', borderRadius: '980px', fontSize: '0.65rem',
                                            fontWeight: 600, backgroundColor: 'rgba(0,0,0,0.04)', color: 'var(--text-muted)',
                                            letterSpacing: '0.03em'
                                        }}>
                                            {t}
                                        </span>
                                    ))}
                                </div>
                                <span className="read-more">Read Article →</span>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
                        <h3 style={{ color: 'var(--text-main)', marginBottom: '0.5rem' }}>No articles found</h3>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Try adjusting your search or filters</p>
                        <button onClick={clearFilters} className="btn btn-outline" style={{ cursor: 'pointer' }}>Reset Filters</button>
                    </div>
                )}
            </section>
        </div>
    );
}
