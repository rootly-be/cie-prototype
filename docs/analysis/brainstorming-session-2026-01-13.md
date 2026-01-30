---
stepsCompleted: [1, 2, 3, 4]
inputDocuments: ['docs/index.md', 'Functional-requirements.md', 'cie4/docs/CHARTE-GRAPHIQUE.md']
session_topic: 'MVP Features for CIE Website v1 - Dynamic Transformation'
session_goals: ['Define MVP scope', 'Admin backoffice for 4 entities', 'Auto-generated agenda logic', 'Design coherence with cie4', 'Validate coherence', 'Find quick wins']
selected_approach: 'user-selected'
techniques_used: ['Question Storming', 'Assumption Reversal', 'Ecosystem Thinking', 'Solution Matrix']
ideas_generated: 26
questions_raised: 26
assumptions_challenged: 5
features_prioritized: 18
session_status: 'completed'
context_file: 'docs/index.md'
---

# Brainstorming Session Results

**Facilitator:** Greg
**Date:** 2026-01-13

## Session Overview

**Topic:** MVP Features for CIE Website v1 - Dynamic Transformation

**Goals:**
- Define essential vs nice-to-have features for v1
- Design admin backoffice for Animations, Formations, Stages
- Define auto-generation logic for Agenda from Formations + Stages
- Ensure strict adherence to cie4 design guide
- Validate overall coherence and identify adjustments
- Discover quick wins (small effort, big impact)

**Constraints:**
- No visitor user accounts (public browsing only)
- Admin-only content management
- Respect existing cie4 design system (colors, typography, components)
- Preserve 7 existing pages structure

**Approach:** User-Selected Techniques

---

## Technique Selection

**Approach:** User-Selected from 4 categories (Structured, Deep, Biomimetic, Quantum)

**Selected Techniques:**
1. **D5 - Question Storming:** Generate questions before answers to identify blind spots
2. **D4 - Assumption Reversal:** Challenge and flip core assumptions to validate coherence
3. **B2 - Ecosystem Thinking:** Analyze entities as interconnected ecosystem
4. **S6 - Solution Matrix:** Systematic grid of features vs effort/impact

**Execution Flow:** D5 → D4 → B2 → S6 (Questions → Challenges → Systems → Structure)

---

## Technique 1: D5 - Question Storming

### UX & Parents Flow
| # | Question | Category |
|---|----------|----------|
| Q1 | Faut-il implémenter un système de ticketing ou utiliser un service tiers ? | Inscription |
| Q2 | La charte graphique est-elle assez claire pour les parents pressés ? | UX |
| Q3 | Les informations sont-elles vraiment disponibles facilement ? | UX |
| Q4 | La boîte à idées est-elle redondante avec le formulaire contact ? | Fonctionnalité |
| Q5 | Que se passe-t-il après inscription ? (emails, rappels, confirmations) | Post-inscription |
| Q6 | Comment gérer l'inscription de plusieurs enfants d'une même famille ? | Inscription |
| Q7 | Les tarifs/réductions sont-ils clairement affichés ? | Pricing |
| Q8 | Quelles métriques l'admin voit en priorité sur son dashboard ? | Admin |
| Q9 | Comment alerter l'admin quand un stage atteint sa capacité max ? | Admin |
| Q10 | Que devient un événement agenda quand la formation source est dépubliée ? | Agenda |

### Entités
| # | Question | Entity |
|---|----------|--------|
| Q11 | Comment gérer les animations qui se répètent chaque année ? | Animations |
| Q12 | Les niveaux scolaires sont-ils suffisamment granulaires ? | Animations |
| Q13 | Faut-il un système de thématiques/tags pour regrouper ? | Animations |
| Q14 | Les formations ont-elles des prérequis ? | Formations |
| Q15 | Distinguer formations ponctuelles vs cycles multi-séances ? | Formations |
| Q16 | Comment gérer les niveaux de difficulté ? | Formations |
| Q17 | La tranche d'âge suffit-elle ou faut-il aussi le niveau scolaire ? | Stages |
| Q18 | Comment gérer semaines complètes vs journées individuelles ? | Stages |
| Q19 | Faut-il un champ "matériel à apporter" ? | Stages |
| Q20 | Quel délai avant qu'un événement apparaisse automatiquement ? | Agenda |
| Q21 | L'admin peut-il modifier un événement auto-généré ? | Agenda |
| Q22 | Comment afficher les événements passés ? | Agenda |

### Technique
| # | Question | Aspect |
|---|----------|--------|
| Q23 | GraphQL ou REST suffit ? | API |
| Q24 | Comment gérer le SEO avec une SPA ? | Frontend |
| Q25 | CMS headless ou admin custom ? | Architecture |
| Q26 | Comment sécuriser les uploads d'images ? | Sécurité |

