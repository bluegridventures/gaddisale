import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await ctx.params
    const body = await req.json().catch(() => ({}))
    const data: any = {}
    if (typeof body.featured === 'boolean') data.featured = body.featured
    if (body.status && ['APPROVED','REJECTED','PENDING'].includes(body.status)) {
      data.status = body.status
    }
    if (Object.keys(data).length === 0) return NextResponse.json({ error: 'No changes' }, { status: 400 })
    const updated = await prisma.car.update({ where: { id }, data })
    return NextResponse.json(updated)
  } catch (e: any) {
    const msg = String(e?.message || 'Update failed')
    const hint = (msg.includes('Unknown arg `status`') || msg.includes('column') && msg.includes('status'))
      ? 'Run: npx prisma generate && npx prisma migrate dev --name add-car-status'
      : undefined
    return NextResponse.json({ error: 'Update failed', message: msg, hint }, { status: 500 })
  }
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params
  await prisma.carImage.deleteMany({ where: { carId: id } })
  await prisma.car.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
