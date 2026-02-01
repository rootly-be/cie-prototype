/**
 * ActivityCard Component
 * Story 5.6: Create ActivityCard for All Content Types
 *
 * Unified card component for displaying animations, formations, and stages
 * with appropriate badges and metadata.
 */

import Link from 'next/link'
import Image from 'next/image'
import { Badge } from './Badge'
import { getPrimaryBadge, getAnimationBadge, type BadgeableEntity } from '@/lib/services/badge-service'
import styles from './ActivityCard.module.css'

// =========================================
// Type Definitions
// =========================================

interface ImageData {
  url: string
  alt: string | null
}

interface CategoryData {
  nom: string
}

interface FormationDateData {
  dateDebut: Date | string
}

interface BaseActivity {
  id: string
  titre: string
  description: string
  createdAt: Date | string
  images?: ImageData[]
  categorie?: CategoryData | null
}

interface AnimationData extends BaseActivity {
  niveau: string
}

interface FormationData extends BaseActivity {
  billetwebUrl?: string | null
  placesLeft?: number | null
  isFull?: boolean
  dates?: FormationDateData[]
}

interface StageData extends BaseActivity {
  ageMin: number
  ageMax: number
  periode: string
  dateDebut: Date | string
  dateFin: Date | string
  prix: string
  billetwebUrl?: string | null
  placesLeft?: number | null
  isFull?: boolean
}

type ActivityData =
  | { type: 'animation'; data: AnimationData }
  | { type: 'formation'; data: FormationData }
  | { type: 'stage'; data: StageData }

interface ActivityCardProps {
  activity: ActivityData
  className?: string
}

// =========================================
// Badge Logic Helper (uses badge-service)
// =========================================

type BadgeType = 'nouveau' | 'complet' | 'dernieres-places' | 'inscriptions-bientot' | null

function determineBadge(activity: ActivityData): BadgeType {
  const { type, data } = activity

  // For animations, only check "Nouveau"
  if (type === 'animation') {
    return getAnimationBadge(data.createdAt)
  }

  // For formations and stages, use full badge logic
  const activityData = data as FormationData | StageData
  const badgeableEntity: BadgeableEntity = {
    createdAt: activityData.createdAt,
    billetwebUrl: activityData.billetwebUrl,
    placesLeft: activityData.placesLeft,
    isFull: activityData.isFull
  }

  return getPrimaryBadge(badgeableEntity, true)
}

// =========================================
// Metadata Formatters
// =========================================

function formatDate(date: Date | string): string {
  const d = new Date(date)
  return d.toLocaleDateString('fr-BE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function formatDateRange(start: Date | string, end: Date | string): string {
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

  return `${startStr} - ${endStr}`
}

function getAgeRangeLabel(ageMin: number, ageMax: number): string {
  return `${ageMin}-${ageMax} ans`
}

// =========================================
// Main Component
// =========================================

export function ActivityCard({ activity, className }: ActivityCardProps) {
  const { type, data } = activity
  const badge = determineBadge(activity)

  // Get image or placeholder
  const image = data.images?.[0]
  const imageSrc = image?.url || '/images/placeholder.jpg'
  const imageAlt = image?.alt || data.titre

  // Build link href
  const href = `/${type}s/${data.id}`

  // Truncate description
  const truncatedDescription =
    data.description.length > 120
      ? data.description.substring(0, 120) + '...'
      : data.description

  const cardClasses = [styles.activityCard, className || ''].filter(Boolean).join(' ')

  return (
    <Link href={href} className={cardClasses}>
      {/* Image Area */}
      <div className={styles.imageWrapper}>
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className={styles.image}
        />
        {badge && (
          <div className={styles.badgeWrapper}>
            <Badge variant={badge} />
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className={styles.content}>
        {/* Category/Type Label */}
        {data.categorie && (
          <span className={styles.category}>{data.categorie.nom}</span>
        )}

        {/* Title */}
        <h3 className={styles.title}>{data.titre}</h3>

        {/* Description */}
        <p className={styles.description}>{truncatedDescription}</p>

        {/* Type-specific Metadata */}
        <div className={styles.metadata}>
          {type === 'animation' && (
            <AnimationMeta data={data as AnimationData} />
          )}
          {type === 'formation' && (
            <FormationMeta data={data as FormationData} />
          )}
          {type === 'stage' && <StageMeta data={data as StageData} />}
        </div>
      </div>
    </Link>
  )
}

// =========================================
// Type-Specific Metadata Components
// =========================================

function AnimationMeta({ data }: { data: AnimationData }) {
  return (
    <div className={styles.metaRow}>
      <span className={styles.metaLabel}>Niveau:</span>
      <span className={styles.metaValue}>{data.niveau}</span>
    </div>
  )
}

function FormationMeta({ data }: { data: FormationData }) {
  const nextDate = data.dates?.[0]?.dateDebut

  return (
    <>
      {nextDate && (
        <div className={styles.metaRow}>
          <span className={styles.metaLabel}>Prochaine date:</span>
          <span className={styles.metaValue}>{formatDate(nextDate)}</span>
        </div>
      )}
      {data.placesLeft !== null && data.placesLeft !== undefined && !data.isFull && (
        <div className={styles.metaRow}>
          <span className={styles.metaLabel}>Places:</span>
          <span className={styles.metaValue}>{data.placesLeft} disponibles</span>
        </div>
      )}
    </>
  )
}

function StageMeta({ data }: { data: StageData }) {
  return (
    <>
      <div className={styles.metaRow}>
        <span className={styles.metaLabel}>Âge:</span>
        <span className={styles.metaValue}>
          {getAgeRangeLabel(data.ageMin, data.ageMax)}
        </span>
      </div>
      <div className={styles.metaRow}>
        <span className={styles.metaLabel}>Période:</span>
        <span className={styles.metaValue}>{data.periode}</span>
      </div>
      <div className={styles.metaRow}>
        <span className={styles.metaLabel}>Dates:</span>
        <span className={styles.metaValue}>
          {formatDateRange(data.dateDebut, data.dateFin)}
        </span>
      </div>
      <div className={styles.metaRow}>
        <span className={styles.metaLabel}>Prix:</span>
        <span className={styles.metaValue}>{data.prix}</span>
      </div>
    </>
  )
}
