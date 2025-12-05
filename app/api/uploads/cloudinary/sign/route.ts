import { NextResponse } from 'next/server'
import { createHash } from 'crypto'

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({} as any))
    const folder = (body?.folder as string) || 'gaddisale'

    const apiKey = process.env.CLOUDINARY_API_KEY
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME
    const apiSecret = process.env.CLOUDINARY_API_SECRET

    if (!apiKey || !cloudName || !apiSecret) {
      return NextResponse.json({ error: 'Cloudinary environment variables are missing' }, { status: 500 })
    }

    const timestamp = Math.floor(Date.now() / 1000)
    const paramsToSign: Record<string, string | number> = { folder, timestamp }
    const toSign = Object.keys(paramsToSign)
      .sort()
      .map((k) => `${k}=${paramsToSign[k]}`)
      .join('&')

    const signature = createHash('sha1').update(toSign + apiSecret).digest('hex')

    return NextResponse.json({ timestamp, signature, apiKey, cloudName, folder })
  } catch (e) {
    return NextResponse.json({ error: 'Failed to create signature' }, { status: 500 })
  }
}
