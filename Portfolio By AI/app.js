/**
 * Simple animation trigger for elements with data-aos attribute
 */
document.addEventListener('DOMContentLoaded', () => {
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

    // Number counting animation
    const animateNumbers = () => {
        const stats = document.querySelectorAll('.stat-number[data-target]');
        stats.forEach(stat => {
            const target = parseFloat(stat.getAttribute('data-target'));
            const suffix = stat.getAttribute('data-suffix') || '';
            let count = 0;
            const duration = 2000;
            const increment = target / (duration / 16);

            const updateCount = () => {
                if (count < target) {
                    count += increment;
                    stat.innerText = (count % 1 === 0 ? count : count.toFixed(1)) + suffix;
                    requestAnimationFrame(updateCount);
                } else {
                    stat.innerText = target + suffix;
                }
            };
            
            // Only trigger once
            const statObserver = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    updateCount();
                    statObserver.unobserve(stat);
                }
            });
            statObserver.observe(stat);
        });
    };

    animateNumbers();
});
