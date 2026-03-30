import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'

/**
 * GET /api/clients/:clientId
 * Get detailed client info with data sources and latest health score.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ clientId: string }> }
) {
  try {
    const { clientId } = await params

    const client = await prisma.client.findUnique({
      where: { id: clientId },
      include: {
        dataSources: {
          select: {
            id: true,
            platform: true,
            accountId: true,
            status: true,
            lastSyncedAt: true,
          },
        },
        healthScores: {
          orderBy: { computedAt: 'desc' },
          take: 1,
        },
        _count: {
          select: { alerts: { where: { resolvedAt: null } } },
        },
      },
    })

    if (!client) {
      return Response.json(
        { error: { message: 'Client not found', code: 'NOT_FOUND' } },
        { status: 404 }
      )
    }

    const data = {
      id: client.id,
      name: client.name,
      shortCode: client.shortCode,
      color: client.color,
      vertical: client.vertical,
      status: client.status,
      platforms: client.platforms,
      kpiType: client.kpiType,
      contractValue: client.contractValue,
      dataSources: client.dataSources.map((ds: { id: string; platform: string; accountId: string; status: string; lastSyncedAt: Date | null }) => ({
        ...ds,
        lastSyncedAt: ds.lastSyncedAt?.toISOString() ?? null,
      })),
      latestHealthScore: client.healthScores[0]?.score ?? null,
      latestRiskLevel: client.healthScores[0]?.riskLevel ?? null,
      alertCount: client._count.alerts,
      createdAt: client.createdAt.toISOString(),
      updatedAt: client.updatedAt.toISOString(),
    }

    return Response.json({ data })
  } catch (error) {
    console.error('[GET /api/clients/:clientId]', error)
    return Response.json(
      { error: { message: 'Failed to fetch client', code: 'FETCH_ERROR' } },
      { status: 500 }
    )
  }
}
