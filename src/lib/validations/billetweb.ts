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
