import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminFromRequest } from '@/lib/auth'

/**
 * GET /api/admin/niveaux
 * List all niveaux ordered by ordre
 */
export async function GET(request: NextRequest) {
  const admin = getAdminFromRequest(request)
  if (!admin) {
    return Response.json(
      { error: { code: 'UNAUTHORIZED', message: 'Non autorisé' } },
      { status: 401 }
    )
  }

  try {
    const niveaux = await prisma.niveau.findMany({
      orderBy: { ordre: 'asc' },
    })

    return Response.json({ data: niveaux })
  } catch (error) {
    console.error('[GET /api/admin/niveaux]', error)
    return Response.json(
      { error: { code: 'SERVER_ERROR', message: 'Erreur serveur' } },
      { status: 500 }
    )
  }
}

/**
 * POST /api/admin/niveaux
 * Create a new niveau
 */
export async function POST(request: NextRequest) {
  const admin = getAdminFromRequest(request)
  if (!admin) {
    return Response.json(
      { error: { code: 'UNAUTHORIZED', message: 'Non autorisé' } },
      { status: 401 }
    )
  }

  try {
    const body = await request.json()
    const { code, label, ordre } = body

    if (!code || !label) {
      return Response.json(
        { error: { code: 'VALIDATION_ERROR', message: 'Code et label requis' } },
        { status: 400 }
      )
    }

    // Check if code already exists
    const existing = await prisma.niveau.findUnique({ where: { code } })
    if (existing) {
      return Response.json(
        { error: { code: 'DUPLICATE', message: 'Ce code existe déjà' } },
        { status: 409 }
      )
    }

    const niveau = await prisma.niveau.create({
      data: {
        code,
        label,
        ordre: ordre ?? 0,
      },
    })

    return Response.json({ data: niveau }, { status: 201 })
  } catch (error) {
    console.error('[POST /api/admin/niveaux]', error)
    return Response.json(
      { error: { code: 'SERVER_ERROR', message: 'Erreur serveur' } },
      { status: 500 }
    )
  }
}
