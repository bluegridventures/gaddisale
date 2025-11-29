import Link from "next/link"
import { Car } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t bg-muted/40">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <Car className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">GaddiSale</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {"Your trusted platform for buying and selling vehicles online."}
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Buy</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/cars" className="text-muted-foreground hover:text-primary transition-colors">
                  Browse Cars
                </Link>
              </li>
              <li>
                <Link href="/cars?condition=new" className="text-muted-foreground hover:text-primary transition-colors">
                  New Cars
                </Link>
              </li>
              <li>
                <Link
                  href="/cars?condition=used"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Used Cars
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Sell</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/sell" className="text-muted-foreground hover:text-primary transition-colors">
                  Post an Ad
                </Link>
              </li>
              <li>
                <Link href="/sell#pricing" className="text-muted-foreground hover:text-primary transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/sell#tips" className="text-muted-foreground hover:text-primary transition-colors">
                  Selling Tips
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} AutoMarket. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
