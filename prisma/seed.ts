import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

/**
 * Seed data matching the 12 brands in the existing UI prototype.
 * Run with: npx prisma db seed
 */
async function main() {
  console.log('🌱 Seeding Logam OS database...\n')

  // ─── Organisation ──────────────────────────────────────────────────
  const org = await prisma.organisation.upsert({
    where: { slug: 'logam-digital' },
    update: {},
    create: {
      name: 'Logam Digital',
      slug: 'logam-digital',
      plan: 'scale',
    },
  })
  console.log(`  ✓ Organisation: ${org.name} (${org.id})`)

  // ─── Users ─────────────────────────────────────────────────────────
  const rishi = await prisma.user.upsert({
    where: { clerkId: 'seed_rishi' },
    update: {},
    create: {
      orgId: org.id,
      clerkId: 'seed_rishi',
      name: 'Rishi Singh',
      email: 'rishi@logamdigital.com',
      role: 'owner',
    },
  })
  console.log(`  ✓ User: ${rishi.name}`)

  const anas = await prisma.user.upsert({
    where: { clerkId: 'seed_anas' },
    update: {},
    create: {
      orgId: org.id,
      clerkId: 'seed_anas',
      name: 'Anas',
      email: 'anas@logamdigital.com',
      role: 'admin',
    },
  })
  console.log(`  ✓ User: ${anas.name}`)

  // ─── Clients (brands) ─────────────────────────────────────────────
  const brandsData = [
    { name: 'Hobby India',       shortCode: 'HI', color: '#7c3aed', vertical: 'ecommerce',  platforms: ['meta', 'google'], kpiType: 'roas' },
    { name: 'Fitness Fox',       shortCode: 'FF', color: '#f97316', vertical: 'ecommerce',  platforms: ['meta'],           kpiType: 'roas' },
    { name: 'Nova Jewels',       shortCode: 'NJ', color: '#d4a017', vertical: 'ecommerce',  platforms: ['meta'],           kpiType: 'roas' },
    { name: 'Sahajanand Elite',  shortCode: 'SE', color: '#a855f7', vertical: 'realestate', platforms: ['meta', 'google'], kpiType: 'cpl' },
    { name: 'Bodyleaf',          shortCode: 'BL', color: '#22c55e', vertical: 'ecommerce',  platforms: ['meta'],           kpiType: 'roas' },
    { name: 'EcoTrip',           shortCode: 'ET', color: '#10b981', vertical: 'other',      platforms: ['meta', 'google'], kpiType: 'cpl' },
    { name: 'Zoyalty',           shortCode: 'ZY', color: '#3b82f6', vertical: 'realestate', platforms: ['meta'],           kpiType: 'cpl' },
    { name: 'Casa Amplio',       shortCode: 'CA', color: '#ef4444', vertical: 'realestate', platforms: ['meta', 'google'], kpiType: 'cpl' },
    { name: 'Green Valley',      shortCode: 'GV', color: '#84cc16', vertical: 'realestate', platforms: ['meta'],           kpiType: 'cpl' },
    { name: 'Gurukrupa Wire',    shortCode: 'GW', color: '#06b6d4', vertical: 'other',      platforms: ['meta', 'google'], kpiType: 'cpl' },
    { name: 'Aatmee Developers', shortCode: 'AD', color: '#f59e0b', vertical: 'realestate', platforms: ['meta'],           kpiType: 'cpl' },
    { name: 'Maruti Estate',     shortCode: 'ME', color: '#ec4899', vertical: 'realestate', platforms: ['meta', 'google'], kpiType: 'cpl' },
  ]

  const clients = []
  for (const b of brandsData) {
    const client = await prisma.client.upsert({
      where: { id: slugify(b.name) },
      update: {},
      create: {
        id: slugify(b.name),
        orgId: org.id,
        name: b.name,
        shortCode: b.shortCode,
        color: b.color,
        vertical: b.vertical,
        platforms: b.platforms,
        kpiType: b.kpiType,
        status: 'active',
        contractValue: randomBetween(50000, 300000),
      },
    })
    clients.push(client)
  }
  console.log(`  ✓ Clients: ${clients.length} brands created`)

  // ─── Sample Metrics (last 30 days for first 4 clients) ─────────────
  const today = new Date()
  let metricCount = 0

  for (const client of clients.slice(0, 4)) {
    const isEcom = client.kpiType === 'roas'

    for (let daysAgo = 30; daysAgo >= 0; daysAgo--) {
      const date = new Date(today)
      date.setDate(date.getDate() - daysAgo)
      date.setHours(0, 0, 0, 0)

      const spend = randomBetween(3000, 15000)
      const impressions = randomBetween(20000, 150000)
      const clicks = Math.round(impressions * randomBetween(0.015, 0.055))
      const conversions = Math.round(clicks * randomBetween(0.02, 0.12))
      const convValue = isEcom ? conversions * randomBetween(800, 3500) : 0
      const reach = Math.round(impressions * randomBetween(0.5, 0.85))

      await prisma.metric.create({
        data: {
          clientId: client.id,
          sourceId: 'seed-source',
          platform: 'meta',
          level: 'account',
          entityId: `camp_${client.shortCode.toLowerCase()}_main`,
          entityName: `${client.name} — Main Campaign`,
          date,
          spend,
          impressions,
          clicks,
          ctr: clicks / impressions,
          cpc: spend / clicks,
          conversions,
          convValue,
          roas: convValue > 0 ? convValue / spend : 0,
          frequency: impressions / reach,
          hookRate: randomBetween(0.15, 0.45),
          reach,
        },
      })
      metricCount++
    }
  }
  console.log(`  ✓ Metrics: ${metricCount} data points`)

  // ─── Sample Health Scores ──────────────────────────────────────────
  const healthData: { clientIdx: number; score: number; risk: string; signals: object[] }[] = [
    {
      clientIdx: 0, score: 82, risk: 'low',
      signals: [
        { label: 'ROAS stable at 7.2×', impact: 'positive', direction: 'stable' },
        { label: 'Creative frequency nearing threshold', impact: 'negative', direction: 'up' },
      ],
    },
    {
      clientIdx: 1, score: 54, risk: 'high',
      signals: [
        { label: 'ROAS dropped 23% in 7 days', impact: 'negative', direction: 'down' },
        { label: 'CTR declining 3 weeks', impact: 'negative', direction: 'down' },
        { label: 'Client engagement reduced', impact: 'negative', direction: 'down' },
      ],
    },
    {
      clientIdx: 2, score: 75, risk: 'medium',
      signals: [
        { label: 'ROAS stable at 3.1×', impact: 'positive', direction: 'stable' },
        { label: 'Spend increase +15%', impact: 'positive', direction: 'up' },
      ],
    },
    {
      clientIdx: 3, score: 91, risk: 'low',
      signals: [
        { label: 'CPL improved 22% vs last month', impact: 'positive', direction: 'down' },
        { label: 'Client engagement high', impact: 'positive', direction: 'up' },
      ],
    },
  ]

  for (const h of healthData) {
    await prisma.healthScore.create({
      data: {
        clientId: clients[h.clientIdx].id,
        score: h.score,
        riskLevel: h.risk,
        signals: h.signals,
      },
    })
  }
  console.log(`  ✓ Health scores: ${healthData.length} entries`)

  // ─── Sample Alerts ─────────────────────────────────────────────────
  const alertsData = [
    {
      clientIdx: 0, type: 'fatigue', severity: 'warning',
      title: 'Creative fatigue detected — DIY Canvas ad set',
      description: 'Frequency reached 4.8× and CTR dropped from 4.1% to 1.8% over 6 days on the "DIY Canvas" ad set. Recommend pausing and launching new hook by Wednesday.',
    },
    {
      clientIdx: 1, type: 'anomaly', severity: 'critical',
      title: 'ROAS dropped 23% in 5 days',
      description: 'Primary cause: frequency crossed 4.6 and CTR fell 40%. Creative fatigue detected across 3 ad sets targeting broad audiences.',
    },
    {
      clientIdx: 1, type: 'anomaly', severity: 'critical',
      title: 'CPC spike — retargeting audiences',
      description: 'CPC increased 67% on retargeting audiences. Audience pool may be saturated. Consider expanding lookalike seed or refreshing retargeting window.',
    },
    {
      clientIdx: 5, type: 'anomaly', severity: 'warning',
      title: 'CPL rising — travel vertical seasonal pattern',
      description: 'CPL increased 18% over last 14 days. This may correlate with off-season travel patterns. Monitor for 7 more days before adjusting.',
    },
    {
      clientIdx: 7, type: 'opportunity', severity: 'info',
      title: 'New high-performing placement detected',
      description: 'Instagram Reels placement showing 2.3× higher CTR than feed placements for Casa Amplio. Consider shifting 20% of budget to Reels.',
    },
  ]

  for (const a of alertsData) {
    await prisma.alert.create({
      data: {
        clientId: clients[a.clientIdx].id,
        type: a.type,
        severity: a.severity,
        title: a.title,
        description: a.description,
      },
    })
  }
  console.log(`  ✓ Alerts: ${alertsData.length} entries`)

  console.log('\n✅ Seed complete!')
}

// ─── Helpers ─────────────────────────────────────────────────────────

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

function randomBetween(min: number, max: number): number {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100
}

// ─── Run ─────────────────────────────────────────────────────────────

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('Seed error:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
