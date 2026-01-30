import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminFromRequest } from '@/lib/auth'
import { formationCreateSchema, formationQuerySchema } from '@/lib/validations/formation'
import { AUDIT_ACTIONS, ERROR_CODES } from '@/lib/constants'
import { Prisma } from '@/generated/prisma/client'
import { z } from 'zod'

/**
 * GET /api/admin/formations
 * List all formations with filters and pagination (admin view)
 * Story 3.3: FR2, FR13, FR22, FR27
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
    const query = formationQuerySchema.parse(Object.fromEntries(searchParams))

    // Build where clause
    const where: Prisma.FormationWhereInput = {}

    if (query.categorieId) where.categorieId = query.categorieId
    if (query.published !== undefined) where.published = query.published
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
        include: {
          categorie: true,
          tags: true,
          images: true,
          dates: true
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
      console.error('[GET /api/admin/formations] Validation error:', {
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

    console.error('[GET /api/admin/formations] Server error:', {
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
 * POST /api/admin/formations
 * Create a new formation
 * Story 3.3: FR2, FR13, FR14, FR38 (audit logging)
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
    const validated = formationCreateSchema.parse(body)

    // Create formation with relations
    const formation = await prisma.formation.create({
      data: {
        titre: validated.titre,
        description: validated.description,
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
        },
        dates: {
          connect: validated.dateIds.map(id => ({ id }))
        }
      },
      include: {
        categorie: true,
        tags: true,
        images: true,
        dates: true
      }
    })

    // FR38: Audit logging
    await prisma.auditLog.create({
      data: {
        adminId: admin.adminId,
        action: AUDIT_ACTIONS.FORMATION_CREATED,
        entity: 'Formation',
        entityId: formation.id,
        details: JSON.stringify({ titre: formation.titre })
      }
    })

    return NextResponse.json({ data: formation }, { status: 201 })

  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('[POST /api/admin/formations] Validation error:', {
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
          { error: { code: ERROR_CODES.NOT_FOUND, message: 'Catégorie, tag ou date non trouvé' } },
          { status: 404 }
        )
      }
      if (error.code === 'P2003') {
        return NextResponse.json(
          { error: { code: ERROR_CODES.VALIDATION_ERROR, message: 'Référence invalide (catégorie, tag, image ou date)' } },
          { status: 400 }
        )
      }
    }

    console.error('[POST /api/admin/formations] Server error:', {
      code: 'SERVER_ERROR',
      errorType: error instanceof Error ? error.constructor.name : 'Unknown'
    })

    return NextResponse.json(
      { error: { code: ERROR_CODES.SERVER_ERROR, message: 'Erreur serveur' } },
      { status: 500 }
    )
  }
}
