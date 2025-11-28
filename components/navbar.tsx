"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Car, Menu, User } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { usePathname } from "next/navigation"

export function Navbar() {
  const pathname = usePathname()
  const [isTransparent, setIsTransparent] = useState(true)

  useEffect(() => {
    // navbar solid on page except home
    if (pathname !== "/") {
      setIsTransparent(false)
      return
    }

    const hero = document.getElementById("hero-video")
    if (!hero) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsTransparent(entry.isIntersecting)
      },
      { threshold: 0.5 } // 50% of hero visible = transparent
    )

    observer.observe(hero)

    return () => observer.disconnect()
  }, [pathname])

  return (
   <header
  className={`fixed top-0 left-0 z-50 w-full transition-all duration-300 
    ${isTransparent 
      ? "bg-transparent border-none shadow-none backdrop-blur-0" 
      : "bg-white shadow-md border-b border-gray-200"
    }
  `}
>

     <div className="container mx-auto flex h-16 items-center px-4">
  <div className="flex items-center gap-6 mr-auto">
  <Link href="/" className="flex items-center gap-2">
    <Car className={`h-6 w-6 transition-colors ${isTransparent ? "text-white" : "text-primary"}`} />
    <span className={`text-xl font-bold transition-colors ${isTransparent ? "text-white" : "text-black"}`}>
      GaddiSale
    </span>
  </Link>

  <nav className="hidden md:flex items-center gap-6 ml-8">
    <Link
      href="/cars"
      className={`text-sm font-medium transition-colors 
      ${isTransparent ? "text-white" : "text-gray-700"}`}
    >
      Browse Cars
    </Link>

    <Link
      href="/sell"
      className={`text-sm font-medium transition-colors 
      ${isTransparent ? "text-white" : "text-gray-700"}`}
    >
      Sell Your Car
    </Link>
  </nav>
</div>


        <div className="flex items-center gap-3">
         <Button
  asChild
  variant="ghost"
  size="sm"
  className={`hidden md:flex transition-colors group
    ${isTransparent ? "text-white hover:text-black" : "text-gray-700 hover:text-black"}
  `}
>
  <Link href="/login" className="flex items-center">
    <User
      className={`h-4 w-4 mr-2 transition-colors
        ${isTransparent ? "text-white group-hover:text-black" : "text-gray-700 group-hover:text-black"}
      `}
    />
    Sign In
  </Link>
</Button>


         <Button asChild size="sm" className="bg-[#f5e8a3] text-black hover:bg-[#f5d98f]">
  <Link href="/sell">Post Ad</Link>
</Button>


          <DropdownMenu>
            <DropdownMenuTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className={`h-5 w-5 ${isTransparent ? "text-white" : "text-gray-700"}`} />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href="/cars">Browse Cars</Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link href="/sell">Sell Your Car</Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link href="/login">Sign In</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