**Total Questions: 26**

---

## Technique 2: D4 - Assumption Reversal

### Core Assumptions Identified

| # | Assumption | Status |
|---|------------|--------|
| A1 | "Les visiteurs ne veulent PAS de compte" | À challenger |
| A2 | "L'agenda doit être AUTO-généré" | À challenger |
| A3 | "La charte cie4 est PARFAITE telle quelle" | À challenger |
| A4 | "Les 4 entités sont SÉPARÉES" | À challenger |
| A5 | "L'admin est UNE seule personne" | À challenger |

### Assumption Reversal Analysis

**A1 INVERSÉ:** "Les visiteurs VEULENT un compte"
- **Insight:** Même sans compte obligatoire, un compte optionnel permettrait :
  - Sauvegarder ses favoris (stages/formations intéressants)
  - Pré-remplir les formulaires d'inscription
  - Recevoir des notifications personnalisées
- **Decision:** Garder v1 sans compte, mais prévoir l'architecture pour v2

**A2 INVERSÉ:** "L'agenda doit être MANUEL"
- **Insight:** Un agenda 100% auto-généré peut créer des problèmes :
  - Événements qui apparaissent trop tôt/tard
  - Impossibilité d'ajouter des événements ponctuels (portes ouvertes)
  - Pas de contrôle sur l'ordre d'affichage
- **Decision:** Agenda HYBRIDE = auto-généré + événements manuels ponctuels

**A3 INVERSÉ:** "La charte cie4 a des LACUNES"
- **Insight:** En analysant pour les parents pressés :
  - Manque de CTA (Call-To-Action) clairs pour inscription rapide
  - Pas de section "En bref" pour scanner rapidement
  - Les dates/prix pourraient être plus visibles
- **Decision:** Enrichir avec composants supplémentaires (badges, highlights)

**A4 INVERSÉ:** "Les 4 entités sont INTERCONNECTÉES"
- **Insight:**
  - Une Animation peut devenir une Formation (version adulte)
  - Un Stage peut inclure plusieurs Animations
  - L'Agenda est une VUE sur Formations + Stages
- **Decision:** Modéliser les relations many-to-many + tags communs

**A5 INVERSÉ:** "Il y a PLUSIEURS admins avec RÔLES différents"
- **Insight:**
  - Animateur: peut modifier Animations/Stages
  - Coordinateur: peut tout modifier + voir stats
  - Super-admin: gère les utilisateurs admin
- **Decision:** v1 = rôle unique, mais prévoir structure multi-rôles

### Key Insights from Reversal
1. **Agenda hybride** = quick win majeur
2. **Tags transversaux** entre entités = cohérence
3. **Architecture extensible** pour comptes/rôles futurs
4. **UX améliorations** : badges, highlights, CTA visibles

---

## Technique 3: B2 - Ecosystem Thinking

### Entity Ecosystem Map

```
                    ┌─────────────┐
                    │   AGENDA    │
                    │  (Vue/Hub)  │
                    └──────┬──────┘
                           │
            ┌──────────────┼──────────────┐
            │              │              │
            ▼              ▼              ▼
     ┌──────────┐   ┌──────────┐   ┌──────────┐
     │FORMATIONS│   │  STAGES  │   │ EVENTS   │
     │ (Adultes)│   │(Enfants) │   │ (Manuel) │
     └────┬─────┘   └────┬─────┘   └──────────┘
          │              │
          │    ┌─────────┴─────────┐
          │    │                   │
          ▼    ▼                   ▼
     ┌──────────┐           ┌──────────┐
     │ANIMATIONS│           │   TAGS   │
     │(Scolaire)│           │(Communs) │
     └──────────┘           └──────────┘
```

### Ecosystem Flows

**Flow 1: Création → Publication → Agenda**
```
Admin crée Formation → Définit dates → Auto-ajout Agenda → Visible public
```

**Flow 2: Tags Transversaux**
```
Tag "Nature" → Filtre Animations + Formations + Stages ensemble
```

**Flow 3: Cycle de Vie**
```
Draft → Publié → Complet → Passé → Archivé
```

### Symbiotic Relationships

| Relation | Type | Valeur |
|----------|------|--------|
| Formation → Agenda | Auto-génération | Évite double saisie |
| Stage → Agenda | Auto-génération | Évite double saisie |
| Animation ↔ Stage | Inclusion | Stage = N animations |
| Tags → Toutes entités | Unification | Recherche transversale |
| Events manuels → Agenda | Hybridation | Flexibilité |

### Ecosystem Health Indicators
- **Diversité:** 4 entités + tags + events manuels = écosystème riche
- **Redondance:** Agenda comme hub évite isolation
- **Résilience:** Si une entité vide, agenda reste fonctionnel

---

## Technique 4: S6 - Solution Matrix

