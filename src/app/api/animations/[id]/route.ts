import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ERROR_CODES } from '@/lib/constants'

/**
 * GET /api/animations/[id]
 * Get single published animation by ID (public view)
 * Story 3.2: FR1
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params

  try {
    const animation = await prisma.animation.findUnique({
      where: {
        id,
        published: true // Only allow published animations
      },
      select: {
        id: true,
        titre: true,
        description: true,
        niveau: true,
        published: true,
        createdAt: true,
        updatedAt: true,
        categorie: {
          select: {
            id: true,
            nom: true,
            type: true
          }
        },
        tags: {
          select: {
            id: true,
            nom: true,
            couleur: true
          }
        },
        images: {
          select: {
            id: true,
            url: true,
            alt: true
          }
        }
        // Note: Do NOT expose createdById, updatedById in public API
      }
    })

    if (!animation) {
      return NextResponse.json(
        { error: { code: ERROR_CODES.NOT_FOUND, message: 'Animation non trouvée' } },
        { status: 404 }
      )
    }

    return NextResponse.json({ data: animation })

  } catch (error) {
    console.error(`[GET /api/animations/${id}] Server error:`, {
      code: 'SERVER_ERROR',
      errorType: error instanceof Error ? error.constructor.name : 'Unknown'
    })

    return NextResponse.json(
      { error: { code: ERROR_CODES.SERVER_ERROR, message: 'Erreur serveur' } },
      { status: 500 }
    )
  }
}
