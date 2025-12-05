# GaddiSale – Postgres (Neon) + Prisma Setup and Admin Panel Guide

This guide walks you through replacing the current demo data with a real Postgres database hosted on Neon, wiring it to this Next.js app using Prisma, exposing CRUD API routes, connecting the UI, and scaffolding a protected admin panel.

## What you’ll build
- **Postgres on Neon** with a schema for cars, sellers, and images
- **Prisma ORM** for migrations and type-safe queries
- **Next.js API routes** for list/detail/create/update/delete
- **UI wiring** to replace dummy data with live API
- **Admin panel** (protected) to manage listings

---

## Prerequisites
- **Node.js 18+**
- **Package manager**: npm (or pnpm/yarn)
- **Neon account** (https://neon.tech)
- Images: We will use **Cloudinary** to host images and save the returned `secure_url` values in Postgres.

---

## Step 0: Current app overview (context)
- Framework: **Next.js (App Router)**, TS, Tailwind.
- Demo data lives in `lib/dummy-data.ts` and powers listing pages.
- Sell form (`/sell`) will upload images to **Cloudinary** and persist listing data to Postgres.

We will add Postgres for all listing data and use Cloudinary for images (you can swap to another media provider later if desired).

---

## Step 1: Create a Neon Postgres database
1. **Create a project** in Neon and a database (default is fine).
2. In the Neon dashboard, copy your **pooled connection string** (recommended), which looks like:
   - `postgres://USER:PASSWORD@ep-xxxxxx-pooler.neon.tech/DB_NAME?sslmode=require`
3. Ensure pooling is enabled. Pooling avoids connection limits in serverless environments.

---

## Step 2: Configure environment variables
Add the database URL and Cloudinary variables to your local env:

```bash
# .env.local
DATABASE_URL="postgres://USER:PASSWORD@ep-xxxxxx-pooler.neon.tech/DB_NAME?sslmode=require"

# Cloudinary (Unsigned direct upload)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your_cloud_name"
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET="unsigned_preset_name"  # create this in Cloudinary settings

# Cloudinary (Signed uploads - optional, recommended for stricter control)
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"

# Auth / Admin
JWT_SECRET="a-long-random-secret"
ADMIN_EMAIL="admin@bgv.com"
```

In production (e.g., Vercel), add the same `DATABASE_URL` in Project Settings → Environment Variables.

---

## Step 2b: Cloudinary image uploads (choose one approach)

- **Option A: Unsigned direct upload (simpler)**
  1. In Cloudinary Console → Settings → Upload, create an **unsigned upload preset**.
  2. Restrict it to images, set an allowed folder (e.g., `gaddisale/`), size limits, and allowed formats.
  3. Client upload endpoint: `https://api.cloudinary.com/v1_1/${NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`.
  4. Client code (example):

```ts
// In your form component
async function uploadToCloudinary(files: File[]): Promise<string[]> {
  const urls: string[] = []
  for (const file of files) {
    const fd = new FormData()
    fd.append("file", file)
    fd.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!)
    const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
      method: "POST",
      body: fd,
    })
    if (!res.ok) throw new Error("Cloudinary upload failed")
    const data = await res.json()
    urls.push(data.secure_url as string)
  }
  return urls
}
```

- **Option B: Signed uploads via API (more secure)**
  1. Install SDK: `npm i cloudinary`
  2. Add `app/api/cloudinary/sign/route.ts` to generate signatures server-side:

```ts
// app/api/cloudinary/sign/route.ts
import { NextResponse } from "next/server"
import { v2 as cloudinary } from "cloudinary"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function GET() {
  const timestamp = Math.floor(Date.now() / 1000)
  const paramsToSign = { timestamp, folder: "gaddisale" }
  const signature = cloudinary.utils.api_sign_request(paramsToSign, process.env.CLOUDINARY_API_SECRET!)
  return NextResponse.json({ timestamp, signature, folder: "gaddisale", apiKey: process.env.CLOUDINARY_API_KEY })
}
```

  3. Client flow:
     - GET `/api/cloudinary/sign` to receive `{ signature, timestamp, apiKey, folder }`
     - POST the file to `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload` with `file`, `api_key`, `timestamp`, `signature`, and `folder` in `FormData`.

---

---

## Step 3: Install Prisma and initialize
```bash
npm i -D prisma
npm i @prisma/client
npx prisma init --datasource-provider postgresql
```
This creates a `prisma/schema.prisma` and sets `DATABASE_URL` in `.env` (we’ll read from `.env.local` during dev).

---

## Step 4: Define your Prisma schema
Open `prisma/schema.prisma` and replace with the models below. This maps the app’s fields closely to what you already collect in the Sell form, including image URLs from Cloudinary:

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum Condition {
  new
  used
}

enum Transmission {
  automatic
  manual
}

enum FuelType {
  petrol
  diesel
  hybrid
  electric
}

model Seller {
  id        String  @id @default(cuid())
  name      String
  phone     String
  email     String  @unique
  cars      Car[]
  createdAt DateTime @default(now())
}

model Car {
  id                String       @id @default(cuid())
  title             String
  make              String
  model             String
  year              Int
  price             Int
  mileage           Int
  city              String
  condition         Condition
  transmission      Transmission
  fuelType          FuelType
  description       String
  postedDate        DateTime     @default(now())
  featured          Boolean      @default(false)
  picturesOnTheWay  Boolean      @default(false)
  isNew             Boolean      @default(false)
  isUsed            Boolean      @default(false)

  sellerId String
  seller   Seller       @relation(fields: [sellerId], references: [id])
  images   CarImage[]
}

model CarImage {
  id     String @id @default(cuid())
  url    String
  sort   Int    @default(0)
  carId  String
  car    Car    @relation(fields: [carId], references: [id])
}

// Optional: users/roles for admin panel (if you later add NextAuth)
enum Role {
  USER
  ADMIN
}

model AppUser {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  role      Role     @default(USER)
  createdAt DateTime @default(now())
}
```

---

## Step 5: Run migrations
```bash
npx prisma migrate dev --name init
npx prisma generate
```
You now have a Postgres schema on Neon and a generated Prisma Client.

Optional seed script for local data:
```bash
npx prisma db seed
```
Add a `prisma/seed.ts` later if you want to preload cars.

---

## Step 6: Create a reusable Prisma client
Create `lib/prisma.ts` to avoid multiple client instances during dev:

```ts
// lib/prisma.ts
import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined }

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["warn", "error"],
  })

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
```

---

## Step 7: Add API routes (CRUD)

Create the following routes under `app/api`.

1) `app/api/cars/route.ts`
- **GET**: list cars (supports `make`, `condition`, `sort`) and pagination (`take`, `skip`)
- **POST**: create a car + seller + images (expects image URLs from Cloudinary uploads)

```ts
// app/api/cars/route.ts
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const make = searchParams.get("make") || undefined
  const condition = searchParams.get("condition") as "new" | "used" | null
  const sort = searchParams.get("sort") // "newest" | "price-asc" | "price-desc"
  const take = Number(searchParams.get("take") ?? 24)
  const skip = Number(searchParams.get("skip") ?? 0)

  const orderBy =
    sort === "price-asc" ? { price: "asc" } :
    sort === "price-desc" ? { price: "desc" } : { postedDate: "desc" }

  const where: any = {}
  if (make) where.make = { equals: make, mode: "insensitive" }
  if (condition && condition !== "all") where.condition = condition

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
  // Expect: { title, make, model, year, price, mileage, condition, transmission, fuelType, description, city, sellerName, sellerPhone, sellerEmail, images: string[] }
  const {
    sellerName, sellerPhone, sellerEmail, images = [], ...car
  } = body

  const seller = await prisma.seller.upsert({
    where: { email: sellerEmail },
    update: { name: sellerName, phone: sellerPhone },
    create: { name: sellerName, phone: sellerPhone, email: sellerEmail },
  })

  const created = await prisma.car.create({
    data: {
      ...car,
      sellerId: seller.id,
      images: { create: images.map((url: string, i: number) => ({ url, sort: i })) },
    },
    include: { images: true, seller: true },
  })

  return NextResponse.json(created, { status: 201 })
}
```

2) `app/api/cars/[id]/route.ts`
- **GET**: car by id
- **PATCH**: update fields
- **DELETE**: remove car and its images

```ts
// app/api/cars/[id]/route.ts
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

