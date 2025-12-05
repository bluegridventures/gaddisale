import { prisma } from '@/lib/prisma'
import { VisitorsBarChart } from '@/components/admin/visitors-bar-chart'

function formatNumber(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`
  return n.toLocaleString()
}

function formatDuration(sec: number) {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${m}m ${s}s`
}

export default async function AdminAnalyticsPage() {
  const now = new Date()
  const start = new Date(now.getFullYear(), now.getMonth(), 1)
  const next = new Date(now.getFullYear(), now.getMonth() + 1, 1)
  const prevStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const prevEnd = new Date(now.getFullYear(), now.getMonth(), 1)

  const [curVisits, prevVisits] = await Promise.all([
    prisma.visit.findMany({
      where: { createdAt: { gte: start, lt: next } },
      select: { createdAt: true, sessionId: true, path: true, durationSec: true },
      orderBy: { createdAt: 'asc' },
    }),
    prisma.visit.findMany({
      where: { createdAt: { gte: prevStart, lt: prevEnd } },
      select: { createdAt: true, sessionId: true, path: true, durationSec: true },
      orderBy: { createdAt: 'asc' },
    }),
  ])

  const filter = (rows: typeof curVisits) => rows.filter((v) => !v.path?.startsWith('/admin'))
  const visits = filter(curVisits)
  const visitsPrev = filter(prevVisits)

  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
  const dayBuckets = Array.from({ length: daysInMonth }, (_, i) => ({ day: i + 1, value: 0 }))
  for (const v of visits) {
    const d = v.createdAt.getDate()
    if (d >= 1 && d <= daysInMonth) dayBuckets[d - 1].value += 1
  }

  const uniqSessions = new Set((visits.map((v) => v.sessionId).filter(Boolean) as string[]))
  const uniqSessionsPrev = new Set((visitsPrev.map((v) => v.sessionId).filter(Boolean) as string[]))

  const sessionsMap: Record<string, { count: number; dur: number }> = {}
  for (const v of visits) {
    const key = v.sessionId || `${v.userAgent || 'anon'}:${v.createdAt.toISOString().slice(0,10)}`
    sessionsMap[key] = sessionsMap[key] || { count: 0, dur: 0 }
    sessionsMap[key].count += 1
    sessionsMap[key].dur += Math.max(0, v.durationSec || 0)
  }
  const sessionVals = Object.values(sessionsMap)
  const bounces = sessionVals.filter((s) => s.count <= 1).length
  const bounceRate = sessionVals.length ? Math.round((bounces / sessionVals.length) * 100) : 0
  const avgSessionSec = sessionVals.length ? Math.round(sessionVals.reduce((a, b) => a + b.dur, 0) / sessionVals.length) : 0

  const sessionsPrevMap: Record<string, { count: number; dur: number }> = {}
  for (const v of visitsPrev) {
    const key = v.sessionId || `${v.userAgent || 'anon'}:${v.createdAt.toISOString().slice(0,10)}`
    sessionsPrevMap[key] = sessionsPrevMap[key] || { count: 0, dur: 0 }
    sessionsPrevMap[key].count += 1
    sessionsPrevMap[key].dur += Math.max(0, v.durationSec || 0)
  }
  const sessionPrevVals = Object.values(sessionsPrevMap)
  const bouncesPrev = sessionPrevVals.filter((s) => s.count <= 1).length
  const bounceRatePrev = sessionPrevVals.length ? Math.round((bouncesPrev / sessionPrevVals.length) * 100) : 0
  const avgSessionSecPrev = sessionPrevVals.length ? Math.round(sessionPrevVals.reduce((a, b) => a + b.dur, 0) / sessionPrevVals.length) : 0

  // deltas
  const delta = (cur: number, prev: number) => {
    if (prev === 0) return 100
    return Math.round(((cur - prev) / prev) * 100)
  }

  const uniqueVisitors = uniqSessions.size
  const uniqueVisitorsPrev = uniqSessionsPrev.size
  const totalPageviews = visits.length
  const totalPageviewsPrev = visitsPrev.length

  const uniqueDelta = delta(uniqueVisitors, uniqueVisitorsPrev)
  const viewsDelta = delta(totalPageviews, totalPageviewsPrev)
  const bounceDelta = delta(100 - bounceRate, 100 - bounceRatePrev) // invert to show drop as negative
  const durDelta = delta(avgSessionSec, avgSessionSecPrev)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Visitors Analytics</h1>

      <div className="rounded-lg border bg-white mb-6">
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h2 className="font-semibold">Visitors Analytics</h2>
            <p className="text-xs text-muted-foreground">This month</p>
          </div>
          <div className="text-xs text-gray-500">SHORT BY: <span className="font-medium">Daily</span></div>
        </div>
        <div className="p-4">
          <VisitorsBarChart data={dayBuckets} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="rounded-lg border bg-white p-4">
          <div className="text-xs text-muted-foreground mb-1">Unique Visitors</div>
          <div className="text-2xl font-semibold">{formatNumber(uniqueVisitors)}</div>
          <div className="text-xs mt-1 text-emerald-600">{uniqueDelta >= 0 ? `↑ ${uniqueDelta}%` : `↓ ${Math.abs(uniqueDelta)}%`}</div>
        </div>
        <div className="rounded-lg border bg-white p-4">
          <div className="text-xs text-muted-foreground mb-1">Total Pageviews</div>
          <div className="text-2xl font-semibold">{formatNumber(totalPageviews)}</div>
          <div className="text-xs mt-1 text-emerald-600">{viewsDelta >= 0 ? `↑ ${viewsDelta}%` : `↓ ${Math.abs(viewsDelta)}%`}</div>
        </div>
        <div className="rounded-lg border bg-white p-4">
          <div className="text-xs text-muted-foreground mb-1">Bounce Rate</div>
          <div className="text-2xl font-semibold">{bounceRate}%</div>
          <div className={`text-xs mt-1 ${bounceRate <= bounceRatePrev ? 'text-emerald-600' : 'text-red-600'}`}>
            {bounceDelta >= 0 ? `↑ ${bounceDelta}%` : `↓ ${Math.abs(bounceDelta)}%`}
          </div>
        </div>
        <div className="rounded-lg border bg-white p-4">
          <div className="text-xs text-muted-foreground mb-1">Visit Duration</div>
          <div className="text-2xl font-semibold">{formatDuration(avgSessionSec)}</div>
          <div className={`text-xs mt-1 ${avgSessionSec >= avgSessionSecPrev ? 'text-emerald-600' : 'text-red-600'}`}>
            {durDelta >= 0 ? `↑ ${durDelta}%` : `↓ ${Math.abs(durDelta)}%`}
          </div>
        </div>
      </div>
    </div>
  )
}
