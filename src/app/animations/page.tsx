import { Suspense } from 'react'
import { prisma } from '@/lib/prisma'
import { Section, Container } from '@/components/layout'
import { PageHeader } from '@/components/sections'
import { ActivityCard, FilterBar } from '@/components/ui'
import type { FilterConfig } from '@/components/ui'
import styles from './page.module.css'

/**
 * Animations List Page
 * Story 5.1: Build Animations List Page with Filters
 *
 * Implements FR21 (filter by level), FR22 (filter by category), FR29 (nouveau badge)
 * ISR with 60s revalidation
 */

// ISR Configuration
export const revalidate = 60

// SEO Metadata
export const metadata = {
  title: 'Animations Scolaires - CIE Enghien',
  description:
    "Découvrez nos animations scolaires pour tous les niveaux, de la maternelle au secondaire. Activités nature et environnement au CIE d'Enghien.",
  openGraph: {
    title: 'Animations Scolaires - CIE Enghien',
    description:
      "Animations scolaires nature et environnement pour tous les niveaux.",
    type: 'website',
    locale: 'fr_BE',
  },
}

// School level options (FR21)
const NIVEAUX = [
  { value: 'M1', label: 'Maternelle 1ère' },
  { value: 'M2/M3', label: 'Maternelle 2-3' },
  { value: 'P1-P2', label: 'Primaire 1-2' },
  { value: 'P3-P4', label: 'Primaire 3-4' },
  { value: 'P5-P6', label: 'Primaire 5-6' },
  { value: 'S1-S3', label: 'Secondaire 1-3' },
  { value: 'S4-S6', label: 'Secondaire 4-6' },
]

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function AnimationsPage({ searchParams }: PageProps) {
  const params = await searchParams
  const niveau = typeof params.niveau === 'string' ? params.niveau : undefined
  const categorieId = typeof params.categorie === 'string' ? params.categorie : undefined

  // Fetch categories for filter
  const categories = await prisma.category.findMany({
    where: { type: 'animation' },
    orderBy: { nom: 'asc' },
  })

  // Build filter config
  const filters: FilterConfig[] = [
    {
      id: 'niveau',
      label: 'Niveau scolaire',
      type: 'select',
      options: NIVEAUX,
      allLabel: 'Tous les niveaux',
    },
    {
      id: 'categorie',
      label: 'Catégorie',
      type: 'chips',
      options: categories.map((c) => ({ value: c.id, label: c.nom })),
      allLabel: 'Toutes',
    },
  ]

  // Fetch animations with filters
  const animations = await prisma.animation.findMany({
    where: {
      published: true,
      ...(niveau && { niveau }),
      ...(categorieId && { categorieId }),
    },
    include: {
      categorie: true,
      images: true,
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <>
      <PageHeader
        title="Animations Scolaires"
        subtitle="Découvrez nos programmes éducatifs pour tous les niveaux"
      />

      <Section>
        <Container>
          {/* Filters - wrapped in Suspense for client component */}
          <Suspense fallback={<div className={styles.filterSkeleton} />}>
            <FilterBar filters={filters} />
          </Suspense>

          {/* Results count */}
          <p className={styles.resultsCount}>
            {animations.length} animation{animations.length !== 1 ? 's' : ''} trouvée
            {animations.length !== 1 ? 's' : ''}
          </p>

          {/* Animation Grid */}
          {animations.length > 0 ? (
            <div className={styles.grid}>
              {animations.map((animation) => (
                <ActivityCard
                  key={animation.id}
                  activity={{
                    type: 'animation',
                    data: {
                      id: animation.id,
                      titre: animation.titre,
                      description: animation.description,
                      niveau: animation.niveau,
                      createdAt: animation.createdAt,
                      categorie: animation.categorie,
                      images: animation.images,
                    },
                  }}
                />
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <p>Aucune animation ne correspond à vos critères.</p>
              <p>Essayez de modifier vos filtres.</p>
            </div>
          )}
        </Container>
      </Section>
    </>
  )
}
