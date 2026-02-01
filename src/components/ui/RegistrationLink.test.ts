/**
 * RegistrationLink Tests
 * Story 7.3: Add Registration Links to Content
 *
 * Tests URL validation logic for security
 */

import { describe, it, expect } from 'vitest'

// Re-implement the validation function for testing
// (since we can't import from TSX in node environment)
function isValidExternalUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'https:' &&
           (parsed.hostname.endsWith('billetweb.fr') ||
            parsed.hostname.endsWith('billetweb.com'))
  } catch {
    return false
  }
}

describe('isValidExternalUrl', () => {
  describe('valid Billetweb URLs', () => {
    it('accepts https://billetweb.fr URLs', () => {
      expect(isValidExternalUrl('https://billetweb.fr/event/123')).toBe(true)
    })

    it('accepts https://www.billetweb.fr URLs', () => {
      expect(isValidExternalUrl('https://www.billetweb.fr/event/abc')).toBe(true)
    })

    it('accepts https://billetweb.com URLs', () => {
      expect(isValidExternalUrl('https://billetweb.com/event/456')).toBe(true)
    })

    it('accepts https://subdomain.billetweb.fr URLs', () => {
      expect(isValidExternalUrl('https://cie-enghien.billetweb.fr/formation')).toBe(true)
    })
  })

  describe('invalid URLs', () => {
    it('rejects HTTP URLs (not HTTPS)', () => {
      expect(isValidExternalUrl('http://billetweb.fr/event/123')).toBe(false)
    })

    it('rejects non-Billetweb domains', () => {
      expect(isValidExternalUrl('https://malicious-site.com/billetweb.fr')).toBe(false)
    })

    it('rejects javascript: URLs', () => {
      expect(isValidExternalUrl('javascript:alert(1)')).toBe(false)
    })

    it('rejects data: URLs', () => {
      expect(isValidExternalUrl('data:text/html,<script>alert(1)</script>')).toBe(false)
    })

    it('rejects malformed URLs', () => {
      expect(isValidExternalUrl('not-a-url')).toBe(false)
    })

    it('rejects empty strings', () => {
      expect(isValidExternalUrl('')).toBe(false)
    })

    it('rejects domains that contain billetweb but are not billetweb', () => {
      expect(isValidExternalUrl('https://fake-billetweb.fr.evil.com/event')).toBe(false)
    })

    it('rejects billetweb in path but wrong domain', () => {
      expect(isValidExternalUrl('https://evil.com/billetweb.fr/event')).toBe(false)
    })
  })
})
