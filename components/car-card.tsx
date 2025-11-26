import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Gauge } from "lucide-react";
import type { Car } from "@/lib/types";

interface CarCardProps {
  car: Car;
}

export function CarCard({ car }: CarCardProps) {
  return (
    <Link href={`/cars/${car.id}`}>
      <Card className="py-0 overflow-hidden hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-2 transition-all duration-300 cursor-pointer h-140 rounded-lg bg-[#F9F9F9] border border-gray-700 hover:border-blue-500 group">
        <div className="aspect-video relative overflow-hidden bg-gray-700 rounded-t-lg">
          <img
            src={car.images[0] || "/placeholder.svg"}
            alt={`${car.make} ${car.model}`}
            className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          {car.featured && (
            <Badge className="absolute top-3 left-3 bg-linear-to-r from-blue-900 to-purple-600 text-white px-3 py-1 text-xs font-semibold rounded-md shadow-lg animate-fade-in">
              Featured
            </Badge>
          )}
          {car.condition === "new" && (
            <Badge className="absolute top-3 right-3 bg-linear-to-r from-green-700 to-emerald-500 text-white px-3 py-1 text-xs font-semibold rounded-md shadow-lg animate-fade-in">
              New
            </Badge>
          )}
        </div>

        <CardContent className="p-6 space-y-4">
          <h3 className="font-bold text-2xl text-black group-hover:text-black-200 transition-colors duration-200 line-clamp-1">
            {car.make} {car.model}
          </h3>

          <p className="text-3xl font-extrabold text-transparent bg-linear-to-r from-gray-900 to-gray-300 bg-clip-text">
            Rs {car.price.toLocaleString()}
          </p>

          <div className="flex flex-wrap gap-4 text-sm text-gray-800">
            <div className="flex items-center gap-2 group-hover:text-gray-700 transition-colors duration-200">
              <Calendar className="h-4 w-4 text-gray-800 group-hover:text-blue-900 transition-colors duration-200" />
              <span>{car.year}</span>
            </div>
            <div className="flex items-center gap-2 group-hover:text-gray-700 transition-colors duration-200">
              <Gauge className="h-4 w-4 text-gray-800 group-hover:text-blue-900 transition-colors duration-200" />
              <span>{car.mileage.toLocaleString()} km</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-6 pt-0">
          <div className="flex items-center gap-2 text-sm font-bold text-gray-900 group-hover:text-gray-700 transition-colors duration-200">
            <MapPin className="h-4 w-4 text-gray-800 group-hover:text-blue-900 transition-colors duration-200" />
            <span>{car.city}</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
