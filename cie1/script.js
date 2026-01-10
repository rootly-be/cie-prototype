document.addEventListener('DOMContentLoaded', () => {
    
    // --- Navigation Logic (Smooth Scroll / SPA feel) ---
    const links = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('.page-section');
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinksContainer = document.querySelector('.nav-links');

    // Mobile Menu Toggle
    menuToggle.addEventListener('click', () => {
        navLinksContainer.classList.toggle('mobile-active');
    });

    // Navigation Click Handler
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active class from all links
            links.forEach(l => l.classList.remove('active'));
            // Add active to clicked
            link.classList.add('active');

            // Scroll to section
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            window.scrollTo({
                top: targetSection.offsetTop - 70, // Adjust for fixed header
                behavior: 'smooth'
            });

            // Close mobile menu if open
            navLinksContainer.classList.remove('mobile-active');
        });
    });

    // Helper to allow external calls (like from Hero CTA)
    window.navigateTo = (pageId) => {
        const link = document.querySelector(`a[href="#${pageId}"]`);
        if(link) link.click();
    };


    // --- Color Picker Logic ---
    const colorInput = document.getElementById('colorInput');
    const root = document.documentElement;

    colorInput.addEventListener('input', (e) => {
        const color = e.target.value;
        root.style.setProperty('--primary-color', color);
    });


    // --- Scroll Spy (Optional: Highlight nav on scroll) ---
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });

        links.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });

    // --- Parallax Effect for Hero ---
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroBg = document.querySelector('.hero-bg');
        if (heroBg) {
            heroBg.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });

});
