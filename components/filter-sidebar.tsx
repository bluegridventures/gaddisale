"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useState, useEffect } from "react"

export function FilterSidebar() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [priceRange, setPriceRange] = useState([0, 10000000])
  const [make, setMake] = useState(searchParams.get("make") || "all")
  const [condition, setCondition] = useState(searchParams.get("condition") || "all")

  // Update local state when URL params change
  useEffect(() => {
    setMake(searchParams.get("make") || "all")
    setCondition(searchParams.get("condition") || "all")
  }, [searchParams])

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString())

    if (make && make !== "all") params.set("make", make)
    else params.delete("make")

    if (condition && condition !== "all") params.set("condition", condition)
    else params.delete("condition")

    // Add price range param logic if needed, simplified for now

    router.push(`/cars?${params.toString()}`)
  }

  const clearFilters = () => {
    router.push("/cars")
    setMake("all")
    setCondition("all")
    setPriceRange([0, 10000000])
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold mb-4">Filters</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Make</Label>
            <Select value={make} onValueChange={setMake}>
              <SelectTrigger>
                <SelectValue placeholder="Select Make" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Makes</SelectItem>
                <SelectItem value="Toyota">Toyota</SelectItem>
                <SelectItem value="Honda">Honda</SelectItem>
                <SelectItem value="Suzuki">Suzuki</SelectItem>
                <SelectItem value="Mercedes">Mercedes</SelectItem>
                <SelectItem value="BMW">BMW</SelectItem>
                <SelectItem value="Audi">Audi</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Condition</Label>
            <RadioGroup value={condition} onValueChange={setCondition}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="all" />
                <Label htmlFor="all">All</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="new" id="new" />
                <Label htmlFor="new">New</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="used" id="used" />
                <Label htmlFor="used">Used</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label>Price Range (PKR)</Label>
            <div className="pt-2">
              <Slider
                defaultValue={[0, 10000000]}
                max={20000000}
                step={100000}
                value={priceRange}
                onValueChange={setPriceRange}
                className="my-4"
              />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Rs {priceRange[0].toLocaleString()}</span>
                <span>Rs {priceRange[1].toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 pt-4">
            <Button onClick={applyFilters} className="w-full">
              Apply Filters
            </Button>
            <Button variant="outline" onClick={clearFilters} className="w-full bg-transparent">
              Clear All
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
