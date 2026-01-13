document.addEventListener('DOMContentLoaded', () => {
    
    // --- Sticky Navbar Effect ---
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // --- Mobile Menu Toggle ---
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        menuToggle.classList.toggle('active');
        
        // Change icon based on state
        const span = menuToggle.querySelector('span');
        if (navLinks.classList.contains('active')) {
            span.textContent = '✕'; // Close icon
        } else {
            span.textContent = '☰'; // Menu icon
        }
    });

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            menuToggle.classList.remove('active');
            menuToggle.querySelector('span').textContent = '☰';
        });
    });

    // --- Smooth Scroll ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Account for fixed header offset
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- Simple Parallax for Hero ---
    const heroBg = document.querySelector('.hero-bg');
    if (heroBg) {
        window.addEventListener('scroll', () => {
            const scrollPosition = window.pageYOffset;
            if (scrollPosition < 800) { // Only animate when visible
                // Move the background image position, not the div itself to avoid top gap
                heroBg.style.backgroundPosition = `center ${scrollPosition * 0.5}px`;
            }
        });
    }

    // --- Theme Toggle ---
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        const themeIcon = themeToggle.querySelector('img');

        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');

            if (document.body.classList.contains('dark-mode')) {
                themeIcon.src = 'img/moon.svg';
            } else {
                themeIcon.src = 'img/sun.svg';
            }
        });
    }

    // --- Scroll Reveal Animation ---
    // Respecte prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReducedMotion) {
        const animatedElements = document.querySelectorAll('.animate-on-scroll');

        if (animatedElements.length > 0) {
            const observerOptions = {
                root: null,
                rootMargin: '0px 0px -50px 0px', // Déclenche un peu avant
                threshold: 0.1
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        observer.unobserve(entry.target); // Une seule fois
                    }
                });
            }, observerOptions);

            animatedElements.forEach(el => observer.observe(el));
        }
    } else {
        // Si reduced motion, rendre tout visible immédiatement
        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            el.classList.add('is-visible');
        });
    }
});
