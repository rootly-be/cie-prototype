import { prisma } from '@/lib/prisma'
import { billetwebEventSchema } from '@/lib/validations/billetweb'
import type { BilletwebEvent, SyncResult, EventSyncResult } from '@/lib/validations/billetweb'

/**
 * Billetweb Sync Service
 * Story 7.1: Create Billetweb Sync Service
 *
 * Covers:
 * - FR18: System syncs available places from Billetweb API
 * - NFR23: Billetweb sync < 30s
 * - NFR24: Billetweb graceful degradation
 */

// Cache configuration
const CACHE_TTL_MS = 5 * 60 * 1000 // 5 minutes

// In-memory cache for Billetweb API responses
interface CacheEntry {
  data: BilletwebEvent
  timestamp: number
  expiresAt: number
}

const cache = new Map<string, CacheEntry>()

/**
 * BilletwebService - Singleton service for Billetweb API integration
 */
class BilletwebService {
  private apiKey: string
  private apiUrl: string

  constructor() {
    this.apiKey = process.env.BILLETWEB_API_KEY || ''
    this.apiUrl = process.env.BILLETWEB_API_URL || 'https://www.billetweb.fr/api'
  }

  /**
   * Check if API is configured
   */
  isConfigured(): boolean {
    return !!this.apiKey
  }

  /**
   * Get event places from Billetweb API
   * Implements caching with 5-minute TTL (NFR24)
   */
  async getEventPlaces(billetwebId: string): Promise<{ total: number; left: number } | null> {
    // Check cache first
    const cached = cache.get(billetwebId)
    if (cached && Date.now() < cached.expiresAt) {
      return {
        total: cached.data.places_total,
        left: cached.data.places_remaining
      }
    }

    // If not configured, return null (graceful degradation)
    if (!this.isConfigured()) {
      console.warn('[BilletwebService.getEventPlaces] API not configured, skipping sync')
      return null
    }

    try {
      const response = await fetch(`${this.apiUrl}/event/${billetwebId}/places`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Accept': 'application/json'
        },
        signal: AbortSignal.timeout(10000) // 10s timeout per request
      })

      if (!response.ok) {
        // On error, serve stale cache if available (NFR24)
        if (cached) {
          console.warn(`[BilletwebService.getEventPlaces] API error, serving stale cache for ${billetwebId}`)
          return {
            total: cached.data.places_total,
            left: cached.data.places_remaining
          }
        }
        throw new Error(`Billetweb API returned ${response.status}`)
      }

      const rawData = await response.json()
      const data = billetwebEventSchema.parse(rawData)

      // Update cache
      cache.set(billetwebId, {
        data,
        timestamp: Date.now(),
        expiresAt: Date.now() + CACHE_TTL_MS
      })

