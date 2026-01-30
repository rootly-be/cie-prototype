---
stepsCompleted: ['step-01-init', 'step-02-discovery', 'step-03-success', 'step-04-journeys', 'step-05-domain', 'step-06-innovation', 'step-07-project-type', 'step-08-scoping', 'step-09-functional', 'step-10-nonfunctional', 'step-11-polish']
classification:
  projectType: 'web_app'
  domain: 'edtech'
  complexity: 'medium'
  projectContext: 'brownfield'
inputDocuments:
  - 'Functional-requirements.md'
  - 'docs/index.md'
  - 'docs/project-overview.md'
  - 'docs/architecture.md'
  - 'docs/component-inventory.md'
  - 'docs/source-tree-analysis.md'
  - 'docs/development-guide.md'
  - 'docs/analysis/brainstorming-session-2026-01-13.md'
workflowType: 'prd'
documentCounts:
  briefs: 0
  research: 0
  brainstorming: 1
  projectDocs: 7
projectType: 'brownfield'
decisionsConfirmed:
  inscriptions: 'Liens externes uniquement (Billetweb)'
  imageUpload: 'Hetzner Object Storage (S3-compatible)'
  multiLangue: 'Français uniquement'
  notifications: 'Webhook n8n'
  paiements: 'Hors scope V1'
---

# Product Requirements Document - CIE Enghien Website

**Author:** Greg
**Date:** 2026-01-26
**Version:** 1.0 (MVP)

---

## Executive Summary

Le **Centre d'Initiation à l'Environnement (CIE) d'Enghien** a besoin d'un nouveau site web pour remplacer son WordPress abandonné depuis plusieurs mois. Le projet transforme le prototype statique **cie4** en application web dynamique avec gestion de contenu.

**Objectif principal:** Permettre à l'admin de publier stages, formations et animations en moins de 5 minutes, et aux visiteurs de les trouver et s'inscrire en moins de 2 minutes.

**Périmètre MVP:** CRUD 4 entités, agenda hybride auto-généré, intégration Billetweb (places temps réel), badges de statut, design cie4 pixel-perfect.

**Contrainte critique:** Le design doit correspondre **exactement** au mockup cie4 validé.

---

## Project Context

### Situation actuelle (Brownfield)

| Aspect | État |
|--------|------|
| Site existant | WordPress abandonné (plugin cher, dépassé) |
| Prototype validé | cie4/ — 7 pages HTML statiques, design complet |
| Charte graphique | Validée et documentée (29 composants UI) |
| Gestion contenu | Manuelle, pas de CMS fonctionnel |

### Transformation souhaitée

```
WordPress abandonné  →  Application web dynamique
Contenu statique     →  Backoffice admin CRUD
Pas de visibilité    →  Agenda auto-généré + badges temps réel
```

### Décisions clés confirmées

| Décision | Choix |
|----------|-------|
| Inscriptions | Liens externes vers Billetweb |
| Places disponibles | Sync API Billetweb (premier plugin) |
| Images | Hetzner Object Storage (S3-compatible) |
| Notifications | Webhook n8n (découplé) |
| Langue | Français uniquement |
| Paiements | Hors scope V1 |

---

## Success Criteria

### User Success

- Trouver un stage/formation pertinent en **< 3 clics**
- Information complète visible sans scroll excessif
- Parcours découverte → inscription: **< 2 minutes**

### Admin Success

- Créer et publier un stage: **< 5 minutes**
- Zéro intervention technique pour la gestion quotidienne
- Sync Billetweb automatique (fini la vérification manuelle)

### Business Success

- Taux de remplissage moyen des stages: **≥ 80%**
- Taux de conversion visiteur → inscription: amélioration vs baseline
- Site actif et maintenu (vs WordPress abandonné)

### Technical Success

- **Design cie4 pixel-perfect** (couleurs, typo, 29 composants)
- Lighthouse scores > 90 (Performance, Accessibility, SEO, Best Practices)
- Page load < 3s
- Architecture plugin extensible

---

## Product Scope

