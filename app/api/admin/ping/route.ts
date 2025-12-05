import { NextResponse } from 'next/server'

export async function GET() {
  // If middleware let us through, user is admin
  return NextResponse.json({ ok: true })
}
