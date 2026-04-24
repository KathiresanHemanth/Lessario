import { useEffect } from 'react';

export default function useScrollReveal(dependencies = []) {
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

        // Apply staggered delays to sibling groups
        const staggerGroups = [
            document.querySelectorAll('.hero h1, .hero p, .hero a.btn'),
            document.querySelectorAll('.grid .card'),
            document.querySelectorAll('#partners .partner-card'),
            document.querySelectorAll('.team-grid .team-member'),
            document.querySelectorAll('.social-links a'),
            document.querySelectorAll('#technologies span')
        ];

        staggerGroups.forEach(group => {
            group.forEach((el, index) => {
                el.classList.add('fade-in-up');
                el.style.transitionDelay = `${index * 0.1}s`;
                observer.observe(el);
            });
        });

        // Apply base fade logic to isolated elements mapping cleanly (no nested targeting)
        const standalone = document.querySelectorAll('.section-title, .contact-info, .stat-box, .about-text, .media-card');
        standalone.forEach(el => {
            el.classList.add('fade-in-up');
            observer.observe(el);
        });
        
        return () => observer.disconnect();
    }, dependencies);
}
