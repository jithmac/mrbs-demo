// configuration
const CONFIG = {
    lms_url: "#" // REPLACE WITH REAL LMS URL
};

// Apply LMS URL
document.addEventListener('DOMContentLoaded', () => {
    const lmsButtons = document.querySelectorAll('.btn-lms-main, #nav-lms-btn');
    lmsButtons.forEach(btn => {
        btn.href = CONFIG.lms_url;
    });

    // Mobile Menu
    const mobileToggle = document.getElementById('mobile-menu-toggle');
    const mobileNav = document.getElementById('mobile-nav');
    
    if(mobileToggle && mobileNav) {
        mobileToggle.addEventListener('click', () => {
            mobileNav.classList.toggle('active');
        });
        
        mobileNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileNav.classList.remove('active');
            });
        });
    }

    // Sticky Navbar
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Reveal on Scroll
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                
                // If it's the stat strip, trigger counters
                if(entry.target.classList.contains('stat-strip')) {
                    triggerCounters(entry.target);
                    // trigger coin flip
                    const coinIcon = entry.target.querySelector('.coin-flip-icon svg');
                    if(coinIcon) coinIcon.classList.add('flip');
                }
                
                // If it's why section, trigger compass
                if(entry.target.classList.contains('why-section') || entry.target.closest('.why-section')) {
                    const compass = document.querySelector('.compass-icon svg');
                    if(compass && !compass.classList.contains('spin-settle')) {
                        compass.classList.add('spin-settle');
                    }
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // Counter Animation
    function triggerCounters(statSection) {
        const counters = statSection.querySelectorAll('.stat-number');
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const duration = 2000;
            const stepTime = Math.abs(Math.floor(duration / target));
            let current = 0;
            
            const timer = setInterval(() => {
                current += 1;
                counter.textContent = current + "+";
                if (current >= target) {
                    clearInterval(timer);
                    counter.textContent = target + "+";
                }
            }, stepTime);
        });
    }

    // Parallax on Scroll for Hero Image
    const heroImage = document.getElementById('hero-image');
    if(heroImage) {
        window.addEventListener('scroll', () => {
            const scroll = window.scrollY;
            if(scroll < window.innerHeight) {
                // translate proportionally, max 30px
                const translateY = Math.min(scroll * 0.05, 30);
                heroImage.style.transform = `translateY(${translateY}px)`;
            }
        });
    }

    // Cursor-aware tilt (Desktop only)
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    if (!isTouchDevice) {
        const tiltCards = document.querySelectorAll('.tilt-card');
        
        tiltCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left; // x position within the element.
                const y = e.clientY - rect.top;  // y position within the element.
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                // Max rotation: 4deg
                const rotateX = ((y - centerY) / centerY) * -4;
                const rotateY = ((x - centerX) / centerX) * 4;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
                card.style.transition = 'none';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
                card.style.transition = 'transform 0.25s ease-out, box-shadow 0.25s ease-out';
            });
        });
    }

    // Set Copyright Year
    const yearEl = document.getElementById('year');
    if(yearEl) yearEl.textContent = new Date().getFullYear();

    // Background Mouse Glow Tracking (Desktop Only)
    if (!isTouchDevice) {
        const glow = document.createElement('div');
        glow.className = 'mouse-glow';
        document.body.appendChild(glow);

        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let glowX = mouseX;
        let glowY = mouseY;

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            if(!glow.classList.contains('active')) {
                glow.classList.add('active');
            }
        });

        function animateGlow() {
            // Easing equation for smooth trailing effect
            glowX += (mouseX - glowX) * 0.1;
            glowY += (mouseY - glowY) * 0.1;
            glow.style.transform = `translate(calc(-50% + ${glowX}px), calc(-50% + ${glowY}px))`;
            requestAnimationFrame(animateGlow);
        }
        animateGlow();
    }
});
