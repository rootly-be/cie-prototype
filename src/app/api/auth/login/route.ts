import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { comparePassword, signJWT } from '@/lib/auth'
import { loginSchema } from '@/lib/validations/auth'
import { isRateLimited, recordFailedAttempt, resetRateLimit } from '@/lib/rate-limit'
import { AUDIT_ACTIONS, ERROR_CODES, COOKIE_NAMES } from '@/lib/constants'
import { z } from 'zod'

// H3 fix: Constant-time delay to prevent timing attacks
const TIMING_SAFE_DELAY_MS = 100

/**
 * POST /api/auth/login
 * Authenticate admin with email and password
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json()

    // Validate input
    const validated = loginSchema.parse(body)

    // C2 fix: Check rate limit (by email to prevent account enumeration via timing)
    const identifier = validated.email.toLowerCase()
    if (isRateLimited(identifier)) {
      return NextResponse.json(
        { error: { code: ERROR_CODES.TOO_MANY_REQUESTS, message: 'Trop de tentatives. Réessayez dans 15 minutes.' } },
        { status: 429 }
      )
    }

    // H3 fix: Start timing for constant-time response
    const startTime = Date.now()

    // Find admin by email
    const admin = await prisma.admin.findUnique({
      where: { email: validated.email },
      select: {
        id: true,
        email: true,
        passwordHash: true
      }
    })

    // Check if admin exists and verify password
    let isAuthenticated = false

    if (admin) {
      const isValid = await comparePassword(validated.password, admin.passwordHash)
      isAuthenticated = isValid
    }

    // H3 fix: Ensure constant-time response (prevent timing attacks)
    const elapsed = Date.now() - startTime
    if (elapsed < TIMING_SAFE_DELAY_MS) {
      await new Promise(resolve => setTimeout(resolve, TIMING_SAFE_DELAY_MS - elapsed))
    }

    // Handle authentication failure
    if (!isAuthenticated || !admin) {
      recordFailedAttempt(identifier) // C2 fix: Track failed attempt
      return NextResponse.json(
        { error: { code: ERROR_CODES.UNAUTHORIZED, message: 'Identifiants invalides' } },
        { status: 401 }
      )
    }

    // C2 fix: Reset rate limit on successful login
    resetRateLimit(identifier)

    // Sign JWT token (async with jose library)
    const token = await signJWT({
      adminId: admin.id,
      email: admin.email
    })

    // Log successful login to audit log (M1 fix: Use constant)
    await prisma.auditLog.create({
      data: {
        adminId: admin.id,
        action: AUDIT_ACTIONS.ADMIN_LOGIN,
        entity: 'Admin',
        entityId: admin.id
      }
    })

    // Set JWT as httpOnly cookie (C1 fix - XSS protection)
    const cookieStore = await cookies()
    const isProduction = process.env.NODE_ENV === 'production'

    cookieStore.set(COOKIE_NAMES.AUTH_TOKEN, token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      path: '/',
      maxAge: 24 * 60 * 60 // 24 hours in seconds
    })

    // Return success response with admin data (NO TOKEN in body)
    return NextResponse.json({
      data: {
        admin: {
          id: admin.id,
          email: admin.email
        }
      }
    })

  } catch (error) {
    // H5 fix: Structured logging without sensitive data
    if (error instanceof z.ZodError) {
      console.error('[POST /api/auth/login] Validation error:', {
        code: 'VALIDATION_ERROR',
        issueCount: error.issues.length
      })

      return NextResponse.json(
        {
          error: {
            code: ERROR_CODES.VALIDATION_ERROR,
            message: 'Données invalides',
            details: error.issues
          }
        },
        { status: 400 }
      )
    }

    // H5 fix: Log error without exposing sensitive details
    console.error('[POST /api/auth/login] Server error:', {
      code: 'SERVER_ERROR',
      errorType: error instanceof Error ? error.constructor.name : 'Unknown'
    })

    // Handle all other errors
    return NextResponse.json(
      { error: { code: ERROR_CODES.SERVER_ERROR, message: 'Erreur serveur' } },
      { status: 500 }
    )
  }
}
