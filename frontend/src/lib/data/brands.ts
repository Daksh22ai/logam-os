/**
 * Single source of truth for brand/client mock data.
 * Used by Landing page, Rail, Sidebar, and Reporting pages.
 *
 * When the database is connected, components will fetch from API
 * and these constants will only be used as fallback/seed reference.
 */

export interface Brand {
  id: string
  name: string
  short: string
  color: string
  bg: string
  type: string
  cat: string
  status: string
  platform: string[]
  roas: string | null
  cpl: string | null
  trend: number
  alert: 'warn' | 'critical' | null
}

export const BRANDS: Brand[] = [
  { id: 'hobby', name: 'Hobby India', short: 'HI', color: '#7c3aed', bg: 'rgba(124,58,237,.15)', type: 'E-Commerce', cat: 'ecommerce', status: 'active', platform: ['Meta', 'Google'], roas: '7.2×', cpl: null, trend: +12, alert: 'warn' },
  { id: 'fitness', name: 'Fitness Fox', short: 'FF', color: '#f97316', bg: 'rgba(249,115,22,.15)', type: 'E-Commerce · NZ', cat: 'ecommerce', status: 'active', platform: ['Meta'], roas: '5.1×', cpl: null, trend: -8, alert: 'critical' },
  { id: 'nova', name: 'Nova Jewels', short: 'NJ', color: '#d4a017', bg: 'rgba(212,160,23,.15)', type: 'Jewellery · LA', cat: 'ecommerce', status: 'active', platform: ['Meta'], roas: '3.1×', cpl: null, trend: +5, alert: null },
  { id: 'sahajanand', name: 'Sahajanand Elite', short: 'SE', color: '#a855f7', bg: 'rgba(168,85,247,.15)', type: 'Real Estate', cat: 'realestate', status: 'active', platform: ['Meta', 'Google'], roas: null, cpl: '₹380', trend: +22, alert: null },
  { id: 'bodyleaf', name: 'Bodyleaf', short: 'BL', color: '#22c55e', bg: 'rgba(34,197,94,.15)', type: 'Health · D2C', cat: 'ecommerce', status: 'active', platform: ['Meta'], roas: '4.8×', cpl: null, trend: +3, alert: null },
  { id: 'ecotrip', name: 'EcoTrip', short: 'ET', color: '#10b981', bg: 'rgba(16,185,129,.15)', type: 'Travel', cat: 'other', status: 'active', platform: ['Meta', 'Google'], roas: null, cpl: '₹290', trend: -4, alert: 'warn' },
  { id: 'zoyalty', name: 'Zoyalty', short: 'ZY', color: '#3b82f6', bg: 'rgba(59,130,246,.15)', type: 'Real Estate', cat: 'realestate', status: 'active', platform: ['Meta'], roas: null, cpl: '₹420', trend: +18, alert: null },
  { id: 'casa', name: 'Casa Amplio', short: 'CA', color: '#ef4444', bg: 'rgba(239,68,68,.15)', type: 'Real Estate', cat: 'realestate', status: 'active', platform: ['Meta', 'Google'], roas: null, cpl: '₹510', trend: -2, alert: 'warn' },
  { id: 'green', name: 'Green Valley', short: 'GV', color: '#84cc16', bg: 'rgba(132,204,22,.15)', type: 'Real Estate', cat: 'realestate', status: 'active', platform: ['Meta'], roas: null, cpl: '₹460', trend: +9, alert: null },
  { id: 'gurukrupa', name: 'Gurukrupa Wire', short: 'GW', color: '#06b6d4', bg: 'rgba(6,182,212,.15)', type: 'Industrial B2B', cat: 'other', status: 'active', platform: ['Meta', 'Google'], roas: null, cpl: '₹680', trend: +14, alert: null },
  { id: 'aatmee', name: 'Aatmee Developers', short: 'AD', color: '#f59e0b', bg: 'rgba(245,158,11,.15)', type: 'Real Estate', cat: 'realestate', status: 'active', platform: ['Meta'], roas: null, cpl: '₹395', trend: +8, alert: null },
  { id: 'maruti', name: 'Maruti Estate', short: 'ME', color: '#ec4899', bg: 'rgba(236,72,153,.15)', type: 'Real Estate', cat: 'realestate', status: 'active', platform: ['Meta', 'Google'], roas: null, cpl: '₹520', trend: -1, alert: null },
]

/** Subset used by Rail and Sidebar — the first 4 brands */
export const RAIL_BRANDS = BRANDS.slice(0, 4).map((b) => ({
  id: b.id,
  name: b.name,
  short: b.short,
  color: b.color,
  bg: b.bg,
  alert: b.alert,
}))

/** Look up a brand by id */
export function getBrandById(id: string): Brand | undefined {
  return BRANDS.find((b) => b.id === id)
}
