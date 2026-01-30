# Cahier des Charges Fonctionnel - CIE Website
## Projet : Transformation du prototype CIE4 en application dynamique

**Version :** 1.0
**Date :** 13 janvier 2026
**Statut :** Document initial

---

## 1. Contexte et Objectifs

### 1.1 Contexte
Le site CIE (Centre d'Information et d'Éducation) propose actuellement un prototype statique (CIE4).
L'objectif est de le transformer en une application web dynamique avec :
- Un **frontend** moderne et responsive
- Un **backend** API RESTful
- Une base de données **PostgreSQL**

### 1.2 Objectifs
- Permettre à l'administrateur de gérer le contenu sans intervention technique
- Offrir une expérience utilisateur fluide pour les visiteurs
- Centraliser la gestion des animations, formations, stages et agenda

---

## 2. Architecture Technique Proposée

| Composant | Technologie suggérée |
|-----------|---------------------|
| Frontend  | React / Next.js ou Vue.js |
| Backend   | Node.js (Express/Fastify) ou Python (FastAPI) |
| Base de données | PostgreSQL |
| Authentification | JWT / Session-based |
| Hébergement | À définir |

---

## 3. Entités et Fonctionnalités

### 3.1 ANIMATIONS

#### Définition
Les animations sont des événements ou activités organisées pour divertir ou engager un public spécifique. Elles peuvent inclure des spectacles, des ateliers, des jeux, des présentations interactives, etc. Les animations sont souvent utilisées dans des contextes tels que les festivals, les événements culturels, les centres de loisirs, les écoles et les entreprises.

#### Modèle de données : Animation

| Champ | Type | Description | Obligatoire |
|-------|------|-------------|-------------|
| id | UUID/Serial | Identifiant unique | Oui (auto) |
| category_id | FK | Référence vers AnimationCategory | Oui |
| image_url | VARCHAR(500) | URL de l'image | Non |
| title | VARCHAR(200) | Titre de l'animation | Oui |
| description | TEXT | Description détaillée | Oui |
| period | VARCHAR(100) | Période de l'animation | Oui |
| location | VARCHAR(200) | Lieu | Oui |
| is_published | BOOLEAN | Statut de publication | Oui (défaut: false) |
| created_at | TIMESTAMP | Date de création | Oui (auto) |
| updated_at | TIMESTAMP | Date de modification | Oui (auto) |

#### Modèle de données : AnimationCategory

| Champ | Type | Description | Obligatoire |
|-------|------|-------------|-------------|
| id | UUID/Serial | Identifiant unique | Oui (auto) |
| name | VARCHAR(100) | Nom de la catégorie | Oui |
| description | TEXT | Description | Non |

#### Fonctionnalités Admin
- [ ] Créer une animation
- [ ] Modifier une animation
- [ ] Supprimer une animation
- [ ] Publier/Dépublier une animation
- [ ] Gérer les catégories d'animations (CRUD)

---

### 3.2 FORMATIONS

#### Définition
Les formations sont des programmes éducatifs ou des cours conçus pour enseigner des compétences spécifiques, des connaissances ou des aptitudes à un groupe de personnes.

#### Modèle de données : Formation

| Champ | Type | Description | Obligatoire |
|-------|------|-------------|-------------|
| id | UUID/Serial | Identifiant unique | Oui (auto) |
| category_id | FK | Référence vers FormationCategory | Oui |
| title | VARCHAR(200) | Titre de la formation | Oui |
| description | TEXT | Description détaillée | Oui |
| image_url | VARCHAR(500) | URL de l'image | Non |
| price | DECIMAL(10,2) | Prix en euros | Oui |
| number_of_sessions | INTEGER | Nombre de sessions | Oui |
| max_participants | INTEGER | Nombre max de participants | Oui |
| duration | VARCHAR(50) | Durée (ex: "2h", "1 journée") | Oui |
| location | VARCHAR(200) | Lieu | Oui |
| register_link | VARCHAR(500) | Lien d'inscription externe | Non |
| is_published | BOOLEAN | Statut de publication | Oui (défaut: false) |
| created_at | TIMESTAMP | Date de création | Oui (auto) |
| updated_at | TIMESTAMP | Date de modification | Oui (auto) |

#### Modèle de données : FormationCategory

| Champ | Type | Description | Obligatoire |
|-------|------|-------------|-------------|
| id | UUID/Serial | Identifiant unique | Oui (auto) |
| name | VARCHAR(100) | Nom de la catégorie | Oui |
| description | TEXT | Description | Non |

#### Fonctionnalités Admin
- [ ] Créer une formation
- [ ] Modifier une formation
- [ ] Supprimer une formation
- [ ] Publier/Dépublier une formation
- [ ] Gérer les catégories de formations (CRUD)

---

### 3.3 STAGES

#### Définition
Les stages sont des périodes d'encadrement pendant les vacances scolaires. Les thèmes des stages sont prédéfinis et varient selon les périodes de l'année.

#### Modèle de données : Stage

| Champ | Type | Description | Obligatoire |
|-------|------|-------------|-------------|
| id | UUID/Serial | Identifiant unique | Oui (auto) |
| category_id | FK | Référence vers StageCategory | Oui |
| title | VARCHAR(200) | Titre du stage | Oui |
| description | TEXT | Description détaillée | Oui |
| image_url | VARCHAR(500) | URL de l'image | Non |
| price | DECIMAL(10,2) | Prix en euros | Oui |
| max_participants | INTEGER | Nombre max de participants | Oui |
| start_date | DATE | Date de début | Oui |
| end_date | DATE | Date de fin | Oui |
| total_days | INTEGER | Nombre total de jours | Oui |
| location | VARCHAR(200) | Lieu | Oui |
| register_link | VARCHAR(500) | Lien d'inscription externe | Non |
| is_published | BOOLEAN | Statut de publication | Oui (défaut: false) |
| created_at | TIMESTAMP | Date de création | Oui (auto) |
| updated_at | TIMESTAMP | Date de modification | Oui (auto) |

