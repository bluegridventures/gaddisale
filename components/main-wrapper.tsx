"use client"

import { usePathname } from "next/navigation"
import type { ReactNode } from "react"

export function MainWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname?.startsWith("/admin")
  return (
    <main className={`min-h-screen ${isAdmin ? '' : 'mt-[65px]'}`}>{children}</main>
  )
}
