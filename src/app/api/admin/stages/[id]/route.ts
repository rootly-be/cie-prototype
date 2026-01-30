import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminFromRequest } from '@/lib/auth'
import { stageUpdateSchema } from '@/lib/validations/stage'
import { AUDIT_ACTIONS, ERROR_CODES } from '@/lib/constants'
import { Prisma } from '@/generated/prisma/client'
import { z } from 'zod'

/**
 * GET /api/admin/stages/[id]
 * Get single stage by ID (admin view - includes unpublished)
 * Story 3.4: FR3
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params

  try {
    const stage = await prisma.stage.findUnique({
      where: { id },
      include: {
        categorie: true,
        tags: true,
        images: true,
        createdBy: { select: { id: true, email: true } },
        updatedBy: { select: { id: true, email: true } }
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
    console.error(`[GET /api/admin/stages/${id}] Server error:`, {
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
 * PUT /api/admin/stages/[id]
 * Update an existing stage
 * Story 3.4: FR3, FR13, FR24, FR25, FR38 (audit logging)
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
    const validated = stageUpdateSchema.parse(body)

    // Build update data (use any to allow custom transformations)
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

    // Update stage
    const stage = await prisma.stage.update({
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
        action: AUDIT_ACTIONS.STAGE_UPDATED,
        entity: 'Stage',
        entityId: stage.id,
        details: JSON.stringify({ titre: stage.titre, updated: Object.keys(validated) })
      }
    })

    return NextResponse.json({ data: stage })

  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error(`[PUT /api/admin/stages/${id}] Validation error:`, {
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
          { error: { code: ERROR_CODES.NOT_FOUND, message: 'Stage non trouvé' } },
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

    console.error(`[PUT /api/admin/stages/${id}] Server error:`, {
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
 * DELETE /api/admin/stages/[id]
 * Soft-delete a stage (set published = false)
 * Story 3.4: FR3, FR38 (audit logging)
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
    const stage = await prisma.stage.update({
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
        action: AUDIT_ACTIONS.STAGE_DELETED,
        entity: 'Stage',
        entityId: stage.id,
        details: JSON.stringify({ titre: stage.titre })
      }
    })

    return NextResponse.json({ data: { id: stage.id, deleted: true } })

  } catch (error) {
    // Handle Prisma errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return NextResponse.json(
          { error: { code: ERROR_CODES.NOT_FOUND, message: 'Stage non trouvé' } },
          { status: 404 }
        )
      }
    }

    console.error(`[DELETE /api/admin/stages/${id}] Server error:`, {
      code: 'SERVER_ERROR',
      errorType: error instanceof Error ? error.constructor.name : 'Unknown'
    })

    return NextResponse.json(
      { error: { code: ERROR_CODES.SERVER_ERROR, message: 'Erreur serveur' } },
      { status: 500 }
    )
  }
}
