import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ERROR_CODES } from '@/lib/constants'

/**
 * GET /api/formations/[id]
 * Get single published formation by ID (public view)
 * Story 3.3: FR2, FR14
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params

  try {
    const formation = await prisma.formation.findUnique({
      where: {
        id,
        published: true // Only allow published formations
      },
      select: {
        id: true,
        titre: true,
        description: true,
        isFull: true,
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
        },
        dates: {
          select: {
            id: true,
            dateDebut: true,
            dateFin: true,
            lieu: true
          }
        }
        // Note: Do NOT expose createdById, updatedById in public API
      }
    })

    if (!formation) {
      return NextResponse.json(
        { error: { code: ERROR_CODES.NOT_FOUND, message: 'Formation non trouvée' } },
        { status: 404 }
      )
    }

    return NextResponse.json({ data: formation })

  } catch (error) {
    console.error(`[GET /api/formations/${id}] Server error:`, {
      code: 'SERVER_ERROR',
      errorType: error instanceof Error ? error.constructor.name : 'Unknown'
    })

    return NextResponse.json(
      { error: { code: ERROR_CODES.SERVER_ERROR, message: 'Erreur serveur' } },
      { status: 500 }
    )
  }
}
