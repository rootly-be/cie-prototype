# Component Inventory - CIE Enghien Website

> Generated: 2026-01-13 | Scan Level: Deep

## Overview

This document catalogs all UI components in the CIE4 prototype. The design system uses CSS variables for theming and follows a component-based architecture without a JavaScript framework.

## Design System Foundation

### CSS Variables (Theme Tokens)

```css
/* Brand Colors */
--L-sapin: #1a4a26      /* Primary: Titles, Buttons */
--L-feuille: #649a4f    /* Secondary: Hover, Accents */
--L-ecorce: #8d5524     /* Details: Dates, Stats */
--L-eau: #4a8db7        /* Accents: Icons */

/* Typography */
--font-heading: 'Playfair Display', serif
--font-body: 'Lora', serif

/* Spacing */
--radius-sm: 8px
--radius-md: 16px
--radius-lg: 30px
```

---

## Layout Components

### Container
**File:** `style.css:170`
**Usage:** Page wrapper with max-width
```css
.container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
```

### Section
**File:** `style.css:171`
**Usage:** Vertical section spacing
```css
.section { padding: 100px 0; }
```

### Grid Layouts
| Class | Columns | Usage |
|-------|---------|-------|
| `.presentation-grid` | 2 cols | Text + Image layouts |
| `.stats-grid` | 3 cols | Statistics display |
| `.activities-grid` | Auto-fit 320px | Card grids |
| `.contact-grid` | 2 cols | Form + Info |

---

## Navigation Components

### Navbar
**File:** `style.css:243-300`
**States:** Default (transparent), Scrolled (solid)
**Features:**
- Fixed position with scroll detection
- Mobile hamburger menu
- Theme toggle button
- Active page indicator

**HTML Structure:**
```html
<nav class="navbar">
  <div class="container nav-inner">
    <a class="logo">CIE Enghien</a>
    <button class="menu-toggle">☰</button>
    <div class="nav-links">
      <a href="..." class="active">Link</a>
      <a class="btn btn-primary">CTA</a>
      <button class="theme-toggle-btn">🌙</button>
    </div>
  </div>
</nav>
```

### Skip Link (Accessibility)
**File:** `style.css:155-167`
**Purpose:** Keyboard navigation accessibility

---

## Button Components

### Primary Button
**Class:** `.btn-primary`
**File:** `style.css:199-209`
**States:** Default, Hover (lift + glow), Active (scale down)
```css
.btn-primary {
  background-color: var(--color-btn-bg);
  color: var(--text-inverse);
  border-radius: 50px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
}
```

### Outline Button
**Class:** `.btn-outline`
**File:** `style.css:211-220`
**States:** Default (transparent), Hover (filled)

### Disabled Button
**Class:** `.btn-disabled`
**File:** `style.css:222-237`
**Usage:** "Complet" (sold out) events

---

## Card Components

### Activity Card
**Class:** `.activity-card`
**File:** `style.css:402-416`
**Structure:**
```html
<div class="activity-card">
  <div class="activity-img"><img></div>
  <div class="activity-content">
    <h3>Title</h3>
    <p>Description</p>
    <a>Link →</a>
  </div>
</div>
```
**Features:**
- Image zoom on hover
- Card lift animation
- Border accent on hover

### Agenda Item
**Class:** `.agenda-item`
**File:** `style.css:368-399`
**Structure:**
```html
<article class="agenda-item">
  <div class="date-box">
    <span class="day">12</span>
    <span class="month">Juil</span>
  </div>
  <div class="event-info">
    <h3>Event Title</h3>
    <p><img src="clock.svg"> Time <img src="map-pin.svg"> Location</p>
  </div>
  <a class="btn btn-outline">S'inscrire</a>
</article>
```

### Date Box
**Class:** `.date-box`
**File:** `style.css:382-393`
**Purpose:** Calendar-style date display
**Note:** Always brown background for visual identity

### Stats Item
**Class:** `.stat-item`
**File:** `style.css:341-349`
**Usage:** Statistics display (20+ years, 3000+ participants)

---

## Form Components

### Form Input
**Class:** `.form-input`
**File:** `style.css:477-489`
**Elements:** `<input>`, `<textarea>`, `<select>`
**States:** Default, Focus (accent border + ring)

### Form Box
**Class:** `.form-box`
**File:** `style.css:473-476`
**Purpose:** Form container with card styling

### Form Group
**Class:** `.form-group`
**Usage:** Label + Input wrapper

---

## Hero Components

### Full-Screen Hero
**Class:** `.hero`
**File:** `style.css:302-314`
**Features:**
- 100vh height
- Background image with overlay
- Parallax effect on scroll
- Fade-in animation

### Page Header
**Class:** `.page-header`
**File:** `style.css:321-329`
**Purpose:** Subpage hero (50vh)

---

## Section Components

### Section Header
**Class:** `.section-header`
**File:** `style.css:317-319`
**Usage:** Centered title + subtitle

### Subheading
**Class:** `.subheading`
**File:** `style.css:176-184`
**Purpose:** Uppercase category label above titles

---

## Interactive Components

### Theme Toggle
**Class:** `.theme-toggle-btn`
**File:** `style.css:287-295`
**Functionality:** Switches between sun/moon icons, toggles `.dark-mode` class

### Filter Buttons
**Class:** `.filter-btn`
**File:** `style.css:431-439`
**Usage:** Category filtering (animations page)

### Event Tag
**Class:** `.event-tag`
**File:** `style.css:440-445`
**Usage:** Category badges (Adultes, Familles, etc.)

---

## Icon Components

### Feature Icon
**Class:** `.feature-icon`
**File:** `style.css:359-365`
**Usage:** Circular icon container for feature lists

### Icon Circle
**Class:** `.icon-circle`
**File:** `style.css:456-462`
**Usage:** Contact info icons

### Icon Circle Page
**Class:** `.icon-circle-page`
**Usage:** Page section icons

---

## Support Components

### Donation Badge
**Class:** `.donation-badge`
**File:** `style.css:466-471`
**Purpose:** Highlight donation information

### Stats Bar
**Class:** `.stats-bar`
**File:** `style.css:333-339`
**Purpose:** Overlapping statistics section

---

## Animation Classes

### Scroll Reveal
**Class:** `.animate-on-scroll`
**File:** `style.css:517-526`
**Behavior:** Fade-in-up when element enters viewport
**Implementation:** IntersectionObserver API

### Stagger Effect
**File:** `style.css:529-533`
**Purpose:** Sequential animation delays for card grids

---

## Responsive Breakpoints

| Breakpoint | Width | Behavior |
|------------|-------|----------|
| Mobile | ≤768px | Single column, hamburger menu |
| Tablet | 769-1024px | Adjusted spacing |
| Desktop | ≥1025px | Full layout, larger typography |

---

## Dark Mode Adaptations

All components adapt via CSS variable remapping:
- Primary colors → Mint green variants
- Background → Dark surfaces
- Text → Light variants
- Images → Brightness reduced to 85%

---

## Component Count Summary

| Category | Count |
|----------|-------|
| Layout | 4 |
| Navigation | 3 |
| Buttons | 3 |
| Cards | 4 |
| Forms | 3 |
| Heroes | 2 |
| Sections | 2 |
| Interactive | 3 |
| Icons | 3 |
| Support | 2 |
| **Total** | **29 components** |
