import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { categoryQuerySchema } from '@/lib/validations/category'
import { ERROR_CODES } from '@/lib/constants'
import { Prisma } from '@/generated/prisma/client'
import { z } from 'zod'

/**
 * GET /api/categories
 * List all categories (public view)
 * Story 3.5: FR5, FR6, FR7
 */
export async function GET(request: NextRequest) {
  try {
    // Parse and validate query params
    const { searchParams } = new URL(request.url)
    const query = categoryQuerySchema.parse(Object.fromEntries(searchParams))

    // Build where clause
    const where: Prisma.CategoryWhereInput = {}
    if (query.type) where.type = query.type

    // Fetch all categories (no pagination)
    const categories = await prisma.category.findMany({
      where,
      orderBy: { nom: 'asc' }
    })

    return NextResponse.json({ data: categories })

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

    console.error('[GET /api/categories] Server error:', {
      code: 'SERVER_ERROR',
      errorType: error instanceof Error ? error.constructor.name : 'Unknown'
    })

    return NextResponse.json(
      { error: { code: ERROR_CODES.SERVER_ERROR, message: 'Erreur serveur' } },
      { status: 500 }
    )
  }
}
