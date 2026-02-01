/**
 * Next.js Instrumentation
 * Story 7.4: Create Scheduled Sync Job
 *
 * This file runs once when the Next.js server starts.
 * Used to initialize background services like the sync scheduler.
 */

export async function register() {
  // Only run on server (not during build or client-side)
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Dynamically import to avoid bundling issues
    const { startScheduler } = await import('@/lib/services/sync-scheduler')

    console.log('[Instrumentation] Initializing server-side services')

    // Start the Billetweb sync scheduler
    startScheduler()

    console.log('[Instrumentation] Server-side services initialized')
  }
}
