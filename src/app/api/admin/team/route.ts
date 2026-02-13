import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminFromRequest } from '@/lib/auth'
import { ERROR_CODES } from '@/lib/constants'
import { z } from 'zod'

const teamMemberCreateSchema = z.object({
  nom: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  fonction: z.string().min(2, 'La fonction doit contenir au moins 2 caractères'),
  photo: z.string().url().nullable().optional(),
  type: z.enum(['equipe', 'ca']),
  ordre: z.number().int().nonnegative().optional().default(0),
})

/**
 * GET /api/admin/team
 * List all team members
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')

    const members = await prisma.teamMember.findMany({
      where: type ? { type } : undefined,
      orderBy: [{ type: 'asc' }, { ordre: 'asc' }, { nom: 'asc' }],
    })

    return NextResponse.json({ data: members })
  } catch (error) {
    console.error('[GET /api/admin/team] Server error:', error)
    return NextResponse.json(
      { error: { code: ERROR_CODES.SERVER_ERROR, message: 'Erreur serveur' } },
      { status: 500 }
    )
  }
}

/**
 * POST /api/admin/team
 * Create a new team member
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
    const validated = teamMemberCreateSchema.parse(body)

    const member = await prisma.teamMember.create({
      data: validated,
    })

    return NextResponse.json({ data: member }, { status: 201 })
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

    console.error('[POST /api/admin/team] Server error:', error)
    return NextResponse.json(
      { error: { code: ERROR_CODES.SERVER_ERROR, message: 'Erreur serveur' } },
      { status: 500 }
    )
  }
}