type Params = { params: { id: string } }

export async function GET(_: Request, { params }: Params) {
  const car = await prisma.car.findUnique({
    where: { id: params.id },
    include: { images: true, seller: true },
  })
  if (!car) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(car)
}

export async function PATCH(req: Request, { params }: Params) {
  const data = await req.json()
  const updated = await prisma.car.update({ where: { id: params.id }, data })
  return NextResponse.json(updated)
}

export async function DELETE(_: Request, { params }: Params) {
  await prisma.carImage.deleteMany({ where: { carId: params.id } })
  await prisma.car.delete({ where: { id: params.id } })
  return NextResponse.json({ ok: true })
}
```

---

## Step 8: Wire the UI to the API

- **Replace dummy data imports** (`lib/dummy-data.ts`) with fetch calls to the API.
- Examples:
  - Home and Browse pages: `await fetch("/api/cars?make=...&condition=...&sort=...")`
  - Car details page: `await fetch("/api/cars/{id}")`
  - Sell form: After uploading images to Cloudinary, call `POST /api/cars` with the full payload including the `images` URLs.

Recommended updates:
- `app/page.tsx` and `app/cars/page.tsx`: Use `fetch` in server components or a client hook to populate `CarCard` from API results.
- `components/post-ad-form.tsx`: After images upload, call `fetch("/api/cars", { method: "POST", body: JSON.stringify(valuesWithImages) })` and navigate to the new car page or show success.

Note: Cloudinary is used for images; listing metadata is stored in Postgres.

---

## Step 9: Admin panel (protected)

You have two options to protect `/admin` routes:

1) **Quick cookie token guard (simple, no users)**
- Add a `.env.local` value: `ADMIN_TOKEN="strong-random-string"`
- Create `app/admin/login/page.tsx` to accept the token and set a cookie.
- Add a `middleware.ts` to protect `/admin` by checking the cookie:

```ts
// middleware.ts
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(req: NextRequest) {
  const isAdminRoute = req.nextUrl.pathname.startsWith("/admin")
  if (!isAdminRoute) return NextResponse.next()

  const cookie = req.cookies.get("admin_token")?.value
  if (cookie === process.env.ADMIN_TOKEN) return NextResponse.next()

  const url = req.nextUrl.clone()
  url.pathname = "/admin/login"
  return NextResponse.redirect(url)
}

