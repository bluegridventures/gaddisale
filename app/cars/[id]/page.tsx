import { notFound } from "next/navigation"
import Link from "next/link"
import { dummyCars } from "@/lib/dummy-data"
import { CarGallery } from "@/components/car-gallery"
import { SellerCard } from "@/components/seller-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Gauge, MapPin, Fuel, Settings, ArrowLeft, Share2, Heart } from "lucide-react"

export default async function CarDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const car = dummyCars.find((c) => c.id === id)

  if (!car) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb / Back */}
        <div className="mb-6">
          <Button variant="ghost" asChild className="pl-0 hover:bg-transparent">
            <Link href="/cars" className="flex items-center gap-2 text-muted-foreground hover:text-primary">
              <ArrowLeft className="h-4 w-4" />
              Back to Listings
            </Link>
          </Button>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column - Images & Details */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    {car.make} {car.model} {car.year}
                  </h1>
                  <div className="mt-2 flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{car.city}</span>
                    <span>•</span>
                    <span>Posted on {car.postedDate}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon">
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <CarGallery images={car.images} title={`${car.make} ${car.model}`} />
            </div>

            {/* Key Specs */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 bg-white p-6 rounded-lg shadow-sm">
              <div className="flex flex-col items-center justify-center gap-2 text-center p-2">
                <Calendar className="h-6 w-6 text-primary" />
                <span className="text-sm text-muted-foreground">Year</span>
                <span className="font-semibold">{car.year}</span>
              </div>
              <div className="flex flex-col items-center justify-center gap-2 text-center p-2">
                <Gauge className="h-6 w-6 text-primary" />
                <span className="text-sm text-muted-foreground">Mileage</span>
                <span className="font-semibold">{car.mileage.toLocaleString()} km</span>
              </div>
              <div className="flex flex-col items-center justify-center gap-2 text-center p-2">
                <Fuel className="h-6 w-6 text-primary" />
                <span className="text-sm text-muted-foreground">Fuel</span>
                <span className="font-semibold capitalize">{car.fuelType}</span>
              </div>
              <div className="flex flex-col items-center justify-center gap-2 text-center p-2">
                <Settings className="h-6 w-6 text-primary" />
                <span className="text-sm text-muted-foreground">Transmission</span>
                <span className="font-semibold capitalize">{car.transmission}</span>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
              <h2 className="text-xl font-bold">Description</h2>
              <p className="text-gray-600 leading-relaxed">{car.description}</p>
            </div>

            {/* Features */}
            <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
              <h2 className="text-xl font-bold">Car Features</h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {car.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Price & Seller */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <p className="text-sm text-muted-foreground">Price</p>
              <div className="mt-1 flex items-baseline justify-between">
                <h2 className="text-3xl font-bold text-primary">Rs {car.price.toLocaleString()}</h2>
                {car.condition === "new" && <Badge>New</Badge>}
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Final price negotiation depends on the car condition.
              </p>
            </div>

            <SellerCard seller={car.seller} />

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold mb-4">Safety Tips</h3>
              <ul className="space-y-2 text-sm text-muted-foreground list-disc pl-4">
                <li>Meet in a safe, public place</li>
                <li>Inspect the car thoroughly</li>
                <li>Check all documents carefully</li>
                <li>Never pay in advance</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
