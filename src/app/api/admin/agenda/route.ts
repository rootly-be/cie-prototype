import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminFromRequest } from '@/lib/auth'
import { agendaEventCreateSchema, agendaEventQuerySchema } from '@/lib/validations/agenda'
import { AUDIT_ACTIONS, ERROR_CODES } from '@/lib/constants'
import { Prisma } from '@/generated/prisma/client'
import { z } from 'zod'

/**
 * GET /api/admin/agenda
 * List all agenda events with filters (admin view)
 * Story 6.1: FR4, FR16
 */
export async function GET(request: NextRequest) {
  try {
    const admin = getAdminFromRequest(request)
    if (!admin) {
      return NextResponse.json(
        { error: { code: ERROR_CODES.UNAUTHORIZED, message: 'Non authentifié' } },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const query = agendaEventQuerySchema.parse(Object.fromEntries(searchParams))

    // Build where clause
    const where: Prisma.AgendaEventWhereInput = {}

    if (query.published !== undefined) where.published = query.published
    if (query.sourceType) where.sourceType = query.sourceType

    // Tag filter
    if (query.tagIds) {
      where.tags = {
        some: { id: { in: query.tagIds.split(',') } }
      }
    }

    // Date range filter
    if (query.dateFrom || query.dateTo) {
      where.date = {}
      if (query.dateFrom) where.date.gte = query.dateFrom
      if (query.dateTo) where.date.lte = query.dateTo
    }

    // Month/year filter
    if (query.month && query.year) {
      const startOfMonth = new Date(query.year, query.month - 1, 1)
      const endOfMonth = new Date(query.year, query.month, 0, 23, 59, 59)
      where.date = { gte: startOfMonth, lte: endOfMonth }
    }

    // Pagination
    const skip = (query.page - 1) * query.pageSize
    const take = query.pageSize

    const [events, total] = await Promise.all([
      prisma.agendaEvent.findMany({
        where,
        include: { tags: true },
        orderBy: { [query.sortBy]: query.sortOrder },
        skip,
        take
      }),
      prisma.agendaEvent.count({ where })
    ])

    return NextResponse.json({
      data: events,
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
        { error: { code: ERROR_CODES.VALIDATION_ERROR, message: 'Paramètres invalides', details: error.issues } },
        { status: 400 }
      )
    }

    console.error('[GET /api/admin/agenda] Server error:', {
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
 * POST /api/admin/agenda
 * Create a new agenda event
 * Story 6.1: FR4, FR16, FR38
 */
export async function POST(request: NextRequest) {
  try {
    const admin = getAdminFromRequest(request)
    if (!admin) {
      return NextResponse.json(
        { error: { code: ERROR_CODES.UNAUTHORIZED, message: 'Non authentifié' } },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validated = agendaEventCreateSchema.parse(body)

    const event = await prisma.agendaEvent.create({
      data: {
        titre: validated.titre,
        date: validated.date,
        dateFin: validated.dateFin,
        lieu: validated.lieu,
        sourceType: validated.sourceType,
        sourceId: validated.sourceId,
        published: validated.published,
        createdById: admin.adminId,
        updatedById: admin.adminId,
        tags: {
          connect: validated.tagIds.map(id => ({ id }))
        }
      },
      include: { tags: true }
    })

    // FR38: Audit logging
    await prisma.auditLog.create({
      data: {
        adminId: admin.adminId,
        action: AUDIT_ACTIONS.AGENDA_EVENT_CREATED,
        entity: 'AgendaEvent',
        entityId: event.id,
        details: JSON.stringify({ titre: event.titre, date: event.date })
      }
    })

    return NextResponse.json({ data: event }, { status: 201 })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: { code: ERROR_CODES.VALIDATION_ERROR, message: 'Données invalides', details: error.issues } },
        { status: 400 }
      )
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return NextResponse.json(
          { error: { code: ERROR_CODES.NOT_FOUND, message: 'Tag non trouvé' } },
          { status: 404 }
        )
      }
    }

    console.error('[POST /api/admin/agenda] Server error:', {
      code: 'SERVER_ERROR',
      errorType: error instanceof Error ? error.constructor.name : 'Unknown'
    })
    return NextResponse.json(
      { error: { code: ERROR_CODES.SERVER_ERROR, message: 'Erreur serveur' } },
      { status: 500 }
    )
  }
}
