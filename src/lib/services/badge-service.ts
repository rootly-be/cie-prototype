/**
 * Badge Service
 * Story 7.2: Implement Automatic Status Badge Logic
 *
 * Covers:
 * - FR29: "Nouveau" badge (< 7 days)
 * - FR30: "Complet" badge (no places)
 * - FR31: "Dernières places" badge (below threshold)
 * - FR32: "Inscriptions bientôt" badge (no link yet)
 * - FR19: Badges update automatically
 */

// Configuration
export const BADGE_CONFIG = {
  NOUVEAU_DAYS: 7,
  DERNIERES_PLACES_THRESHOLD: 5
} as const

// Badge types and their priorities (lower = higher priority)
export type BadgeType = 'nouveau' | 'complet' | 'dernieres-places' | 'inscriptions-bientot'

export interface BadgeInfo {
  type: BadgeType
  label: string
  priority: number
}

const BADGE_DEFINITIONS: Record<BadgeType, Omit<BadgeInfo, 'type'>> = {
  'complet': {
    label: 'Complet',
    priority: 1 // Highest priority - most important info
  },
  'dernieres-places': {
    label: 'Dernières places',
    priority: 2
  },
  'nouveau': {
    label: 'Nouveau',
    priority: 3
  },
  'inscriptions-bientot': {
    label: 'Inscriptions bientôt',
    priority: 4 // Lowest priority
  }
}

// Entity interface for badge calculation
export interface BadgeableEntity {
  createdAt: Date | string
  billetwebUrl?: string | null
  placesLeft?: number | null
  placesTotal?: number | null
  isFull?: boolean
}

/**
 * Check if entity is new (created less than NOUVEAU_DAYS ago)
 */
export function isNew(createdAt: Date | string): boolean {
  const created = new Date(createdAt)
  const daysSinceCreated = Math.floor(
    (Date.now() - created.getTime()) / (1000 * 60 * 60 * 24)
  )
  return daysSinceCreated < BADGE_CONFIG.NOUVEAU_DAYS
}

/**
 * Check if entity is full (no places left)
 */
export function isFull(entity: BadgeableEntity): boolean {
  return entity.isFull === true || entity.placesLeft === 0
}

/**
 * Check if entity has last spots available
 */
export function hasLastSpots(entity: BadgeableEntity): boolean {
  return (
    entity.placesLeft !== null &&
    entity.placesLeft !== undefined &&
    entity.placesLeft > 0 &&
    entity.placesLeft <= BADGE_CONFIG.DERNIERES_PLACES_THRESHOLD
  )
}

/**
 * Check if registration is coming soon (no link yet)
 */
export function isRegistrationComingSoon(entity: BadgeableEntity): boolean {
  return !entity.billetwebUrl
}

/**
 * Get all applicable badges for an entity, sorted by priority
 */
export function getAllBadges(entity: BadgeableEntity, hasPlacesInfo: boolean = true): BadgeInfo[] {
  const badges: BadgeInfo[] = []

  // Check each badge condition
  if (hasPlacesInfo) {
    if (isFull(entity)) {
      badges.push({ type: 'complet', ...BADGE_DEFINITIONS['complet'] })
    } else if (hasLastSpots(entity)) {
      badges.push({ type: 'dernieres-places', ...BADGE_DEFINITIONS['dernieres-places'] })
    } else if (isRegistrationComingSoon(entity)) {
      badges.push({ type: 'inscriptions-bientot', ...BADGE_DEFINITIONS['inscriptions-bientot'] })
    }
  }

  if (isNew(entity.createdAt)) {
    badges.push({ type: 'nouveau', ...BADGE_DEFINITIONS['nouveau'] })
  }

  // Sort by priority
  return badges.sort((a, b) => a.priority - b.priority)
}

/**
 * Get the primary (highest priority) badge for an entity
 * This is what should be displayed when only one badge can be shown
 */
export function getPrimaryBadge(entity: BadgeableEntity, hasPlacesInfo: boolean = true): BadgeType | null {
  const badges = getAllBadges(entity, hasPlacesInfo)
  return badges.length > 0 ? badges[0].type : null
}

/**
 * Get badge for animation (no places info)
 */
export function getAnimationBadge(createdAt: Date | string): BadgeType | null {
  return isNew(createdAt) ? 'nouveau' : null
}

/**
 * Get badge for formation or stage
 */
export function getFormationOrStageBadge(entity: BadgeableEntity): BadgeType | null {
  return getPrimaryBadge(entity, true)
}
