/**
 * Edge-compatible authentication utilities
 * Uses jose library which works in Edge runtime
 *
 * Note: For password hashing, use auth.ts which uses bcrypt (Node.js only)
 */
import { SignJWT, jwtVerify } from 'jose'

// JWT Payload interface
export interface JWTPayload {
  adminId: string
  email: string
  iat?: number
  exp?: number
}

// Ensure JWT_SECRET is defined
function getJWTSecret(): Uint8Array {
  const secret = process.env.AUTH_SECRET
  if (!secret) {
    throw new Error('AUTH_SECRET environment variable is required')
  }
  return new TextEncoder().encode(secret)
}

/**
 * Sign a JWT token with 24h expiry
 * Uses jose library for Edge runtime compatibility
 * @param payload - JWT payload containing adminId and email
 * @returns JWT token string
 */
export async function signJWT(payload: { adminId: string; email: string }): Promise<string> {
  const secret = getJWTSecret()

  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(secret)
}

/**
 * Verify and decode a JWT token
 * Uses jose library for Edge runtime compatibility
 * @param token - JWT token string
 * @returns Decoded JWT payload
 * @throws Error if token is invalid or expired
 */
export async function verifyJWT(token: string): Promise<JWTPayload> {
  const secret = getJWTSecret()

  const { payload } = await jwtVerify(token, secret, {
    algorithms: ['HS256']
  })

  return {
    adminId: payload.adminId as string,
    email: payload.email as string,
    iat: payload.iat,
    exp: payload.exp
  }
}
