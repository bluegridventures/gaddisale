"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

interface CarGalleryProps {
  images: string[]
  title: string
}

export function CarGallery({ images, title }: CarGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(images[0])

  return (
    <div className="space-y-4">
      <div className="aspect-video relative overflow-hidden rounded-lg border bg-muted">
        <img src={selectedImage || "/placeholder.svg"} alt={title} className="h-full w-full object-cover" />
      </div>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(image)}
            className={cn(
              "relative aspect-video w-24 shrink-0 overflow-hidden rounded-md border-2",
              selectedImage === image ? "border-primary" : "border-transparent",
            )}
          >
            <img
              src={image || "/placeholder.svg"}
              alt={`${title} view ${index + 1}`}
              className="h-full w-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  )
}
