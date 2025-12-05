"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { User } from "lucide-react"

export function AuthDisplay({ isTransparent = false }: { isTransparent?: boolean }) {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const res = await fetch('/api/auth/me', { cache: 'no-store' })
        if (res.ok) {
          const u = await res.json()
          if (mounted) setUser(u)
        } else if (mounted) {
          setUser(null)
        }
      } catch {
        if (mounted) setUser(null)
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [])

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    location.reload()
  }

  if (loading) return null

  if (!user) {
    return (
      <Button
        asChild
        variant="ghost"
        size="sm"
        className={`hidden md:flex transition-colors group ${isTransparent ? "text-white hover:text-black" : "text-gray-700 hover:text-black"}`}
      >
        <Link href="/login">
          <User className={`h-4 w-4 mr-2 transition-colors ${isTransparent ? "text-white group-hover:text-black" : "text-gray-700 group-hover:text-black"}`} />
          Sign In
        </Link>
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className={`${isTransparent ? "text-white" : "text-gray-700"}`}>
          Hi, {user.name || user.email}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href="/sell">Post Ad</Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
