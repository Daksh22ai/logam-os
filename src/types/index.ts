/**
 * Shared TypeScript types for Logam OS.
 * These mirror the Prisma schema and provide API-level types.
 */

// ─── Enums (string unions matching DB values) ────────────────────────

export type Plan = 'starter' | 'growth' | 'scale'
export type UserRole = 'owner' | 'admin' | 'member' | 'viewer'
export type ClientStatus = 'active' | 'paused' | 'churned'
export type Vertical = 'ecommerce' | 'realestate' | 'education' | 'other'
export type Platform = 'meta' | 'google' | 'tiktok' | 'ga4' | 'shopify'
export type KPIType = 'roas' | 'cpl'
export type MetricLevel = 'account' | 'campaign' | 'adset' | 'ad'
export type DataSourceStatus = 'active' | 'expired' | 'revoked'
export type AlertType = 'fatigue' | 'anomaly' | 'opportunity' | 'positive'
export type AlertSeverity = 'critical' | 'warning' | 'info' | 'success'
export type RiskLevel = 'low' | 'medium' | 'high' | 'critical'
export type CreativeFormat = 'image' | 'video' | 'carousel' | 'reel'
export type HookType = 'curiosity' | 'pain' | 'benefit' | 'social_proof' | 'ugc'
export type AudienceType = 'broad' | 'lookalike' | 'retargeting' | 'custom'
export type ReportStatus = 'draft' | 'reviewed' | 'sent'

// ─── Normalised Metrics (cross-platform) ─────────────────────────────

export interface NormalisedMetrics {
  platform: Platform
  date: string // ISO date
  accountId: string
  campaignId: string
  spend: number
  impressions: number
  clicks: number
  ctr: number // 0–1 decimal
  cpc: number
  conversions: number
  conversionValue: number
  roas: number
  frequency?: number  // Meta only
  hookRate?: number   // Meta video only
}

// ─── Health Score Signal ─────────────────────────────────────────────

export interface HealthSignal {
  label: string
  impact: 'positive' | 'negative' | 'neutral'
  direction: 'up' | 'down' | 'stable'
  detail?: string
}

// ─── API Response Types ──────────────────────────────────────────────

export interface APIResponse<T> {
  data: T
  error?: never
}

export interface APIError {
  data?: never
  error: {
    message: string
    code: string
  }
}

export type APIResult<T> = APIResponse<T> | APIError

// ─── Client List Item (API response for /api/clients) ────────────────

export interface ClientListItem {
  id: string
  name: string
  shortCode: string
  color: string
  vertical: Vertical
  status: ClientStatus
  platforms: string[]
  kpiType: KPIType
  contractValue: number | null
  latestHealthScore: number | null
  latestRiskLevel: RiskLevel | null
  alertCount: number
}

// ─── Client Detail (API response for /api/clients/:id) ───────────────

export interface ClientDetail extends ClientListItem {
  dataSources: {
    id: string
    platform: Platform
    accountId: string
    status: DataSourceStatus
    lastSyncedAt: string | null
  }[]
  createdAt: string
  updatedAt: string
}

// ─── Metrics Query Params ────────────────────────────────────────────

export interface MetricsQueryParams {
  dateFrom?: string
  dateTo?: string
  platform?: Platform
  level?: MetricLevel
  entityId?: string
}