#### Modèle de données : StageCategory

| Champ | Type | Description | Obligatoire |
|-------|------|-------------|-------------|
| id | UUID/Serial | Identifiant unique | Oui (auto) |
| name | VARCHAR(100) | Nom de la catégorie | Oui |
| description | TEXT | Description | Non |

#### Fonctionnalités Admin
- [ ] Créer un stage
- [ ] Modifier un stage
- [ ] Supprimer un stage
- [ ] Publier/Dépublier un stage
- [ ] Gérer les catégories de stages (CRUD)

---

### 3.4 AGENDA

#### Définition
L'agenda est un calendrier ou un programme qui répertorie les formations et les stages à venir, permettant aux utilisateurs de planifier leur participation à ces événements.

#### Modèle de données : AgendaItem

| Champ | Type | Description | Obligatoire |
|-------|------|-------------|-------------|
| id | UUID/Serial | Identifiant unique | Oui (auto) |
| tag_id | FK | Référence vers AgendaTag | Oui |
| date | DATE | Date de l'événement | Oui |
| title | VARCHAR(200) | Titre | Oui |
| time_from | TIME | Heure de début | Oui |
| time_to | TIME | Heure de fin | Oui |
| location | VARCHAR(200) | Lieu | Oui |
| register_link | VARCHAR(500) | Lien d'inscription externe | Non |
| is_published | BOOLEAN | Statut de publication | Oui (défaut: false) |
| created_at | TIMESTAMP | Date de création | Oui (auto) |
| updated_at | TIMESTAMP | Date de modification | Oui (auto) |

#### Modèle de données : AgendaTag

| Champ | Type | Description | Obligatoire |
|-------|------|-------------|-------------|
| id | UUID/Serial | Identifiant unique | Oui (auto) |
| name | VARCHAR(50) | Nom du tag | Oui |
| color | VARCHAR(7) | Code couleur hex (ex: #FF5733) | Non |

#### Fonctionnalités Admin
- [ ] Créer un élément d'agenda
- [ ] Modifier un élément d'agenda
- [ ] Supprimer un élément d'agenda
- [ ] Publier/Dépublier un élément
- [ ] Gérer les tags d'agenda (CRUD)

---

## 4. Rôles Utilisateurs

| Rôle | Description | Permissions |
|------|-------------|-------------|
| Visiteur | Utilisateur non connecté | Consultation du contenu publié uniquement |
| Administrateur | Gestionnaire du site | CRUD complet sur toutes les entités |

---

## 5. Fonctionnalités Transversales

### 5.1 Côté Visiteur (Frontend Public)
- [ ] Page d'accueil avec aperçu des contenus
- [ ] Liste des animations (filtrées par catégorie)
- [ ] Liste des formations (filtrées par catégorie)
- [ ] Liste des stages (filtrés par catégorie)
- [ ] Vue agenda/calendrier
- [ ] Page de détail pour chaque entité
- [ ] Responsive design (mobile-first)

### 5.2 Côté Administrateur (Backoffice)
- [ ] Authentification sécurisée
- [ ] Tableau de bord avec statistiques
- [ ] Interface CRUD pour chaque entité
- [ ] Gestion des catégories et tags
- [ ] Prévisualisation avant publication
- [ ] Upload d'images (ou gestion d'URLs)

---

## 6. API Endpoints (Proposition)

### Animations
```
GET    /api/animations          - Liste des animations publiées
GET    /api/animations/:id      - Détail d'une animation
POST   /api/admin/animations    - Créer une animation (auth)
PUT    /api/admin/animations/:id - Modifier une animation (auth)
DELETE /api/admin/animations/:id - Supprimer une animation (auth)
```

### Formations
```
GET    /api/formations          - Liste des formations publiées
GET    /api/formations/:id      - Détail d'une formation
POST   /api/admin/formations    - Créer une formation (auth)
PUT    /api/admin/formations/:id - Modifier une formation (auth)
DELETE /api/admin/formations/:id - Supprimer une formation (auth)
```

### Stages
```
GET    /api/stages              - Liste des stages publiés
GET    /api/stages/:id          - Détail d'un stage
POST   /api/admin/stages        - Créer un stage (auth)
PUT    /api/admin/stages/:id    - Modifier un stage (auth)
DELETE /api/admin/stages/:id    - Supprimer un stage (auth)
```

### Agenda
```
GET    /api/agenda              - Liste des événements publiés
GET    /api/agenda/:id          - Détail d'un événement
POST   /api/admin/agenda        - Créer un événement (auth)
PUT    /api/admin/agenda/:id    - Modifier un événement (auth)
DELETE /api/admin/agenda/:id    - Supprimer un événement (auth)
```

---

## 7. Prochaines Étapes

1. **Validation** de ce cahier des charges
2. **Choix des technologies** (frontend, backend)
3. **Conception de la base de données** (schéma PostgreSQL)
4. **Développement du backend** (API)
5. **Développement du frontend** (public + admin)
6. **Tests et recette**
7. **Déploiement**

---

## 8. Questions Ouvertes

- [ ] Faut-il gérer les inscriptions directement sur le site ou via liens externes uniquement ?
- [ ] Quel système d'upload d'images ? (local, S3, Cloudinary, etc.)
- [ ] Multi-langue nécessaire ?
- [ ] Notifications par email pour les nouveaux événements ?
- [ ] Intégration avec un système de paiement ?

---

*Document à compléter et valider avec les parties prenantes.*