### MVP (Phase 1) — Must Have

| Feature | Justification |
|---------|---------------|
| CRUD Animations, Formations, Stages, Agenda | Core business |
| Agenda hybride (auto + manuel) | Évite double saisie |
| Billetweb API integration | Badges temps réel |
| Tags transversaux + filtres | Navigation efficace |
| Badges statut (Nouveau, Complet, Inscriptions bientôt) | UX claire |
| n8n webhook notifications | Alertes admin |
| Hetzner S3 image upload | Contenu visuel |
| Design cie4 exact | Accord validé |

### Phase 2 (Growth) — Nice to Have

| Feature | Value |
|---------|-------|
| Dashboard admin avec stats | Métriques en un coup d'œil |
| Multi-rôles admin | Déléguer aux animateurs |
| SEO avancé | Rich snippets, sitemap dynamique |
| Analytics | Plausible/Matomo |

### Phase 3 (Vision) — Future

| Feature | Value |
|---------|-------|
| Comptes visiteurs | Favoris, pré-remplissage |
| Inscriptions intégrées | Sans Billetweb |
| Paiements | Stripe/Mollie |
| Multi-langue | NL, EN |

### Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Billetweb API instable | Fallback manuel (badge admin) |
| SSR performance | Cache agressif, ISR |
| Adoption admin | UX intuitive, formation simple |
| Scope creep | MVP strict |

---

## User Journeys

### Journey 1: Sophie, Parent — "Trouver un stage vacances"

**Persona:** Sophie, 38 ans, maman de Lucas (8 ans) et Emma (11 ans), travaille à temps plein.

**Scénario:** Dimanche soir 21h30, elle cherche un stage nature pour les vacances de Pâques.

**Parcours:**
1. Recherche Google → landing page CIE
2. Clique "Stages" → filtre par tranche d'âge
3. Repère "Explorateurs de la forêt" avec badge **"Dernières places"**
4. Clique → voit prix, dates, programme
5. Clique "S'inscrire" → Billetweb, inscription en 2 min
6. Retour site → badge **"Complet"** affiché

**Capacités révélées:** Filtres âge, badges temps réel, mobile-friendly, lien Billetweb

---

### Journey 2: Marc, Enseignant — "Organiser une sortie scolaire"

**Persona:** Marc, 45 ans, instituteur P4, classe de 22 élèves.

**Scénario:** Pendant sa pause, il cherche une animation écosystème pour le printemps.

**Parcours:**
1. Ouvre "Animations" → catégories par niveau scolaire
2. Filtre "Primaire P3-P4" → liste adaptée
3. Clique "L'écosystème de la mare" → objectifs pédagogiques, durée, lieu
4. Remplit formulaire contact (sujet: "Inscription Scolaire")
5. Admin reçoit notification n8n → répond le jour même

**Capacités révélées:** Filtres niveau, contenu pédagogique, formulaire catégorisé, webhook n8n

---

### Journey 3: Nathalie, Admin CIE — "Publier les stages d'été"

**Persona:** Nathalie, 52 ans, coordinatrice depuis 15 ans, pas technique.

**Scénario:** Début mars, elle doit publier 6 stages avec photos et liens Billetweb.

**Parcours:**
1. Connexion backoffice → dashboard simple
2. "Nouveau Stage" → formulaire clair
3. Remplit titre, dates, prix, description, âge
4. Upload photo → preview immédiat
5. Colle lien Billetweb → sync places automatique
6. Clique "Publier" → stage visible avec badge "Nouveau", ajouté à l'agenda

**Résultat:** 6 stages publiés en 25 min (vs demi-journée sur WordPress)

**Capacités révélées:** Backoffice simple, upload S3, sync Billetweb, agenda auto, badges auto

---

### Journey 4: Système n8n — "Notification nouveau message"

**Flux:**
1. Visiteur soumet formulaire contact
2. Backend envoie webhook n8n (payload structuré)
3. n8n route selon règles: email admin, Slack, Google Sheet...

