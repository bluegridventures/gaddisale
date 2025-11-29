import { Button } from "@/components/ui/button"
import { SearchBar } from "@/components/search-bar"
import { CarCard } from "@/components/car-card"
import { dummyCars } from "@/lib/dummy-data"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const featuredCars = dummyCars.filter((car) => car.featured).slice(0, 3)
  const latestCars = dummyCars.slice(0, 6)

  return (
    <div className="flex flex-col -mt-[65px]">
      <section id="hero-video" className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Video */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover brightness-[0.65]"
        >
          <source src="https://scleasing.dk/wp-content/uploads/sites/3/2025/03/Hjemmeside-SCG-FULL-HD-LOW-RES.mp4" type="video/mp4" />
        </video>

        {/* Hero Content */}
        <div className="relative z-20 container mx-auto px-6 md:px-10 text-center max-w-4xl">
          <div className="max-w-3xl mx-auto text-center space-y-6 text-white">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white drop-shadow-lg animate-fadeIn">
              Find Your Dream Car Today
            </h1>

            <p className="text-lg md:text-2xl text-white/90 mt-4 mb-8 drop-shadow-md animate-fadeIn delay-150">
              Browse thousands of new and used cars from trusted sellers across the country
            </p>

            <div className="backdrop-blur-xl bg-white/10 p-4 rounded-2xl shadow-2xl mx-auto w-full max-w-3xl animate-fadeIn delay-300 border border-white/20">
              <SearchBar />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Cars Section */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Featured Cars</h2>
              <p className="text-gray-600 mt-1">Hand-picked premium vehicles</p>
            </div>
            <Button variant="ghost" asChild className="hidden md:flex hover:text-gray-900 transition-colors">
              <Link href="/cars?featured=true">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>

          <div className="mt-8 text-center md:hidden">
            <Button variant="outline" asChild className="border-gray-300 hover:border-gray-900">
              <Link href="/cars?featured=true">
                View All Featured Cars
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Latest Cars Section */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Latest Cars</h2>
              <p className="text-gray-600 mt-1">Recently listed vehicles</p>
            </div>
            <Button variant="ghost" asChild className="hidden md:flex hover:text-gray-900 transition-colors">
              <Link href="/cars">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestCars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>

          <div className="mt-8 text-center md:hidden">
            <Button variant="outline" asChild className="border-gray-300 hover:border-gray-900">
              <Link href="/cars">
                View All Cars
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="bg-[#f5f1e5] text-gray-700 rounded-xl p-8 md:p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Sell Your Car?</h2>
            <p className="text-lg mb-6 opacity-90 max-w-2xl mx-auto text-pretty">
              {"List your car in minutes and reach thousands of potential buyers"}
            </p>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/sell">
                Post Your Ad Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
