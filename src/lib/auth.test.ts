/**
 * Unit tests for authentication utilities
 * H2 fix: Add comprehensive unit tests
 */

import { describe, it, expect, beforeAll } from 'vitest'
import { hashPassword, comparePassword, signJWT, verifyJWT } from './auth'

// Set AUTH_SECRET for testing
beforeAll(() => {
  process.env.AUTH_SECRET = 'test-secret-key-minimum-32-characters-long'
})

describe('auth utilities', () => {
  describe('hashPassword', () => {
    it('should hash a password', async () => {
      const password = 'testpassword123'
      const hash = await hashPassword(password)

      expect(hash).toBeDefined()
      expect(hash).not.toBe(password)
      expect(hash.startsWith('$2')).toBe(true) // bcrypt hash format
    })

    it('should create different hashes for same password', async () => {
      const password = 'testpassword123'
      const hash1 = await hashPassword(password)
      const hash2 = await hashPassword(password)

      expect(hash1).not.toBe(hash2) // Different salts
    })
  })

  describe('comparePassword', () => {
    it('should return true for matching password', async () => {
      const password = 'testpassword123'
      const hash = await hashPassword(password)

      const result = await comparePassword(password, hash)
      expect(result).toBe(true)
    })

    it('should return false for non-matching password', async () => {
      const password = 'testpassword123'
      const hash = await hashPassword(password)

      const result = await comparePassword('wrongpassword', hash)
      expect(result).toBe(false)
    })
  })

  describe('signJWT', () => {
    it('should create a valid JWT token', () => {
      const payload = {
        adminId: 'test-admin-id',
        email: 'admin@test.com'
      }

      const token = signJWT(payload)

      expect(token).toBeDefined()
      expect(typeof token).toBe('string')
      expect(token.split('.')).toHaveLength(3) // JWT format: header.payload.signature
    })

    it('should include adminId and email in token', () => {
      const payload = {
        adminId: 'test-admin-id',
        email: 'admin@test.com'
      }

      const token = signJWT(payload)
      const decoded = verifyJWT(token)

      expect(decoded.adminId).toBe(payload.adminId)
      expect(decoded.email).toBe(payload.email)
    })

    it('should set 24h expiry', () => {
      const payload = {
        adminId: 'test-admin-id',
        email: 'admin@test.com'
      }

      const token = signJWT(payload)
      const decoded = verifyJWT(token)

      expect(decoded.exp).toBeDefined()
      expect(decoded.iat).toBeDefined()

      const expiryDuration = decoded.exp! - decoded.iat!
      expect(expiryDuration).toBe(24 * 60 * 60) // 24 hours in seconds
    })
  })

  describe('verifyJWT', () => {
    it('should verify and decode valid token', () => {
      const payload = {
        adminId: 'test-admin-id',
        email: 'admin@test.com'
      }

      const token = signJWT(payload)
      const decoded = verifyJWT(token)

      expect(decoded.adminId).toBe(payload.adminId)
      expect(decoded.email).toBe(payload.email)
    })

    it('should throw error for invalid token', () => {
      const invalidToken = 'invalid.token.here'

      expect(() => verifyJWT(invalidToken)).toThrow()
    })

    it('should throw error for tampered token', () => {
      const payload = {
        adminId: 'test-admin-id',
        email: 'admin@test.com'
      }

      const token = signJWT(payload)
      const tamperedToken = token.slice(0, -10) + 'tampered123'

      expect(() => verifyJWT(tamperedToken)).toThrow()
    })
  })
})
