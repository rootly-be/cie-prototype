import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ERROR_CODES } from '@/lib/constants'

/**
 * GET /api/stages/[id]
 * Get single published stage by ID (public view)
 * Story 3.4: FR3, FR24, FR25
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params

  try {
    const stage = await prisma.stage.findUnique({
      where: {
        id,
        published: true // Only allow published stages
      },
      select: {
        id: true,
        titre: true,
        description: true,
        ageMin: true,
        ageMax: true,
        periode: true,
        dateDebut: true,
        dateFin: true,
        prix: true,
        billetwebUrl: true,
        placesTotal: true,
        placesLeft: true,
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
        }
        // Note: Do NOT expose createdById, updatedById, billetwebId in public API
      }
    })

    if (!stage) {
      return NextResponse.json(
        { error: { code: ERROR_CODES.NOT_FOUND, message: 'Stage non trouvé' } },
        { status: 404 }
      )
    }

    return NextResponse.json({ data: stage })

  } catch (error) {
    console.error(`[GET /api/stages/${id}] Server error:`, {
      code: 'SERVER_ERROR',
      errorType: error instanceof Error ? error.constructor.name : 'Unknown'
    })

    return NextResponse.json(
      { error: { code: ERROR_CODES.SERVER_ERROR, message: 'Erreur serveur' } },
      { status: 500 }
    )
  }
}
