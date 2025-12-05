import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { signToken } from '@/lib/auth'

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json()
    if (!email || !password) return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })

    const existing = await prisma.appUser.findUnique({ where: { email } })
    if (existing) return NextResponse.json({ error: 'Email already in use' }, { status: 409 })

    const passwordHash = await bcrypt.hash(password, 10)
    const user = await prisma.appUser.create({ data: { name: name ?? null, email, passwordHash } })

    const token = await signToken({ sub: user.id, email: user.email, role: user.role as 'USER' | 'ADMIN' })
    const res = NextResponse.json({ id: user.id, email: user.email, name: user.name })
    res.cookies.set('auth_token', token, { httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 7 })
    return res
  } catch (e) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
