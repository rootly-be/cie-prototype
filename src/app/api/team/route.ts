import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ERROR_CODES } from '@/lib/constants'

/**
 * GET /api/team
 * Public API to get team members
 */
export async function GET() {
  try {
    const members = await prisma.teamMember.findMany({
      orderBy: [{ type: 'asc' }, { ordre: 'asc' }, { nom: 'asc' }],
    })

    return NextResponse.json({ data: members })
  } catch (error) {
    console.error('[GET /api/team] Server error:', error)
    return NextResponse.json(
      { error: { code: ERROR_CODES.SERVER_ERROR, message: 'Erreur serveur' } },
      { status: 500 }
    )
  }
}
