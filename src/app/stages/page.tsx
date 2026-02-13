import { Suspense } from 'react'
import { prisma } from '@/lib/prisma'
import { Section, Container } from '@/components/layout'
import { PageHeader } from '@/components/sections'
import { ActivityCard, FilterBar } from '@/components/ui'
import type { FilterConfig } from '@/components/ui'
import styles from './page.module.css'

/**
 * Stages List Page
 * Story 5.3: Build Stages List Page with Filters
 *
 * Implements FR24 (filter by age), FR25 (filter by period), FR29-32 (badges)
 */

// SEO Metadata
export const metadata = {
  title: 'Stages de Vacances - CIE Enghien',
  description:
    "Découvrez nos stages nature pour enfants pendant les vacances scolaires. Activités en plein air au CIE d'Enghien.",
  openGraph: {
    title: 'Stages de Vacances - CIE Enghien',
    description:
      "Stages nature pour enfants pendant les vacances scolaires.",
    type: 'website',
    locale: 'fr_BE',
  },
}

// Age group options (FR24)
const AGE_GROUPS = [
  { value: '3-5', label: '3-5 ans', min: 3, max: 5 },
  { value: '6-9', label: '6-9 ans', min: 6, max: 9 },
  { value: '10-12', label: '10-12 ans', min: 10, max: 12 },
  { value: '13-16', label: '13-16 ans', min: 13, max: 16 },
]

// Period options (FR25)
const PERIODES = [
  { value: 'Carnaval', label: 'Carnaval' },
  { value: 'Pâques', label: 'Pâques' },
  { value: 'Été', label: 'Été' },
  { value: 'Toussaint', label: 'Toussaint' },
]

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function StagesPage({ searchParams }: PageProps) {
  const params = await searchParams
  const ageGroup = typeof params.age === 'string' ? params.age : undefined
  const periode = typeof params.periode === 'string' ? params.periode : undefined

  // Parse age group to get min/max
  const ageFilter = ageGroup ? AGE_GROUPS.find((g) => g.value === ageGroup) : undefined

  // Build filter config (période à gauche, âges à droite)
  const filters: FilterConfig[] = [
    {
      id: 'periode',
      label: 'Période',
      type: 'select',
      options: PERIODES,
      allLabel: 'Toutes les périodes',
    },
    {
      id: 'age',
      label: 'Tranche d\'âge',
      type: 'chips',
      options: AGE_GROUPS.map((g) => ({ value: g.value, label: g.label })),
      allLabel: 'Tous âges',
    },
  ]

  // Fetch stages with filters
  const stages = await prisma.stage.findMany({
    where: {
      published: true,
      ...(periode && { periode }),
      // Age filter: stage's age range must overlap with selected range
      ...(ageFilter && {
        ageMin: { lte: ageFilter.max },
        ageMax: { gte: ageFilter.min },
      }),
    },
    include: {
      categorie: true,
      images: true,
    },
    orderBy: { dateDebut: 'asc' },
  })

  return (
    <>
      <PageHeader
        title="Stages de Vacances"
        subtitle="Des aventures nature pour les enfants pendant les vacances"
      />

      <Section>
        <Container>
          {/* Filters */}
          <Suspense fallback={<div className={styles.filterSkeleton} />}>
            <FilterBar filters={filters} />
          </Suspense>

          {/* Results count */}
          <p className={styles.resultsCount}>
            {stages.length} stage{stages.length !== 1 ? 's' : ''} trouvé
            {stages.length !== 1 ? 's' : ''}
          </p>

          {/* Stage Grid */}
          {stages.length > 0 ? (
            <div className={styles.grid}>
              {stages.map((stage) => (
                <ActivityCard
                  key={stage.id}
                  activity={{
                    type: 'stage',
                    data: {
                      id: stage.id,
                      titre: stage.titre,
                      description: stage.description,
                      ageMin: stage.ageMin,
                      ageMax: stage.ageMax,
                      periode: stage.periode,
                      dateDebut: stage.dateDebut,
                      dateFin: stage.dateFin,
                      prix: stage.prix,
                      createdAt: stage.createdAt,
                      categorie: stage.categorie,
                      images: stage.images,
                      billetwebUrl: stage.billetwebUrl,
                      placesLeft: stage.placesLeft,
                      isFull: stage.isFull,
                    },
                  }}
                />
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <p>Aucun stage ne correspond à vos critères.</p>
              <p>Essayez de modifier vos filtres.</p>
            </div>
          )}
        </Container>
      </Section>
    </>
  )
}
