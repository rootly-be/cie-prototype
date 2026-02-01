import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminFromRequest } from '@/lib/auth'
import { agendaEventUpdateSchema } from '@/lib/validations/agenda'
import { AUDIT_ACTIONS, ERROR_CODES } from '@/lib/constants'
import { Prisma } from '@/generated/prisma/client'
import { z } from 'zod'

/**
 * GET /api/admin/agenda/[id]
 * Get single agenda event by ID (admin view - includes unpublished)
 * Story 6.1: FR4, FR16
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params

  try {
    const admin = getAdminFromRequest(request)
    if (!admin) {
      return NextResponse.json(
        { error: { code: ERROR_CODES.UNAUTHORIZED, message: 'Non authentifié' } },
        { status: 401 }
      )
    }

    const event = await prisma.agendaEvent.findUnique({
      where: { id },
      include: {
        tags: true,
        createdBy: { select: { id: true, email: true } },
        updatedBy: { select: { id: true, email: true } }
      }
    })

    if (!event) {
      return NextResponse.json(
        { error: { code: ERROR_CODES.NOT_FOUND, message: 'Événement non trouvé' } },
        { status: 404 }
      )
    }

    return NextResponse.json({ data: event })

  } catch (error) {
    console.error(`[GET /api/admin/agenda/${id}] Server error:`, {
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
 * PUT /api/admin/agenda/[id]
 * Update an existing agenda event
 * Story 6.1: FR4, FR16, FR38 (audit logging)
 */
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params

  try {
    const admin = getAdminFromRequest(request)
    if (!admin) {
      return NextResponse.json(
        { error: { code: ERROR_CODES.UNAUTHORIZED, message: 'Non authentifié' } },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validated = agendaEventUpdateSchema.parse(body)

    // Build update data (use any to allow custom transformations)
    const data: Record<string, unknown> = {
      ...validated,
      updatedById: admin.adminId
    }

    // Handle tag relations (set replaces all)
    if (validated.tagIds !== undefined) {
      data.tags = {
        set: validated.tagIds.map(tagId => ({ id: tagId }))
      }
      delete data.tagIds
    }

    const event = await prisma.agendaEvent.update({
      where: { id },
      data,
      include: { tags: true }
    })

    // FR38: Audit logging
    await prisma.auditLog.create({
      data: {
        adminId: admin.adminId,
        action: AUDIT_ACTIONS.AGENDA_EVENT_UPDATED,
        entity: 'AgendaEvent',
        entityId: event.id,
        details: JSON.stringify({ titre: event.titre, updated: Object.keys(validated) })
      }
    })

    return NextResponse.json({ data: event })

  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error(`[PUT /api/admin/agenda/${id}] Validation error:`, {
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

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return NextResponse.json(
          { error: { code: ERROR_CODES.NOT_FOUND, message: 'Événement non trouvé' } },
          { status: 404 }
        )
      }
      if (error.code === 'P2003') {
        return NextResponse.json(
          { error: { code: ERROR_CODES.VALIDATION_ERROR, message: 'Tag invalide' } },
          { status: 400 }
        )
      }
    }

    console.error(`[PUT /api/admin/agenda/${id}] Server error:`, {
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
 * DELETE /api/admin/agenda/[id]
 * Soft-delete an agenda event (set published = false)
 * Story 6.1: FR4, FR16, FR38 (audit logging)
 */
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params

  try {
    const admin = getAdminFromRequest(request)
    if (!admin) {
      return NextResponse.json(
        { error: { code: ERROR_CODES.UNAUTHORIZED, message: 'Non authentifié' } },
        { status: 401 }
      )
    }

    // Soft-delete: set published = false
    const event = await prisma.agendaEvent.update({
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
        action: AUDIT_ACTIONS.AGENDA_EVENT_DELETED,
        entity: 'AgendaEvent',
        entityId: event.id,
        details: JSON.stringify({ titre: event.titre })
      }
    })

    return NextResponse.json({ data: { id: event.id, deleted: true } })

  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return NextResponse.json(
          { error: { code: ERROR_CODES.NOT_FOUND, message: 'Événement non trouvé' } },
          { status: 404 }
        )
      }
    }

    console.error(`[DELETE /api/admin/agenda/${id}] Server error:`, {
      code: 'SERVER_ERROR',
      errorType: error instanceof Error ? error.constructor.name : 'Unknown'
    })

    return NextResponse.json(
      { error: { code: ERROR_CODES.SERVER_ERROR, message: 'Erreur serveur' } },
      { status: 500 }
    )
  }
}
