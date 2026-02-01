import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminFromRequest } from '@/lib/auth'
import { billetwebService } from '@/lib/services/billetweb-service'
import { getSchedulerStatus, triggerSync } from '@/lib/services/sync-scheduler'
import { AUDIT_ACTIONS, ERROR_CODES } from '@/lib/constants'

/**
 * POST /api/billetweb/sync
 * Trigger Billetweb sync for all configured events
 * Story 7.1: FR18, NFR23, NFR24
 * Story 7.4: Manual trigger via scheduler
 */
export async function POST(request: NextRequest) {
  try {
    // Require admin authentication
    const admin = getAdminFromRequest(request)
    if (!admin) {
      return NextResponse.json(
        { error: { code: ERROR_CODES.UNAUTHORIZED, message: 'Non authentifié' } },
        { status: 401 }
      )
    }

    // Check if service is configured
    if (!billetwebService.isConfigured()) {
      return NextResponse.json(
        { error: { code: ERROR_CODES.SERVER_ERROR, message: 'Billetweb API non configurée' } },
        { status: 503 }
      )
    }

    // Log sync start
    await prisma.auditLog.create({
      data: {
        adminId: admin.adminId,
        action: AUDIT_ACTIONS.BILLETWEB_SYNC_STARTED,
        entity: 'BilletwebSync',
        entityId: 'manual',
        details: JSON.stringify({ triggeredBy: admin.email })
      }
    })

    // Run sync via scheduler (AC3: manual trigger)
    const result = await triggerSync()

    // Log sync completion
    const action = result.failed > 0
      ? AUDIT_ACTIONS.BILLETWEB_SYNC_FAILED
      : AUDIT_ACTIONS.BILLETWEB_SYNC_COMPLETED

    await prisma.auditLog.create({
      data: {
        adminId: admin.adminId,
        action,
        entity: 'BilletwebSync',
        entityId: 'manual',
        details: JSON.stringify({
          synced: result.synced,
          failed: result.failed,
          duration: result.duration,
          errors: result.errors.slice(0, 10) // Limit errors in log
        })
      }
    })

    return NextResponse.json({
      data: {
        synced: result.synced,
        failed: result.failed,
        errors: result.errors,
        duration: result.duration,
        message: result.failed > 0
          ? `Sync completed with ${result.failed} errors`
          : `Successfully synced ${result.synced} events`
      }
    })

  } catch (error) {
    console.error('[POST /api/billetweb/sync] Server error:', {
      code: 'SERVER_ERROR',
      errorType: error instanceof Error ? error.constructor.name : 'Unknown'
    })

    return NextResponse.json(
      { error: { code: ERROR_CODES.SERVER_ERROR, message: 'Erreur serveur' } },
      { status: 500 }
    )
  }
}

/**
 * GET /api/billetweb/sync
 * Get sync status and cache information
 */
export async function GET(request: NextRequest) {
  try {
    const admin = getAdminFromRequest(request)
    if (!admin) {
      return NextResponse.json(
        { error: { code: ERROR_CODES.UNAUTHORIZED, message: 'Non authentifié' } },
        { status: 401 }
      )
    }

    const cacheStats = billetwebService.getCacheStats()
    const isConfigured = billetwebService.isConfigured()
    const schedulerStatus = getSchedulerStatus()

    // Get last sync from audit log
    const lastSync = await prisma.auditLog.findFirst({
      where: {
        action: {
          in: [AUDIT_ACTIONS.BILLETWEB_SYNC_COMPLETED, AUDIT_ACTIONS.BILLETWEB_SYNC_FAILED]
        }
      },
      orderBy: { createdAt: 'desc' },
      select: {
        action: true,
        createdAt: true,
        details: true
      }
    })

    return NextResponse.json({
      data: {
        configured: isConfigured,
        cacheSize: cacheStats.size,
        cachedEvents: cacheStats.entries,
        scheduler: {
          isRunning: schedulerStatus.isRunning,
          lastRun: schedulerStatus.lastRun,
          nextRun: schedulerStatus.nextRun,
          runCount: schedulerStatus.runCount,
          lastError: schedulerStatus.lastError
        },
        lastSync: lastSync ? {
          status: lastSync.action === AUDIT_ACTIONS.BILLETWEB_SYNC_COMPLETED ? 'success' : 'failed',
          timestamp: lastSync.createdAt,
          details: lastSync.details ? JSON.parse(lastSync.details) : null
        } : null
      }
    })

  } catch (error) {
    console.error('[GET /api/billetweb/sync] Server error:', {
      code: 'SERVER_ERROR',
      errorType: error instanceof Error ? error.constructor.name : 'Unknown'
    })

    return NextResponse.json(
      { error: { code: ERROR_CODES.SERVER_ERROR, message: 'Erreur serveur' } },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/billetweb/sync
 * Invalidate Billetweb cache
 */
export async function DELETE(request: NextRequest) {
  try {
    const admin = getAdminFromRequest(request)
    if (!admin) {
      return NextResponse.json(
        { error: { code: ERROR_CODES.UNAUTHORIZED, message: 'Non authentifié' } },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const billetwebId = searchParams.get('billetwebId')

    billetwebService.invalidateCache(billetwebId || undefined)

    return NextResponse.json({
      data: {
        message: billetwebId
          ? `Cache invalidated for event ${billetwebId}`
          : 'All cache invalidated'
      }
    })

  } catch (error) {
    console.error('[DELETE /api/billetweb/sync] Server error:', {
      code: 'SERVER_ERROR',
      errorType: error instanceof Error ? error.constructor.name : 'Unknown'
    })

    return NextResponse.json(
      { error: { code: ERROR_CODES.SERVER_ERROR, message: 'Erreur serveur' } },
      { status: 500 }
    )
  }
}
