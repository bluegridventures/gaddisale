import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const { path, ua, sid, durationSec } = await req.json()
    if (!path || typeof path !== 'string') {
      return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
    }
    const dur = Number.isFinite(durationSec) ? Math.max(0, Math.min(60 * 60, Math.floor(durationSec))) : 0
    await prisma.visit.create({ data: { path, userAgent: ua || null, sessionId: sid || null, durationSec: dur } })
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: 'Failed to track' }, { status: 500 })
  }
}
