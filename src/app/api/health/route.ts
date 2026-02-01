import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * Health Check Endpoint
 * Story 8.1: Create Docker Multi-Stage Build
 *
 * Covers:
 * - AC3: Health check endpoint works
 * - Used by Docker HEALTHCHECK and load balancers
 * - M1 fix: Includes database connectivity check
 */

// Track server start time for uptime calculation
const startTime = Date.now()

// App version from package.json
const VERSION = process.env.npm_package_version || '0.1.0'

/**
 * GET /api/health
 * Returns health status for container orchestration
 * Checks both server and database connectivity
 */
export async function GET() {
  const uptime = Math.floor((Date.now() - startTime) / 1000)

  // Check database connectivity (M1 fix)
  let dbStatus = 'healthy'
  try {
    // Simple query to verify database connection
    await prisma.$queryRaw`SELECT 1`
  } catch {
    dbStatus = 'unhealthy'
  }

  const isHealthy = dbStatus === 'healthy'

  return NextResponse.json({
    status: isHealthy ? 'healthy' : 'degraded',
    version: VERSION,
    uptime,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    checks: {
      database: dbStatus
    }
  }, {
    status: isHealthy ? 200 : 503,
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
      'Pragma': 'no-cache'
    }
  })
}
