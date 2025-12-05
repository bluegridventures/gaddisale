import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface Params { params: { id: string } }

export async function GET(_req: Request, { params }: Params) {
  const car = await prisma.car.findUnique({ where: { id: params.id }, include: { images: true, seller: true } })
  if (!car) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(car)
}

export async function PATCH(req: Request, { params }: Params) {
  const data = await req.json()
  const updated = await prisma.car.update({ where: { id: params.id }, data })
  return NextResponse.json(updated)
}

export async function DELETE(_req: Request, { params }: Params) {
  await prisma.carImage.deleteMany({ where: { carId: params.id } })
  await prisma.car.delete({ where: { id: params.id } })
  return NextResponse.json({ ok: true })
}
