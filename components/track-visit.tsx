"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

export function TrackVisit() {
  const pathname = usePathname()

  useEffect(() => {
    if (!pathname) return
    if (pathname.startsWith("/admin")) return

    // Ensure a client session id
    let sid = localStorage.getItem("sid")
    if (!sid) {
      sid = `sid_${Math.random().toString(36).slice(2)}_${Date.now()}`
      localStorage.setItem("sid", sid)
    }

    const start = Date.now()
    const controller = new AbortController()

    return () => {
      const durationSec = Math.max(0, Math.round((Date.now() - start) / 1000))
      try {
        navigator.sendBeacon?.(
          "/api/track",
          new Blob([JSON.stringify({ path: pathname, ua: navigator.userAgent, sid, durationSec })], {
            type: "application/json",
          })
        ) ||
          fetch("/api/track", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ path: pathname, ua: navigator.userAgent, sid, durationSec }),
            signal: controller.signal,
            keepalive: true,
          })
      } catch {}
    }
  }, [pathname])

  return null
}
