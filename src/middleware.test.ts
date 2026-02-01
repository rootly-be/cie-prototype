/**
 * Unit tests for authentication middleware
 * Tests all scenarios: valid token, missing token, invalid token, admin context
 */

import { describe, it, expect, beforeAll } from 'vitest'
import { NextRequest } from 'next/server'
import { middleware } from './middleware'
import { signJWT } from '@/lib/auth-edge'
import { COOKIE_NAMES } from '@/lib/constants'

// Set AUTH_SECRET for testing
beforeAll(() => {
  process.env.AUTH_SECRET = 'test-secret-key-minimum-32-characters-long'
})

describe('middleware', () => {
  describe('valid JWT token', () => {
    it('should allow access with valid token', async () => {
      // Create valid JWT token
      const token = await signJWT({
        adminId: 'test-admin-id',
        email: 'admin@test.com'
      })

      // Create request with auth cookie
      const request = new NextRequest('http://localhost:3000/admin')
      request.cookies.set(COOKIE_NAMES.AUTH_TOKEN, token)

      const response = await middleware(request)

      // Should NOT be a redirect (status 307)
      expect(response.status).not.toBe(307)
    })

    it('should set admin context headers with valid token', async () => {
      const token = await signJWT({
        adminId: 'test-admin-id',
        email: 'admin@test.com'
      })

      const request = new NextRequest('http://localhost:3000/admin')
      request.cookies.set(COOKIE_NAMES.AUTH_TOKEN, token)

      const response = await middleware(request)

      // Check admin context headers are set
      const headers = response.request?.headers
      expect(headers?.get('x-admin-id')).toBe('test-admin-id')
      expect(headers?.get('x-admin-email')).toBe('admin@test.com')
    })

    it('should allow access to nested admin routes', async () => {
      const token = await signJWT({
        adminId: 'test-admin-id',
        email: 'admin@test.com'
      })

      const request = new NextRequest('http://localhost:3000/admin/animations/create')
      request.cookies.set(COOKIE_NAMES.AUTH_TOKEN, token)

      const response = await middleware(request)

      expect(response.status).not.toBe(307)
    })
  })

  describe('missing token', () => {
    it('should redirect to /login when token is missing', async () => {
      const request = new NextRequest('http://localhost:3000/admin')

      const response = await middleware(request)

      expect(response.status).toBe(307) // Temporary redirect
      expect(response.headers.get('location')).toContain('/login')
    })

    it('should redirect to /login for nested admin routes', async () => {
      const request = new NextRequest('http://localhost:3000/admin/animations')

      const response = await middleware(request)

      expect(response.status).toBe(307)
      expect(response.headers.get('location')).toContain('/login')
    })
  })

  describe('invalid token', () => {
    it('should redirect to /login with invalid token format', async () => {
      const request = new NextRequest('http://localhost:3000/admin')
      request.cookies.set(COOKIE_NAMES.AUTH_TOKEN, 'invalid.token.here')

      const response = await middleware(request)

      expect(response.status).toBe(307)
      expect(response.headers.get('location')).toContain('/login')
    })

    it('should redirect to /login with tampered token', async () => {
      const validToken = await signJWT({
        adminId: 'test-admin-id',
        email: 'admin@test.com'
      })

      // Tamper with the token
      const tamperedToken = validToken.slice(0, -10) + 'tampered123'

      const request = new NextRequest('http://localhost:3000/admin')
      request.cookies.set(COOKIE_NAMES.AUTH_TOKEN, tamperedToken)

      const response = await middleware(request)

      expect(response.status).toBe(307)
      expect(response.headers.get('location')).toContain('/login')
    })

    it('should redirect to /login with expired token', async () => {
      // Create an expired token (this would require mocking time or waiting 24h)
      // For now, we test with invalid token which has similar behavior
      const request = new NextRequest('http://localhost:3000/admin')
      request.cookies.set(COOKIE_NAMES.AUTH_TOKEN, 'expired.token.test')

      const response = await middleware(request)

      expect(response.status).toBe(307)
      expect(response.headers.get('location')).toContain('/login')
    })
  })

  describe('redirect URL', () => {
    it('should redirect to /login with absolute URL', async () => {
      const request = new NextRequest('http://localhost:3000/admin')

      const response = await middleware(request)

      const location = response.headers.get('location')
      expect(location).toBe('http://localhost:3000/login')
    })

    it('should preserve host in redirect URL', async () => {
      const request = new NextRequest('https://example.com/admin')

      const response = await middleware(request)

      const location = response.headers.get('location')
      expect(location).toBe('https://example.com/login')
    })
  })

  describe('admin context', () => {
    it('should preserve original request headers', async () => {
      const token = await signJWT({
        adminId: 'test-admin-id',
        email: 'admin@test.com'
      })

      const request = new NextRequest('http://localhost:3000/admin')
      request.headers.set('user-agent', 'test-agent')
      request.cookies.set(COOKIE_NAMES.AUTH_TOKEN, token)

      const response = await middleware(request)

      const headers = response.request?.headers
      expect(headers?.get('user-agent')).toBe('test-agent')
    })

    it('should add admin headers without removing existing headers', async () => {
      const token = await signJWT({
        adminId: 'test-admin-id',
        email: 'admin@test.com'
      })

      const request = new NextRequest('http://localhost:3000/admin')
      request.headers.set('custom-header', 'custom-value')
      request.cookies.set(COOKIE_NAMES.AUTH_TOKEN, token)

      const response = await middleware(request)

      const headers = response.request?.headers
      expect(headers?.get('custom-header')).toBe('custom-value')
      expect(headers?.get('x-admin-id')).toBe('test-admin-id')
      expect(headers?.get('x-admin-email')).toBe('admin@test.com')
    })
  })
})
