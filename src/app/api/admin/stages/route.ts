import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminFromRequest } from '@/lib/auth'
import { stageCreateSchema, stageQuerySchema } from '@/lib/validations/stage'
import { extractBilletwebId } from '@/lib/validations/billetweb'
import { AUDIT_ACTIONS, ERROR_CODES } from '@/lib/constants'
import { Prisma } from '@/generated/prisma/client'
import { z } from 'zod'

/**
 * GET /api/admin/stages
 * List all stages with filters and pagination (admin view)
 * Story 3.4: FR3, FR13, FR24, FR25, FR22, FR27
 */
export async function GET(request: NextRequest) {
  try {
    // Get admin context from middleware
    const admin = getAdminFromRequest(request)
    if (!admin) {
      return NextResponse.json(
        { error: { code: ERROR_CODES.UNAUTHORIZED, message: 'Non authentifié' } },
        { status: 401 }
      )
    }

    // Parse and validate query params
    const { searchParams } = new URL(request.url)
    const query = stageQuerySchema.parse(Object.fromEntries(searchParams))

    // Build where clause
    const where: Prisma.StageWhereInput = {}

    if (query.periode) where.periode = query.periode
    if (query.categorieId) where.categorieId = query.categorieId
    if (query.published !== undefined) where.published = query.published
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
        include: {
          categorie: true,
          tags: true,
          images: true
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
      console.error('[GET /api/admin/stages] Validation error:', {
        code: 'VALIDATION_ERROR',
        issueCount: error.issues.length
      })

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

    console.error('[GET /api/admin/stages] Server error:', {
      code: 'SERVER_ERROR',
      errorType: error instanceof Error ? error.constructor.name : 'Unknown'
    })

    return NextResponse.json(
      { error: { code: ERROR_CODES.SERVER_ERROR, message: 'Erreur serveur' } },
      { status: 500 }
    )
  }
}

/**
 * POST /api/admin/stages
 * Create a new stage
 * Story 3.4: FR3, FR13, FR24, FR25, FR38 (audit logging)
 */
export async function POST(request: NextRequest) {
  try {
    // Get admin context from middleware
    const admin = getAdminFromRequest(request)
    if (!admin) {
      return NextResponse.json(
        { error: { code: ERROR_CODES.UNAUTHORIZED, message: 'Non authentifié' } },
        { status: 401 }
      )
    }

    // Validate request body
    const body = await request.json()
    const validated = stageCreateSchema.parse(body)

    // Extract billetwebId from URL if not provided
    const billetwebId = validated.billetwebId || extractBilletwebId(validated.billetwebUrl)

    // Create stage with relations
    const stage = await prisma.stage.create({
      data: {
        titre: validated.titre,
        description: validated.description,
        ageMin: validated.ageMin,
        ageMax: validated.ageMax,
        periode: validated.periode,
        dateDebut: validated.dateDebut,
        dateFin: validated.dateFin,
        prix: validated.prix,
        billetwebUrl: validated.billetwebUrl,
        billetwebId: billetwebId,
        placesTotal: validated.placesTotal,
        placesLeft: validated.placesLeft,
        isFull: validated.isFull,
        published: validated.published,
        categorieId: validated.categorieId,
        createdById: admin.adminId,
        updatedById: admin.adminId,
        tags: {
          connect: validated.tagIds.map(id => ({ id }))
        },
        images: {
          connect: validated.imageIds.map(id => ({ id }))
        }
      },
      include: {
        categorie: true,
        tags: true,
        images: true
      }
    })

    // FR38: Audit logging
    await prisma.auditLog.create({
      data: {
        adminId: admin.adminId,
        action: AUDIT_ACTIONS.STAGE_CREATED,
        entity: 'Stage',
        entityId: stage.id,
        details: JSON.stringify({ titre: stage.titre, periode: stage.periode })
      }
    })

    return NextResponse.json({ data: stage }, { status: 201 })

  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('[POST /api/admin/stages] Validation error:', {
        code: 'VALIDATION_ERROR',
        issueCount: error.issues.length
      })

      return NextResponse.json(
        {
          error: {
            code: ERROR_CODES.VALIDATION_ERROR,
            message: 'Données invalides',
            details: error.issues
          }
        },
        { status: 400 }
      )
    }

    // Handle Prisma errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return NextResponse.json(
          { error: { code: ERROR_CODES.NOT_FOUND, message: 'Catégorie ou tag non trouvé' } },
          { status: 404 }
        )
      }
      if (error.code === 'P2003') {
        return NextResponse.json(
          { error: { code: ERROR_CODES.VALIDATION_ERROR, message: 'Référence invalide (catégorie, tag ou image)' } },
          { status: 400 }
        )
      }
    }

    console.error('[POST /api/admin/stages] Server error:', {
      code: 'SERVER_ERROR',
      errorType: error instanceof Error ? error.constructor.name : 'Unknown'
    })

    return NextResponse.json(
      { error: { code: ERROR_CODES.SERVER_ERROR, message: 'Erreur serveur' } },
      { status: 500 }
    )
  }
}
