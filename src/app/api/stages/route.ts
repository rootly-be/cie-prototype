import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { stageQuerySchema } from '@/lib/validations/stage'
import { ERROR_CODES } from '@/lib/constants'
import { Prisma } from '@/generated/prisma/client'
import { z } from 'zod'

/**
 * GET /api/stages
 * List published stages with filters (public view)
 * Story 3.4: FR3, FR13, FR24, FR25, FR22, FR27
 */
export async function GET(request: NextRequest) {
  try {
    // Parse and validate query params
    const { searchParams } = new URL(request.url)
    const query = stageQuerySchema.parse(Object.fromEntries(searchParams))

    // Build where clause - ONLY published stages
    const where: Prisma.StageWhereInput = {
      published: true // Public API only shows published content
    }

    if (query.periode) where.periode = query.periode
    if (query.categorieId) where.categorieId = query.categorieId
    if (query.isFull !== undefined) where.isFull = query.isFull

    // Age range filter: stages that overlap with requested range
    if (query.ageMin !== undefined || query.ageMax !== undefined) {
      if (query.ageMin !== undefined) {
        where.ageMax = { gte: query.ageMin } // Stage max age >= requested min
      }
      if (query.ageMax !== undefined) {
        where.ageMin = { lte: query.ageMax } // Stage min age <= requested max
      }
    }

    // Tag filter (many-to-many)
    if (query.tagIds) {
      where.tags = {
        some: {
          id: { in: query.tagIds.split(',') }
        }
      }
    }

    // Pagination
    const skip = (query.page - 1) * query.pageSize
    const take = query.pageSize

    // Fetch data with count
    const [stages, total] = await Promise.all([
      prisma.stage.findMany({
        where,
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
        },
        orderBy: { [query.sortBy]: query.sortOrder },
        skip,
        take
      }),
      prisma.stage.count({ where })
    ])

    return NextResponse.json({
      data: stages,
      meta: {
        total,
        page: query.page,
        pageSize: query.pageSize,
        totalPages: Math.ceil(total / query.pageSize)
      }
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: {
            code: ERROR_CODES.VALIDATION_ERROR,
            message: 'Paramètres de requête invalides',
            details: error.issues
          }
        },
        { status: 400 }
      )
    }

    console.error('[GET /api/stages] Server error:', {
      code: 'SERVER_ERROR',
      errorType: error instanceof Error ? error.constructor.name : 'Unknown'
    })

    return NextResponse.json(
      { error: { code: ERROR_CODES.SERVER_ERROR, message: 'Erreur serveur' } },
      { status: 500 }
    )
  }
}
