/**
 * Unit tests for authentication validation schemas
 * H2 fix: Add validation schema tests
 */

import { describe, it, expect } from 'vitest'
import { loginSchema } from './auth'

describe('loginSchema', () => {
  describe('valid inputs', () => {
    it('should accept valid email and password', () => {
      const valid = {
        email: 'admin@test.com',
        password: 'password123'
      }

      const result = loginSchema.safeParse(valid)
      expect(result.success).toBe(true)
    })

    it('should accept minimum 8 character password', () => {
      const valid = {
        email: 'admin@test.com',
        password: '12345678' // Exactly 8 characters
      }

      const result = loginSchema.safeParse(valid)
      expect(result.success).toBe(true)
    })
  })

  describe('invalid inputs', () => {
    it('should reject invalid email format', () => {
      const invalid = {
        email: 'notanemail',
        password: 'password123'
      }

      const result = loginSchema.safeParse(invalid)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Email invalide')
      }
    })

    it('should reject password shorter than 8 characters', () => {
      const invalid = {
        email: 'admin@test.com',
        password: '1234567' // Only 7 characters
      }

      const result = loginSchema.safeParse(invalid)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Le mot de passe doit contenir au moins 8 caractères')
      }
    })

    it('should reject missing email', () => {
      const invalid = {
        password: 'password123'
      }

      const result = loginSchema.safeParse(invalid)
      expect(result.success).toBe(false)
    })

    it('should reject missing password', () => {
      const invalid = {
        email: 'admin@test.com'
      }

      const result = loginSchema.safeParse(invalid)
      expect(result.success).toBe(false)
    })

    it('should reject empty strings', () => {
      const invalid = {
        email: '',
        password: ''
      }

      const result = loginSchema.safeParse(invalid)
      expect(result.success).toBe(false)
    })
  })
})
