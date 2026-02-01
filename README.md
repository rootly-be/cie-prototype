# CIE Enghien - Site Web

Site web du Centre d'Initiation à l'Environnement d'Enghien.

## Prérequis

- Node.js 22+
- npm

## Installation

```bash
# Cloner le repo
git clone https://github.com/rootly-be/cie-prototype.git
cd cie-prototype

# Installer les dépendances
npm install

# Générer le client Prisma
npm run db:generate

# Initialiser la base de données
npm run db:push

# Créer l'admin et les données de base
npm run db:seed
```

## Développement

```bash
# Démarrer le serveur de développement
npm run dev
```

Le site est accessible sur http://localhost:3000

### Accès Admin

- URL: http://localhost:3000/admin
- Email: `admin@cie-enghien.be`
- Password: `admin123`

## Scripts disponibles

| Commande | Description |
|----------|-------------|
| `npm run dev` | Serveur de développement |
| `npm run build` | Build de production |
| `npm run start` | Démarrer le build de production |
| `npm run lint` | Linter ESLint |
| `npm run db:generate` | Générer le client Prisma |
| `npm run db:push` | Appliquer le schéma à la DB |
| `npm run db:seed` | Créer admin + données de base |
| `npm run db:studio` | Interface Prisma Studio |

## Variables d'environnement

Créer un fichier `.env` à la racine:

```env
# Base de données SQLite
DATABASE_URL="file:./dev.db"

# Secret pour JWT (min 32 caractères)
AUTH_SECRET="votre-secret-jwt-minimum-32-caracteres"

# Optionnel: Billetweb API
BILLETWEB_API_KEY="votre-cle-api"
BILLETWEB_ORG_ID="votre-org-id"

# Optionnel: S3 pour les images
S3_ENDPOINT="https://..."
S3_ACCESS_KEY="..."
S3_SECRET_KEY="..."
S3_BUCKET="..."
```

## Production avec Docker

```bash
# Build de l'image
docker build -t cie-website .

# Démarrer le container
docker run -d --name cie-website -p 3000:3000 \
  -e DATABASE_URL="file:/app/data/prod.db" \
  -e AUTH_SECRET="votre-secret-production-32-chars" \
  -v cie-data:/app/data \
  cie-website
```

Avec Docker Compose:

```bash
# Développement
docker compose up -d

# Production (avec Caddy SSL)
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

## Structure du projet

```
src/
├── app/                    # Pages Next.js App Router
│   ├── admin/             # Pages d'administration
│   ├── animations/        # Pages animations
│   ├── formations/        # Pages formations
│   ├── stages/            # Pages stages
│   └── api/               # Routes API
├── components/            # Composants React
│   ├── ui/               # Composants UI réutilisables
│   ├── layout/           # Header, Footer, etc.
│   └── sections/         # Sections de pages
├── lib/                   # Utilitaires
│   ├── prisma.ts         # Client Prisma
│   ├── auth.ts           # Auth (bcrypt)
│   ├── auth-edge.ts      # Auth Edge (jose)
│   └── services/         # Services métier
└── styles/               # CSS global
prisma/
└── schema.prisma         # Schéma de base de données
```

## Technologies

- **Framework**: Next.js 16 (App Router)
- **Base de données**: SQLite + Prisma
- **Auth**: JWT (jose) + bcrypt
- **Styling**: CSS Modules + CSS Variables
- **Déploiement**: Docker + Caddy
