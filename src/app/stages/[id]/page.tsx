import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { Section, Container } from '@/components/layout'
import { Badge, RegistrationLink } from '@/components/ui'
import { getPrimaryBadge, type BadgeableEntity } from '@/lib/services/badge-service'
import styles from '@/styles/detail-page.module.css'

/**
 * Stage Detail Page
 * Story 5.4: Build Detail Pages for All Content Types
 * Updated Story 7.3: Add Registration Links with proper accessibility
 *
 * Implements FR28 (detailed content pages) and FR20 (registration links)
 */

interface PageProps {
  params: Promise<{ id: string }>
}

// Generate dynamic metadata
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const stage = await prisma.stage.findUnique({
    where: { id, published: true },
    select: { titre: true, description: true },
  })

  if (!stage) {
    return { title: 'Stage non trouvé - CIE Enghien' }
  }

  return {
    title: `${stage.titre} - Stages - CIE Enghien`,
    description: stage.description.substring(0, 160),
    openGraph: {
      title: stage.titre,
      description: stage.description.substring(0, 160),
      type: 'article',
      locale: 'fr_BE',
    },
  }
}

// Format date range
function formatDateRange(start: Date, end: Date): string {
  const startDate = new Date(start)
  const endDate = new Date(end)

  const startStr = startDate.toLocaleDateString('fr-BE', {
    day: 'numeric',
    month: 'long',
  })
  const endStr = endDate.toLocaleDateString('fr-BE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return `Du ${startStr} au ${endStr}`
}

export default async function StageDetailPage({ params }: PageProps) {
  const { id } = await params

  const stage = await prisma.stage.findUnique({
    where: { id, published: true },
    include: {
      categorie: true,
      images: true,
      tags: true,
    },
  })

  if (!stage) {
    notFound()
  }

  // Use badge-service for consistent badge logic (Story 7.2)
  const badgeableEntity: BadgeableEntity = {
    createdAt: stage.createdAt,
    billetwebUrl: stage.billetwebUrl,
    placesLeft: stage.placesLeft,
    isFull: stage.isFull,
  }
  const badge = getPrimaryBadge(badgeableEntity, true)
  const mainImage = stage.images[0]

  return (
    <>
      {/* Hero Image */}
      {mainImage && (
        <div className={styles.heroImage}>
          <Image
            src={mainImage.url}
            alt={mainImage.alt || stage.titre}
            fill
            priority
            sizes="100vw"
          />
        </div>
      )}

      <Section>
        <Container>
          <div className={styles.content}>
            {/* Back Link */}
            <Link href="/stages" className={styles.backLink}>
              ← Retour aux stages
            </Link>

            {/* Category */}
            {stage.categorie && (
              <span className={styles.category}>{stage.categorie.nom}</span>
            )}

            {/* Title with Badge */}
            <div className={styles.titleRow}>
              <h1 className={styles.title}>{stage.titre}</h1>
              {badge && <Badge variant={badge} />}
            </div>

            {/* Description */}
            <div className={styles.description}>
              <p>{stage.description}</p>
            </div>

            {/* Metadata */}
            <div className={styles.metaGrid}>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Tranche d&apos;âge</span>
                <span className={styles.metaValue}>{stage.ageMin}-{stage.ageMax} ans</span>
              </div>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Période</span>
                <span className={styles.metaValue}>{stage.periode}</span>
              </div>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Dates</span>
                <span className={styles.metaValue}>
                  {formatDateRange(stage.dateDebut, stage.dateFin)}
                </span>
              </div>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Prix</span>
                <span className={styles.metaValue}>{stage.prix}</span>
              </div>
              {stage.placesLeft !== null && !stage.isFull && (
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Places disponibles</span>
                  <span className={styles.metaValue}>{stage.placesLeft}</span>
                </div>
              )}
            </div>

            {/* Actions - Story 7.3: RegistrationLink with accessibility */}
            <div className={styles.actions}>
              <RegistrationLink
                billetwebUrl={stage.billetwebUrl}
                isFull={stage.isFull}
                activityTitle={stage.titre}
                activityType="stage"
              />
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}
