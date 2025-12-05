"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, ExternalLink } from "lucide-react"

export function AdminTopbar() {
  const pathname = usePathname()
  return (
    <header className="h-16 w-full border-b bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="h-full flex items-center justify-between px-4">
        <div className="flex items-center gap-3 max-w-md w-full">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input placeholder="Search in admin..." className="pl-9" />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" asChild>
            <Link href="/" prefetch={false}>
              <ExternalLink className="h-4 w-4 mr-2" />
              View Site
            </Link>
          </Button>
          <div className="text-xs text-gray-600 hidden sm:block">{pathname}</div>
        </div>
      </div>
    </header>
  )
}
