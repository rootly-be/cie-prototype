import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminFromRequest } from '@/lib/auth'
import { tagCreateSchema } from '@/lib/validations/tag'
import { ERROR_CODES } from '@/lib/constants'
import { Prisma } from '@/generated/prisma/client'
import { z } from 'zod'

/**
 * GET /api/admin/tags
 * List all tags (no pagination needed - small dataset)
 * Story 3.5: FR8, FR9
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

    // Fetch all tags (no pagination)
    const tags = await prisma.tag.findMany({
      orderBy: { nom: 'asc' }
    })

    return NextResponse.json({ data: tags })

  } catch (error) {
    console.error('[GET /api/admin/tags] Server error:', {
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
 * POST /api/admin/tags
 * Create a new tag
 * Story 3.5: FR8, FR9
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
    const validated = tagCreateSchema.parse(body)

    // Create tag
    const tag = await prisma.tag.create({
      data: {
        nom: validated.nom,
        couleur: validated.couleur
      }
    })

    return NextResponse.json({ data: tag }, { status: 201 })

  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('[POST /api/admin/tags] Validation error:', {
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
          { error: { code: ERROR_CODES.CONFLICT, message: 'Un tag avec ce nom existe déjà' } },
          { status: 409 }
        )
      }
    }

    console.error('[POST /api/admin/tags] Server error:', {
      code: 'SERVER_ERROR',
      errorType: error instanceof Error ? error.constructor.name : 'Unknown'
    })

    return NextResponse.json(
      { error: { code: ERROR_CODES.SERVER_ERROR, message: 'Erreur serveur' } },
      { status: 500 }
    )
  }
}
