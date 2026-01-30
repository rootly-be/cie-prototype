import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { formationQuerySchema } from '@/lib/validations/formation'
import { ERROR_CODES } from '@/lib/constants'
import { Prisma } from '@/generated/prisma/client'
import { z } from 'zod'

/**
 * GET /api/formations
 * List published formations with filters (public view)
 * Story 3.3: FR2, FR13, FR14, FR22, FR27
 */
export async function GET(request: NextRequest) {
  try {
    // Parse and validate query params
    const { searchParams } = new URL(request.url)
    const query = formationQuerySchema.parse(Object.fromEntries(searchParams))

    // Build where clause - ONLY published formations
    const where: Prisma.FormationWhereInput = {
      published: true // Public API only shows published content
    }

    if (query.categorieId) where.categorieId = query.categorieId
    if (query.isFull !== undefined) where.isFull = query.isFull

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
    const [formations, total] = await Promise.all([
      prisma.formation.findMany({
        where,
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
        },
        orderBy: { [query.sortBy]: query.sortOrder },
        skip,
        take
      }),
      prisma.formation.count({ where })
    ])

    return NextResponse.json({
      data: formations,
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

    console.error('[GET /api/formations] Server error:', {
      code: 'SERVER_ERROR',
      errorType: error instanceof Error ? error.constructor.name : 'Unknown'
    })

    return NextResponse.json(
      { error: { code: ERROR_CODES.SERVER_ERROR, message: 'Erreur serveur' } },
      { status: 500 }
    )
  }
}