### Features vs Effort/Impact

| Feature | Effort | Impact | Score | Priority |
|---------|--------|--------|-------|----------|
| CRUD Animations | Medium | High | 8 | **P1** |
| CRUD Formations | Medium | High | 8 | **P1** |
| CRUD Stages | Medium | High | 8 | **P1** |
| Agenda auto-généré | Low | Very High | 10 | **P0** |
| Events manuels (agenda) | Low | High | 9 | **P0** |
| Tags transversaux | Low | High | 9 | **P1** |
| Filtres par tags | Low | Medium | 7 | **P1** |
| Dashboard admin basique | Medium | Medium | 6 | **P2** |
| Badges "Complet/Nouveau" | Very Low | High | 10 | **P0** |
| Section "En bref" | Very Low | Medium | 8 | **P1** |
| Upload images | Medium | Medium | 5 | **P2** |
| Multi-rôles admin | High | Low (v1) | 3 | **P3** |
| Comptes visiteurs | High | Low (v1) | 2 | **v2** |
| Système ticketing | High | Medium | 4 | **P3** |
| Notifications email | Medium | Medium | 5 | **P2** |
| Archives événements | Low | Low | 4 | **P2** |
| SEO optimization | Medium | High | 7 | **P1** |
| Dark mode (existant) | Done | High | - | ✓ |
| Responsive (existant) | Done | High | - | ✓ |

### Priority Groupings

**P0 - Quick Wins (Low Effort, High Impact)**
- Agenda auto-généré depuis Formations/Stages
- Events manuels pour agenda hybride
- Badges visuels "Complet", "Nouveau", "Dernières places"

**P1 - MVP Core**
- CRUD complet pour les 3 entités
- Tags transversaux + filtres
- Section "En bref" pour scan rapide
- SEO basique

**P2 - Nice to Have**
- Dashboard admin avec métriques
- Upload images optimisé
- Notifications email basiques
- Archives

**P3 - Future (v2+)**
- Multi-rôles admin
- Système ticketing intégré
- Comptes visiteurs optionnels

---

## Session Synthesis

### Key Discoveries

1. **Agenda Hybride** - L'insight le plus important : l'agenda ne doit pas être 100% auto-généré mais hybride (auto + manuel) pour permettre des événements ponctuels comme les portes ouvertes.

2. **Tags Transversaux** - Un système de tags commun entre Animations, Formations et Stages améliore considérablement la navigation et la cohérence.

3. **UX Quick Wins** - Badges visuels ("Complet", "Nouveau", "Dernières places") à très faible effort pour un impact UX élevé, surtout pour les parents pressés.

4. **Architecture Extensible** - Même si v1 est simple (pas de comptes visiteurs, un seul rôle admin), l'architecture doit prévoir ces extensions pour v2.

5. **Boîte à idées** - Peut être supprimée, le formulaire contact suffit.

### Coherence Validation

| Aspect | Status | Notes |
|--------|--------|-------|
| Charte graphique | ✅ Valide | Enrichir avec badges/highlights |
| 7 pages structure | ✅ Valide | Garder telle quelle |
| 4 entités | ⚠️ Ajuster | Ajouter Events manuels + Tags |
| Auto-agenda | ⚠️ Ajuster | Passer en hybride |
| Admin unique | ✅ v1 OK | Prévoir multi-rôles v2 |

### Recommended Adjustments

1. **Data Model:**
   - Ajouter entité `Event` pour événements manuels
   - Ajouter entité `Tag` avec relation many-to-many
   - Ajouter champ `status` (draft/published/full/archived)

2. **UI Components to Add:**
   - Badge "Complet" (rouge)
   - Badge "Nouveau" (vert)
   - Badge "Dernières places" (orange)
   - Section "En bref" sur pages détails

3. **Admin Features:**
   - Toggle publication (draft/published)
   - Indicateur capacité restante
   - Création événements manuels agenda

### MVP Scope Definition

**IN Scope (v1):**
- CRUD Animations, Formations, Stages
- Agenda hybride (auto + manuel)
- Tags et filtres
- Badges statut
- Admin single-role
- SEO basique

**OUT Scope (v2+):**
- Comptes visiteurs
- Multi-rôles admin
- Système ticketing
- Notifications email
- Statistiques avancées

---

## Next Steps

1. **Research** (`/bmad:bmm:workflows:research`) - Comparer solutions techniques (CMS vs custom, framework choix)
2. **PRD** (`/bmad:bmm:workflows:prd`) - Documenter les exigences validées
3. **Architecture** (`/bmad:bmm:workflows:create-architecture`) - Définir stack technique

---

*Session completed: 2026-01-13*
*Techniques applied: D5 (Question Storming) → D4 (Assumption Reversal) → B2 (Ecosystem Thinking) → S6 (Solution Matrix)*
