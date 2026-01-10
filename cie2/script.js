document.addEventListener('DOMContentLoaded', () => {
    
    // Theme Switcher
    window.setTheme = (color) => {
        document.documentElement.style.setProperty('--primary', color);
    };

    // Mobile Menu
    const burger = document.querySelector('.menu-burger');
    const mobileMenu = document.querySelector('.mobile-menu');
    const closeBtn = document.querySelector('.close-menu');
    const mobileLinks = document.querySelectorAll('.mobile-menu a');

    function toggleMenu() {
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    }

    burger.addEventListener('click', toggleMenu);
    closeBtn.addEventListener('click', toggleMenu);

    mobileLinks.forEach(link => {
        link.addEventListener('click', toggleMenu);
    });

    // Smooth Scroll (Native behavior + slight offset adjustment if needed, but CSS scroll-padding is better. 
    // Adding minimal JS for "Active State" on scroll)
    
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.desktop-nav a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active'); // Minimal style doesn't strictly need active state highlighting, but good for UX
            if (link.getAttribute('href').includes(current)) {
                // link.classList.add('active'); // Optional
            }
        });
    });

});
