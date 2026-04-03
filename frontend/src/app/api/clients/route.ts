import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'

/**
 * GET /api/clients
 * List all clients for the organisation.
 * Query params: ?status=active&vertical=ecommerce
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const status = searchParams.get('status')
    const vertical = searchParams.get('vertical')

    // Build where clause
    const where: Record<string, unknown> = {}
    if (status) where.status = status
    if (vertical) where.vertical = vertical

    const clients = await prisma.client.findMany({
      where,
      include: {
        healthScores: {
          orderBy: { computedAt: 'desc' },
          take: 1,
          select: { score: true, riskLevel: true },
        },
        _count: {
          select: { alerts: { where: { resolvedAt: null } } },
        },
      },
      orderBy: { name: 'asc' },
    })

    const data = clients.map((c) => ({
      id: c.id,
      name: c.name,
      shortCode: c.shortCode,
      color: c.color,
      vertical: c.vertical,
      status: c.status,
      platforms: c.platforms,
      kpiType: c.kpiType,
      contractValue: c.contractValue,
      latestHealthScore: c.healthScores[0]?.score ?? null,
      latestRiskLevel: c.healthScores[0]?.riskLevel ?? null,
      alertCount: c._count.alerts,
    }))

    return Response.json({ data })
  } catch (error) {
    console.error('[GET /api/clients]', error)
    return Response.json(
      { error: { message: 'Failed to fetch clients', code: 'FETCH_ERROR' } },
      { status: 500 }
    )
  }
}
