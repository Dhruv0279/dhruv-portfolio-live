/**
 * Portfolio & Case Study Interactivity
 */
document.addEventListener('DOMContentLoaded', () => {
    // Simple animation trigger for elements with data-aos attribute
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
            }
        });
    }, observerOptions);

    document.querySelectorAll('[data-aos]').forEach(el => observer.observe(el));

    // Number counting animation (progressive enhancement on top of hardcoded HTML values)
    const animateNumbers = () => {
        const stats = document.querySelectorAll('.stat-number[data-target]');
        stats.forEach(stat => {
            const rawTarget = stat.getAttribute('data-target');
            const target = parseFloat(rawTarget);
            if (isNaN(target)) return;

            const suffix = stat.getAttribute('data-suffix') || '';
            const prefix = stat.getAttribute('data-prefix') || '';
            const decimals = (rawTarget.split('.')[1] || '').length;
            const duration = 1800;

            const statObserver = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    let startTime = null;
                    const step = (timestamp) => {
                        if (!startTime) startTime = timestamp;
                        const progress = Math.min((timestamp - startTime) / duration, 1);
                        // easeOutCubic
                        const ease = 1 - Math.pow(1 - progress, 3);
                        const current = ease * target;

                        if (progress < 1) {
                            const formatted = decimals > 0 ? current.toFixed(decimals) : Math.floor(current).toLocaleString();
                            stat.innerText = prefix + formatted + suffix;
                            requestAnimationFrame(step);
                        } else {
                            const formatted = decimals > 0 ? target.toFixed(decimals) : target.toLocaleString();
                            stat.innerText = prefix + formatted + suffix;
                        }
                    };
                    requestAnimationFrame(step);
                    statObserver.unobserve(stat);
                }
            }, { threshold: 0.2 });

            statObserver.observe(stat);
        });
    };
    animateNumbers();

    // --- Lightbox Functionality ---
    const initLightbox = () => {
        // Ensure lightbox DOM structure only created once
        if (!document.querySelector('.lightbox')) {
            const lightbox = document.createElement('div');
            lightbox.className = 'lightbox';
            lightbox.innerHTML = `
                <span class="lightbox-close" aria-label="Close lightbox">&times;</span>
                <div class="lightbox-container">
                    <img src="" alt="Expanded Proof Screenshot">
                    <div class="lightbox-caption"></div>
                </div>
            `;
            document.body.appendChild(lightbox);
        }

        const lightbox = document.querySelector('.lightbox');
        const lightboxImg = lightbox.querySelector('img');
        const lightboxCaption = lightbox.querySelector('.lightbox-caption');
        const closeBtn = lightbox.querySelector('.lightbox-close');

        const openLightbox = (src, caption) => {
            if (!src) return;
            lightboxImg.src = src;
            lightboxImg.alt = caption || 'Expanded Proof Screenshot';
            if (caption) {
                lightboxCaption.textContent = caption;
                lightboxCaption.style.display = 'block';
            } else {
                lightboxCaption.style.display = 'none';
            }
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        };

        const closeLightbox = () => {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
            setTimeout(() => {
                lightboxImg.src = '';
                lightboxCaption.textContent = '';
            }, 300);
        };

        // Attach to all .clickable-image elements
        document.querySelectorAll('.clickable-image').forEach(img => {
            img.addEventListener('click', (e) => {
                e.stopPropagation();
                const caption = img.getAttribute('data-caption') || img.getAttribute('alt') || '';
                const src = img.currentSrc || img.src;
                openLightbox(src, caption);
            });
        });

        // Attach to proof strip cards
        document.querySelectorAll('.proof-strip-card').forEach(card => {
            card.addEventListener('click', () => {
                const img = card.querySelector('img');
                if (img) {
                    const caption = card.getAttribute('data-caption') || img.getAttribute('data-caption') || img.getAttribute('alt') || '';
                    const src = img.currentSrc || img.src;
                    openLightbox(src, caption);
                }
            });
        });

        closeBtn.onclick = closeLightbox;
        lightbox.onclick = (e) => {
            if (e.target === lightbox || e.target.classList.contains('lightbox-container')) {
                closeLightbox();
            }
        };

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('active')) {
                closeLightbox();
            }
        });
    };
    initLightbox();

    // --- Sticky Jump-Link Active Tracking ---
    const initStickyJumpLinks = () => {
        const jumpLinks = document.querySelectorAll('.jump-link');
        if (jumpLinks.length === 0) return;

        const sections = [];
        jumpLinks.forEach(link => {
            const targetId = link.getAttribute('href');
            if (targetId && targetId.startsWith('#')) {
                const section = document.querySelector(targetId);
                if (section) {
                    sections.push({ id: targetId, el: section, link: link });
                }
            }
        });

        if (sections.length === 0) return;

        const onScroll = () => {
            const scrollPos = window.scrollY + 180;
            let current = null;

            for (let i = 0; i < sections.length; i++) {
                const top = sections[i].el.offsetTop;
                if (scrollPos >= top) {
                    current = sections[i];
                }
            }

            jumpLinks.forEach(l => l.classList.remove('active'));
            if (current) {
                current.link.classList.add('active');
            }
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    };
    initStickyJumpLinks();
});
