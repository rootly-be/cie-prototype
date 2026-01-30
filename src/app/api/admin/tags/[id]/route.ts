import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminFromRequest } from '@/lib/auth'
import { tagUpdateSchema } from '@/lib/validations/tag'
import { ERROR_CODES } from '@/lib/constants'
import { Prisma } from '@/generated/prisma/client'
import { z } from 'zod'

/**
 * GET /api/admin/tags/[id]
 * Get single tag by ID
 * Story 3.5: FR8, FR9
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params

  try {
    const tag = await prisma.tag.findUnique({
      where: { id }
    })

    if (!tag) {
      return NextResponse.json(
        { error: { code: ERROR_CODES.NOT_FOUND, message: 'Tag non trouvé' } },
        { status: 404 }
      )
    }

    return NextResponse.json({ data: tag })

  } catch (error) {
    console.error(`[GET /api/admin/tags/${id}] Server error:`, {
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
 * PUT /api/admin/tags/[id]
 * Update an existing tag
 * Story 3.5: FR8, FR9
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
    const validated = tagUpdateSchema.parse(body)

    // Update tag
    const tag = await prisma.tag.update({
      where: { id },
      data: validated
    })

    return NextResponse.json({ data: tag })

  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error(`[PUT /api/admin/tags/${id}] Validation error:`, {
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
          { error: { code: ERROR_CODES.NOT_FOUND, message: 'Tag non trouvé' } },
          { status: 404 }
        )
      }
      if (error.code === 'P2002') {
        return NextResponse.json(
          { error: { code: ERROR_CODES.CONFLICT, message: 'Un tag avec ce nom existe déjà' } },
          { status: 409 }
        )
      }
    }

    console.error(`[PUT /api/admin/tags/${id}] Server error:`, {
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
 * DELETE /api/admin/tags/[id]
 * Delete a tag (hard delete - FK constraint prevents if in use)
 * Story 3.5: FR8, FR9
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

    // Delete tag
    await prisma.tag.delete({
      where: { id }
    })

    return NextResponse.json({ data: { id, deleted: true } })

  } catch (error) {
    // Handle Prisma errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return NextResponse.json(
          { error: { code: ERROR_CODES.NOT_FOUND, message: 'Tag non trouvé' } },
          { status: 404 }
        )
      }
      if (error.code === 'P2003') {
        return NextResponse.json(
          { error: { code: ERROR_CODES.VALIDATION_ERROR, message: 'Impossible de supprimer: tag utilisé par du contenu' } },
          { status: 400 }
        )
      }
    }

    console.error(`[DELETE /api/admin/tags/${id}] Server error:`, {
      code: 'SERVER_ERROR',
      errorType: error instanceof Error ? error.constructor.name : 'Unknown'
    })

    return NextResponse.json(
      { error: { code: ERROR_CODES.SERVER_ERROR, message: 'Erreur serveur' } },
      { status: 500 }
    )
  }
}
