import { PostAdForm } from "@/components/post-ad-form"

export default function SellPage() {
  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="bg-primary py-12 text-primary-foreground mb-8">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold mb-2">Sell Your Car</h1>
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
