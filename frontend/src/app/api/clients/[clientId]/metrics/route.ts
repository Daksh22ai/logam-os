import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'

interface MetricRow {
  id: bigint
  platform: string
  level: string
  entityId: string
  entityName: string
  date: Date
  spend: number
  impressions: bigint
  clicks: bigint
  ctr: number
  cpc: number
  conversions: number
  convValue: number
  roas: number
  frequency: number | null
  hookRate: number | null
  reach: bigint | null
}

/**
 * GET /api/clients/:clientId/metrics
 * Query normalised metrics with date range, platform, and level filters.
 *
 * Query params:
 *   dateFrom  — ISO date string (default: 30 days ago)
 *   dateTo    — ISO date string (default: today)
 *   platform  — meta | google | tiktok
 *   level     — account | campaign | adset | ad
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ clientId: string }> }
) {
  try {
    const { clientId } = await params
    const { searchParams } = request.nextUrl

    // Date range defaults to last 30 days
    const now = new Date()
    const thirtyDaysAgo = new Date(now)
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const dateFrom = searchParams.get('dateFrom')
      ? new Date(searchParams.get('dateFrom')!)
      : thirtyDaysAgo
    const dateTo = searchParams.get('dateTo')
      ? new Date(searchParams.get('dateTo')!)
      : now

    const platform = searchParams.get('platform')
    const level = searchParams.get('level')

    // Build where clause
    const where: Record<string, unknown> = {
      clientId,
      date: { gte: dateFrom, lte: dateTo },
    }
    if (platform) where.platform = platform
    if (level) where.level = level

    const metrics: MetricRow[] = await prisma.metric.findMany({
      where,
      orderBy: { date: 'asc' },
      select: {
        id: true,
        platform: true,
        level: true,
        entityId: true,
        entityName: true,
        date: true,
        spend: true,
        impressions: true,
        clicks: true,
        ctr: true,
        cpc: true,
        conversions: true,
        convValue: true,
        roas: true,
        frequency: true,
        hookRate: true,
        reach: true,
      },
    })

    // Convert BigInt fields to numbers for JSON serialization
    const data = metrics.map((m: MetricRow) => ({
      ...m,
      id: Number(m.id),
      impressions: Number(m.impressions),
      clicks: Number(m.clicks),
      reach: m.reach ? Number(m.reach) : null,
      date: m.date.toISOString(),
    }))

    // Compute aggregate KPIs
    const totalSpend = data.reduce((s: number, m) => s + m.spend, 0)
    const totalImpressions = data.reduce((s: number, m) => s + m.impressions, 0)
    const totalClicks = data.reduce((s: number, m) => s + m.clicks, 0)
    const totalConversions = data.reduce((s: number, m) => s + m.conversions, 0)
    const totalConvValue = data.reduce((s: number, m) => s + m.convValue, 0)

    const summary = {
      totalSpend: Math.round(totalSpend),
      totalImpressions,
      totalClicks,
      totalConversions: Math.round(totalConversions),
      avgCTR: totalImpressions > 0 ? totalClicks / totalImpressions : 0,
      avgCPC: totalClicks > 0 ? totalSpend / totalClicks : 0,
      totalRoas: totalSpend > 0 ? totalConvValue / totalSpend : 0,
      totalCPL: totalConversions > 0 ? totalSpend / totalConversions : 0,
      dataPoints: data.length,
      dateFrom: dateFrom.toISOString(),
      dateTo: dateTo.toISOString(),
    }

    return Response.json({ data, summary })
  } catch (error) {
    console.error('[GET /api/clients/:clientId/metrics]', error)
    return Response.json(
      { error: { message: 'Failed to fetch metrics', code: 'FETCH_ERROR' } },
      { status: 500 }
    )
  }
}
