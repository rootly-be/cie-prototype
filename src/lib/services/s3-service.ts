import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'

// S3 Client singleton for Hetzner S3-compatible storage
// Uses custom endpoint configuration for S3-compatible services

// Upload timeout in milliseconds (NFR27: < 10s)
const UPLOAD_TIMEOUT_MS = 10000

function createS3Client(): S3Client {
  const endpoint = process.env.S3_ENDPOINT
  const accessKeyId = process.env.S3_ACCESS_KEY
  const secretAccessKey = process.env.S3_SECRET_KEY
  const region = process.env.S3_REGION || 'fsn1'

  if (!endpoint || !accessKeyId || !secretAccessKey) {
    throw new Error('S3 configuration missing: S3_ENDPOINT, S3_ACCESS_KEY, and S3_SECRET_KEY are required')
  }

  return new S3Client({
    endpoint,
    region,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
    forcePathStyle: true, // Required for S3-compatible services like Hetzner
  })
}

// Lazy initialization with retry capability
// H3 Fix: Reset client on failure to allow retry after env vars are fixed
let s3Client: S3Client | null = null
let s3ClientError: Error | null = null

function getS3Client(): S3Client {
  // If previous attempt failed, retry (env vars might be fixed now)
  if (s3ClientError) {
    s3ClientError = null
    s3Client = null
  }

  if (!s3Client) {
    try {
      s3Client = createS3Client()
    } catch (error) {
      s3ClientError = error as Error
      throw error
    }
  }
  return s3Client
}

/**
 * Normalize endpoint URL by removing trailing slash
 */
function normalizeEndpoint(endpoint: string): string {
  return endpoint.endsWith('/') ? endpoint.slice(0, -1) : endpoint
}

/**
 * Upload an image to S3 storage
 * @param file - Image buffer to upload
 * @param filename - Unique filename with extension
 * @param contentType - MIME type (e.g., 'image/jpeg')
 * @returns Public URL of uploaded image
 * @throws Error if upload fails or times out (NFR27: < 10s)
 */
export async function uploadImage(
  file: Buffer,
  filename: string,
  contentType: string
): Promise<string> {
  const bucket = process.env.S3_BUCKET
  const endpoint = process.env.S3_ENDPOINT

  if (!bucket) {
    throw new Error('S3_BUCKET environment variable is required')
  }
  if (!endpoint) {
    throw new Error('S3_ENDPOINT environment variable is required')
  }

  const key = `uploads/${filename}`

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: file,
    ContentType: contentType,
    ACL: 'public-read', // Make image publicly accessible
  })

  // M1 Fix: Add timeout for upload (NFR27: < 10s)
  const abortController = new AbortController()
  const timeoutId = setTimeout(() => abortController.abort(), UPLOAD_TIMEOUT_MS)

  try {
    await getS3Client().send(command, { abortSignal: abortController.signal })
  } catch (error) {
    console.error('[S3 Upload Error]', error)
    if ((error as Error).name === 'AbortError') {
      throw new Error('Délai d\'upload dépassé (10s max)')
    }
    throw new Error('Erreur lors de l\'upload vers S3')
  } finally {
    clearTimeout(timeoutId)
  }

  // M3 Fix: Normalize endpoint to avoid double slashes
  const normalizedEndpoint = normalizeEndpoint(endpoint)
  return `${normalizedEndpoint}/${bucket}/${key}`
}

/**
 * Delete an image from S3 storage
 * @param url - Full URL of the image to delete
 * @throws Error if deletion fails
 */
export async function deleteImage(url: string): Promise<void> {
  const bucket = process.env.S3_BUCKET
  const endpoint = process.env.S3_ENDPOINT

  if (!bucket || !endpoint) {
    throw new Error('S3 configuration missing')
  }

  // M3 Fix: Normalize endpoint for consistent URL matching
  const normalizedEndpoint = normalizeEndpoint(endpoint)

  // Extract key from URL
  // URL format: https://endpoint/bucket/uploads/filename.ext
  const prefix = `${normalizedEndpoint}/${bucket}/`
  if (!url.startsWith(prefix)) {
    throw new Error('URL invalide pour la suppression S3')
  }

  const key = url.substring(prefix.length)

  const command = new DeleteObjectCommand({
    Bucket: bucket,
    Key: key,
  })

  try {
    await getS3Client().send(command)
  } catch (error) {
    console.error('[S3 Delete Error]', error)
    throw new Error('Erreur lors de la suppression depuis S3')
  }
}