**Capacités révélées:** Webhook API, payload structuré, découplage notification/app

---

## Domain Requirements

**Domain:** EdTech (Éducation Environnementale) — **Complexity:** Low-Medium

Ce projet est un site vitrine avec gestion de contenu, pas une plateforme d'apprentissage. Aucune donnée personnelle d'élèves stockée.

| Requirement | Implementation |
|-------------|----------------|
| Accessibilité WCAG AA | Préservé de cie4 (skip-link, focus, contraste) |
| RGPD | Formulaire contact minimal, privacy policy |
| SEO éducatif | Mots-clés pédagogiques, metadata niveaux |

**Non applicable:** COPPA/FERPA, LMS standards, modération contenu.

---

## Technical Requirements

### Frontend Architecture

| Aspect | Decision |
|--------|----------|
| Type | SPA avec SSR/SSG pour SEO |
| Framework | Next.js ou Nuxt.js |
| Rendering | Hybride: pages statiques + hydratation client |
| Design System | cie4 exact (CSS variables, 29 composants) |

### Browser Support

Chrome, Firefox, Safari, Edge (2 dernières versions). IE11 non supporté.

### Performance Targets

| Metric | Target |
|--------|--------|
| Page load | < 3s (3G) |
| TTFB | < 600ms |
| FCP | < 1.8s |
| LCP | < 2.5s |
| Lighthouse (all) | > 90 |

### SEO Strategy

SSR/SSG pour crawlabilité, meta tags par page, Open Graph, sitemap auto, URLs propres (`/stages/explorateurs-foret`), Schema.org pour événements.

---

## Functional Requirements

> **CAPABILITY CONTRACT:** Cette liste définit ce que le produit PEUT faire. Ce qui n'est pas listé n'existera pas.

### Content Management (Admin) — FR1-FR13

| FR | Capability |
|----|------------|
| FR1 | Admin can CRUD Animations |
| FR2 | Admin can CRUD Formations |
| FR3 | Admin can CRUD Stages |
| FR4 | Admin can CRUD manual Agenda events |
| FR5 | Admin can manage Animation categories |
| FR6 | Admin can manage Formation categories |
| FR7 | Admin can manage Stage categories |
| FR8 | Admin can manage Agenda tags (with color) |
| FR9 | Admin can manage cross-entity tags |
| FR10 | Admin can upload images |
| FR11 | Admin can preview before publishing |
| FR12 | Admin can publish/unpublish content |
| FR13 | Admin can mark Stage/Formation as "Full" manually |

### Agenda System — FR14-FR17

| FR | Capability |
|----|------------|
| FR14 | System auto-generates Agenda from Formations with dates |
| FR15 | System auto-generates Agenda from Stages |
| FR16 | Admin can create standalone Agenda events |
| FR17 | System displays Agenda chronologically with date grouping |

### Billetweb Integration — FR18-FR20

| FR | Capability |
|----|------------|
| FR18 | System syncs available places from Billetweb API |
| FR19 | System auto-updates badges based on Billetweb data |
| FR20 | Visitor can click registration link to Billetweb |

### Content Discovery (Visitors) — FR21-FR28

| FR | Capability |
|----|------------|
| FR21 | Visitor can browse Animations by school level |
| FR22 | Visitor can browse Animations by category |
| FR23 | Visitor can browse Formations by category |
| FR24 | Visitor can browse Stages by age group |
| FR25 | Visitor can browse Stages by period/season |
| FR26 | Visitor can view Agenda by month |
| FR27 | Visitor can filter any list by tags |
| FR28 | Visitor can view detailed content pages |

### Status Badges — FR29-FR32

| FR | Capability |
|----|------------|
| FR29 | System displays "Nouveau" badge (< 7 days) |
| FR30 | System displays "Complet" badge (no places) |
| FR31 | System displays "Dernières places" badge (below threshold) |
| FR32 | System displays "Inscriptions bientôt" badge (no link yet) |

### Contact & Communication — FR33-FR35

