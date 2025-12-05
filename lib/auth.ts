import { SignJWT, jwtVerify } from 'jose'

const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'dev-secret')

export type JwtPayload = {
  sub: string
  email: string
  role?: 'USER' | 'ADMIN'
}

export async function signToken(payload: JwtPayload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret)
}

export async function verifyToken<T = JwtPayload>(token: string): Promise<T | null> {
  try {
    const { payload } = await jwtVerify(token, secret)
    return payload as T
  } catch {
    return null
  }
}
