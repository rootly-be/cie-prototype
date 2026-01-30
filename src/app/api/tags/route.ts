import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ERROR_CODES } from '@/lib/constants'

/**
 * GET /api/tags
 * List all tags (public view)
 * Story 3.5: FR8, FR9
 */
export async function GET(request: NextRequest) {
  try {
    // Fetch all tags (no pagination)
    const tags = await prisma.tag.findMany({
      orderBy: { nom: 'asc' }
    })

    return NextResponse.json({ data: tags })

  } catch (error) {
    console.error('[GET /api/tags] Server error:', {
      code: 'SERVER_ERROR',
      errorType: error instanceof Error ? error.constructor.name : 'Unknown'
    })

    return NextResponse.json(
      { error: { code: ERROR_CODES.SERVER_ERROR, message: 'Erreur serveur' } },
      { status: 500 }
    )
  }
}
