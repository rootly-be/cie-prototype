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
 * Formation Detail Page
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
  const formation = await prisma.formation.findUnique({
    where: { id, published: true },
    select: { titre: true, description: true },
  })

  if (!formation) {
    return { title: 'Formation non trouvée - CIE Enghien' }
  }

  return {
    title: `${formation.titre} - Formations - CIE Enghien`,
    description: formation.description.substring(0, 160),
    openGraph: {
      title: formation.titre,
      description: formation.description.substring(0, 160),
      type: 'article',
      locale: 'fr_BE',
    },
  }
}

// Format date
function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString('fr-BE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default async function FormationDetailPage({ params }: PageProps) {
  const { id } = await params

  const formation = await prisma.formation.findUnique({
    where: { id, published: true },
    include: {
      categorie: true,
      images: true,
      tags: true,
      dates: {
        orderBy: { dateDebut: 'asc' },
      },
    },
  })

  if (!formation) {
    notFound()
  }

  // Use badge-service for consistent badge logic (Story 7.2)
  const badgeableEntity: BadgeableEntity = {
    createdAt: formation.createdAt,
    billetwebUrl: formation.billetwebUrl,
    placesLeft: formation.placesLeft,
    isFull: formation.isFull,
  }
  const badge = getPrimaryBadge(badgeableEntity, true)
  const mainImage = formation.images[0]
  const upcomingDates = formation.dates.filter((d) => new Date(d.dateDebut) >= new Date())

  return (
    <>
      {/* Hero Image */}
      {mainImage && (
        <div className={styles.heroImage}>
          <Image
            src={mainImage.url}
            alt={mainImage.alt || formation.titre}
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
            <Link href="/formations" className={styles.backLink}>
              ← Retour aux formations
            </Link>

            {/* Category */}
            {formation.categorie && (
              <span className={styles.category}>{formation.categorie.nom}</span>
            )}

            {/* Title with Badge */}
            <div className={styles.titleRow}>
              <h1 className={styles.title}>{formation.titre}</h1>
              {badge && <Badge variant={badge} />}
            </div>

            {/* Description */}
            <div className={styles.description}>
              <p>{formation.description}</p>
            </div>

            {/* Metadata */}
            <div className={styles.metaGrid}>
              {formation.categorie && (
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Catégorie</span>
                  <span className={styles.metaValue}>{formation.categorie.nom}</span>
                </div>
              )}
              {formation.placesLeft !== null && !formation.isFull && (
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Places disponibles</span>
                  <span className={styles.metaValue}>{formation.placesLeft}</span>
                </div>
              )}
            </div>

            {/* Upcoming Dates */}
            {upcomingDates.length > 0 && (
              <div className={styles.metaGrid}>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Prochaines dates</span>
                  {upcomingDates.map((date) => (
                    <span key={date.id} className={styles.metaValue}>
                      {formatDate(date.dateDebut)}
                      {date.lieu && ` - ${date.lieu}`}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Actions - Story 7.3: RegistrationLink with accessibility */}
            <div className={styles.actions}>
              <RegistrationLink
                billetwebUrl={formation.billetwebUrl}
                isFull={formation.isFull}
                activityTitle={formation.titre}
                activityType="formation"
              />
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}
