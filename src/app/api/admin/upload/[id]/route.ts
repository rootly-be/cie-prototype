import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminFromRequest } from '@/lib/auth'
import { deleteImage } from '@/lib/services/s3-service'

interface RouteParams {
  params: Promise<{ id: string }>
}

/**
 * GET /api/admin/upload/[id]
 * Get a single image by ID
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  const admin = getAdminFromRequest(request)
  if (!admin) {
    return Response.json(
      { error: { code: 'UNAUTHORIZED', message: 'Non autorisé' } },
      { status: 401 }
    )
  }

  try {
    const { id } = await params

    const image = await prisma.image.findUnique({
      where: { id },
    })

    if (!image) {
      return Response.json(
        { error: { code: 'NOT_FOUND', message: 'Image non trouvée' } },
        { status: 404 }
      )
    }

    return Response.json({ data: image })
  } catch (error) {
    console.error('[GET /api/admin/upload/[id]]', error)
    return Response.json(
      { error: { code: 'SERVER_ERROR', message: 'Erreur serveur' } },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/admin/upload/[id]
 * Delete an image from S3 and database
 *
 * NFR28: S3 error handling - graceful degradation
 */
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  const admin = getAdminFromRequest(request)
  if (!admin) {
    return Response.json(
      { error: { code: 'UNAUTHORIZED', message: 'Non autorisé' } },
      { status: 401 }
    )
  }

  try {
    const { id } = await params

    // 1. Find image in database
    const image = await prisma.image.findUnique({
      where: { id },
    })

    if (!image) {
      return Response.json(
        { error: { code: 'NOT_FOUND', message: 'Image non trouvée' } },
        { status: 404 }
      )
    }

    // 2. Delete from S3 (best effort - continue even if S3 delete fails)
    try {
      await deleteImage(image.url)
    } catch (s3Error) {
      // Log S3 error but continue with database deletion
      // This prevents orphaned database records when S3 is unavailable
      console.error('[DELETE /api/admin/upload/[id]] S3 delete failed (continuing):', s3Error)
    }

    // 3. Delete from database
    await prisma.image.delete({
      where: { id },
    })

    return Response.json({ data: { success: true } })
  } catch (error) {
    console.error('[DELETE /api/admin/upload/[id]]', error)
    return Response.json(
      { error: { code: 'SERVER_ERROR', message: 'Erreur lors de la suppression' } },
      { status: 500 }
    )
  }
}
