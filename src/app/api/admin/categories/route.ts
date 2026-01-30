import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminFromRequest } from '@/lib/auth'
import { categoryCreateSchema, categoryQuerySchema } from '@/lib/validations/category'
import { ERROR_CODES } from '@/lib/constants'
import { Prisma } from '@/generated/prisma/client'
import { z } from 'zod'

/**
 * GET /api/admin/categories
 * List all categories (no pagination needed - small dataset)
 * Story 3.5: FR5, FR6, FR7
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
      console.error('[GET /api/admin/categories] Validation error:', {
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

    console.error('[GET /api/admin/categories] Server error:', {
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
 * POST /api/admin/categories
 * Create a new category
 * Story 3.5: FR5, FR6, FR7
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
    const validated = categoryCreateSchema.parse(body)

    // Create category
    const category = await prisma.category.create({
      data: {
        nom: validated.nom,
        type: validated.type
      }
    })

    return NextResponse.json({ data: category }, { status: 201 })

  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('[POST /api/admin/categories] Validation error:', {
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
      if (error.code === 'P2002') {
        return NextResponse.json(
          { error: { code: ERROR_CODES.CONFLICT, message: 'Une catégorie avec ce nom existe déjà pour ce type' } },
          { status: 409 }
        )
      }
    }

    console.error('[POST /api/admin/categories] Server error:', {
      code: 'SERVER_ERROR',
      errorType: error instanceof Error ? error.constructor.name : 'Unknown'
    })

    return NextResponse.json(
      { error: { code: ERROR_CODES.SERVER_ERROR, message: 'Erreur serveur' } },
      { status: 500 }
    )
  }
}
