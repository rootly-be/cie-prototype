# Charte Graphique - CIE Enghien

> Centre d'Initiation à l'Environnement d'Enghien
> Version 1.0 - Janvier 2026

---

## Table des matières

1. [Philosophie de design](#1-philosophie-de-design)
2. [Palette de couleurs](#2-palette-de-couleurs)
3. [Typographie](#3-typographie)
4. [Espacements et grille](#4-espacements-et-grille)
5. [Composants UI](#5-composants-ui)
6. [Iconographie](#6-iconographie)
7. [Animations](#7-animations)
8. [Accessibilité](#8-accessibilité)
9. [Mode sombre](#9-mode-sombre)
10. [Responsive Design](#10-responsive-design)

---

## 1. Philosophie de design

### Vision
Le design du site CIE Enghien reflète l'identité d'un centre dédié à la **nature et à l'environnement**. L'esthétique choisie est **organique, chaleureuse et raffinée**, évoquant la forêt wallonne et le parc historique d'Enghien.

### Principes directeurs

| Principe | Application |
|----------|-------------|
| **Naturel** | Couleurs inspirées de la forêt (vert sapin, brun écorce, bleu eau) |
| **Accessible** | Contrastes WCAG AA, navigation clavier, animations respectueuses |
| **Élégant** | Typographie serif sophistiquée, espacements généreux |
| **Discret** | Animations subtiles, pas de surcharge visuelle |

### Ton & Personnalité
- **Accueillant** : Le site doit donner envie de découvrir la nature
- **Professionnel** : Crédibilité institutionnelle (soutien Région Wallonne)
- **Pédagogique** : Clarté de l'information, hiérarchie visuelle évidente

---

## 2. Palette de couleurs

### 2.1 Couleurs principales (Mode clair)

#### Couleurs de marque

| Nom | Variable CSS | Hex | Usage |
|-----|--------------|-----|-------|
| **Vert Sapin** | `--L-sapin` | `#1a4a26` | Titres, boutons, éléments d'action |
| **Vert Feuille** | `--L-feuille` | `#649a4f` | Hovers, accents, bordures actives |
| **Brun Écorce** | `--L-ecorce` | `#8d5524` | Dates, statistiques, détails |
| **Bleu Eau** | `--L-eau` | `#4a8db7` | Icônes, liens, éléments informatifs |

#### Justification des choix

**Vert Sapin (`#1a4a26`)**
> Couleur dominante représentant la forêt profonde du parc d'Enghien. Ce vert foncé évoque la stabilité, la croissance et le respect de l'environnement. Suffisamment sombre pour assurer un excellent contraste sur fond clair.

**Vert Feuille (`#649a4f`)**
> Variante plus lumineuse pour les états interactifs. Représente le renouveau printanier et la vitalité. Utilisé pour les hovers afin de créer une sensation de "vie" au survol.

**Brun Écorce (`#8d5524`)**
> Couleur terreuse évoquant l'écorce des arbres centenaires du parc. Apporte chaleur et ancrage terrestre. Utilisée pour les éléments temporels (dates) et les statistiques.

**Bleu Eau (`#4a8db7`)**
> Rappelle les étangs et cours d'eau du parc d'Enghien. Couleur froide qui équilibre les tons chauds et guide l'œil vers les éléments informatifs.

#### Couleurs de fond et texte

| Nom | Variable CSS | Hex | Usage |
|-----|--------------|-----|-------|
| Fond page | `--L-bg` | `#fdfcf8` | Arrière-plan principal (blanc cassé chaud) |
| Surface carte | `--L-surface` | `#ffffff` | Cartes, modales, éléments surélevés |
| Texte principal | `--L-text` | `#2c3e50` | Corps de texte |
| Texte secondaire | `--text-muted` | `#5a6c7d` | Descriptions, métadonnées |
| Bordures | `--L-border` | `#e0e0e0` | Séparateurs, contours |

### 2.2 Couleurs secondaires

| Nom | Variable CSS | Hex | Usage |
|-----|--------------|-----|-------|
| Écorce sombre | `--L-ecorce-dark` | `#1e3d2b` | Variante date-box événements spéciaux |
| Vert D-feuille | `--D-feuille` | `#81c784` | Accents sur fond sombre |

### 2.3 Utilisation des couleurs

```css
/* Exemple d'utilisation des variables */
.element-principal {
    color: var(--color-primary);      /* Vert sapin */
    background: var(--bg-card);        /* Blanc */
    border: 1px solid var(--border-main);
}

.element-accent {
    color: var(--color-accent);        /* Vert feuille */
}

.element-info {
    color: var(--color-icon);          /* Bleu eau */
}
```

---

## 3. Typographie

### 3.1 Familles de polices

#### Police de titres : Playfair Display

```css
--font-heading: 'Playfair Display', serif;
```

| Caractéristique | Valeur |
|-----------------|--------|
| Type | Serif à empattements élégants |
| Graisses utilisées | 400, 600, 700 |
| Styles | Normal, Italique |

**Pourquoi Playfair Display ?**
> Police serif classique et raffinée qui évoque l'élégance des jardins historiques du XVIIe siècle. Ses empattements fins et son contraste marqué entre pleins et déliés apportent une touche de sophistication institutionnelle tout en restant lisible. Parfaite pour un centre lié au patrimoine wallon.

#### Police de corps : Lora

```css
--font-body: 'Lora', serif;
```

| Caractéristique | Valeur |
|-----------------|--------|
| Type | Serif contemporaine |
| Graisses utilisées | 400, 500, 600 |
| Styles | Normal, Italique |

**Pourquoi Lora ?**
> Police serif moderne et chaleureuse, conçue pour une excellente lisibilité à l'écran. Son caractère organique et ses courbes douces s'harmonisent parfaitement avec Playfair Display tout en étant plus accessible pour la lecture prolongée. Elle évite l'aspect générique des polices sans-serif courantes (Inter, Roboto) et renforce l'identité naturelle du site.

### 3.2 Échelle typographique

#### Mobile (défaut)

| Variable | Taille | Usage |
|----------|--------|-------|
| `--text-xs` | 0.85rem | Tags, labels |
| `--text-sm` | 0.95rem | Métadonnées, notes |
| `--text-base` | 1.05rem | Corps de texte |
| `--text-lg` | 1.25rem | Lead paragraphs |
| `--text-xl` | 1.5rem | H4, sous-titres |
| `--heading-sm` | 2rem | H3 |
| `--heading-md` | 2.5rem | H2 |
| `--heading-lg` | 3rem | H1 |

#### Desktop (>1025px)

| Variable | Taille |
|----------|--------|
| `--text-base` | 1.1rem |
| `--heading-md` | 3rem |
| `--heading-lg` | 4.5rem |

### 3.3 Styles de texte

#### Titres (h1-h4)

```css
h1, h2, h3, h4 {
    font-family: var(--font-heading);
    color: var(--text-heading);
    font-weight: 700;
    line-height: 1.2;
}
```

#### Corps de texte

```css
body {
    font-family: var(--font-body);
    font-size: var(--text-base);
    color: var(--text-main);
    line-height: 1.7;
}
```

#### Subheading (surtitre de section)

```css
.subheading {
    text-transform: uppercase;
    letter-spacing: 2px;
    font-size: var(--text-sm);
    color: var(--text-muted);
    margin-bottom: 10px;
    font-family: var(--font-body);
    font-weight: 600;
}
```

Usage :
```html
<h4 class="subheading">Notre Mission</h4>
<h2>Comprendre pour mieux protéger</h2>
```

---

## 4. Espacements et grille

### 4.1 Rayons de bordure

| Variable | Valeur | Usage |
|----------|--------|-------|
| `--radius-sm` | 8px | Inputs, tags, petits éléments |
| `--radius-md` | 16px | Cartes, modales |
| `--radius-lg` | 30px | Images décoratives, boutons pill |

### 4.2 Ombres

```css
--shadow-card: 0 4px 20px rgba(26, 74, 38, 0.08);
```

> L'ombre utilise la couleur primaire (vert sapin) en transparence pour maintenir la cohérence chromatique.

### 4.3 Conteneur principal

```css
.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px;
}
```

### 4.4 Sections

```css
.section {
    padding: 100px 0;
}
```

---

## 5. Composants UI

### 5.1 Boutons

#### Bouton primaire

```css
.btn-primary {
    background-color: var(--color-btn-bg);
    color: var(--text-inverse);
    padding: 14px 32px;
    border-radius: 50px;
    font-weight: 600;
    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
}
```

| État | Effet |
|------|-------|
| Hover | `brightness(1.1)`, `translateY(-2px)` |
| Active | `scale(0.98)` |
| Focus | Ring bleu `var(--focus-ring)` |

#### Bouton outline

```css
.btn-outline {
    border: 2px solid var(--color-primary);
    color: var(--color-primary);
    background: transparent;
}
```

| État | Effet |
|------|-------|
| Hover | Fond devient `var(--color-primary)`, texte s'inverse |

#### Bouton désactivé

```css
.btn-disabled {
    background: var(--border-main);
    color: var(--text-muted);
    opacity: 0.7;
    pointer-events: none;
}
```

### 5.2 Cartes

#### Activity Card

```css
.activity-card {
    background: var(--bg-card);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-card);
    border: 1px solid var(--border-main);
}
```

| État | Effet |
|------|-------|
| Hover | `translateY(-6px)`, bordure devient `var(--color-accent)` |

### 5.3 Formulaires

```css
.form-input {
    padding: 12px;
    border: 1px solid var(--border-main);
    background-color: var(--bg-input);
    border-radius: var(--radius-sm);
    font-family: var(--font-body);
    font-size: 16px;
}
```

| État | Effet |
|------|-------|
| Focus | Bordure `var(--color-accent)`, ring subtil |

### 5.4 Date Box (Agenda)

```css
.date-box {
    background: var(--L-ecorce);  /* Brun écorce */
    color: white;
    padding: 12px;
    border-radius: var(--radius-sm);
    min-width: 70px;
}
```

> La date-box conserve toujours le fond brun pour l'identité visuelle du calendrier, même en mode sombre.

---

## 6. Iconographie

### 6.1 Style des icônes

| Propriété | Valeur |
|-----------|--------|
| Taille par défaut | 24x24px |
| Stroke width | 2px |
| Style | Outline (pas de fill) |
| Couleur | `var(--color-icon)` (#4a8db7) |

### 6.2 Icônes disponibles

| Icône | Fichier | Usage |
|-------|---------|-------|
| Feuille | `leaf.svg` | Nature, environnement |
| Loupe | `search.svg` | Recherche, découverte |
| Soleil | `sun.svg` | Mode clair |
| Lune | `moon.svg` | Mode sombre |
| Pin | `map-pin.svg` | Localisation |
| Email | `mail.svg` | Contact |
| Téléphone | `phone.svg` | Contact |
| Coeur | `heart.svg` | Soutien, don |
| Horloge | `clock.svg` | Horaires |
| Facebook | `facebook.svg` | Réseaux sociaux |
| Instagram | `instagram.svg` | Réseaux sociaux |

### 6.3 Conteneur d'icône

```css
.icon-circle-page {
    width: 50px;
    height: 50px;
    background: rgba(0,0,0,0.05);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}
```

---

## 7. Animations

### 7.1 Philosophie

Les animations sont **discrètes et organiques**, évoquant le mouvement naturel (feuilles, eau). Elles respectent `prefers-reduced-motion`.

### 7.2 Animations d'entrée

#### Fade In Up (révélation au scroll)

```css
@keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}
```

#### Scale In (stats bar)

```css
@keyframes scaleIn {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
}
```

### 7.3 Stagger (effet cascade)

```css
.animate-on-scroll:nth-child(1) { transition-delay: 0s; }
.animate-on-scroll:nth-child(2) { transition-delay: 0.1s; }
.animate-on-scroll:nth-child(3) { transition-delay: 0.2s; }
/* ... */
```

### 7.4 Micro-interactions

| Élément | Animation |
|---------|-----------|
| Cards | `translateY(-6px)` au hover |
| Agenda items | `translateX(4px)` au hover |
| Boutons | `scale(0.98)` au clic |
| Date box | `scale(1.05)` au hover parent |
| Feature icons | `scale(1.08)` au hover |

### 7.5 Accessibilité

```css
@media (prefers-reduced-motion: reduce) {
    * {
        animation-duration: 0.01ms !important;
        transition-duration: 0.01ms !important;
    }
}
```

---

## 8. Accessibilité

### 8.1 Contrastes

| Combinaison | Ratio | Niveau |
|-------------|-------|--------|
| Texte principal sur fond | 7.5:1 | AAA |
| Texte secondaire sur fond | 4.6:1 | AA |
| Bouton primaire | 7.2:1 | AAA |

### 8.2 Focus visible

```css
--focus-ring: 0 0 0 3px rgba(74, 141, 183, 0.5);

a:focus-visible,
button:focus-visible {
    outline: none;
    box-shadow: var(--focus-ring);
}
```

### 8.3 Skip link

```html
<a href="#main-content" class="skip-link">
    Aller au contenu principal
</a>
```

Le skip link apparaît uniquement au focus pour les utilisateurs clavier.

---

## 9. Mode sombre

### 9.1 Palette mode sombre

| Variable | Clair | Sombre |
|----------|-------|--------|
| `--color-primary` | `#1a4a26` | `#a5d6a7` (vert menthe) |
| `--color-btn-bg` | `#1a4a26` | `#2e7d32` (vert solide) |
| `--color-accent` | `#649a4f` | `#81c784` |
| `--color-detail` | `#8d5524` | `#e6ceb9` (beige sable) |
| `--color-icon` | `#4a8db7` | `#81d4fa` (bleu ciel) |
| `--bg-body` | `#fdfcf8` | `#121212` |
| `--bg-card` | `#ffffff` | `#1e1e1e` |
| `--text-main` | `#2c3e50` | `#e0e0e0` |

### 9.2 Justification des choix sombres

**Vert menthe pour les titres (`#a5d6a7`)**
> En mode sombre, le vert sapin serait illisible. Le vert menthe conserve l'identité verte tout en assurant la lisibilité sur fond noir.

**Beige sable pour les détails (`#e6ceb9`)**
> Le brun écorce deviendrait invisible en mode sombre. Le beige sable maintient la chaleur tout en offrant un excellent contraste.

### 9.3 Images en mode sombre

```css
body.dark-mode img {
    filter: brightness(0.85);
}
```

> Réduit légèrement la luminosité des images pour éviter l'éblouissement.

---

## 10. Responsive Design

### 10.1 Breakpoints

| Nom | Min | Max |
|-----|-----|-----|
| Mobile | 0 | 768px |
| Tablet | 769px | 1024px |
| Desktop | 1025px | ∞ |

### 10.2 Adaptations mobiles

#### Navigation
- Menu hamburger remplace la nav horizontale
- Menu plein écran en overlay

#### Grilles
- `presentation-grid` : 2 colonnes → 1 colonne
- `stats-grid` : 3 colonnes → 1 colonne
- `contact-grid` : 2 colonnes → 1 colonne

#### Typographie
- H1 réduit de `--heading-lg` à `--heading-md`

---

## Annexes

### A. Variables CSS complètes

```css
:root {
    /* Couleurs de marque */
    --L-sapin: #1a4a26;
    --L-feuille: #649a4f;
    --L-ecorce: #8d5524;
    --L-ecorce-dark: #1e3d2b;
    --L-eau: #4a8db7;

    /* Fonds */
    --L-bg: #fdfcf8;
    --L-surface: #ffffff;
    --L-text: #2c3e50;
    --L-border: #e0e0e0;

    /* Mappages actifs */
    --color-primary: var(--L-sapin);
    --color-btn-bg: var(--L-sapin);
    --color-accent: var(--L-feuille);
    --color-detail: var(--L-ecorce);
    --color-icon: var(--L-eau);
    --bg-body: var(--L-bg);
    --bg-card: var(--L-surface);
    --text-main: var(--L-text);
    --text-muted: #5a6c7d;
    --text-heading: var(--L-sapin);
    --text-inverse: #ffffff;
    --border-main: var(--L-border);

    /* Typographie */
    --font-heading: 'Playfair Display', serif;
    --font-body: 'Lora', serif;

    /* Rayons */
    --radius-sm: 8px;
    --radius-md: 16px;
    --radius-lg: 30px;

    /* Ombres */
    --shadow-card: 0 4px 20px rgba(26, 74, 38, 0.08);

    /* Focus */
    --focus-ring: 0 0 0 3px rgba(74, 141, 183, 0.5);
}
```

### B. Import Google Fonts

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;1,400&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap" rel="stylesheet">
```

---

*Document généré pour le CIE Enghien - Janvier 2026*