      return {
        total: data.places_total,
        left: data.places_remaining
      }
    } catch (error) {
      // Graceful degradation: serve stale cache on error (NFR24)
      if (cached) {
        console.warn(`[BilletwebService.getEventPlaces] Error, serving stale cache for ${billetwebId}:`, {
          errorType: error instanceof Error ? error.constructor.name : 'Unknown'
        })
        return {
          total: cached.data.places_total,
          left: cached.data.places_remaining
        }
      }

      console.error(`[BilletwebService.getEventPlaces] Error fetching ${billetwebId}:`, {
        code: 'BILLETWEB_API_ERROR',
        errorType: error instanceof Error ? error.constructor.name : 'Unknown'
      })
      return null
    }
  }

  /**
   * Sync all events that have billetwebId configured
   * NFR23: Must complete in < 30s
   */
  async syncAllEvents(): Promise<SyncResult> {
    const startTime = Date.now()
    const results: EventSyncResult[] = []
    const errors: string[] = []

    // If not configured, return empty result (graceful degradation)
    if (!this.isConfigured()) {
      console.warn('[BilletwebService.syncAllEvents] API not configured, skipping sync')
      return {
        synced: 0,
        failed: 0,
        errors: ['Billetweb API not configured'],
        duration: Date.now() - startTime
      }
    }

    try {
      // Fetch all formations with billetwebId
      const formations = await prisma.formation.findMany({
        where: {
          billetwebId: { not: null }
        },
        select: {
          id: true,
          billetwebId: true,
          titre: true
        }
      })

      // Fetch all stages with billetwebId
      const stages = await prisma.stage.findMany({
        where: {
          billetwebId: { not: null }
        },
        select: {
          id: true,
          billetwebId: true,
          titre: true
        }
      })

      // Build sync tasks for parallel execution
      const syncTasks: Array<{
        entityType: 'formation' | 'stage'
        entityId: string
        billetwebId: string
        titre: string
      }> = []

      for (const formation of formations) {
        if (formation.billetwebId) {
          syncTasks.push({
            entityType: 'formation',
            entityId: formation.id,
            billetwebId: formation.billetwebId,
            titre: formation.titre
          })
        }
      }

      for (const stage of stages) {
        if (stage.billetwebId) {
          syncTasks.push({
            entityType: 'stage',
            entityId: stage.id,
            billetwebId: stage.billetwebId,
            titre: stage.titre
          })
        }
      }

      // Execute sync in parallel with concurrency limit (5 concurrent requests)
      const CONCURRENCY_LIMIT = 5
      for (let i = 0; i < syncTasks.length; i += CONCURRENCY_LIMIT) {
        const batch = syncTasks.slice(i, i + CONCURRENCY_LIMIT)
        const batchResults = await Promise.all(
          batch.map(task => this.syncEntity(
            task.entityType,
            task.entityId,
            task.billetwebId,
            task.titre
          ))
        )

        for (const result of batchResults) {
          results.push(result)
          if (!result.success && result.error) {
            const task = batch.find(t => t.billetwebId === result.billetwebId)
            errors.push(`${result.entityType === 'formation' ? 'Formation' : 'Stage'} "${task?.titre}": ${result.error}`)
          }
        }
      }

      const synced = results.filter(r => r.success).length
      const failed = results.filter(r => !r.success).length
      const duration = Date.now() - startTime

      // Warn if sync took longer than 30s (NFR23)
      if (duration > 30000) {
        console.warn('[BilletwebService.syncAllEvents] Sync exceeded 30s target:', {
          duration,
          totalEvents: results.length
        })
      }

      return {
        synced,
        failed,
        errors,
        duration
      }
    } catch (error) {
      console.error('[BilletwebService.syncAllEvents] Critical error:', {
        code: 'BILLETWEB_SYNC_ERROR',
        errorType: error instanceof Error ? error.constructor.name : 'Unknown'
      })

      return {
        synced: results.filter(r => r.success).length,
        failed: results.filter(r => !r.success).length + 1,
        errors: [...errors, error instanceof Error ? error.message : 'Unknown error'],
        duration: Date.now() - startTime
      }
    }
  }

  /**
   * Sync a single entity (formation or stage)
   */
  private async syncEntity(
    entityType: 'formation' | 'stage',
    entityId: string,
    billetwebId: string,
    titre: string
  ): Promise<EventSyncResult> {
    try {
      const places = await this.getEventPlaces(billetwebId)

      if (!places) {
        return {
          billetwebId,
          entityType,
          entityId,
          success: false,
          error: 'Failed to fetch places data'
        }
      }

      // Update the entity in database (including isFull for badge logic)
      const isFull = places.left === 0
      if (entityType === 'formation') {
        await prisma.formation.update({
          where: { id: entityId },
          data: {
            placesTotal: places.total,
            placesLeft: places.left,
            isFull
          }
        })
      } else {
        await prisma.stage.update({
          where: { id: entityId },
          data: {
            placesTotal: places.total,
            placesLeft: places.left,
            isFull
          }
        })
      }

      return {
        billetwebId,
        entityType,
        entityId,
        success: true,
        placesTotal: places.total,
        placesLeft: places.left
      }
    } catch (error) {
      console.error(`[BilletwebService.syncEntity] Error syncing ${entityType} ${titre}:`, {
        code: 'BILLETWEB_ENTITY_SYNC_ERROR',
        errorType: error instanceof Error ? error.constructor.name : 'Unknown'
      })

      return {
        billetwebId,
        entityType,
        entityId,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * Invalidate cache for a specific event or all events
   */
  invalidateCache(billetwebId?: string): void {
    if (billetwebId) {
      cache.delete(billetwebId)
    } else {
      cache.clear()
    }
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { size: number; entries: string[] } {
    return {
      size: cache.size,
      entries: Array.from(cache.keys())
    }
  }
}

// Export singleton instance
export const billetwebService = new BilletwebService()

// Export class for testing
export { BilletwebService }
