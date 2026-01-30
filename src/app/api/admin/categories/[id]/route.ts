import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminFromRequest } from '@/lib/auth'
import { categoryUpdateSchema } from '@/lib/validations/category'
import { ERROR_CODES } from '@/lib/constants'
import { Prisma } from '@/generated/prisma/client'
import { z } from 'zod'

/**
 * GET /api/admin/categories/[id]
 * Get single category by ID
 * Story 3.5: FR5, FR6, FR7
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params

  try {
    const category = await prisma.category.findUnique({
      where: { id }
    })

    if (!category) {
      return NextResponse.json(
        { error: { code: ERROR_CODES.NOT_FOUND, message: 'Catégorie non trouvée' } },
        { status: 404 }
      )
    }

    return NextResponse.json({ data: category })

  } catch (error) {
    console.error(`[GET /api/admin/categories/${id}] Server error:`, {
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
 * PUT /api/admin/categories/[id]
 * Update an existing category
 * Story 3.5: FR5, FR6, FR7
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
    const validated = categoryUpdateSchema.parse(body)

    // Update category
    const category = await prisma.category.update({
      where: { id },
      data: validated
    })

    return NextResponse.json({ data: category })

  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error(`[PUT /api/admin/categories/${id}] Validation error:`, {
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
          { error: { code: ERROR_CODES.NOT_FOUND, message: 'Catégorie non trouvée' } },
          { status: 404 }
        )
      }
      if (error.code === 'P2002') {
        return NextResponse.json(
          { error: { code: ERROR_CODES.CONFLICT, message: 'Une catégorie avec ce nom existe déjà pour ce type' } },
          { status: 409 }
        )
      }
    }

    console.error(`[PUT /api/admin/categories/${id}] Server error:`, {
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
 * DELETE /api/admin/categories/[id]
 * Delete a category (hard delete - FK constraint prevents if in use)
 * Story 3.5: FR5, FR6, FR7
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

    // Delete category
    await prisma.category.delete({
      where: { id }
    })

    return NextResponse.json({ data: { id, deleted: true } })

  } catch (error) {
    // Handle Prisma errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return NextResponse.json(
          { error: { code: ERROR_CODES.NOT_FOUND, message: 'Catégorie non trouvée' } },
          { status: 404 }
        )
      }
      if (error.code === 'P2003') {
        return NextResponse.json(
          { error: { code: ERROR_CODES.VALIDATION_ERROR, message: 'Impossible de supprimer: catégorie utilisée par du contenu' } },
          { status: 400 }
        )
      }
    }

    console.error(`[DELETE /api/admin/categories/${id}] Server error:`, {
      code: 'SERVER_ERROR',
      errorType: error instanceof Error ? error.constructor.name : 'Unknown'
    })

    return NextResponse.json(
      { error: { code: ERROR_CODES.SERVER_ERROR, message: 'Erreur serveur' } },
      { status: 500 }
    )
  }
}
