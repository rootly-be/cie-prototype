import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { agendaEventQuerySchema } from '@/lib/validations/agenda'
import { ERROR_CODES } from '@/lib/constants'
import { Prisma } from '@/generated/prisma/client'
import { z } from 'zod'

/**
 * GET /api/agenda
 * List published agenda events with filters (public view)
 * Story 6.1: FR4, FR16
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = agendaEventQuerySchema.parse(Object.fromEntries(searchParams))

    // Build where clause - ONLY published events
    const where: Prisma.AgendaEventWhereInput = {
      published: true // Public API only shows published content
    }

    // Source type filter
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
        select: {
          id: true,
          titre: true,
          date: true,
          dateFin: true,
          lieu: true,
          sourceType: true,
          sourceId: true,
          published: true,
          createdAt: true,
          tags: {
            select: {
              id: true,
              nom: true,
              couleur: true
            }
          }
          // Note: Do NOT expose createdById, updatedById in public API
        },
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

    console.error('[GET /api/agenda] Server error:', {
      code: 'SERVER_ERROR',
      errorType: error instanceof Error ? error.constructor.name : 'Unknown'
    })

    return NextResponse.json(
      { error: { code: ERROR_CODES.SERVER_ERROR, message: 'Erreur serveur' } },
      { status: 500 }
    )
  }
}
