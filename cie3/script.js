document.addEventListener('DOMContentLoaded', () => {

    // --- Color Picker ---
    const colorInput = document.getElementById('themeColor');
    const root = document.documentElement;

    colorInput.addEventListener('input', (e) => {
        const color = e.target.value;
        root.style.setProperty('--primary', color);
        // Also update header wave fill if possible, but it's hardcoded in SVG. 
        // We can change the site-header background which connects to it.
        const header = document.querySelector('.site-header');
        if(header) header.style.backgroundColor = color;
    });

    // --- Mobile Menu ---
    const menuToggle = document.getElementById('menuToggle');
    const mainNav = document.getElementById('mainNav');

    if(menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            mainNav.classList.toggle('active');
            menuToggle.textContent = mainNav.classList.contains('active') ? '✖ Fermer' : '🍔 Menu';
        });

        // Close on link click
        mainNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mainNav.classList.remove('active');
                menuToggle.textContent = '🍔 Menu';
            });
        });
    }

    // --- Fun Hover Effects JS (Optional enhancement) ---
    const stickers = document.querySelectorAll('.agenda-sticker');
    stickers.forEach(sticker => {
        sticker.addEventListener('mouseenter', () => {
            sticker.style.zIndex = '10';
        });
        sticker.addEventListener('mouseleave', () => {
            setTimeout(() => { sticker.style.zIndex = '1'; }, 200);
        });
    });

});
