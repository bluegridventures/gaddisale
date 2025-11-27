export interface Car {
  id: string
  make: string
  model: string
  year: number
  price: number
  mileage: number
  city: string
  condition: "new" | "used"
  engineSize: number
  transmission: "automatic" | "manual"
  fuelType: "petrol" | "diesel" | "hybrid" | "electric"
  images: string[]
  description: string
  features: string[]
  seller: {
    name: string
    phone: string
    email: string
  }
  postedDate: string
  featured?: boolean
   picturesOnTheWay?: boolean;
}