| FR | Capability |
|----|------------|
| FR33 | Visitor can submit contact form with subject |
| FR34 | System sends webhook to n8n on form submit |
| FR35 | Visitor receives confirmation after submit |

### Authentication & Security — FR36-FR38

| FR | Capability |
|----|------------|
| FR36 | Admin can log in with secure credentials |
| FR37 | System restricts backoffice to authenticated admins |
| FR38 | System logs admin actions for audit |

### User Experience — FR39-FR42

| FR | Capability |
|----|------------|
| FR39 | Visitor can toggle light/dark mode |
| FR40 | System preserves theme preference |
| FR41 | Visitor can navigate with keyboard only |
| FR42 | System provides skip-link to main content |

### Design Fidelity (cie4 Exact Match) — FR43-FR56

> **CRITICAL:** Pixel-perfect match to cie4 mockup. No deviations permitted.

| FR | Capability |
|----|------------|
| FR43 | Exact color palette (L-sapin, L-feuille, L-écorce, L-eau) |
| FR44 | Exact typography (Playfair Display, Lora) |
| FR45 | All 29 UI components from cie4 |
| FR46 | Exact 7-page structure |
| FR47 | Exact breakpoints (768px, 1024px) |
| FR48 | Exact dark mode mappings |
| FR49 | Exact scroll animations (fade-in-up) |
| FR50 | Exact navbar behavior (transparent → solid) |
| FR51 | Exact button styles |
| FR52 | Exact card components |
| FR53 | Exact form styling |
| FR54 | Exact hero sections |
| FR55 | Exact stats-bar component |
| FR56 | Exact footer |

**Total: 56 Functional Requirements**

---

## Non-Functional Requirements

> NFRs define HOW WELL the system performs.

### Performance — NFR1-NFR7

| NFR | Target |
|-----|--------|
| NFR1 | Page load < 3s (3G) |
| NFR2 | Lighthouse Performance > 90 |
| NFR3 | Lighthouse SEO > 90 |
| NFR4 | Lighthouse Best Practices > 90 |
| NFR5 | TTFB < 600ms |
| NFR6 | FCP < 1.8s |
| NFR7 | LCP < 2.5s |

### Security — NFR8-NFR14

| NFR | Requirement |
|-----|-------------|
| NFR8 | HTTPS only |
| NFR9 | Passwords hashed (bcrypt) |
| NFR10 | JWT expiry 24h with refresh |
| NFR11 | CSRF protection |
| NFR12 | Image upload validation |
| NFR13 | SQL injection prevention (ORM) |
| NFR14 | XSS prevention |

### Accessibility — NFR15-NFR22

| NFR | Requirement |
|-----|-------------|
| NFR15 | WCAG 2.1 AA compliance |
| NFR16 | Lighthouse Accessibility > 90 |
| NFR17 | All images have alt text |
| NFR18 | Color contrast 4.5:1 minimum |
| NFR19 | Keyboard accessible |
| NFR20 | Visible focus states |
| NFR21 | Skip-link functional |
| NFR22 | Respects prefers-reduced-motion |

### Integration — NFR23-NFR28

| NFR | Requirement |
|-----|-------------|
| NFR23 | Billetweb sync < 30s |
| NFR24 | Billetweb graceful degradation |
| NFR25 | n8n webhook < 5s |
| NFR26 | n8n retry (3 attempts) |
| NFR27 | S3 upload < 10s |
| NFR28 | S3 error handling |

### Reliability — NFR29-NFR32

| NFR | Requirement |
|-----|-------------|
| NFR29 | Uptime 99% |
| NFR30 | Auto-restart on crash |
| NFR31 | Daily backups (30-day retention) |
| NFR32 | Structured error logging |

**Total: 32 Non-Functional Requirements**

---

## Summary

| Category | Count |
|----------|-------|
| Functional Requirements | 56 |
| Non-Functional Requirements | 32 |
| User Journeys | 4 |
| MVP Features | 9 |
| Phase 2 Features | 4 |
| Phase 3 Features | 4 |

**Next Steps:** Architecture → Epics & Stories → Implementation
