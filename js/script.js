document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });

        // Close menu when a link is clicked
        const links = navLinks.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
    }

    // 2. Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // 3. Hero Content Delayed Reveal
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        // Wait ~0.8s for the video animation to finish before sliding in text
        setTimeout(() => {
            heroContent.classList.add('loaded');
        }, 800);
    }

    // 4. Scroll Reveal via IntersectionObserver
    const revealElements = document.querySelectorAll('.reveal');
    if (revealElements.length > 0) {
        const revealOptions = {
            threshold: 0.15, // Trigger when 15% visible
            rootMargin: '0px 0px -50px 0px'
        };

        const revealOnScroll = new IntersectionObserver(function(entries, observer) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target); // Run once
                }
            });
        }, revealOptions);

        revealElements.forEach(el => {
            revealOnScroll.observe(el);
        });
    }

    // 5. Video Replay Logic (Play once, wait 2 mins, replay)
    const heroVideo = document.querySelector('.hero-video');
    if (heroVideo) {
        heroVideo.addEventListener('ended', () => {
            // 120,000 ms = 2 minutes
            setTimeout(() => {
                heroVideo.play();
            }, 120000);
        });
    }

    // 6. Interactive Mouse Parallax (Business Theme)
    const heroSection = document.querySelector('.hero');
    const parallaxEls = document.querySelectorAll('.parallax-el');
    
    if (heroSection && parallaxEls.length > 0) {
        heroSection.addEventListener('mousemove', (e) => {
            const x = (window.innerWidth - e.pageX * 2) / 90;
            const y = (window.innerHeight - e.pageY * 2) / 90;
            
            parallaxEls.forEach((el, index) => {
                const speed = (index + 1.5) * 1.5;
                el.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
            });
        });
    }
});
