import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Calendar, Gauge } from "lucide-react"
import type { Car } from "@/lib/types"

interface CarCardProps {
  car: Car
}

export function CarCard({ car }: CarCardProps) {
  return (
    <Link href={`/cars/${car.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full">
        <div className="aspect-video relative overflow-hidden bg-muted">
          <img
            src={car.images[0] || "/placeholder.svg"}
            alt={`${car.make} ${car.model}`}
            className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
          />
          {car.featured && (
            <Badge className="absolute top-2 left-2" variant="default">
              Featured
            </Badge>
          )}
          {car.condition === "new" && (
            <Badge className="absolute top-2 right-2" variant="secondary">
              New
            </Badge>
          )}
        </div>

        <CardContent className="p-4">
          <div className="space-y-2">
            <h3 className="font-semibold text-lg leading-tight line-clamp-1">
              {car.make} {car.model}
            </h3>

            <p className="text-2xl font-bold text-primary">Rs {car.price.toLocaleString()}</p>

            <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{car.year}</span>
              </div>
              <div className="flex items-center gap-1">
                <Gauge className="h-4 w-4" />
                <span>{car.mileage.toLocaleString()} km</span>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{car.city}</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}
