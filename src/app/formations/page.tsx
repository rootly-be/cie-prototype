import { Suspense } from 'react'
import { prisma } from '@/lib/prisma'
import { Section, Container } from '@/components/layout'
import { PageHeader } from '@/components/sections'
import { ActivityCard, FilterBar } from '@/components/ui'
import type { FilterConfig } from '@/components/ui'
import styles from './page.module.css'

/**
 * Formations List Page
 * Story 5.2: Build Formations List Page with Filters
 *
 * Implements FR23 (filter by category), FR29-32 (status badges)
 */

// SEO Metadata
export const metadata = {
  title: 'Formations - CIE Enghien',
  description:
    "Découvrez nos formations pour adultes sur l'environnement, la nature et l'éducation. Développez vos compétences au CIE d'Enghien.",
  openGraph: {
    title: 'Formations - CIE Enghien',
    description:
      "Formations pour adultes sur l'environnement et la nature.",
    type: 'website',
    locale: 'fr_BE',
  },
}

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function FormationsPage({ searchParams }: PageProps) {
  const params = await searchParams
  const categorieId = typeof params.categorie === 'string' ? params.categorie : undefined

  // Fetch categories for filter
  const categories = await prisma.category.findMany({
    where: { type: 'formation' },
    orderBy: { nom: 'asc' },
  })

  // Build filter config
  const filters: FilterConfig[] = [
    {
      id: 'categorie',
      label: 'Catégorie',
      type: 'chips',
      options: categories.map((c) => ({ value: c.id, label: c.nom })),
      allLabel: 'Toutes',
    },
  ]

  // Fetch formations with filters
  const formations = await prisma.formation.findMany({
    where: {
      published: true,
      ...(categorieId && { categorieId }),
    },
    include: {
      categorie: true,
      images: true,
      dates: {
        where: {
          dateDebut: { gte: new Date() },
        },
        orderBy: { dateDebut: 'asc' },
        take: 1,
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <>
      <PageHeader
        title="Formations"
        subtitle="Formations pour adultes sur l'environnement et la nature"
      />

      <Section>
        <Container>
          {/* Filters */}
          <Suspense fallback={<div className={styles.filterSkeleton} />}>
            <FilterBar filters={filters} />
          </Suspense>

          {/* Results count */}
          <p className={styles.resultsCount}>
            {formations.length} formation{formations.length !== 1 ? 's' : ''} trouvée
            {formations.length !== 1 ? 's' : ''}
          </p>

          {/* Formation Grid */}
          {formations.length > 0 ? (
            <div className={styles.grid}>
              {formations.map((formation) => (
                <ActivityCard
                  key={formation.id}
                  activity={{
                    type: 'formation',
                    data: {
                      id: formation.id,
                      titre: formation.titre,
                      description: formation.description,
                      createdAt: formation.createdAt,
                      categorie: formation.categorie,
                      images: formation.images,
                      billetwebUrl: formation.billetwebUrl,
                      placesLeft: formation.placesLeft,
                      isFull: formation.isFull,
                      dates: formation.dates,
                    },
                  }}
                />
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <p>Aucune formation ne correspond à vos critères.</p>
              <p>Essayez de modifier vos filtres.</p>
            </div>
          )}
        </Container>
      </Section>
    </>
  )
}
