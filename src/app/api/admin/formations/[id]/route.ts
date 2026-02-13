import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminFromRequest } from '@/lib/auth'
import { formationUpdateSchema } from '@/lib/validations/formation'
import { extractBilletwebId } from '@/lib/validations/billetweb'
import { AUDIT_ACTIONS, ERROR_CODES } from '@/lib/constants'
import { Prisma } from '@/generated/prisma/client'
import { z } from 'zod'

/**
 * GET /api/admin/formations/[id]
 * Get single formation by ID (admin view - includes unpublished)
 * Story 3.3: FR2
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params

  try {
    const formation = await prisma.formation.findUnique({
      where: { id },
      include: {
        categorie: true,
        tags: true,
        images: true,
        dates: true,
        createdBy: { select: { id: true, email: true } },
        updatedBy: { select: { id: true, email: true } }
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
    console.error(`[GET /api/admin/formations/${id}] Server error:`, {
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
 * PUT /api/admin/formations/[id]
 * Update an existing formation
 * Story 3.3: FR2, FR13, FR38 (audit logging)
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
    const validated = formationUpdateSchema.parse(body)

    // Extract billetwebId from URL if URL provided but not ID
    if (validated.billetwebUrl && !validated.billetwebId) {
      validated.billetwebId = extractBilletwebId(validated.billetwebUrl) || undefined
    }

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

    // Handle date relations (set replaces all)
    if (validated.dateIds !== undefined) {
      data.dates = {
        set: validated.dateIds.map(id => ({ id }))
      }
      delete data.dateIds
    }

    // Update formation
    const formation = await prisma.formation.update({
      where: { id },
      data,
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
        action: AUDIT_ACTIONS.FORMATION_UPDATED,
        entity: 'Formation',
        entityId: formation.id,
        details: JSON.stringify({ titre: formation.titre, updated: Object.keys(validated) })
      }
    })

    return NextResponse.json({ data: formation })

  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error(`[PUT /api/admin/formations/${id}] Validation error:`, {
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
          { error: { code: ERROR_CODES.NOT_FOUND, message: 'Formation non trouvée' } },
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

    console.error(`[PUT /api/admin/formations/${id}] Server error:`, {
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
 * DELETE /api/admin/formations/[id]
 * Permanently delete a formation
 * Story 3.3: FR2, FR38 (audit logging)
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

    // Get formation data for audit log before deletion
    const formation = await prisma.formation.findUnique({
      where: { id },
      select: { id: true, titre: true }
    })

    if (!formation) {
      return NextResponse.json(
        { error: { code: ERROR_CODES.NOT_FOUND, message: 'Formation non trouvée' } },
        { status: 404 }
      )
    }

    // Delete the formation permanently
    await prisma.formation.delete({
      where: { id }
    })

    // FR38: Audit logging
    await prisma.auditLog.create({
      data: {
        adminId: admin.adminId,
        action: AUDIT_ACTIONS.FORMATION_DELETED,
        entity: 'Formation',
        entityId: formation.id,
        details: JSON.stringify({ titre: formation.titre })
      }
    })

    return NextResponse.json({ data: { id: formation.id, deleted: true } })

  } catch (error) {
    // Handle Prisma errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return NextResponse.json(
          { error: { code: ERROR_CODES.NOT_FOUND, message: 'Formation non trouvée' } },
          { status: 404 }
        )
      }
    }

    console.error(`[DELETE /api/admin/formations/${id}] Server error:`, {
      code: 'SERVER_ERROR',
      errorType: error instanceof Error ? error.constructor.name : 'Unknown'
    })

    return NextResponse.json(
      { error: { code: ERROR_CODES.SERVER_ERROR, message: 'Erreur serveur' } },
      { status: 500 }
    )
  }
}
