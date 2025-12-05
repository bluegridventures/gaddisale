import { prisma } from '@/lib/prisma'
import { AdminCarActions } from '@/components/admin-car-actions'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function AdminCarsPage() {
  const cars = await prisma.car.findMany({
    orderBy: { postedDate: 'desc' },
    include: { images: true, seller: true },
    take: 100,
  })

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Cars</h1>
        <div className="flex items-center gap-3">
          <Link href="/cars" className="text-sm underline">View site</Link>
          <Button asChild>
            <Link href="/admin/cars/new">New Car</Link>
          </Button>
        </div>
      </div>
      <div className="overflow-x-auto rounded-md border">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="p-3 text-left">Title</th>
              <th className="p-3 text-left">Make</th>
              <th className="p-3 text-left">Model</th>
              <th className="p-3 text-left">Price</th>
              <th className="p-3 text-left">Seller</th>
              <th className="p-3 text-left">Posted</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Featured</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {cars.map((c: any) => (
              <tr key={c.id} className="border-t">
                <td className="p-3">{c.title}</td>
                <td className="p-3">{c.make}</td>
                <td className="p-3">{c.model}</td>
                <td className="p-3">Rs {Number(c.price).toLocaleString()}</td>
                <td className="p-3">{c.seller?.name}</td>
                <td className="p-3">{new Date(c.postedDate).toLocaleDateString()}</td>
                <td className="p-3"><span className="inline-flex items-center rounded-md border px-2 py-1 text-xs font-medium capitalize">{c.status?.toLowerCase()}</span></td>
                <td className="p-3">{c.featured ? 'Yes' : 'No'}</td>
                <td className="p-3"><AdminCarActions id={c.id} featured={!!c.featured} status={c.status || 'PENDING'} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
