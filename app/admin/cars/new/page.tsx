import Link from "next/link"
import { PostAdForm } from "@/components/post-ad-form"

export default function AdminNewCarPage() {
  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">New Car</h1>
        <Link href="/admin/cars" className="text-sm underline">Back to Cars</Link>
      </div>
      <PostAdForm adminMode />
    </div>
  )
}
