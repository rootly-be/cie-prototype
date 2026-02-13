import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminFromRequest } from '@/lib/auth'
import { ERROR_CODES } from '@/lib/constants'
import { Prisma } from '@/generated/prisma/client'
import { z } from 'zod'

const teamMemberUpdateSchema = z.object({
  nom: z.string().min(2).optional(),
  fonction: z.string().min(2).optional(),
  photo: z.string().url().nullable().optional(),
  type: z.enum(['equipe', 'ca']).optional(),
  ordre: z.number().int().nonnegative().optional(),
})

/**
 * GET /api/admin/team/[id]
 * Get a single team member
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params

  try {
    const member = await prisma.teamMember.findUnique({
      where: { id },
    })

    if (!member) {
      return NextResponse.json(
        { error: { code: ERROR_CODES.NOT_FOUND, message: 'Membre non trouvé' } },
        { status: 404 }
      )
    }

    return NextResponse.json({ data: member })
  } catch (error) {
    console.error(`[GET /api/admin/team/${id}] Server error:`, error)
    return NextResponse.json(
      { error: { code: ERROR_CODES.SERVER_ERROR, message: 'Erreur serveur' } },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/admin/team/[id]
 * Update a team member
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
    const validated = teamMemberUpdateSchema.parse(body)

    const member = await prisma.teamMember.update({
      where: { id },
      data: validated,
    })

    return NextResponse.json({ data: member })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: {
            code: ERROR_CODES.VALIDATION_ERROR,
            message: 'Données invalides',
            details: error.issues,
          },
        },
        { status: 400 }
      )
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return NextResponse.json(
          { error: { code: ERROR_CODES.NOT_FOUND, message: 'Membre non trouvé' } },
          { status: 404 }
        )
      }
    }

    console.error(`[PUT /api/admin/team/${id}] Server error:`, error)
    return NextResponse.json(
      { error: { code: ERROR_CODES.SERVER_ERROR, message: 'Erreur serveur' } },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/admin/team/[id]
 * Delete a team member
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

    await prisma.teamMember.delete({
      where: { id },
    })

    return NextResponse.json({ data: { id, deleted: true } })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return NextResponse.json(
          { error: { code: ERROR_CODES.NOT_FOUND, message: 'Membre non trouvé' } },
          { status: 404 }
        )
      }
    }

    console.error(`[DELETE /api/admin/team/${id}] Server error:`, error)
    return NextResponse.json(
      { error: { code: ERROR_CODES.SERVER_ERROR, message: 'Erreur serveur' } },
      { status: 500 }
    )
  }
}
