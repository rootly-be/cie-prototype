import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminFromRequest } from '@/lib/auth'

/**
 * GET /api/admin/niveaux/[id]
 * Get a single niveau
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = getAdminFromRequest(request)
  if (!admin) {
    return Response.json(
      { error: { code: 'UNAUTHORIZED', message: 'Non autorisé' } },
      { status: 401 }
    )
  }

  const { id } = await params

  try {
    const niveau = await prisma.niveau.findUnique({
      where: { id },
    })

    if (!niveau) {
      return Response.json(
        { error: { code: 'NOT_FOUND', message: 'Niveau non trouvé' } },
        { status: 404 }
      )
    }

    return Response.json({ data: niveau })
  } catch (error) {
    console.error('[GET /api/admin/niveaux/[id]]', error)
    return Response.json(
      { error: { code: 'SERVER_ERROR', message: 'Erreur serveur' } },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/admin/niveaux/[id]
 * Update a niveau
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = getAdminFromRequest(request)
  if (!admin) {
    return Response.json(
      { error: { code: 'UNAUTHORIZED', message: 'Non autorisé' } },
      { status: 401 }
    )
  }

  const { id } = await params

  try {
    const body = await request.json()
    const { code, label, ordre } = body

    // Check if niveau exists
    const existing = await prisma.niveau.findUnique({ where: { id } })
    if (!existing) {
      return Response.json(
        { error: { code: 'NOT_FOUND', message: 'Niveau non trouvé' } },
        { status: 404 }
      )
    }

    // Check if new code conflicts with another niveau
    if (code && code !== existing.code) {
      const conflict = await prisma.niveau.findUnique({ where: { code } })
      if (conflict) {
        return Response.json(
          { error: { code: 'DUPLICATE', message: 'Ce code existe déjà' } },
          { status: 409 }
        )
      }
    }

    const niveau = await prisma.niveau.update({
      where: { id },
      data: {
        ...(code && { code }),
        ...(label && { label }),
        ...(ordre !== undefined && { ordre }),
      },
    })

    return Response.json({ data: niveau })
  } catch (error) {
    console.error('[PUT /api/admin/niveaux/[id]]', error)
    return Response.json(
      { error: { code: 'SERVER_ERROR', message: 'Erreur serveur' } },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/admin/niveaux/[id]
 * Delete a niveau
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = getAdminFromRequest(request)
  if (!admin) {
    return Response.json(
      { error: { code: 'UNAUTHORIZED', message: 'Non autorisé' } },
      { status: 401 }
    )
  }

  const { id } = await params

  try {
    // Check if niveau exists
    const existing = await prisma.niveau.findUnique({ where: { id } })
    if (!existing) {
      return Response.json(
        { error: { code: 'NOT_FOUND', message: 'Niveau non trouvé' } },
        { status: 404 }
      )
    }

    // Check if any animations use this niveau
    const animationsCount = await prisma.animation.count({
      where: { niveau: existing.code },
    })

    if (animationsCount > 0) {
      return Response.json(
        {
          error: {
            code: 'IN_USE',
            message: `Ce niveau est utilisé par ${animationsCount} animation(s)`
          }
        },
        { status: 409 }
      )
    }

    await prisma.niveau.delete({ where: { id } })

    return Response.json({ success: true })
  } catch (error) {
    console.error('[DELETE /api/admin/niveaux/[id]]', error)
    return Response.json(
      { error: { code: 'SERVER_ERROR', message: 'Erreur serveur' } },
      { status: 500 }
    )
  }
}