export const config = { matcher: ["/admin/:path*"] }
```

2) **Recommended: NextAuth + role-based access**
- Add NextAuth (Credentials or OAuth providers), persist users in `AppUser` with a `role` field.
- In callbacks, include `role` in the session/JWT.
- Protect `/admin` via `middleware.ts` by checking session role or in layout via server `getServerSession`.

Admin UI pages to add:
- `app/admin/layout.tsx`: shared nav/shell.
- `app/admin/page.tsx`: dashboard KPIs (counts from Prisma: cars, sellers).
- `app/admin/cars/page.tsx`: table of cars with edit/delete buttons calling the API routes above.

---

## Step 10: Deployment

- **Vercel** (recommended):
  - Set `DATABASE_URL` and (if used) `ADMIN_TOKEN` / NextAuth envs in Vercel.
  - Build command: `next build` (default).
  - Prisma works out of the box; using a pooled Neon connection is important.

- **Neon**:
  - Use the pooled connection string (`-pooler` host) with `sslmode=require`.
  - Optionally use **Neon connection pooling** and **pgbouncer** mode.

---

## Troubleshooting
- **Prisma connection limits**: Use the pooled Neon connection string to avoid “too many connections”.
- **SSL errors**: Ensure `?sslmode=require` on `DATABASE_URL`.
- **Migrations not applying**: Verify `DATABASE_URL` matches the Neon project/branch. Run `npx prisma migrate dev` again.
- **API 500 errors**: Check the Vercel/console logs for Prisma validation errors. Confirm enum values match (`new|used`, `automatic|manual`, etc.).
- **Cloudinary uploads**:
  - 400 errors on unsigned uploads usually mean a wrong preset name, preset not set to unsigned, or disallowed folder/format.
  - 401 errors on signed uploads mean invalid signature/timestamp or API credentials.
  - Large files failing: raise upload size limit in the preset/settings or compress images client-side.
  - Ensure allowed formats include your file types (e.g., jpg, png, webp).

---

## Commands reference
- **Install**: `npm i`
- **Auth libs**: `npm i jose bcryptjs`
- **Dev**: `npm run dev`
- **Build**: `npm run build`
- **Start**: `npm start`
- **Prisma**:
  - `npx prisma init`
  - `npx prisma migrate dev --name init`
  - `npx prisma generate`
  - `npx prisma studio` (visual DB browser)

---

## Admin panel login (single email)
- Only the email in `ADMIN_EMAIL` (defaults to `admin@bgv.com`) can access `/admin/*`.
- Steps:
  - Create a user with that email via `/signup` (first time only), or insert via Prisma/Studio.
  - Go to `/admin/login` and sign in with that email/password.
  - Middleware will allow access to `/admin` and `/admin/cars` only for that email.

---

## Roadmap (optional)
- Replace dummy reads with Prisma queries everywhere.
- Add server actions for create/update to avoid extra client code.
- Integrate NextAuth and role-based admin.
- Add search indices (make/model/city) and pagination.
- Move images to a dedicated media provider if desired.


