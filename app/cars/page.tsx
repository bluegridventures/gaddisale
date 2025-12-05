import { Suspense } from "react"
import { FilterSidebar } from "@/components/filter-sidebar"
import { CarCard } from "@/components/car-card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { prisma } from "@/lib/prisma"

interface CarsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

async function CarsGrid({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const make = (searchParams.make as string) || undefined
  const condition = (searchParams.condition as string) || undefined
  const sort = (searchParams.sort as string) || "newest"
  const featuredParam = (searchParams.featured as string) || undefined

  const orderBy =
    sort === "price-asc" ? { price: "asc" as const } :
    sort === "price-desc" ? { price: "desc" as const } : { postedDate: "desc" as const }

  const where: any = { status: 'APPROVED' }
  if (make && make !== "all") where.make = { equals: make, mode: "insensitive" }
  if (condition && condition !== "all") where.condition = condition
  if (featuredParam === "true") where.featured = true

  const dbCars = await prisma.car.findMany({
    where,
    orderBy,
    include: { images: true, seller: true },
    take: 60,
  })

  const filteredCars = dbCars.map((c: any) => ({
    id: c.id,
    title: c.title,
    make: c.make,
    model: c.model,
    year: c.year,
    price: Number(c.price),
    mileage: c.mileage,
    city: c.city,
    condition: c.condition,
    engineSize: 0,
    transmission: c.transmission,
    fuelType: c.fuelType,
    images: c.images.map((i: any) => i.url),
    description: c.description,
    features: [],
    seller: { name: c.seller?.name || "", phone: c.seller?.phone || "", email: c.seller?.email || "" },
    postedDate: c.postedDate.toISOString(),
    featured: c.featured,
    picturesOnTheWay: c.picturesOnTheWay,
    isNew: c.isNew,
    isUsed: c.isUsed,
  }))

  if (filteredCars.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <h3 className="text-lg font-semibold">No cars found</h3>
        <p className="text-muted-foreground">Try adjusting your filters to find what you're looking for.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {filteredCars.map((car: any) => (
        <CarCard key={car.id} car={car} />
      ))}
    </div>
  )
}

export default async function CarsPage({ searchParams }: CarsPageProps) {
  const resolvedSearchParams = await searchParams

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full md:w-64 shrink-0 space-y-8">
          <Suspense fallback={<div>Loading filters...</div>}>
            <FilterSidebar />
          </Suspense>
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Used Cars for Sale</h1>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground hidden sm:inline-block">Sort by:</span>
              <Select defaultValue="newest">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest Listed</SelectItem>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Suspense fallback={<div>Loading cars...</div>}>
            <CarsGrid searchParams={resolvedSearchParams} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
