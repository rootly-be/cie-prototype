# Source Tree Analysis - CIE Website

> Generated: 2026-01-13 | Scan Level: Deep

## Project Structure Overview

```
cie-website/                          # 📁 Project Root
│
├── 📋 Functional-requirements.md     # ⭐ Specifications for dynamic transformation
│                                     #    - API endpoints, data models, architecture
│
├── 📁 cie4/                          # 🎯 ACTIVE PROTOTYPE
│   ├── 🌐 index.html                 # Homepage (hero, stats, agenda preview, activities)
│   ├── 🌐 cie.html                   # Organization page (team, history, mission)
│   ├── 🌐 animations.html            # School programs (filterable by level)
│   ├── 🌐 agenda.html                # Full events calendar (by month)
│   ├── 🌐 formations.html            # Adult training (placeholder)
│   ├── 🌐 stages.html                # Holiday camps (placeholder)
│   ├── 🌐 contact.html               # Contact & donation info
│   │
│   ├── 🎨 style.css                  # Complete design system (21.8 KB)
│   │                                 #    - CSS variables, dark mode, responsive
│   │                                 #    - 29 reusable components
│   │
│   ├── ⚡ script.js                  # Vanilla JS interactions (4.3 KB)
│   │                                 #    - Navbar scroll, mobile menu
│   │                                 #    - Theme toggle, scroll animations
│   │
│   ├── 📁 img/                       # SVG Icons (11 files, ~44 KB total)
│   │   ├── clock.svg                 # ⏰ Time indicator
│   │   ├── map-pin.svg               # 📍 Location marker
│   │   ├── sun.svg / moon.svg        # 🌞🌙 Theme toggle
│   │   ├── phone.svg / mail.svg      # 📞📧 Contact icons
│   │   ├── leaf.svg / search.svg     # 🍃🔍 Feature icons
│   │   ├── heart.svg                 # ❤️ Donation/support
│   │   └── facebook.svg / instagram.svg  # Social media
│   │
│   └── 📁 docs/
│       └── 📋 CHARTE-GRAPHIQUE.md    # ⭐ Complete design guide
│                                     #    - Colors, typography, components
│                                     #    - Accessibility, dark mode specs
│
├── 📁 cie1/, cie2/, cie3/            # 🗄️ Previous prototype versions (archived)
│
├── 📁 docs/                          # 📚 BMM Documentation Output
│   ├── planning-artifacts/           # Workflow status, PRD (future)
│   └── [generated docs...]           # This documentation
│
├── 📁 _bmad/                         # ⚙️ BMad Framework (tooling)
│   ├── core/                         # Core workflows and tasks
│   └── bmm/                          # BMad Method Module
│
└── 🌐 index.html                     # Root redirect to cie4/
```

## Critical Paths

### Entry Points
| File | Purpose |
|------|---------|
| `cie4/index.html` | Main homepage - user landing page |
| `cie4/style.css` | All styling - design system source |
| `cie4/script.js` | All interactivity |

### Navigation Flow
```
index.html (Homepage)
    ├── cie.html (About)
    ├── animations.html (Programs)
    │   └── [Filter by: M1, M2/M3, Primaire, Secondaire]
    ├── formations.html (Training)
    ├── agenda.html (Calendar)
    │   └── [By month: July, August, September]
    ├── stages.html (Camps)
    └── contact.html (Contact)
        └── #soutenir (Support section)
```

### Asset Dependencies
```
External Resources:
├── fonts.googleapis.com
│   ├── Playfair Display (headings)
│   └── Lora (body text)
│
└── cieenghien.be (images)
    ├── Hero backgrounds
    ├── Activity photos
    └── Team photos

Local Resources:
└── img/*.svg (11 icons)
```

## File Size Analysis

| File | Size | LOC | Purpose |
|------|------|-----|---------|
| `style.css` | 21.8 KB | 685 | Complete design system |
| `index.html` | 10.5 KB | 314 | Homepage |
| `animations.html` | ~15 KB | ~400 | Programs with filters |
| `agenda.html` | ~12 KB | ~350 | Calendar view |
| `script.js` | 4.3 KB | 121 | All interactions |
| `cie.html` | ~8 KB | ~200 | Organization info |
| `contact.html` | ~6 KB | ~180 | Contact page |
| `formations.html` | ~4 KB | ~100 | Placeholder |
| `stages.html` | ~4 KB | ~100 | Placeholder |

**Total prototype size:** ~86 KB (excluding external images)

## Code Organization Patterns

### CSS Architecture
```css
/* Section 1: CSS Variables (Palettes) */
/* Section 2: Active Variable Mapping */
/* Section 3: Dark Mode Mapping */
/* Section 4: Base Styles */
/* Section 5: Components */
/* Section 6: Responsive */
/* Section 7: Animations */
```

### JavaScript Architecture
```javascript
// DOMContentLoaded wrapper
// 1. Sticky Navbar Effect
// 2. Mobile Menu Toggle
// 3. Smooth Scroll
// 4. Parallax Hero
// 5. Theme Toggle
// 6. Scroll Reveal (IntersectionObserver)
```

## Integration Points (Future Dynamic Version)

Based on `Functional-requirements.md`, the following integration points are identified:

| Static Element | Future Dynamic Source |
|----------------|----------------------|
| Agenda items in `index.html` | `GET /api/agenda` (3 latest) |
| Full calendar in `agenda.html` | `GET /api/agenda` (all published) |
| Animations list | `GET /api/animations` (by category) |
| Formations list | `GET /api/formations` (published) |
| Stages list | `GET /api/stages` (published) |
| Contact form | `POST /api/contact` |

## Recommendations for Migration

1. **Keep design system** - CSS variables enable easy theming
2. **Extract data** - Current content → seed data for PostgreSQL
3. **Component mapping** - HTML components → React/Vue components
4. **API integration** - Replace static content with API calls
5. **Preserve accessibility** - Maintain skip-link, focus states, reduced-motion
