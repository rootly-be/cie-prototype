import { z } from 'zod'

/**
 * Validation schemas for Billetweb API integration
 * Story 7.1: Create Billetweb Sync Service
 *
 * Covers:
 * - FR18: System syncs available places from Billetweb API
 * - NFR23: Billetweb sync < 30s
 * - NFR24: Billetweb graceful degradation
 */

/**
 * Schema for Billetweb event data from API response
 */
export const billetwebEventSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  places_total: z.number().int().nonnegative(),
  places_remaining: z.number().int().nonnegative()
})

export type BilletwebEvent = z.infer<typeof billetwebEventSchema>

/**
 * Schema for sync result
 */
export const syncResultSchema = z.object({
  synced: z.number().int().nonnegative(),
  failed: z.number().int().nonnegative(),
  errors: z.array(z.string()),
  duration: z.number().nonnegative(),
  cachedAt: z.date().optional()
})

export type SyncResult = z.infer<typeof syncResultSchema>

/**
 * Schema for individual event sync result
 */
export const eventSyncResultSchema = z.object({
  billetwebId: z.string(),
  entityType: z.enum(['formation', 'stage']),
  entityId: z.string(),
  success: z.boolean(),
  placesTotal: z.number().int().nonnegative().optional(),
  placesLeft: z.number().int().nonnegative().optional(),
  error: z.string().optional()
})

export type EventSyncResult = z.infer<typeof eventSyncResultSchema>

/**
 * Schema for cache entry
 */
export const cacheEntrySchema = z.object({
  data: billetwebEventSchema,
  timestamp: z.number(),
  expiresAt: z.number()
})

export type CacheEntry = z.infer<typeof cacheEntrySchema>

/**
 * Extract billetwebId from a Billetweb URL
 * URL formats:
 * - https://www.billetweb.fr/mon-evenement
 * - https://billetweb.fr/mon-evenement
 * - https://www.billetweb.fr/mon-evenement?param=value
 *
 * @param url The Billetweb URL
 * @returns The event ID (slug) or null if invalid
 */
export function extractBilletwebId(url: string | null | undefined): string | null {
  if (!url) return null

  try {
    const parsed = new URL(url)

    // Check if it's a billetweb.fr domain
    if (!parsed.hostname.includes('billetweb.fr')) {
      return null
    }

    // Get the path and extract the event slug
    // Path is like /mon-evenement or /mon-evenement/
    const path = parsed.pathname.replace(/^\/+|\/+$/g, '') // Remove leading/trailing slashes

    if (!path) return null

    // The path might have multiple segments, we want the first one (event slug)
    const segments = path.split('/')
    const eventSlug = segments[0]

    return eventSlug || null
  } catch {
    // If URL parsing fails, try a simple regex extraction
    const match = url.match(/billetweb\.fr\/([a-zA-Z0-9_-]+)/)
    return match ? match[1] : null
  }
}
