import { NextRequest } from 'next/server'
import { randomUUID } from 'crypto'
import { prisma } from '@/lib/prisma'
import { getAdminFromRequest } from '@/lib/auth'
import { uploadImage, deleteImage } from '@/lib/services/s3-service'
import { validateImage, validateImageContent, getExtensionFromMimeType } from '@/lib/validations/image'

const VALID_ENTITY_TYPES = ['animation', 'formation', 'stage'] as const
type EntityType = typeof VALID_ENTITY_TYPES[number]

/**
 * H1 Fix: Validate that entity exists before linking image
 */
async function validateEntityExists(entityType: EntityType, entityId: string): Promise<boolean> {
  switch (entityType) {
    case 'animation':
      return !!(await prisma.animation.findUnique({ where: { id: entityId }, select: { id: true } }))
    case 'formation':
      return !!(await prisma.formation.findUnique({ where: { id: entityId }, select: { id: true } }))
    case 'stage':
      return !!(await prisma.stage.findUnique({ where: { id: entityId }, select: { id: true } }))
    default:
      return false
  }
}

/**
 * POST /api/admin/upload
 * Upload an image to S3 and create database record
 *
 * Form data:
 * - file: Image file (required)
 * - entityType: 'animation' | 'formation' | 'stage' (optional)
 * - entityId: ID of entity to link image to (optional)
 * - alt: Alt text for the image (optional)
 *
 * FR10: Admin can upload images
 * NFR12: Image upload validation (type, size)
 * NFR27: S3 upload < 10s
 * NFR28: S3 error handling
 */
export async function POST(request: NextRequest) {
  // 1. Check authentication
  const admin = getAdminFromRequest(request)
  if (!admin) {
    return Response.json(
      { error: { code: 'UNAUTHORIZED', message: 'Non autorisé' } },
      { status: 401 }
    )
  }

  let uploadedUrl: string | null = null

  try {
    // 2. Parse multipart form data
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const entityType = formData.get('entityType') as string | null
    const entityId = formData.get('entityId') as string | null
    const altText = formData.get('alt') as string | null

    // 3. Validate file presence
    if (!file) {
      return Response.json(
        { error: { code: 'VALIDATION_ERROR', message: 'Aucun fichier fourni' } },
        { status: 400 }
      )
    }

    // 4. Validate image metadata (type and size)
    const validation = validateImage({ type: file.type, size: file.size })
    if (!validation.valid) {
      return Response.json(
        { error: { code: 'VALIDATION_ERROR', message: validation.error } },
        { status: 400 }
      )
    }

    // 5. Validate entityType if provided
    if (entityType && !VALID_ENTITY_TYPES.includes(entityType as EntityType)) {
      return Response.json(
        { error: { code: 'VALIDATION_ERROR', message: 'Type d\'entité invalide' } },
        { status: 400 }
      )
    }

    // H1 Fix: Validate entity exists before proceeding
    if (entityType && entityId) {
      const entityExists = await validateEntityExists(entityType as EntityType, entityId)
      if (!entityExists) {
        return Response.json(
          { error: { code: 'NOT_FOUND', message: `${entityType} avec l'ID ${entityId} non trouvé` } },
          { status: 404 }
        )
      }
    }

    // 6. Get file buffer
    const buffer = Buffer.from(await file.arrayBuffer())

    // M2 Fix: Validate image content using magic bytes
    const contentValidation = validateImageContent(buffer, file.type)
    if (!contentValidation.valid) {
      return Response.json(
        { error: { code: 'VALIDATION_ERROR', message: contentValidation.error } },
        { status: 400 }
      )
    }

    // 7. Generate unique filename
    const ext = getExtensionFromMimeType(file.type)
    const uniqueFilename = `${randomUUID()}.${ext}`

    // 8. Upload to S3
    try {
      uploadedUrl = await uploadImage(buffer, uniqueFilename, file.type)
    } catch (error) {
      console.error('[POST /api/admin/upload] S3 upload failed:', error)
      const message = error instanceof Error ? error.message : 'Erreur lors de l\'upload vers le serveur de stockage'
      return Response.json(
        { error: { code: 'SERVER_ERROR', message } },
        { status: 500 }
      )
    }

    // 9. Create database record
    // Build image data with optional entity linking
    const imageData: {
      url: string
      alt: string | null
      animationId?: string
      formationId?: string
      stageId?: string
    } = {
      url: uploadedUrl,
      alt: altText || file.name.replace(/\.[^/.]+$/, ''), // Use filename without extension as default alt
    }

    // Link to entity if both entityType and entityId are provided
    if (entityType && entityId) {
      if (entityType === 'animation') {
        imageData.animationId = entityId
      } else if (entityType === 'formation') {
        imageData.formationId = entityId
      } else if (entityType === 'stage') {
        imageData.stageId = entityId
      }
    }

    const image = await prisma.image.create({ data: imageData })

    return Response.json({ data: image }, { status: 201 })
  } catch (error) {
    // H4 Fix: Rollback S3 upload if database creation fails
    if (uploadedUrl) {
      try {
        await deleteImage(uploadedUrl)
        console.log('[POST /api/admin/upload] Rolled back S3 upload after DB failure')
      } catch (rollbackError) {
        console.error('[POST /api/admin/upload] Failed to rollback S3 upload:', rollbackError)
      }
    }

    console.error('[POST /api/admin/upload]', error)
    return Response.json(
      { error: { code: 'SERVER_ERROR', message: 'Erreur lors de l\'upload' } },
      { status: 500 }
    )
  }
}
