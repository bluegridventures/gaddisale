import { PostAdForm } from "@/components/post-ad-form"
import { cookies } from "next/headers"
import { verifyToken } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function SellPage() {
  const cookieStore = await (cookies() as any)
  const token = cookieStore.get('auth_token')?.value
  if (!token) redirect('/login?redirect=/sell')
  const payload = await verifyToken(token)
  if (!payload) redirect('/login?redirect=/sell')
  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="bg-primary py-12 text-primary-foreground mb-8">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold mt-6 mb-2">Sell Your Car</h1>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto">
            Post your ad in 3 easy steps and reach thousands of buyers instantly.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <PostAdForm />
      </div>
    </div>
  )
}
