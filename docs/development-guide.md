# Development Guide - CIE Website

> Generated: 2026-01-13 | Scan Level: Deep

## Prerequisites

### Required
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Text editor or IDE (VS Code recommended)
- Local web server (for testing)

### Optional
- Git for version control
- Live Server extension for VS Code

## Getting Started

### 1. Clone the Repository
```bash
git clone <repository-url>
cd cie-website
```

### 2. Navigate to Prototype
```bash
cd cie4
```

### 3. Start Local Server

**Option A: VS Code Live Server**
1. Install "Live Server" extension
2. Right-click `index.html` → "Open with Live Server"

**Option B: Python**
```bash
python -m http.server 8000
# Open http://localhost:8000
```

**Option C: Node.js**
```bash
npx serve .
# Open http://localhost:3000
```

**Option D: PHP**
```bash
php -S localhost:8000
```

## Project Structure

```
cie4/
├── index.html          # Homepage
├── cie.html            # About page
├── animations.html     # School programs
├── agenda.html         # Events calendar
├── formations.html     # Adult training
├── stages.html         # Holiday camps
├── contact.html        # Contact page
├── style.css           # All styles
├── script.js           # All scripts
├── img/                # SVG icons
└── docs/               # Design documentation
```

## Development Workflow

### Editing Styles
1. Open `style.css`
2. CSS is organized in sections:
   - Lines 1-68: CSS Variables (colors, fonts, spacing)
   - Lines 70-103: Dark mode variables
   - Lines 105-185: Base styles
   - Lines 186-500: Components
   - Lines 501-632: Animations
   - Lines 634-685: Responsive breakpoints

### Adding New Pages
1. Copy an existing HTML file as template
2. Update `<title>` and content
3. Add link to navbar in all pages
4. Set `class="active"` on current page link

### Modifying Theme Colors
Edit CSS variables in `:root`:
```css
:root {
    --L-sapin: #1a4a26;    /* Primary green */
    --L-feuille: #649a4f;  /* Secondary green */
    --L-ecorce: #8d5524;   /* Accent brown */
    --L-eau: #4a8db7;      /* Icon blue */
}
```

### Adding New Components
1. Define styles in `style.css`
2. Use existing CSS variables for consistency
3. Add hover/focus states for interactivity
4. Include dark mode variants if needed

## Testing

### Manual Testing Checklist
- [ ] All pages load without errors
- [ ] Navigation works on all pages
- [ ] Mobile menu opens/closes correctly
- [ ] Dark mode toggles properly
- [ ] Scroll animations trigger
- [ ] Forms show feedback on submit
- [ ] All links work (no 404s)

### Cross-Browser Testing
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

### Accessibility Testing
- [ ] Keyboard navigation works (Tab key)
- [ ] Skip link appears on focus
- [ ] Color contrast passes WCAG AA
- [ ] Reduced motion preference respected

### Testing Dark Mode
1. Click theme toggle button (sun/moon icon)
2. Verify all text is readable
3. Verify images have reduced brightness
4. Verify forms are usable

## Common Tasks

### Add a New Event to Agenda
In `agenda.html`, copy an existing event block:
```html
<article class="agenda-item">
    <div class="date-box">
        <span class="day">DD</span>
        <span class="month">Mon</span>
    </div>
    <div class="event-info">
        <h3>Event Title</h3>
        <p>
            <span><img src="img/clock.svg"> Time</span>
            <span><img src="img/map-pin.svg"> Location</span>
        </p>
    </div>
    <a href="#" class="btn btn-outline">S'inscrire</a>
</article>
```

### Add a New Animation Program
In `animations.html`, add within the appropriate section:
```html
<article class="animation-card">
    <h4>Program Title</h4>
    <p><strong>Thèmes :</strong> Theme list</p>
    <p><strong>Période :</strong> Season availability</p>
</article>
```

### Mark Event as "Complet" (Sold Out)
Replace button with:
```html
<span class="btn btn-disabled">Complet</span>
```

## Code Style Guidelines

### HTML
- Use semantic elements (`<nav>`, `<article>`, `<section>`)
- Include `alt` attributes on images
- Use French language (`lang="fr"`)
- Indent with 4 spaces

### CSS
- Use CSS variables for colors and fonts
- Mobile-first responsive approach
- Group related properties
- Comment section headers

### JavaScript
- Use `const` and `let` (no `var`)
- Use arrow functions for callbacks
- Check for `prefers-reduced-motion`
- Event delegation where appropriate

## Troubleshooting

### Styles Not Loading
- Check file path in `<link>` tag
- Clear browser cache (Ctrl+Shift+R)
- Verify no CSS syntax errors

### JavaScript Not Working
- Check browser console for errors
- Verify `script.js` path is correct
- Ensure DOM is loaded (`DOMContentLoaded`)

### Dark Mode Not Persisting
- Current implementation doesn't persist
- To add persistence, use `localStorage`:
```javascript
// Save preference
localStorage.setItem('darkMode', 'true');
// Load on page load
if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
}
```

### Mobile Menu Not Closing
- Check if `.nav-links.active` class toggles
- Verify click handler is attached

## External Dependencies

| Resource | URL | Purpose |
|----------|-----|---------|
| Google Fonts | fonts.googleapis.com | Playfair Display, Lora |
| CIE Images | cieenghien.be | Hero backgrounds, photos |

**Note:** Site works offline except for fonts and images.

## Future Development (Dynamic Version)

See `Functional-requirements.md` for the planned transformation:
- React/Next.js or Vue.js frontend
- Node.js/Python backend API
- PostgreSQL database
- Admin backoffice

Migration path:
1. Extract current content as seed data
2. Convert HTML components to framework components
3. Replace static content with API calls
4. Implement admin CRUD interface
