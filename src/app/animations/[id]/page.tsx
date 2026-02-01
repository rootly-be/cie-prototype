import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { Section, Container } from '@/components/layout'
import { Badge, Button } from '@/components/ui'
import styles from '@/styles/detail-page.module.css'

/**
 * Animation Detail Page
 * Story 5.4: Build Detail Pages for All Content Types
 *
 * Implements FR28 (detailed content pages)
 */

interface PageProps {
  params: Promise<{ id: string }>
}

// Generate dynamic metadata
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const animation = await prisma.animation.findUnique({
    where: { id, published: true },
    select: { titre: true, description: true },
  })

  if (!animation) {
    return { title: 'Animation non trouvée - CIE Enghien' }
  }

  return {
    title: `${animation.titre} - Animations - CIE Enghien`,
    description: animation.description.substring(0, 160),
    openGraph: {
      title: animation.titre,
      description: animation.description.substring(0, 160),
      type: 'article',
      locale: 'fr_BE',
    },
  }
}

export default async function AnimationDetailPage({ params }: PageProps) {
  const { id } = await params

  const animation = await prisma.animation.findUnique({
    where: { id, published: true },
    include: {
      categorie: true,
      images: true,
      tags: true,
    },
  })

  if (!animation) {
    notFound()
  }

  // Check if new (< 7 days)
  const daysSinceCreated = Math.floor(
    (Date.now() - new Date(animation.createdAt).getTime()) / (1000 * 60 * 60 * 24)
  )
  const isNew = daysSinceCreated < 7

  // Get main image
  const mainImage = animation.images[0]

  return (
    <>
      {/* Hero Image */}
      {mainImage && (
        <div className={styles.heroImage}>
          <Image
            src={mainImage.url}
            alt={mainImage.alt || animation.titre}
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
            <Link href="/animations" className={styles.backLink}>
              ← Retour aux animations
            </Link>

            {/* Category */}
            {animation.categorie && (
              <span className={styles.category}>{animation.categorie.nom}</span>
            )}

            {/* Title with Badge */}
            <div className={styles.titleRow}>
              <h1 className={styles.title}>{animation.titre}</h1>
              {isNew && <Badge variant="nouveau" />}
            </div>

            {/* Description */}
            <div className={styles.description}>
              <p>{animation.description}</p>
            </div>

            {/* Metadata */}
            <div className={styles.metaGrid}>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Niveau scolaire</span>
                <span className={styles.metaValue}>{animation.niveau}</span>
              </div>
              {animation.categorie && (
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Catégorie</span>
                  <span className={styles.metaValue}>{animation.categorie.nom}</span>
                </div>
              )}
            </div>

            {/* Tags */}
            {animation.tags.length > 0 && (
              <div className={styles.tags}>
                {animation.tags.map((tag) => (
                  <span key={tag.id} className={styles.tag}>
                    {tag.nom}
                  </span>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className={styles.actions}>
              <Link href="/contact">
                <Button variant="primary">Nous contacter</Button>
              </Link>
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}
