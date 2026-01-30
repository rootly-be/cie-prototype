import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminFromRequest } from '@/lib/auth'
import { animationCreateSchema, animationQuerySchema } from '@/lib/validations/animation'
import { AUDIT_ACTIONS, ERROR_CODES } from '@/lib/constants'
import { Prisma } from '@/generated/prisma/client'
import { z } from 'zod'

/**
 * GET /api/admin/animations
 * List all animations with filters and pagination (admin view)
 * Story 3.2: FR1, FR21, FR22, FR27
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
    const query = animationQuerySchema.parse(Object.fromEntries(searchParams))

    // Build where clause
    const where: Prisma.AnimationWhereInput = {}

    if (query.niveau) where.niveau = query.niveau
    if (query.categorieId) where.categorieId = query.categorieId
    if (query.published !== undefined) where.published = query.published

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
    const [animations, total] = await Promise.all([
      prisma.animation.findMany({
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
      prisma.animation.count({ where })
    ])

    return NextResponse.json({
      data: animations,
      meta: {
        total,
        page: query.page,
        pageSize: query.pageSize,
        totalPages: Math.ceil(total / query.pageSize)
      }
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('[GET /api/admin/animations] Validation error:', {
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

    console.error('[GET /api/admin/animations] Server error:', {
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
 * POST /api/admin/animations
 * Create a new animation
 * Story 3.2: FR1, FR38 (audit logging)
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
    const validated = animationCreateSchema.parse(body)

    // Create animation with relations
    const animation = await prisma.animation.create({
      data: {
        titre: validated.titre,
        description: validated.description,
        niveau: validated.niveau,
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
        action: AUDIT_ACTIONS.ANIMATION_CREATED,
        entity: 'Animation',
        entityId: animation.id,
        details: JSON.stringify({ titre: animation.titre })
      }
    })

    return NextResponse.json({ data: animation }, { status: 201 })

  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('[POST /api/admin/animations] Validation error:', {
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

    console.error('[POST /api/admin/animations] Server error:', {
      code: 'SERVER_ERROR',
      errorType: error instanceof Error ? error.constructor.name : 'Unknown'
    })

    return NextResponse.json(
      { error: { code: ERROR_CODES.SERVER_ERROR, message: 'Erreur serveur' } },
      { status: 500 }
    )
  }
}
