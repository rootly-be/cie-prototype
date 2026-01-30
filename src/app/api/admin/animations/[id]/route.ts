import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminFromRequest } from '@/lib/auth'
import { animationUpdateSchema } from '@/lib/validations/animation'
import { AUDIT_ACTIONS, ERROR_CODES } from '@/lib/constants'
import { Prisma } from '@/generated/prisma/client'
import { z } from 'zod'

/**
 * GET /api/admin/animations/[id]
 * Get single animation by ID (admin view - includes unpublished)
 * Story 3.2: FR1
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params

  try {
    const animation = await prisma.animation.findUnique({
      where: { id },
      include: {
        categorie: true,
        tags: true,
        images: true,
        createdBy: { select: { id: true, email: true } },
        updatedBy: { select: { id: true, email: true } }
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
    console.error(`[GET /api/admin/animations/${id}] Server error:`, {
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
 * PUT /api/admin/animations/[id]
 * Update an existing animation
 * Story 3.2: FR1, FR38 (audit logging)
 */
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params

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
    const validated = animationUpdateSchema.parse(body)

    // Build update data (remove type annotation to allow custom transformations)
    const data: any = {
      ...validated,
      updatedById: admin.adminId
    }

    // Handle tag relations (set replaces all)
    if (validated.tagIds !== undefined) {
      data.tags = {
        set: validated.tagIds.map(id => ({ id }))
      }
      delete data.tagIds
    }

    // Handle image relations (set replaces all)
    if (validated.imageIds !== undefined) {
      data.images = {
        set: validated.imageIds.map(id => ({ id }))
      }
      delete data.imageIds
    }

    // Update animation
    const animation = await prisma.animation.update({
      where: { id },
      data,
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
        action: AUDIT_ACTIONS.ANIMATION_UPDATED,
        entity: 'Animation',
        entityId: animation.id,
        details: JSON.stringify({ titre: animation.titre, updated: Object.keys(validated) })
      }
    })

    return NextResponse.json({ data: animation })

  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error(`[PUT /api/admin/animations/${id}] Validation error:`, {
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
          { error: { code: ERROR_CODES.NOT_FOUND, message: 'Animation non trouvée' } },
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

    console.error(`[PUT /api/admin/animations/${id}] Server error:`, {
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
 * DELETE /api/admin/animations/[id]
 * Soft-delete an animation (set published = false)
 * Story 3.2: FR1, FR38 (audit logging)
 */
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params

  try {
    // Get admin context from middleware
    const admin = getAdminFromRequest(request)
    if (!admin) {
      return NextResponse.json(
        { error: { code: ERROR_CODES.UNAUTHORIZED, message: 'Non authentifié' } },
        { status: 401 }
      )
    }

    // Soft-delete: set published = false
    const animation = await prisma.animation.update({
      where: { id },
      data: {
        published: false,
        updatedById: admin.adminId
      }
    })

    // FR38: Audit logging
    await prisma.auditLog.create({
      data: {
        adminId: admin.adminId,
        action: AUDIT_ACTIONS.ANIMATION_DELETED,
        entity: 'Animation',
        entityId: animation.id,
        details: JSON.stringify({ titre: animation.titre })
      }
    })

    return NextResponse.json({ data: { id: animation.id, deleted: true } })

  } catch (error) {
    // Handle Prisma errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return NextResponse.json(
          { error: { code: ERROR_CODES.NOT_FOUND, message: 'Animation non trouvée' } },
          { status: 404 }
        )
      }
    }

    console.error(`[DELETE /api/admin/animations/${id}] Server error:`, {
      code: 'SERVER_ERROR',
      errorType: error instanceof Error ? error.constructor.name : 'Unknown'
    })

    return NextResponse.json(
      { error: { code: ERROR_CODES.SERVER_ERROR, message: 'Erreur serveur' } },
      { status: 500 }
    )
  }
}
