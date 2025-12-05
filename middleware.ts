import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const encoder = new TextEncoder()

async function isAdmin(req: NextRequest) {
  const token = req.cookies.get('auth_token')?.value
  if (!token) return false
  try {
    const secret = encoder.encode(process.env.JWT_SECRET || 'dev-secret')
    const { payload } = await jwtVerify(token, secret)
    const email = (payload as any).email
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@bgv.com'
    return email && email.toLowerCase() === adminEmail.toLowerCase()
  } catch {
    return false
  }
}

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname
  const isAdminPage = path.startsWith('/admin')
  const isAdminApi = path.startsWith('/api/admin')

  if (isAdminPage) {
    if (path === '/admin/login') return NextResponse.next()
    const ok = await isAdmin(req)
    if (ok) return NextResponse.next()
    const url = req.nextUrl.clone()
    url.pathname = '/admin/login'
    return NextResponse.redirect(url)
  }

  if (isAdminApi) {
    const ok = await isAdmin(req)
    if (ok) return NextResponse.next()
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}
