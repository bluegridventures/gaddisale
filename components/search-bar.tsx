"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
Select,
SelectContent,
SelectItem,
SelectTrigger,
SelectValue,
} from "@/components/ui/select"
import { Search } from "lucide-react"
import { useRouter } from "next/navigation"

export function SearchBar() {
const router = useRouter()
const [make, setMake] = useState("")
const [model, setModel] = useState("")
const [city, setCity] = useState("")
const [priceRange, setPriceRange] = useState("")

const handleSearch = () => {
const params = new URLSearchParams()
if (make) params.set("make", make)
if (model) params.set("model", model)
if (city) params.set("city", city)
if (priceRange) params.set("priceRange", priceRange)

router.push(`/cars?${params.toString()}`)

}

  return (
    <div className="p-4 rounded-xl">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">

       {/* Make */} 
       <Select value={make} onValueChange={setMake}>
         <SelectTrigger className=" bg-transparent border border-white/30 text-white placeholder:text-white focus:outline-none focus:ring-0 focus:ring-offset-0 focus:border-white shadow-none " >
         <SelectValue placeholder={<span className="text-white">Make</span>} />
         </SelectTrigger>
         <SelectContent className="bg-black/60 text-white border border-white/20 shadow-none"> 
         <SelectItem value="toyota" className="text-white">Toyota</SelectItem> 
         <SelectItem value="honda" className="text-white">Honda</SelectItem> 
         <SelectItem value="suzuki" className="text-white">Suzuki</SelectItem> 
         <SelectItem value="mercedes" className="text-white">Mercedes</SelectItem> 
         <SelectItem value="bmw" className="text-white">BMW</SelectItem> 
         <SelectItem value="audi" className="text-white">Audi</SelectItem> 
         </SelectContent> </Select> 
         
      <Input
  placeholder="Model"
  value={model}
  onChange={(e) => setModel(e.target.value)}
  className="
    bg-transparent 
    border border-white/20 
    text-white 
    placeholder:text-white
    focus:outline-none 
    focus:ring-0 
    hover:border-white/30
  "
/>

<Input
  placeholder="City"
  value={city}
  onChange={(e) => setCity(e.target.value)}
  className="
    bg-transparent 
    border border-white/20 
    text-white 
    placeholder:text-white
    focus:outline-none 
    focus:ring-0 
    hover:border-white/30
  "
/>

           {/* Price Range */} 
           <Select value={priceRange} onValueChange={setPriceRange}>
           <SelectTrigger className=" bg-transparent border border-white/30 text-white placeholder:text-white focus:outline-none focus:ring-0 focus:ring-offset-0 focus:border-white shadow-none " > 
           <SelectValue placeholder={<span className="text-white">Price Range</span>} /> 
           </SelectTrigger> 
           <SelectContent className="bg-black/60 text-white border border-white/20 shadow-none"> 
           <SelectItem value="0-500000" className="text-white">Under 500k</SelectItem> 
           <SelectItem value="500000-1000000" className="text-white">500k - 1M</SelectItem> 
           <SelectItem value="1000000-2000000" className="text-white">1M - 2M</SelectItem> 
           <SelectItem value="2000000-5000000" className="text-white">2M - 5M</SelectItem> 
           <SelectItem value="5000000+" className="text-white">Above 5M</SelectItem> 
           </SelectContent> 
           </Select> 

       {/* Search Button */}
        <Button onClick={handleSearch} className="w-full bg-white/20 hover:bg-white/30 text-white">
         <Search className="h-4 w-4 mr-2" /> Search </Button> </div> </div>
  )
}
