import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Phone, Mail, User } from "lucide-react"
import type { Car } from "@/lib/types"

interface SellerCardProps {
  seller: Car["seller"]
}

export function SellerCard({ seller }: SellerCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Seller Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
            <User className="h-5 w-5" />
          </div>
          <div>
            <p className="font-medium">{seller.name}</p>
            <p className="text-xs text-muted-foreground">Member since 2023</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span>{seller.phone}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span>{seller.email}</span>
          </div>
        </div>

        <Button className="w-full" size="lg">
          <Phone className="mr-2 h-4 w-4" />
          Show Phone Number
        </Button>
        <Button variant="outline" className="w-full bg-transparent">
          <Mail className="mr-2 h-4 w-4" />
          Send Message
        </Button>
      </CardContent>
    </Card>
  )
}
