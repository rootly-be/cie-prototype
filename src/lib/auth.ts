import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

// JWT Payload interface
export interface JWTPayload {
  adminId: string
  email: string
  iat?: number
  exp?: number
}

// Configuration
const SALT_ROUNDS = 10

// Ensure JWT_SECRET is defined
function getJWTSecret(): string {
  const secret = process.env.AUTH_SECRET
  if (!secret) {
    throw new Error('AUTH_SECRET environment variable is required')
  }
  return secret
}

const JWT_SECRET = getJWTSecret()

/**
 * Hash a plain text password using bcrypt
 * @param password - Plain text password
 * @returns Hashed password
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS)
}

/**
 * Compare a plain text password with a hashed password
 * @param password - Plain text password
 * @param hash - Hashed password from database
 * @returns True if passwords match, false otherwise
 */
export async function comparePassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

/**
 * Sign a JWT token with 24h expiry
 * @param payload - JWT payload containing adminId and email
 * @returns JWT token string
 */
export function signJWT(payload: { adminId: string; email: string }): string {
  return jwt.sign(payload, JWT_SECRET, {
    algorithm: 'HS256',
    expiresIn: '24h'
  })
}

/**
 * Verify and decode a JWT token
 * @param token - JWT token string
 * @returns Decoded JWT payload
 * @throws Error if token is invalid or expired
 */
export function verifyJWT(token: string): JWTPayload {
  return jwt.verify(token, JWT_SECRET, {
    algorithms: ['HS256']
  }) as JWTPayload
}

/**
 * Extract admin context from request headers (set by middleware)
 * Story 3.2: Helper for admin API routes
 *
 * Middleware (Story 2.3) attaches admin info to headers after JWT validation.
 * This helper extracts that context for use in API routes.
 *
 * @param request - Next.js request with middleware headers
 * @returns Admin context or null if not authenticated
 */
export function getAdminFromRequest(request: Request): { adminId: string; email: string } | null {
  const adminId = request.headers.get('x-admin-id')
  const email = request.headers.get('x-admin-email')

  if (!adminId || !email) {
    return null
  }

  return { adminId, email }
}
