"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Car, LayoutDashboard, PlusCircle, BarChart3 } from "lucide-react"

const nav = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Cars", href: "/admin/cars", icon: Car },
  { label: "Upload Car", href: "/admin/cars/new", icon: PlusCircle },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
]

export function AdminSidebar() {
  const pathname = usePathname()
  return (
    <aside className="hidden md:flex md:w-64 lg:w-72 shrink-0 border-r bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="flex h-screen sticky top-0 flex-col w-full">
        <div className="h-16 flex items-center px-4 border-b">
          <Link href="/admin" className="font-bold text-lg tracking-tight">Gaddisale Admin</Link>
        </div>
        <nav className="flex-1 p-3">
          <ul className="space-y-1">
            {nav.map((item) => {
              const Icon = item.icon
              const active = pathname === item.href || (item.href !== "/admin" && pathname?.startsWith(item.href))
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={[
                      "flex items-center gap-2 rounded-md px-3 py-2 transition-colors",
                      active
                        ? "bg-gray-900 text-white"
                        : "text-gray-700 hover:bg-gray-100",
                    ].join(" ")}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
        <div className="p-4 border-t text-xs text-gray-500">
          © {new Date().getFullYear()} Gaddisale
        </div>
      </div>
    </aside>
  )
}
