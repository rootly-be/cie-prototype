import { describe, it, expect } from 'vitest'
import {
  validateImage,
  validateImageContent,
  getExtensionFromMimeType,
  ALLOWED_MIME_TYPES,
  MAX_FILE_SIZE_BYTES,
} from './image'

describe('validateImage', () => {
  it('should accept valid JPEG file', () => {
    const result = validateImage({ type: 'image/jpeg', size: 1024 })
    expect(result.valid).toBe(true)
    expect(result.error).toBeUndefined()
  })

  it('should accept valid PNG file', () => {
    const result = validateImage({ type: 'image/png', size: 1024 })
    expect(result.valid).toBe(true)
  })

  it('should accept valid WebP file', () => {
    const result = validateImage({ type: 'image/webp', size: 1024 })
    expect(result.valid).toBe(true)
  })

  it('should accept valid GIF file', () => {
    const result = validateImage({ type: 'image/gif', size: 1024 })
    expect(result.valid).toBe(true)
  })

  it('should reject invalid MIME type', () => {
    const result = validateImage({ type: 'application/pdf', size: 1024 })
    expect(result.valid).toBe(false)
    expect(result.error).toContain('Type de fichier non autorisé')
  })

  it('should reject file exceeding max size', () => {
    const result = validateImage({ type: 'image/jpeg', size: MAX_FILE_SIZE_BYTES + 1 })
    expect(result.valid).toBe(false)
    expect(result.error).toContain('Fichier trop volumineux')
  })

  it('should accept file at exactly max size', () => {
    const result = validateImage({ type: 'image/jpeg', size: MAX_FILE_SIZE_BYTES })
    expect(result.valid).toBe(true)
  })

  it('should reject empty MIME type', () => {
    const result = validateImage({ type: '', size: 1024 })
    expect(result.valid).toBe(false)
  })
})

describe('validateImageContent', () => {
  it('should accept valid JPEG magic bytes', () => {
    const jpegBuffer = Buffer.from([0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10])
    const result = validateImageContent(jpegBuffer, 'image/jpeg')
    expect(result.valid).toBe(true)
  })

  it('should accept valid PNG magic bytes', () => {
    const pngBuffer = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A])
    const result = validateImageContent(pngBuffer, 'image/png')
    expect(result.valid).toBe(true)
  })

  it('should accept valid GIF87a magic bytes', () => {
    const gifBuffer = Buffer.from([0x47, 0x49, 0x46, 0x38, 0x37, 0x61])
    const result = validateImageContent(gifBuffer, 'image/gif')
    expect(result.valid).toBe(true)
  })

  it('should accept valid GIF89a magic bytes', () => {
    const gifBuffer = Buffer.from([0x47, 0x49, 0x46, 0x38, 0x39, 0x61])
    const result = validateImageContent(gifBuffer, 'image/gif')
    expect(result.valid).toBe(true)
  })

  it('should accept valid WebP magic bytes', () => {
    // RIFF....WEBP
    const webpBuffer = Buffer.from([
      0x52, 0x49, 0x46, 0x46, // RIFF
      0x00, 0x00, 0x00, 0x00, // size (placeholder)
      0x57, 0x45, 0x42, 0x50, // WEBP
    ])
    const result = validateImageContent(webpBuffer, 'image/webp')
    expect(result.valid).toBe(true)
  })

  it('should reject JPEG with wrong magic bytes', () => {
    const fakeJpeg = Buffer.from([0x00, 0x00, 0x00, 0x00])
    const result = validateImageContent(fakeJpeg, 'image/jpeg')
    expect(result.valid).toBe(false)
    expect(result.error).toContain('ne correspond pas')
  })

  it('should reject unsupported MIME type', () => {
    const buffer = Buffer.from([0x00, 0x00, 0x00, 0x00])
    const result = validateImageContent(buffer, 'application/pdf')
    expect(result.valid).toBe(false)
    expect(result.error).toContain('non autorisé')
  })

  it('should reject buffer too short for signature', () => {
    const shortBuffer = Buffer.from([0xFF])
    const result = validateImageContent(shortBuffer, 'image/jpeg')
    expect(result.valid).toBe(false)
  })
})

describe('getExtensionFromMimeType', () => {
  it('should return jpg for image/jpeg', () => {
    expect(getExtensionFromMimeType('image/jpeg')).toBe('jpg')
  })

  it('should return png for image/png', () => {
    expect(getExtensionFromMimeType('image/png')).toBe('png')
  })

  it('should return webp for image/webp', () => {
    expect(getExtensionFromMimeType('image/webp')).toBe('webp')
  })

  it('should return gif for image/gif', () => {
    expect(getExtensionFromMimeType('image/gif')).toBe('gif')
  })

  it('should return jpg as default for unknown MIME type', () => {
    expect(getExtensionFromMimeType('unknown/type')).toBe('jpg')
  })
})

describe('ALLOWED_MIME_TYPES', () => {
  it('should contain exactly 4 allowed types', () => {
    expect(ALLOWED_MIME_TYPES).toHaveLength(4)
  })

  it('should include all expected image types', () => {
    expect(ALLOWED_MIME_TYPES).toContain('image/jpeg')
    expect(ALLOWED_MIME_TYPES).toContain('image/png')
    expect(ALLOWED_MIME_TYPES).toContain('image/webp')
    expect(ALLOWED_MIME_TYPES).toContain('image/gif')
  })
})
