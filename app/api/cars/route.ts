import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const make = searchParams.get('make') || undefined
  const conditionRaw = searchParams.get('condition')
  const condition = conditionRaw && conditionRaw !== 'all' ? (conditionRaw as 'new' | 'used') : undefined
  const sort = searchParams.get('sort')
  const take = Number(searchParams.get('take') ?? 24)
  const skip = Number(searchParams.get('skip') ?? 0)

  const orderBy =
    sort === 'price-asc' ? { price: 'asc' as const } :
    sort === 'price-desc' ? { price: 'desc' as const } : { postedDate: 'desc' as const }

  const where: any = {}
  if (make) where.make = { equals: make, mode: 'insensitive' }
  if (condition) where.condition = condition

  const [items, total] = await Promise.all([
    prisma.car.findMany({
      where,
      orderBy,
      take,
      skip,
      include: { images: true, seller: true },
    }),
    prisma.car.count({ where }),
  ])

  return NextResponse.json({ items, total })
}

export async function POST(req: Request) {
  const body = await req.json()
  const {
    title,
    make,
    model,
    year,
    price,
    mileage,
    condition,
    transmission,
    fuelType,
    description,
    city,
    sellerName,
    sellerPhone,
    sellerEmail,
    images = [],
    featured = false,
    picturesOnTheWay = false,
    isNew = false,
    isUsed = false,
  } = body

  const seller = await prisma.seller.upsert({
    where: { email: sellerEmail },
    update: { name: sellerName, phone: sellerPhone },
    create: { name: sellerName, phone: sellerPhone, email: sellerEmail },
  })

  const created = await prisma.car.create({
    data: {
      title,
      make,
      model,
      year: Number(year),
      price: Number(price),
      mileage: Number(mileage),
      condition,
      transmission,
      fuelType,
      description,
      city,
      sellerId: seller.id,
      featured,
      picturesOnTheWay,
      isNew,
      isUsed,
      images: { create: (images as string[]).map((url, i) => ({ url, sort: i })) },
    },
    include: { images: true, seller: true },
  })

  return NextResponse.json(created, { status: 201 })
}
