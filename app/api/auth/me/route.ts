import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const store = await (cookies() as any)
    const token = store?.get?.('auth_token')?.value
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const payload = await verifyToken<{ sub: string; email: string }>(token)
    if (!payload?.sub) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const user = await prisma.appUser.findUnique({ where: { id: payload.sub }, select: { id: true, email: true, name: true, role: true } })
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    return NextResponse.json(user)
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}
