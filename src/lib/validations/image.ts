/**
 * Image validation for upload
 * Validates MIME type and file size according to NFR12
 */

export const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
] as const

export type AllowedMimeType = typeof ALLOWED_MIME_TYPES[number]

// Maximum file size: 5MB (5 * 1024 * 1024 = 5,242,880 bytes)
export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024
export const MAX_FILE_SIZE_MB = 5

export interface ImageValidationResult {
  valid: boolean
  error?: string
}

/**
 * Magic bytes signatures for image format detection
 * M2 Fix: Validate actual file content, not just HTTP header
 */
const MAGIC_BYTES: Record<string, number[][]> = {
  'image/jpeg': [[0xFF, 0xD8, 0xFF]], // JPEG
  'image/png': [[0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]], // PNG
  'image/gif': [[0x47, 0x49, 0x46, 0x38, 0x37, 0x61], [0x47, 0x49, 0x46, 0x38, 0x39, 0x61]], // GIF87a, GIF89a
  'image/webp': [[0x52, 0x49, 0x46, 0x46]], // RIFF (WebP starts with RIFF)
}

/**
 * Validate an image file for upload (basic validation - MIME type and size)
 * @param file - File metadata to validate
 * @returns Validation result with error message if invalid
 */
export function validateImage(file: { type: string; size: number }): ImageValidationResult {
  // Check MIME type from header
  if (!ALLOWED_MIME_TYPES.includes(file.type as AllowedMimeType)) {
    return {
      valid: false,
      error: 'Type de fichier non autorisé. Types acceptés: JPEG, PNG, WebP, GIF',
    }
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: `Fichier trop volumineux. Taille maximum: ${MAX_FILE_SIZE_MB}MB`,
    }
  }

  return { valid: true }
}

/**
 * Validate image content using magic bytes
 * M2 Fix: Stronger validation that checks actual file content
 * @param buffer - File buffer to validate
 * @param claimedType - MIME type claimed by client
 * @returns Validation result
 */
export function validateImageContent(buffer: Buffer, claimedType: string): ImageValidationResult {
  const signatures = MAGIC_BYTES[claimedType]

  if (!signatures) {
    return {
      valid: false,
      error: 'Type de fichier non autorisé',
    }
  }

  // Check if buffer starts with any of the valid signatures for this type
  const isValid = signatures.some(signature => {
    if (buffer.length < signature.length) return false
    return signature.every((byte, index) => buffer[index] === byte)
  })

  // Special handling for WebP: also need to check for WEBP at offset 8
  if (claimedType === 'image/webp' && isValid) {
    const webpSignature = [0x57, 0x45, 0x42, 0x50] // "WEBP"
    const hasWebpMarker = buffer.length >= 12 &&
      webpSignature.every((byte, index) => buffer[8 + index] === byte)

    if (!hasWebpMarker) {
      return {
        valid: false,
        error: 'Contenu du fichier invalide pour le format WebP',
      }
    }
  }

  if (!isValid) {
    return {
      valid: false,
      error: 'Le contenu du fichier ne correspond pas au type déclaré',
    }
  }

  return { valid: true }
}

/**
 * Get file extension from MIME type
 * @param mimeType - MIME type string
 * @returns File extension without dot
 */
export function getExtensionFromMimeType(mimeType: string): string {
  const mimeToExt: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/gif': 'gif',
  }
  return mimeToExt[mimeType] || 'jpg'
}
