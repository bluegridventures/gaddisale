import { prisma } from '@/lib/prisma'
import { VisitsChart } from '@/components/admin/visits-chart'

export default async function AdminDashboardPage() {
  const since = new Date()
  since.setMonth(since.getMonth() - 11)
  since.setDate(1)

  const [cars, sellers, users, visits] = await Promise.all([
    prisma.car.count(),
    prisma.seller.count(),
    prisma.appUser.count(),
    prisma.visit.findMany({
      where: { createdAt: { gte: since } },
      select: { createdAt: true, path: true },
      orderBy: { createdAt: 'asc' },
    }),
  ])

  // Prepare last 12 months buckets
  const months: { key: string; label: string }[] = []
  const now = new Date()
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    const label = d.toLocaleString('en-US', { month: 'short' })
    months.push({ key, label })
  }

  const monthly = months.map((m) => ({ month: m.label, visits: 0, uniquePaths: 0 }))
  const pathSets: Record<string, Set<string>> = {}
  for (const v of visits) {
    const k = `${v.createdAt.getFullYear()}-${String(v.createdAt.getMonth() + 1).padStart(2, '0')}`
    const idx = months.findIndex((m) => m.key === k)
    if (idx >= 0) {
      monthly[idx].visits += 1
      pathSets[k] = pathSets[k] || new Set<string>()
      if (v.path) pathSets[k].add(v.path)
    }
  }
  for (let i = 0; i < months.length; i++) {
    const set = pathSets[months[i].key]
    monthly[i].uniquePaths = set ? set.size : 0
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="rounded-lg border p-6 bg-white">
          <div className="text-sm text-gray-500">Total Cars</div>
          <div className="text-3xl font-bold">{cars}</div>
        </div>
        <div className="rounded-lg border p-6 bg-white">
          <div className="text-sm text-gray-500">Total Sellers</div>
          <div className="text-3xl font-bold">{sellers}</div>
        </div>
        <div className="rounded-lg border p-6 bg-white">
          <div className="text-sm text-gray-500">Total Users</div>
          <div className="text-3xl font-bold">{users}</div>
        </div>
      </div>

      <div className="rounded-lg border bg-white">
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h2 className="font-semibold">Visits Overview</h2>
            <p className="text-xs text-muted-foreground">Last 12 months</p>
          </div>
          <div className="text-xs text-gray-500">SHORT BY: <span className="font-medium">Monthly</span></div>
        </div>
        <div className="p-4">
          <VisitsChart data={monthly} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 text-sm">
            <div className="rounded-md border p-3">
              <div className="text-muted-foreground">Total Visits</div>
              <div className="text-xl font-semibold">{monthly.reduce((a, b) => a + b.visits, 0).toLocaleString()}</div>
            </div>
            <div className="rounded-md border p-3">
              <div className="text-muted-foreground">Unique Paths</div>
              <div className="text-xl font-semibold">{monthly.reduce((a, b) => a + b.uniquePaths, 0).toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
