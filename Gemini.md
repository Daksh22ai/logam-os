# Logam OS — Full Project Context & Development Handoff

> **Last updated:** March 2026  
> **Status:** HTML prototype complete → Next.js build phase  
> **Document purpose:** Complete context for any developer picking this up in CLI, continuing the build, or onboarding a new team member. Read this before touching a single file.

---

## Table of Contents

1. [What We Are Building and Why](#1-what-we-are-building-and-why)
2. [The Problem We Discovered](#2-the-problem-we-discovered)
3. [Target Customer — Who This Is For](#3-target-customer--who-this-is-for)
4. [First Target Agency — Logam Digital](#4-first-target-agency--logam-digital)
5. [Go-To-Market Strategy](#5-go-to-market-strategy)
6. [Product Overview — Logam OS](#6-product-overview--logam-os)
7. [Current State — What Exists Right Now](#7-current-state--what-exists-right-now)
8. [Technical Architecture](#8-technical-architecture)
9. [Data Sources — Meta & Google Ads APIs](#9-data-sources--meta--google-ads-apis)
10. [Module Breakdown](#10-module-breakdown)
11. [UI/UX Design Decisions](#11-uiux-design-decisions)
12. [Next.js Build Guide](#12-nextjs-build-guide)
13. [State Management Decisions](#13-state-management-decisions)
14. [File Structure](#14-file-structure)
15. [Environment Variables](#15-environment-variables)
16. [Development Priorities](#16-development-priorities)
17. [Known Gaps and Decisions Pending](#17-known-gaps-and-decisions-pending)
18. [Business Model](#18-business-model)
19. [Competitive Context](#19-competitive-context)

---

## 1. What We Are Building and Why

**Logam OS** is an agency command centre — a unified operating system for performance marketing agencies managing 15–50 clients.

It is **not** another reporting dashboard. Every existing tool (AgencyAnalytics, Swydo, Supermetrics, TapClicks) solves only the client deliverable side — making reports look good for clients. None of them are built around the agency operator's daily reality.

**What operators actually need and don't have:**
- Real-time anomaly detection with plain-English explanations before the client notices
- Team communication integrated with campaign context (not siloed in WhatsApp groups)
- Creative performance intelligence linked to production workflow
- Client health scoring to detect churn before a cancellation email arrives
- Capacity visibility to know who is overloaded before quality drops

We are building the operating system that sits above the reporting layer. The wedge entry point is automated reporting with AI insight generation. Every subsequent module expands on the same data infrastructure.

**The single sentence vision:**  
*Give a 35-person performance marketing agency the operational intelligence of a 200-person enterprise, at a price they can afford.*

---

## 2. The Problem We Discovered

This product was born from 30 structured discovery conversations with agency founders — 20 in India, 10 globally (US, UK, Australia, Canada, Ireland, Denmark).

**Top problems by frequency across all 30 conversations:**

| Rank | Problem | Frequency | Financial Impact |
|------|---------|-----------|-----------------|
| 1 | Reporting — manual data pull, narrative writing, delivery | 28/30 | 15–35% of team time monthly |
| 2 | Client churn blindness — no early warning system | 24/30 | 1 churned client = 3–6 months of saved reporting time |
| 3 | Creative bottleneck — briefing, production, approval cycles | 19/30 | 5-day cycles when 2-day is needed |
| 4 | Founder bottleneck — single point of failure on approvals | 18/30 | Caps agency scale ceiling |
| 5 | Capacity invisibility — no real-time workload visibility | 16/30 | Overload discovered only after deadline is missed |
| 6 | Client communication overhead — repetitive updates, calls | 15/30 | 4–5 hrs/week per account manager |
| 7 | Scope creep — untracked extra work destroying margins | 12/30 | Margin below 10% on some clients |
| 8 | Onboarding chaos — 3–4 week access collection delay | 11/30 | Trust eroded before work begins |

**The meta-pattern across all 30:** Agencies operate reactively, not predictively. They discover problems after clients feel them. Everything we build should invert this — surface the signal before the problem manifests.

**Key quote from a Bangalore founder:**  
*"Every month same struggle. We pull data from Meta, Google, sometimes TikTok, merge it manually and then someone spends 3-4 hours building a deck. By the time client sees it, numbers are already 2 days old."*

**Key quote from a US founder:**  
*"Attribution hell week — 3 days before monthly reports go out where someone is deep in tracking verification. One person essentially full-time for 3 days every month just on that."*

These are not edge cases. They are structural constants of the mid-size agency model globally.

---

## 3. Target Customer — Who This Is For

**Primary ICP (Ideal Customer Profile):**
- Performance marketing agency
- 15–50 employees
- 10–50 active clients
- Running Meta Ads and/or Google Ads for clients
- Monthly revenue: ₹15L–₹80L (India) / $50K–$300K (Global)
- Already past the "founder does everything" stage but not yet enterprise

**Why this size specifically:**
- Small enough to feel every operational inefficiency personally
- Large enough to have structured data and multiple team members
- Has budget for tooling (₹8,000–₹35,000/month India, $149–$699/month global)
- Understands metrics — won't need hand-holding on why ROAS matters
- Feels the pain of coordination chaos as client count grows past 15–20

**Who we are NOT building for:**
- Freelancers and solo operators — pain not acute enough, budget too low
- 2–5 person agencies — informal systems still work at this scale
- Enterprise agencies (100+ people) — they have custom solutions and IT teams
- Non-performance agencies (pure branding, PR, print) — no structured API data

**Indian market first, global expansion second:**  
Starting in India because founders are more accessible, willing to pilot, and the relationship-first culture means a strong early partner becomes a referral machine. Global expansion (US, UK) follows with the same product at 3–5× higher price point.

---

## 4. First Target Agency — Logam Digital

**Website:** [logamdigital.com](https://www.logamdigital.com)  
**Academy:** [logamacademy.com](https://www.logamacademy.com)  
**Location:** Anand, Gujarat (Vallabh Vidyanagar)  
**Founded:** 2021

**What they do:**
- Performance Marketing (Meta, Google Ads)
- Lead Generation
- WhatsApp Automation
- Shopify Development
- Digital Marketing Training (Logam Academy)

**Current scale (insider-verified):**
- 35–40 active clients
- 35–40 employees
- Historically 250+ clients served
- Verticals: Real estate (heavy), e-commerce, education, industrial B2B, international brands

**Key person — Rishi Singh (Director):**
- LinkedIn: [rao-rishirajsingh-36aa67216](https://www.linkedin.com/in/rao-rishirajsingh-36aa67216/)
- Low LinkedIn activity (last post 1+ month ago, reposts only)
- Leads almost every Logam Academy video — intelligent, dimensional thinker, fun personality
- Reposted content about AI-generated ads with desi context — already thinking about AI in marketing
- Character: seeks improvement, has good base AI knowledge, will ask sharp questions
- **Not a passive buyer** — needs to understand how something works before trusting it

**Co-founder/operations — Anas:**
- Email: anas.logam48@gmail.com
- Handles operations and business side
- Any deal will eventually need both Rishi and Anas to nod

**Why Logam Digital specifically:**
- Right size (35–40 clients, same employee count)
- Performance marketing focus — exactly our wedge
- Multi-vertical client mix = complex reporting challenge = high pain
- Academy gives Rishi a second motivation: if we build this together, it becomes Academy content
- Gujarat-based, accessible for in-person meetings if needed
- Already doing WhatsApp Automation for clients but not using automation internally

**What they are almost certainly experiencing:**
- Manual Meta data pull for 35–40 clients every reporting cycle
- Different report format per vertical (real estate CPL vs e-commerce ROAS vs education cost per enrollment)
- Creative briefing via WhatsApp → misinterpretation → revision cycles
- Rishi as final approver on everything — bottleneck to scale
- No early warning when a client relationship starts cooling
- Invisible margin compression from untracked scope creep

**Approach strategy:**
1. Engage genuinely on Logam Academy Instagram content (Rishi leads videos there)
2. DM referencing specific content + AI repost he made
3. Position as: *"We want you to be the founding agency that shapes what this becomes"*
4. Demo Logam OS with their actual brand colors, their actual client names
5. Offer: 6 months free in exchange for feedback and introductions to other founders
6. First call is discovery — not a pitch. Let Rishi talk first.

**The message that fits his character:**  
*"You've built a team that executes well. But the operational intelligence — knowing when a client is about to have a bad week before they call you, knowing which creative angle is fatiguing — that still lives in your head. We're building the infrastructure that externalises that intelligence so your team runs on it whether you're teaching at the Academy or managing a new mandate."*

---

## 5. Go-To-Market Strategy

**Phase 1 — Validation (Month 1–2, India only)**
- Use filtered list of 193 Indian performance agencies
- Outreach top 30 using 5-question discovery conversation flow
- Goal: 3 unpaid pilot agencies who give deep feedback in exchange for free access
- Pilots should be agencies already spoken to in discovery — they trust us

**The 5 golden discovery questions (in order):**
1. What's the one thing in your agency that stays permanently messy no matter what you do?
2. Where does your team lose the most hours weekly — reporting, client communication, creative, or something else?
3. How do you currently know when a client is quietly becoming unhappy before they say something?
4. If you stepped away for 30 days, what part of the business would you worry about most?
5. If you could eliminate 20% of your team's weekly workload without touching performance, where would you start?

**Outreach conversation principle:** Never dump questions. Reflect what they said, give pattern recognition in return, let the next question grow naturally from their answer. They should feel like they're in a conversation, not filling a survey.

**Phase 2 — First Revenue (Month 3–4, India)**
- Convert pilots to paid. Target 10 paying agencies at Starter tier.
- Monthly recorded interviews. Every complaint is a roadmap item.
- Do not add features until 10 agencies find genuine value in what exists.

**Phase 3 — Expansion (Month 5–8)**
- India: grow to 25 agencies through referrals
- Global: begin US and UK outreach using global founder conversation playbook
- Position globally as *"built by engineers who talked to 100+ agency founders before writing code"*

**Pricing:**

| Tier | India | Global | Modules |
|------|-------|--------|---------|
| Starter | ₹8,000/mo | $149/mo | Reporting only |
| Growth | ₹18,000/mo | $349/mo | Reporting + Health Scoring |
| Scale | ₹35,000/mo | $699/mo | All modules |

**Revenue milestone check:** 50 Indian agencies on Growth = ₹9L/month. 50 global agencies on Growth = $17,500/month. Same product, same team, 60% more revenue from global pricing.

---

## 6. Product Overview — Logam OS

Logam OS is a multi-tenant SaaS platform with five progressive modules. Each module uses the same data infrastructure. Each module adds switching cost. By Month 13, you have a platform built on real revenue, real feedback, and real trust.

**Module 1 — Automated Reporting Engine (Wedge — Ship Week 8)**
- Connects to Meta Ads, Google Ads, TikTok Ads, GA4, Shopify, HubSpot via OAuth
- Normalises all platform data into a consistent schema
- AI (Claude API) generates context-aware narrative per client — not generic boilerplate
- Detects anomalies: "CPA rose 23% — CTR dropped on Campaign X, creative fatigue detected"
- Delivers via email, PDF, or live white-labelled client portal link
- Export Report is contextual — inside the reporting view, not a global header button

**Module 2 — Client Health Score Engine (Month 3–5)**
- Built on top of Module 1 data — no new integrations needed
- Monitors KPI stability trends over 4-week rolling window
- Tracks behavioural signals: email response latency, call attendance, question type shift
- Scores 0–100 with explainable signals: "Client A: 71/100 — 3-week CPA rise + reduced call engagement"
- Alerts account manager before client says anything

**Module 3 — Creative Intelligence System (Month 6–8)**
- Stores every creative with metadata: hook type, angle, format, audience, CTA
- Links each creative to its Meta API performance: CTR, hook rate (3-sec views ÷ impressions), ROAS, frequency fatigue onset
- AI identifies patterns: "Curiosity hooks drive 34% higher CTR for this ICP"
- Predicts creative fatigue before performance drops — flags in advance
- Brief generator: data-driven creative briefs based on historical pattern data

**Module 4 — Capacity & Resource Planner (Month 9–10)**
- Tracks estimated vs actual hours per client per team member
- Real-time capacity utilisation: "Media buyer at 94% — quality risk in 2 weeks"
- Forecasts: "At current growth rate, hire 1 media buyer in 38 days"
- Identifies which clients consume disproportionate hours relative to revenue

**Module 5 — Profit & Scope Tracker (Month 11–13)**
- Real margin per client: revenue minus actual hours at team cost
- Scope vs contract tracking — alerts when client exceeds agreed scope
- "Client X operating at 8% margin — below safe threshold"
- Per-client P&L view that founders currently have no visibility into

---

## 7. Current State — What Exists Right Now

**Completed:**
- 30 discovery conversations (20 India, 10 global) — documented in full conversation playbooks
- Problem frequency analysis and prioritisation
- Product strategy and architecture document
- Competitive landscape analysis
- Full HTML/CSS/JS prototype — `Logam_OS_v2.html`

**The HTML prototype (`Logam_OS_v2.html`) contains:**
- Landing page: 13 Logam Digital brands, search, category filters, 3-stat bar
- Rail: All brand icons, tooltip on hover, utility buttons at bottom
- Sidebar: Complete agency workflow sections — Performance, Client, Team, Workspace — with + add button per section
- Main area sections: Reporting (full), Alerts (full), Creative Studio (full), Client Updates, Onboarding Checklist, Team chat channels (general, media-buyers, creative-team, accounts)
- Chat: Pinned messages, reply threading, emoji reactions, attachment previews
- AI panel: Slide-in from right, full-screen mode, contextual chips, streaming simulation, data-aware responses
- Color scheme: Logam's own black and yellow (#f5c518)
- Fonts: Geist (display) + Geist Mono (data values)

**What the prototype is NOT:**
- Connected to any real API
- Multi-tenant
- Authenticated
- A Next.js app

The prototype is a **conversation tool** — specifically to show Rishi what his agency would look like inside Logam OS before asking him to commit to anything. It uses his real client names, his color scheme, and his vertical mix.

---

## 8. Technical Architecture

**Three-layer architecture:**

```
Data Layer → Intelligence Layer → Presentation Layer
```

### Data Layer
- Unified connector system: OAuth integrations with Meta, Google, TikTok, GA4, HubSpot, Shopify, Stripe
- Normalisation engine: all platforms emit different schemas — this layer makes them consistent
- Data warehouse: TimescaleDB (Postgres extension) for time-series metrics — critical for trend analysis
- Event bus: BullMQ (Redis-backed) for scheduled jobs, data sync, retry logic
- Webhook receiver: captures real-time events from platforms that support them

### Intelligence Layer
- Anomaly detection: statistical models identifying metric deviations beyond 14-day baseline variance
- LLM layer: Anthropic Claude API for narrative generation, insight writing, health scoring, brief generation
- Pattern recognition: creative performance patterns, client behavioural patterns, capacity trends
- Scoring engine: churn risk score, client health score, capacity utilisation — all numeric, explainable
- Workflow orchestrator: n8n (self-hosted) for scheduled jobs and data pipelines

### Presentation Layer
- Web application: Next.js 14 App Router — agency-facing dashboard
- Client portal: white-labelled, separate route group with different layout, accessible by end clients
- Notification layer: email (Resend), Slack webhook, WhatsApp Business API (India-specific)
- API layer: REST + webhooks for future integrations

### Full Tech Stack

| Layer | Technology | Reason |
|-------|-----------|--------|
| Framework | Next.js 14 App Router | SSR, API routes, multi-tenant middleware |
| Language | TypeScript | Catch API shape errors early |
| UI State | Zustand | Lightweight, sufficient for 4-panel dashboard |
| Server State | TanStack Query (React Query) | Meta/Google API polling, caching, background refetch |
| Styling | Tailwind CSS + shadcn/ui | Fast, consistent, customisable — not pre-designed |
| Charts | Recharts + Tremor | Agency dashboard ready, composable |
| AI Streaming | Vercel AI SDK | Claude integration built in, streaming out of the box |
| Auth | Clerk | Multi-tenant, org management, agency + client portal |
| ORM | Prisma | Type-safe, PostgreSQL native |
| Database | PostgreSQL + TimescaleDB | Time-series data at scale |
| Cache | Redis | Dashboard query caching, BullMQ jobs |
| Job Queue | BullMQ | Scheduled report generation, data sync |
| Orchestration | n8n (self-hosted) | Data pipelines, platform integrations |
| File Storage | Cloudflare R2 | Report PDFs, creative assets — S3-compatible, cheaper |
| Email | Resend | Transactional — report delivery, alerts |
| LLM | Anthropic Claude API | Narrative, insights, health scoring, brief generation |
| Vector Store | pgvector (Postgres extension) | Creative intelligence embeddings |
| Monitoring | Sentry + PostHog | Errors + product analytics |
| CI/CD | GitHub Actions | Automated test and deploy |
| Hosting (early) | Railway or Render | Fast deployment, no DevOps overhead |
| Hosting (scale) | AWS ECS + RDS | When revenue justifies migration |

---

## 9. Data Sources — Meta & Google Ads APIs

### Meta Marketing API

**Hierarchy:** Account → Campaign → Ad Set → Ad → Creative

**Key fields available at each level:**

```
Account level:
  spend, impressions, reach, frequency, cpm, cpc, ctr, clicks
  actions (array — purchase, lead, etc.)
  action_values (revenue for ROAS calculation)
  cost_per_action_type

Campaign level:
  + campaign_name, objective, status, daily_budget, lifetime_budget

Ad Set level:
  + targeting (age, gender, interests, custom audiences, lookalikes)
  + placement_breakdown (Feed, Stories, Reels, Audience Network)
  + optimization_goal, bid_strategy
  + frequency (impressions ÷ reach — KEY for fatigue detection)

Ad/Creative level:
  + creative asset URLs (image, video)
  + ad_copy text, headline, description, CTA button
  + video_avg_time_watched, video_p25_watched_actions (hook rate proxy)
  + video_thruplay_watched_actions
```

**ROAS calculation:** `action_values[action_type=purchase] ÷ spend`

**Hook Rate calculation:** `video_p3_watched_actions ÷ impressions` (3-second video views ÷ total impressions)

**Creative Fatigue signal:** `frequency > 4.0` AND `CTR dropping > 30% over 7 days`

**Important limitations:**
- 15-minute to 3-hour data delay — not truly real-time
- Pagination required for large accounts (use `after` cursor)
- Attribution windows must be explicit post-iOS 14 changes
- Each ad account queried separately — aggregation must happen in our layer
- Rate limits: 200 calls per hour per ad account

**Suggested polling strategy:**
- Every 15 minutes: spend, impressions, CTR, ROAS/CPL (anomaly detection)
- Every hour: full campaign and ad set breakdown
- Daily: creative-level performance, placement breakdown
- On-demand: user-triggered full refresh

### Google Ads API

**Hierarchy:** Account → Campaign → Ad Group → Ad → Keyword

**Key fields:**

```
Campaign:
  campaign.name, campaign.status
  metrics.impressions, metrics.clicks, metrics.ctr
  metrics.average_cpc, metrics.cost_micros (÷ 1,000,000 = actual cost)
  metrics.conversions, metrics.conversion_value
  metrics.search_impression_share (Google-only)

Ad Group:
  ad_group.name, ad_group.status
  ad_group_criterion.quality_info.quality_score (1–10)

Keyword:
  search_term_view.search_term (what people actually searched)
  keyword_view.resource_name

Ad:
  responsive_search_ad.headlines, responsive_search_ad.descriptions
  ad.final_urls
```

**ROAS calculation:** `metrics.conversion_value ÷ (metrics.cost_micros ÷ 1,000,000)`

**Key normalisation challenge:**  
Meta calls it `action_values` / `actions`, Google calls it `conversion_value` / `conversions`.  
Same concept, different field names. The normalisation engine must output a consistent schema:

```typescript
interface NormalisedMetrics {
  platform: 'meta' | 'google' | 'tiktok'
  date: string
  accountId: string
  campaignId: string
  spend: number           // always in INR or original currency
  impressions: number
  clicks: number
  ctr: number             // 0–1 decimal
  cpc: number
  conversions: number
  conversionValue: number
  roas: number            // conversionValue / spend
  frequency?: number      // Meta only
  hookRate?: number       // Meta video only
}
```

### Attribution Note
Post-iOS 14, Meta's default attribution window is 7-day click, 1-day view. This must be explicitly set in API calls. Never rely on platform defaults — they change. Always include `action_attribution_windows: ['7d_click', '1d_view']` in Meta API requests.

---

## 10. Module Breakdown

### Reporting Module — Detailed Spec

**What it generates:**

1. **5 KPI Cards** — ROAS/CPL, CTR, Spend, Impressions, Frequency
   - Each shows current value, change vs last period, API field source
   - Frequency card color-coded: green <3, amber 3–4, red >4

2. **AI Insight Card** — generated by Claude API
   - Input: last 30 days of campaign data + 14-day baseline + creative performance
   - Output: 2–3 sentence narrative explaining what happened, why, and what to do
   - Example: "ROAS dropped from 7.1× to 5.4× this week. Primary cause: frequency on broad audience crossed 4.6×, CTR fell 56% in 7 days — classic creative fatigue. Recommend pausing main creative and launching new hook by Wednesday to recover ROAS within 5 days."
   - Actions: Ask AI Follow-up, Draft Client Email, Mark Reviewed, Export Report

3. **Platform Breakdown Tabs** — Combined / Meta Ads / Google Ads
   - Date range selector: Last 7 / 14 / 30 days, This month, Last month, Custom

4. **Three Charts** — ROAS/CPL trend (bar, weekly), Spend by Platform (donut), CTR by Placement (horizontal bars)

5. **Campaign Table** — columns: Campaign Name, Status, ROAS/CPL, CTR, CPC, Spend, Impressions, Frequency, AI Flag

6. **Ad Set Table** — columns: Ad Set, Audience Type, ROAS/CPL, CTR, Frequency, Spend, Status

7. **Creative Performance Table** — columns: Ad Name/Hook, Format, CTR, Hook Rate, ROAS/CPL, Frequency, Signal (health indicator)

8. **Export Report Card** — contextual at bottom of reporting view
   - Generates white-labelled PDF or live link for end client
   - AI writes narrative, account manager reviews, one-click send
   - Client sees branded view — not the internal Logam OS interface

### Alert System — Detection Logic

Three models run every 15 minutes:

**Model 1: Performance Anomaly**
- Baseline: rolling 14-day average for each metric per campaign
- Trigger: metric deviates >25% from baseline for 3+ consecutive data pulls
- Covers: ROAS, CPL, CTR, CPC, conversion rate
- Severity: >25% deviation = Warning; >40% = Critical

**Model 2: Creative Fatigue**
- Trigger: frequency >4.0 AND CTR decline >30% over 7 days (both conditions must be true)
- Secondary signal: hook rate <20% on video ads
- Output: specific ad set name, estimated daily wasted spend, recommended action

**Model 3: Opportunity Identification**
- Checks placement performance: if one placement is >2× ROAS of others with <30% of budget → flag
- Checks audience performance: lookalike outperforming broad by >40% → scale recommendation
- Checks retargeting ROAS: if retargeting >8× → flag for budget increase

**Alert severity colours:**
- 🔴 Critical — act today (frequency + CTR both threshold breached)
- 🟠 Warning — monitor (one threshold breached or trend line concerning)
- 🔵 Opportunity — optional action (positive signal to capitalise on)
- 🟢 Positive — noteworthy win (target hit, new best performance)

### Creative Studio — How It Works

**Storage per creative:**
```typescript
interface Creative {
  id: string
  clientId: string
  adId: string              // linked to Meta Ad ID
  name: string
  hookType: 'curiosity' | 'problem-agitate' | 'social-proof' | 'contrast' | 'offer' | 'story'
  angle: string             // free text description
  format: 'video-15s' | 'video-30s' | 'static' | 'carousel' | 'story' | 'reel'
  audienceType: 'cold-broad' | 'cold-interest' | 'warm-engager' | 'hot-retargeting' | 'lookalike'
  assetUrl: string          // Cloudflare R2 URL
  // Linked from Meta API
  ctr: number
  hookRate: number          // 3-sec views ÷ impressions
  roas: number
  frequency: number
  fatigueOnsetDay: number | null  // day frequency crossed 4.0
  createdAt: Date
  lastUpdated: Date
}
```

**Pattern recognition (Claude API prompt):**
```
Given this agency's creative performance history:
[array of Creative objects with metrics]

Identify:
1. Which hook types perform best for this client's ICP (by average CTR)
2. Which format consistently outperforms (by ROAS)
3. Which audience type converts most efficiently (by ROAS/CPL)
4. Average days until creative fatigue onset
5. Recommended hook for next creative based on these patterns

Return JSON only.
```

**Brief Generator output:**
- Hook line options (3 variations)
- Recommended format and duration
- Opening frame description (what to show in first second)
- CTA recommendation
- Audience to target first
- Based on: what has worked for this exact client, not generic best practices

---

## 11. UI/UX Design Decisions

### Design Philosophy
Not a dashboard. A command centre. A dashboard shows data. A command centre shows what needs attention today.

**Three principles held across every screen:**
1. **Signal over noise** — show what needs attention, hide what doesn't
2. **Explanation over numbers** — every metric that moved has a plain-English explanation
3. **Action over analysis** — every insight surfaces a recommended next step

### Design System

**Colors (CSS variables):**
```css
--bg: #07070a         /* Main background */
--s1: #0d0d11         /* Surface 1 — sidebar */
--s2: #111116         /* Surface 2 — cards */
--s3: #17171d         /* Surface 3 — hover states */
--s4: #1e1e26         /* Surface 4 — input backgrounds */
--b1: #1f1f28         /* Border 1 — subtle */
--b2: #2a2a38         /* Border 2 — hover/active */
--accent: #f5c518     /* Logam yellow — CTAs, active states */
--text: #f0f0f5       /* Primary text */
--t2: #9898b0         /* Secondary text */
--t3: #52526a         /* Muted text, labels */
--green: #22c55e      /* Success, healthy metrics */
--red: #ef4444        /* Errors, critical alerts */
--orange: #f97316     /* Warnings */
--blue: #3b82f6       /* Informational, CTR colour */
```

**Typography:**
- Display/headings: `Geist` (Vercel's font — modern, sharp)
- Body: `Geist` (same family, different weight)
- Data values, metrics, code: `Geist Mono` (tabular numbers, aligned decimals)
- Avoid: Inter, Roboto, Arial, Space Grotesk — too generic

**Layout:**
- Rail: 52px fixed width
- Sidebar: 220px fixed width
- Main: flex-1, all remaining space
- AI panel: 340px slide-in from right (fixed, overlays main)

### Navigation Structure

```
Landing (brand grid)
└── Dashboard (per brand)
    ├── Rail (brand switching + utility)
    ├── Sidebar
    │   ├── Performance
    │   │   ├── reporting         ← default on brand entry
    │   │   ├── alerts
    │   │   ├── creative-studio
    │   │   └── attribution       ← e-commerce clients only
    │   ├── Client
    │   │   ├── client-updates
    │   │   ├── onboarding
    │   │   └── campaign-notes
    │   ├── Team
    │   │   ├── #general
    │   │   ├── #media-buyers
    │   │   ├── #creative-team
    │   │   └── #accounts
    │   └── Workspace
    │       ├── ai-assistant      ← opens AI panel
    │       ├── files
    │       └── scope-tracker
    └── AI Panel (slide-in, independent of section)
```

### Key Screen Decisions

**Landing:** Brands grouped by vertical (Performance/E-Commerce, Real Estate, Education & Other) because that's how agencies think about their book of business. Search + filter + stat bar at top. Status dot on each card.

**Rail:** Icons only, tooltip on hover. No text labels — saves horizontal space. Active brand has accent-color outline. Back-to-landing via logo click.

**Sidebar bottom:** User avatar with name and role. Online status dot. Never takes up more than needed.

**AI Panel:** No floating FAB button — it overlapped the chat send button. Access only via sidebar item "ai-assistant" and header "Ask AI" button. Full-screen toggle via ⤢ button.

**Reporting export:** Not a global header button. Lives at the bottom of the reporting view as a contextual card explaining what it generates. Contextual placement = clearer purpose.

**Chat sections:** Reply threading (click reply button → preview bar appears above input), emoji reactions (professional set: ✅ 👀 🔥), pinned message at top of channel, attachment previews.

---

## 12. Next.js Build Guide

### Project Initialisation

```bash
npx create-next-app@latest logam-os \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*"
cd logam-os
```

### Install Dependencies

```bash
# Core
npm install prisma @prisma/client
npm install @clerk/nextjs
npm install zustand
npm install @tanstack/react-query

# UI
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-tabs
npm install class-variance-authority clsx tailwind-merge
npm install lucide-react

# Charts
npm install recharts

# AI
Local LLM

# Jobs
npm install bullmq ioredis

# Database
npm install pg @types/pg

# Utilities
npm install date-fns zod
npm install resend

# Dev
npm install -D @types/node tsx
```

### Prisma Setup

```bash
npx prisma init
```

Add TimescaleDB extension to `prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Organisation {
  id        String   @id @default(cuid())
  name      String
  plan      String   @default("starter")
  createdAt DateTime @default(now())
  clients   Client[]
  users     User[]
}

model User {
  id     String @id @default(cuid())
  orgId  String
  clerkId String @unique
  name   String
  role   String @default("member")
  org    Organisation @relation(fields: [orgId], references: [id])
}

model Client {
  id            String   @id @default(cuid())
  orgId         String
  name          String
  shortCode     String   // 2-char abbreviation (HI, FF, NJ)
  color         String   // hex
  vertical      String   // ecommerce | realestate | education | other
  status        String   @default("active")
  contractValue Float?
  createdAt     DateTime @default(now())
  org           Organisation @relation(fields: [orgId], references: [id])
  dataSources   DataSource[]
  healthScores  HealthScore[]
  creatives     Creative[]
  alerts        Alert[]
}

model DataSource {
  id                String   @id @default(cuid())
  clientId          String
  platform          String   // meta | google | tiktok | ga4 | shopify
  accountId         String   // platform's account ID
  accessToken       String   // encrypted
  refreshToken      String?  // encrypted
  tokenExpiresAt    DateTime?
  status            String   @default("active")
  lastSyncedAt      DateTime?
  client            Client   @relation(fields: [clientId], references: [id])
  @@unique([clientId, platform, accountId])
}

// TimescaleDB hypertable — created via raw SQL migration
model Metric {
  id          BigInt   @id @default(autoincrement())
  clientId    String
  sourceId    String
  platform    String
  level       String   // account | campaign | adset | ad
  entityId    String   // campaign ID, ad set ID, etc.
  entityName  String
  date        DateTime
  spend       Float    @default(0)
  impressions BigInt   @default(0)
  clicks      BigInt   @default(0)
  ctr         Float    @default(0)
  cpc         Float    @default(0)
  conversions Float    @default(0)
  convValue   Float    @default(0)
  roas        Float    @default(0)
  frequency   Float?
  hookRate    Float?
  reach       BigInt?
  @@index([clientId, date])
  @@index([entityId, date])
}

model HealthScore {
  id          String   @id @default(cuid())
  clientId    String
  score       Int      // 0-100
  riskLevel   String   // low | medium | high | critical
  signals     Json     // array of signal objects
  computedAt  DateTime @default(now())
  client      Client   @relation(fields: [clientId], references: [id])
  @@index([clientId, computedAt])
}

model Creative {
  id           String   @id @default(cuid())
  clientId     String
  metaAdId     String?
  name         String
  hookType     String
  angle        String?
  format       String
  audienceType String
  assetUrl     String?
  ctr          Float?
  hookRate     Float?
  roas         Float?
  frequency    Float?
  fatigueDay   Int?
  status       String   @default("active")
  createdAt    DateTime @default(now())
  client       Client   @relation(fields: [clientId], references: [id])
}

model Alert {
  id          String   @id @default(cuid())
  clientId    String
  type        String   // fatigue | anomaly | opportunity | positive
  severity    String   // critical | warning | info | success
  title       String
  description String
  metadata    Json?
  resolvedAt  DateTime?
  createdAt   DateTime @default(now())
  client      Client   @relation(fields: [clientId], references: [id])
  @@index([clientId, createdAt])
}
```

After schema is ready:
```bash
npx prisma migrate dev --name init
# Then add TimescaleDB hypertable via raw SQL:
# SELECT create_hypertable('Metric', 'date');
```

### File Structure

```
src/
├── app/
│   ├── (auth)/
│   │   ├── sign-in/
│   │   └── sign-up/
│   ├── (dashboard)/
│   │   ├── layout.tsx          # Shell: rail + sidebar + main
│   │   ├── page.tsx            # Landing — brand grid
│   │   └── [brandId]/
│   │       ├── reporting/
│   │       │   └── page.tsx
│   │       ├── alerts/
│   │       │   └── page.tsx
│   │       ├── creative/
│   │       │   └── page.tsx
│   │       ├── updates/
│   │       │   └── page.tsx
│   │       ├── onboarding/
│   │       │   └── page.tsx
│   │       └── [channel]/
│   │           └── page.tsx    # Chat channels
│   ├── (portal)/               # White-labelled client-facing portal
│   │   └── [orgSlug]/
│   │       └── [brandId]/
│   │           └── page.tsx
│   └── api/
│       ├── meta/
│       │   ├── oauth/route.ts
│       │   ├── sync/route.ts
│       │   └── webhook/route.ts
│       ├── google/
│       │   ├── oauth/route.ts
│       │   └── sync/route.ts
│       ├── ai/
│       │   ├── insight/route.ts
│       │   ├── chat/route.ts
│       │   └── brief/route.ts
│       ├── alerts/
│       │   └── detect/route.ts
│       └── reports/
│           └── export/route.ts
├── components/
│   ├── shell/
│   │   ├── Rail.tsx
│   │   ├── Sidebar.tsx
│   │   ├── MainHeader.tsx
│   │   └── AIPanel.tsx
│   ├── reporting/
│   │   ├── KPIGrid.tsx
│   │   ├── AIInsightCard.tsx
│   │   ├── BarChart.tsx
│   │   ├── DonutChart.tsx
│   │   ├── PlacementChart.tsx
│   │   ├── CampaignTable.tsx
│   │   ├── AdSetTable.tsx
│   │   ├── CreativeTable.tsx
│   │   └── ExportCard.tsx
│   ├── alerts/
│   │   ├── HowItWorks.tsx
│   │   └── AlertItem.tsx
│   ├── creative/
│   │   ├── CreativeCard.tsx
│   │   ├── BriefGenerator.tsx
│   │   └── CreativeExplainer.tsx
│   ├── chat/
│   │   ├── ChatMessage.tsx
│   │   ├── ReplyPreview.tsx
│   │   ├── Reactions.tsx
│   │   └── ChatInput.tsx
│   ├── landing/
│   │   ├── BrandCard.tsx
│   │   ├── StatBar.tsx
│   │   └── FilterBar.tsx
│   └── ui/                     # shadcn/ui components
├── lib/
│   ├── prisma.ts               # Prisma client singleton
│   ├── redis.ts                # Redis client
│   ├── meta.ts                 # Meta API client
│   ├── google.ts               # Google Ads API client
│   ├── normalise.ts            # Platform data normalisation
│   ├── claude.ts               # Anthropic SDK wrapper
│   └── jobs/
│       ├── metaSync.ts
│       ├── googleSync.ts
│       ├── alertDetect.ts
│       └── healthScore.ts
├── hooks/
│   ├── useMetrics.ts           # TanStack Query hook for metrics
│   ├── useAlerts.ts
│   ├── useHealthScore.ts
│   └── useAI.ts
├── stores/
│   ├── ui.ts                   # Zustand — panel states, active sections
│   └── brand.ts                # Active brand selection
└── types/
    ├── metrics.ts
    ├── creative.ts
    ├── alert.ts
    └── api.ts
```

---

## 13. State Management Decisions

**Two separate concerns, two separate tools:**

### Zustand — UI State Only
What's open, what's active, what the user is doing:

```typescript
// stores/ui.ts
import { create } from 'zustand'

interface UIStore {
  aiPanelOpen: boolean
  aiPanelFS: boolean
  setAIPanelOpen: (open: boolean) => void
  toggleAIFS: () => void
  activeSection: string
  setActiveSection: (s: string) => void
  replyingTo: Message | null
  setReplyingTo: (m: Message | null) => void
}

export const useUI = create<UIStore>((set) => ({
  aiPanelOpen: false,
  aiPanelFS: false,
  setAIPanelOpen: (open) => set({ aiPanelOpen: open }),
  toggleAIFS: () => set((s) => ({ aiPanelFS: !s.aiPanelFS })),
  activeSection: 'reporting',
  setActiveSection: (activeSection) => set({ activeSection }),
  replyingTo: null,
  setReplyingTo: (replyingTo) => set({ replyingTo }),
}))
```

### TanStack Query — Server/API State
All data from Meta, Google, our database:

```typescript
// hooks/useMetrics.ts
import { useQuery } from '@tanstack/react-query'

export function useMetrics(clientId: string, dateRange: DateRange) {
  return useQuery({
    queryKey: ['metrics', clientId, dateRange],
    queryFn: () => fetchMetrics(clientId, dateRange),
    staleTime: 1000 * 60 * 5,        // 5 minutes — don't refetch unnecessarily
    refetchInterval: 1000 * 60 * 15, // background refetch every 15 min
    refetchIntervalInBackground: true,
  })
}
```

**Rule:** If it comes from an API or database → TanStack Query. If it's what the UI is doing → Zustand. Never mix.

---

## 14. File Structure

See Section 12 above for the complete annotated file tree.

**Critical files to build first (in order):**
1. `src/lib/prisma.ts` — database client
2. `src/app/(dashboard)/layout.tsx` — shell with Rail + Sidebar
3. `src/app/(dashboard)/page.tsx` — landing brand grid
4. `src/app/api/meta/oauth/route.ts` — Meta OAuth flow
5. `src/lib/normalise.ts` — data normalisation engine
6. `src/app/(dashboard)/[brandId]/reporting/page.tsx` — core feature
7. `src/components/shell/AIPanel.tsx` — AI chat
8. `src/app/api/ai/insight/route.ts` — Claude API integration

---

## 15. Environment Variables

```bash
# .env.local

# Database
DATABASE_URL="postgresql://user:pass@localhost:5432/logamos"

# Redis
REDIS_URL="redis://localhost:6379"

# Auth (Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=""
CLERK_SECRET_KEY=""
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL="/"
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL="/"

# Meta API
META_APP_ID=""
META_APP_SECRET=""
META_REDIRECT_URI="http://localhost:3000/api/meta/oauth/callback"

# Google Ads API
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
GOOGLE_DEVELOPER_TOKEN=""
GOOGLE_REDIRECT_URI="http://localhost:3000/api/google/oauth/callback"

# Anthropic
ANTHROPIC_API_KEY=""

# Encryption (for storing OAuth tokens)
ENCRYPTION_KEY=""   # 32 random bytes, base64 encoded

# Email
RESEND_API_KEY=""

# File Storage
CLOUDFLARE_R2_ACCOUNT_ID=""
CLOUDFLARE_R2_ACCESS_KEY=""
CLOUDFLARE_R2_SECRET_KEY=""
CLOUDFLARE_R2_BUCKET=""

# n8n (self-hosted)
N8N_WEBHOOK_SECRET=""
N8N_BASE_URL=""
```

---

## 16. Development Priorities

### Phase 1 — Ship (Weeks 1–8)

**Week 1–2:** Foundation
- [ ] Next.js project setup with TypeScript, Tailwind, shadcn/ui
- [ ] Clerk auth + multi-tenant organisation setup
- [ ] Prisma schema + migrations
- [ ] Shell layout: Rail, Sidebar, Main — pixel-matching the HTML prototype
- [ ] Landing page: brand grid with search and filter

**Week 3–4:** Data connections
- [ ] Meta Ads OAuth flow (complete, not placeholder)
- [ ] Meta Insights API client with proper pagination and rate limiting
- [ ] Data normalisation engine — consistent schema across platforms
- [ ] TimescaleDB hypertable for Metric model
- [ ] BullMQ jobs for scheduled data sync

**Week 5–6:** Intelligence
- [ ] Claude API integration for insight generation
- [ ] Reporting page: all 5 KPI cards, AI insight card, 3 charts
- [ ] Campaign, Ad Set, Creative tables with real data
- [ ] AI panel: streaming responses, contextual chips

**Week 7:** Alerts + Creative
- [ ] Alert detection engine (3 models)
- [ ] Alerts page with full explanation panel
- [ ] Creative Studio with library view and brief generator

**Week 8:** Polish + pilot prep
- [ ] Client portal (white-labelled route group)
- [ ] Export Report as PDF via Puppeteer
- [ ] Onboarding checklist
- [ ] Bug fixes, performance, Logam-specific branding
- [ ] Deploy to Railway/Render
- [ ] First pilot with Logam Digital

### Phase 2 — Retention Layer (Month 3–5)
- [ ] Client health score engine
- [ ] Command centre home screen (all clients health at a glance)
- [ ] Google Ads integration
- [ ] Client updates AI draft + send

### Phase 3 — Creative Layer (Month 6–8)
- [ ] Creative metadata storage and tagging
- [ ] Performance pattern recognition (pgvector embeddings)
- [ ] Brief generator connected to real pattern data
- [ ] TikTok Ads integration

### Phase 4 — Operations Layer (Month 9–13)
- [ ] Capacity tracking (time logging per client per team member)
- [ ] Scope tracker
- [ ] Profit visibility per client
- [ ] Platform consolidation, pricing tier restructure

---

## 17. Known Gaps and Decisions Pending

**Not decided yet:**
- WhatsApp Business API integration for Indian agencies (high priority — many teams run on WhatsApp)
- Mobile responsive design — prototype is desktop only
- Offline mode / PWA for account managers on client calls
- Self-hosted vs managed n8n — cost vs control tradeoff

**Intentionally deferred:**
- TikTok Ads API — Phase 3 only. Start with Meta + Google which covers 95% of Logam's work.
- Zapier/Make integration — only after core product is stable
- Public API for agencies to build their own integrations — Phase 4+

**Open questions to answer during pilot:**
- Does Rishi want client-facing portal to be a separate app or an iframe within their own website?
- What's the preferred report delivery format — email PDF, WhatsApp message, or live link?
- How granular does the onboarding checklist need to be — per vertical or universal?
- Should team chat be retained as a core feature or replaced by a Slack integration?

**Risk to watch:**
- Meta API rate limits at scale (200 calls/hour per ad account). With 35 clients × multiple ad accounts = potentially 100–200 accounts. Need batching strategy with BullMQ job queue from day one.
- Claude API cost at scale. Each insight generation is ~1,500 tokens. At 38 clients × daily = ~57,000 tokens/day. At $3/MTok = ~$0.17/day. Negligible. Monthly report generation will be larger but still manageable.

---

## 18. Business Model

**Revenue model:** Monthly recurring SaaS subscription per agency (not per client, not per user)

**Why per agency and not per client:**
- Predictable for the agency — they know their cost
- Encourages them to add more clients (more value, same price until next tier)
- Simpler to sell — one number, one invoice

**Pricing tiers:**

| Tier | India | Global | Client Limit | Modules |
|------|-------|--------|--------------|---------|
| Starter | ₹8,000/mo | $149/mo | Up to 20 clients | Reporting only |
| Growth | ₹18,000/mo | $349/mo | Up to 40 clients | Reporting + Health Scoring |
| Scale | ₹35,000/mo | $699/mo | Unlimited | All modules |

**Unit economics at steady state:**
- 50 Indian Growth agencies: ₹18,000 × 50 = ₹9L/month
- 50 Global Growth agencies: $349 × 50 = $17,450/month
- Combined: ~₹23.5L/month (~$28,000/month)
- Team of 4 engineers: ~₹4–6L/month
- Gross margin: ~75–80% (SaaS-typical)

**Referral flywheel:**  
Each satisfied founder knows 5–10 other founders. The founding partner deal (6 months free + referral obligation) is not charity — it's the most efficient customer acquisition possible. One relationship that works generates 3–5 paid customers at zero CAC.

---

## 19. Competitive Context

**Direct competitors and why we win:**

| Tool | Their strength | Their weakness | Our advantage |
|------|---------------|----------------|---------------|
| AgencyAnalytics | 80+ integrations, white-label portal | Zero AI, zero team ops, $15/client pricing punishes growth | AI insight layer + team operations in one system |
| Swydo | Clean UI, automated delivery | No intelligence, no team features | Same gap as AgencyAnalytics |
| Supermetrics | Powerful data connectors | Requires technical setup, no UI for non-technical users | We handle the full stack |
| TapClicks | Most feature-complete | Enterprise pricing, complex, dated UI, no real AI | We're built for 15–50 person agencies, not enterprise |
| Madgicx | Meta-specific creative intelligence | Meta only, no team ops, no health scoring | We're platform-agnostic + operational |

**The gap no competitor has filled:**  
Every existing tool is built around the client deliverable (the report). None are built around the operator's daily reality (the chaos of managing 35 clients simultaneously with a team that's always slightly overloaded).

**Meta's Manus AI (embedded in Ads Manager):**  
Meta is moving toward AI-native reporting inside their own platform. This is a signal that AI-powered reporting will eventually become a commodity. Our differentiation must be the operational layer — team communication, creative intelligence, health scoring, capacity management — things Meta has no incentive to build.

**The moat we're building:**  
Data network effects. The more agencies use Logam OS, the better our creative pattern recognition becomes (across verticals, across ICPs). A tool that has seen 10,000 Facebook ad creatives and their performance can give dramatically better brief recommendations than a tool that has seen 100. This compounds over time and becomes very hard to replicate.

---

## Quick Reference — Contacts and Links

| Item | Detail |
|------|--------|
| Logam Digital | logamdigital.com |
| Logam Academy | logamacademy.com |
| Rishi LinkedIn | linkedin.com/in/rao-rishirajsingh-36aa67216 |
| Logam LinkedIn | linkedin.com/company/logamdigital |
| Logam Academy Instagram | instagram.com/logam.academy |
| Anas email | anas.logam48@gmail.com |
| Logam phone | 94083 91548 |
| Meta API docs | developers.facebook.com/docs/marketing-api |
| Google Ads API docs | developers.google.com/google-ads/api |
| Anthropic API docs | docs.anthropic.com |
| Vercel AI SDK | sdk.vercel.ai |
| TanStack Query | tanstack.com/query |
| Clerk docs | clerk.com/docs |
| shadcn/ui | ui.shadcn.com |

---

*This document should be updated after every significant decision, every pilot conversation that changes our understanding, and every major technical choice. If you're picking this up and something feels missing or wrong, that's important information — update this file.*
