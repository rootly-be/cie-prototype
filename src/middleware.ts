import { NextRequest, NextResponse } from 'next/server'
import { verifyJWT } from '@/lib/auth-edge'
import { COOKIE_NAMES } from '@/lib/constants'

// M1 fix: Use environment-based logging
const isDevelopment = process.env.NODE_ENV === 'development'

/**
 * Structured logger for middleware
 * Only logs in development or when explicitly enabled
 */
function logInfo(message: string, data?: Record<string, unknown>) {
  if (isDevelopment) {
    console.log(`[Middleware] ${message}`, data || {})
  }
}

function logError(message: string, data?: Record<string, unknown>) {
  console.error(`[Middleware] ${message}`, data || {})
}

/**
 * Middleware to protect admin routes with JWT authentication
 *
 * This middleware:
 * - Validates JWT tokens from httpOnly cookies
 * - Redirects to /login for invalid/missing tokens
 * - Attaches admin context (adminId, email) to request headers
 * - Only protects /admin/* routes (configured in matcher)
 *
 * @param request - Next.js request object
 * @returns Response (redirect or next)
 */
export async function middleware(request: NextRequest) {
  // Get JWT token from httpOnly cookie (set by Story 2.2 login)
  const tokenCookie = request.cookies.get(COOKIE_NAMES.AUTH_TOKEN)

  // AC2: Redirect to login if no token
  if (!tokenCookie) {
    logInfo('No auth token, redirecting to /login', {
      path: request.nextUrl.pathname
    })
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // L1 fix: Validate cookie value exists
  if (!tokenCookie.value) {
    logInfo('Empty auth token, redirecting to /login', {
      path: request.nextUrl.pathname
    })
    return NextResponse.redirect(new URL('/login', request.url))
  }

  try {
    // AC1: Validate JWT token (async with jose library)
    const payload = await verifyJWT(tokenCookie.value)

    // AC3: Attach admin context to request headers
    // These headers will be available to all downstream route handlers
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-admin-id', payload.adminId)
    requestHeaders.set('x-admin-email', payload.email)

    // L2 fix: Log successful authentication only in development
    logInfo('Auth successful', {
      path: request.nextUrl.pathname,
      adminId: payload.adminId
    })

    // AC2: Allow access with admin context
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  } catch (error) {
    // AC2: Invalid or expired token - redirect to login
    // L3 fix: Sanitize error logging (always log errors, but sanitized)
    logError('Auth failed', {
      path: request.nextUrl.pathname,
      errorType: error instanceof Error ? error.constructor.name : 'Unknown',
      // Don't log full error message in production (might expose JWT internals)
      ...(isDevelopment && { errorMessage: error instanceof Error ? error.message : 'Unknown' })
    })

    return NextResponse.redirect(new URL('/login', request.url))
  }
}

/**
 * Middleware configuration
 *
 * Matcher specifies which routes should run this middleware:
 * - /admin/:path* - All admin routes (protected)
 *
 * M2 fix: Optimized matcher to exclude Next.js internals and static assets
 * for better performance
 *
 * Routes NOT matched:
 * - / - Homepage (public)
 * - /login - Login page (public - must be accessible without auth)
 * - /api/auth/login - Login API (public)
 * - /_next/* - Next.js internals (static assets, chunks)
 * - /favicon.ico, /robots.txt - Static files
 * - Other public routes (animations, formations, stages, etc.)
 */
export const config = {
  matcher: [
    /*
     * Match admin routes and admin API routes
     * All other routes (/, /login, /api/*, public pages) are NOT protected
     */
    '/admin/:path*',
    '/api/admin/:path*',
  ]
}
