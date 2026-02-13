/**
 * Database Seed Script
 * Creates default admin user and sample data
 *
 * Usage:
 *   npm run db:seed
 *
 * Or with custom credentials:
 *   ADMIN_EMAIL=admin@example.com ADMIN_PASSWORD=secret npm run db:seed
 */

import { prisma } from '../src/lib/prisma'
import { hashPassword } from '../src/lib/auth'

// Default admin credentials (change in production!)
const DEFAULT_ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@cie-enghien.be'
const DEFAULT_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'

async function main() {
  console.log('🌱 Starting seed...')

  // Create default admin user
  const existingAdmin = await prisma.admin.findUnique({
    where: { email: DEFAULT_ADMIN_EMAIL }
  })

  if (existingAdmin) {
    console.log(`✓ Admin already exists: ${DEFAULT_ADMIN_EMAIL}`)
  } else {
    const passwordHash = await hashPassword(DEFAULT_ADMIN_PASSWORD)

    const admin = await prisma.admin.create({
      data: {
        email: DEFAULT_ADMIN_EMAIL,
        passwordHash
      }
    })

    console.log(`✓ Admin created: ${admin.email}`)
    console.log(`  Password: ${DEFAULT_ADMIN_PASSWORD}`)
    console.log('  ⚠️  Change this password in production!')
  }

  // Create default categories
  const categories = [
    // Animation categories
    { nom: 'Nature', type: 'animation' },
    { nom: 'Sciences', type: 'animation' },
    { nom: 'Art', type: 'animation' },
    { nom: 'Sport', type: 'animation' },
    // Formation categories
    { nom: 'Pédagogie', type: 'formation' },
    { nom: 'Environnement', type: 'formation' },
    { nom: 'Bien-être', type: 'formation' },
    // Stage categories
    { nom: 'Multi-activités', type: 'stage' },
    { nom: 'Nature & Aventure', type: 'stage' },
    { nom: 'Créatif', type: 'stage' },
  ]

  for (const cat of categories) {
    const existing = await prisma.category.findFirst({
      where: { nom: cat.nom, type: cat.type }
    })

    if (!existing) {
      await prisma.category.create({ data: cat })
      console.log(`✓ Category created: ${cat.nom} (${cat.type})`)
    }
  }

  // Create default tags
  const tags = [
    { nom: 'Nouveau', couleur: '#22c55e' },
    { nom: 'Populaire', couleur: '#f59e0b' },
    { nom: 'Extérieur', couleur: '#3b82f6' },
    { nom: 'Intérieur', couleur: '#8b5cf6' },
    { nom: 'Famille', couleur: '#ec4899' },
  ]

  for (const tag of tags) {
    const existing = await prisma.tag.findUnique({
      where: { nom: tag.nom }
    })

    if (!existing) {
      await prisma.tag.create({ data: tag })
      console.log(`✓ Tag created: ${tag.nom}`)
    }
  }

  // Create default niveaux (school levels)
  const niveaux = [
    { code: 'M1', label: 'Maternelle 1', ordre: 1 },
    { code: 'M2/M3', label: 'Maternelle 2-3', ordre: 2 },
    { code: 'P1-P2', label: 'Primaire 1-2', ordre: 3 },
    { code: 'P3-P4', label: 'Primaire 3-4', ordre: 4 },
    { code: 'P5-P6', label: 'Primaire 5-6', ordre: 5 },
    { code: 'S1-S3', label: 'Secondaire 1-3', ordre: 6 },
    { code: 'S4-S6', label: 'Secondaire 4-6', ordre: 7 },
  ]

  for (const niveau of niveaux) {
    const existing = await prisma.niveau.findUnique({
      where: { code: niveau.code }
    })

    if (!existing) {
      await prisma.niveau.create({ data: niveau })
      console.log(`✓ Niveau created: ${niveau.code} (${niveau.label})`)
    }
  }

  console.log('')
  console.log('🎉 Seed completed!')
  console.log('')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('  Admin Login:')
  console.log(`  Email:    ${DEFAULT_ADMIN_EMAIL}`)
  console.log(`  Password: ${DEFAULT_ADMIN_PASSWORD}`)
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
