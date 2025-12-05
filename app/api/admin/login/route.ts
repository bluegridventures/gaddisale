import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { token } = await req.json()
  if (!token || token !== process.env.ADMIN_TOKEN) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  }
  const res = NextResponse.json({ ok: true })
  res.cookies.set('admin_token', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  })
  return res
}
