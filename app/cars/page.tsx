import { Suspense } from "react"
import { FilterSidebar } from "@/components/filter-sidebar"
import { CarCard } from "@/components/car-card"
import { dummyCars } from "@/lib/dummy-data"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface CarsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

async function CarsGrid({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  // Filter logic
  let filteredCars = [...dummyCars]

  const make = searchParams.make as string
  const condition = searchParams.condition as string
  const sort = searchParams.sort as string

  if (make && make !== "all") {
    filteredCars = filteredCars.filter((car) => car.make.toLowerCase() === make.toLowerCase())
  }

  if (condition && condition !== "all") {
    filteredCars = filteredCars.filter((car) => car.condition === condition)
  }

  // Sort logic
  if (sort === "price-asc") {
    filteredCars.sort((a, b) => a.price - b.price)
  } else if (sort === "price-desc") {
    filteredCars.sort((a, b) => b.price - a.price)
  } else if (sort === "newest") {
    filteredCars.sort((a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime())
  }

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
      {filteredCars.map((car) => (
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
