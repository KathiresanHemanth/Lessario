import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import blogs from '../data/blogs';
import useScrollReveal from '../hooks/useScrollReveal';

export default function BlogPost() {
    useScrollReveal();
    const { category, id } = useParams();
    const navigate = useNavigate();

    const blog = blogs.find(b => b.category === category && b.id === id);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    if (!blog) {
        return (
            <div style={{ paddingTop: '120px', minHeight: '100vh', backgroundColor: 'var(--bg-page)', textAlign: 'center' }}>
                <section className="section">
                    <h1 style={{ fontSize: '3rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '1rem' }}>404</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', marginBottom: '2rem' }}>This article could not be found.</p>
                    <Link to="/blogs" className="btn">← Back to All Articles</Link>
                </section>
            </div>
        );
    }

    // Category label formatting
    const categoryLabels = {
        'studio': 'Lessario Studios',
        'world': 'World News',
        'india': 'India',
        'tamil-nadu': 'Tamil Nadu'
    };

    // Find related articles (same category, excluding current)
    const related = blogs.filter(b => b.category === blog.category && b.id !== blog.id).slice(0, 3);

    // Simple markdown-like rendering for the content
    const renderContent = (content) => {
        const lines = content.trim().split('\n');
        const elements = [];
        let i = 0;

        while (i < lines.length) {
            const line = lines[i].trim();

            if (line.startsWith('## ')) {
                elements.push(
                    <h2 key={i} style={{ fontSize: '1.8rem', fontWeight: 600, color: 'var(--text-main)', marginTop: '2.5rem', marginBottom: '1rem', letterSpacing: '-0.02em' }}>
                        {line.replace('## ', '')}
                    </h2>
                );
            } else if (line.startsWith('### ')) {
                elements.push(
                    <h3 key={i} style={{ fontSize: '1.3rem', fontWeight: 600, color: 'var(--text-main)', marginTop: '2rem', marginBottom: '0.8rem' }}>
                        {line.replace('### ', '')}
                    </h3>
                );
            } else if (line.startsWith('- **')) {
                elements.push(
                    <li key={i} style={{ marginBottom: '0.8rem', lineHeight: 1.7, color: 'var(--text-muted)', paddingLeft: '0.5rem' }}>
                        <span dangerouslySetInnerHTML={{ __html: line.replace(/^- /, '').replace(/\*\*(.*?)\*\*/g, '<strong style="color: var(--text-main)">$1</strong>') }} />
                    </li>
                );
            } else if (line.startsWith('1. ') || line.startsWith('2. ') || line.startsWith('3. ') || line.startsWith('4. ')) {
                elements.push(
                    <li key={i} style={{ marginBottom: '0.8rem', lineHeight: 1.7, color: 'var(--text-muted)', paddingLeft: '0.5rem', listStyleType: 'decimal' }}>
                        <span dangerouslySetInnerHTML={{ __html: line.replace(/^\d+\.\s/, '').replace(/\*\*(.*?)\*\*/g, '<strong style="color: var(--text-main)">$1</strong>') }} />
                    </li>
                );
            } else if (line.length > 0) {
                elements.push(
                    <p key={i} style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: 1.8, marginBottom: '1.2rem' }}>
                        {line}
                    </p>
                );
            }
            i++;
        }
        return elements;
    };

    return (
        <div style={{ paddingTop: '80px', minHeight: '100vh', backgroundColor: 'var(--bg-page)' }}>
            {/* Breadcrumb */}
            <div style={{ maxWidth: '780px', margin: '0 auto', padding: '2rem 2rem 0' }}>
                <nav style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
                    <Link to="/" style={{ color: 'var(--accent-blue)', textDecoration: 'none' }}>Home</Link>
                    <span>›</span>
                    <Link to="/blogs" style={{ color: 'var(--accent-blue)', textDecoration: 'none' }}>News & Blogs</Link>
                    <span>›</span>
                    <span style={{ color: 'var(--text-muted)' }}>{categoryLabels[blog.category] || blog.category}</span>
                </nav>
            </div>

            {/* Article Header */}
            <article style={{ maxWidth: '780px', margin: '0 auto', padding: '0 2rem 4rem' }}>
                <div style={{ marginBottom: '3rem' }}>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <span className="tag">{blog.tag}</span>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{blog.date}</span>
                    </div>
                    <h1 style={{ fontSize: '2.8rem', fontWeight: 600, letterSpacing: '-0.04em', color: 'var(--text-main)', lineHeight: 1.15, marginBottom: '1.5rem' }}>
                        {blog.title}
                    </h1>
                    <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                        {blog.summary}
                    </p>
                    {/* Article Tags */}
                    {blog.tags && blog.tags.length > 0 && (
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '1.5rem' }}>
                            {blog.tags.map(t => (
                                <Link
                                    key={t}
                                    to="/blogs"
                                    style={{
                                        padding: '4px 12px', borderRadius: '980px', fontSize: '0.75rem',
                                        fontWeight: 600, backgroundColor: 'rgba(0,113,227,0.08)', color: 'var(--accent-blue)',
                                        textDecoration: 'none', letterSpacing: '0.02em', transition: 'all 0.2s ease'
                                    }}
                                >
                                    {t}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                {/* Divider */}
                <div style={{ width: '60px', height: '3px', backgroundColor: 'var(--accent-blue)', borderRadius: '4px', marginBottom: '3rem' }}></div>

                {/* Article Body */}
                <div>
                    {renderContent(blog.content)}
                </div>

                {/* Back Button */}
                <div style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid var(--border-color)' }}>
                    <button
                        onClick={() => navigate('/blogs')}
                        className="btn btn-outline"
                        style={{ cursor: 'pointer' }}
                    >
                        ← Back to All Articles
                    </button>
                </div>
            </article>

            {/* Related Articles */}
            {related.length > 0 && (
                <section style={{ maxWidth: '980px', margin: '0 auto', padding: '0 2rem 6rem' }}>
                    <h2 style={{ fontSize: '2rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '2rem', letterSpacing: '-0.03em' }}>
                        More from {categoryLabels[blog.category]}
                    </h2>
                    <div className="grid">
                        {related.map(r => (
                            <Link
                                key={r.id}
                                to={`/blogs/${r.category}/${r.id}`}
                                className="card news-card"
                                style={{ textDecoration: 'none', color: 'inherit' }}
                            >
                                <span className="tag">{r.tag}</span>
                                <h3>{r.title}</h3>
                                <p style={{ color: 'var(--text-muted)' }}>{r.summary}</p>
                                <span className="read-more">Read Article →</span>
                            </Link>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}
