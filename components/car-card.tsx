"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Car } from "@/lib/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";


interface CarCardProps {
  car: Car;
}

export function CarCard({ car }: CarCardProps) {
    const [open, setOpen] = useState(false);
    const [mode, setMode] = useState<"leasing" | "purchase">("leasing");

  return (
      <>
    <Card className="w-full pt-0 overflow-hidden rounded-xl border border-gray-200 bg-[#F9F9F9] shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer">
    
      <div className="relative h-52 w-full overflow-hidden bg-gray-100">
        <img
          src={car.images[0] || "/placeholder.svg"}
          alt={`${car.make} ${car.model}`}
          className="h-full w-full object-cover"
        />

       
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="rounded-full bg-[#f5e8a3] px-3 py-1 text-xs font-semibold text-gray-900 shadow-sm">
            NEWS
          </span>

         {car.picturesOnTheWay && (
    <span className="rounded-full bg-[#d8d8d8] px-3 py-1 text-xs font-semibold text-gray-900 shadow-sm">
      PICTURES ON THE WAY
    </span>
  )}
        </div>
      </div>

   
    {/* LEASING / PURCHASE TOGGLE */}
<div className="flex items-center justify-center gap-2 mt-3">

  <button
    onClick={() => setMode("leasing")}
    className={`px-6 py-2 rounded-full text-sm font-semibold transition
      ${mode === "leasing" ? "bg-black text-white" : "bg-gray-100 text-gray-600"}
    `}
  >
    Leasing
  </button>

  <button
    onClick={() => setMode("purchase")}
    className={`px-6 py-2 rounded-full text-sm font-semibold transition
      ${mode === "purchase" ? "bg-[#f5e8a3] text-black" : "bg-gray-100 text-gray-600"}
    `}
  >
    Purchase
  </button>

</div>


      {/* content */}
      <div className="px-5 py-5">
       
        <h2 className="text-lg font-bold text-gray-900">
          {car.make}
        </h2>
        <p className="text-sm text-gray-700 mt-1">
          {car.model}
        </p>

       
        <div className="mt-5 space-y-2 text-sm text-gray-800">
          <div className="flex justify-between">
            <span className="text-gray-500">Year</span>
            <span className="font-medium">{car.year}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">Propellant</span>
            <span className="font-medium">{car.fuelType}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">Kilometer</span>
            <span className="font-medium">
              {car.mileage.toLocaleString()}
            </span>
          </div>
        </div>

      
       {/* price and details */}
<div className="mt-6 space-y-1">

  {mode === "purchase" && (
    <>
      <div className="flex justify-between text-sm">
        <span className="text-gray-500">Purchase Price</span>
        <span className="font-semibold text-gray-900">
          Rs {car.price.toLocaleString()}
        </span>
      </div>

      <div className="flex justify-between text-sm">
        <span className="text-gray-500">Tax Status</span>
        <span className="font-semibold text-gray-900">Without Charge/Fee</span>
      </div>
    </>
  )}

  {mode === "leasing" && (
    <>
      <div className="flex justify-between text-sm">
        <span className="text-gray-500">First-time performance</span>
        <span className="font-semibold text-gray-900">
          Rs {car.price.toLocaleString()}
        </span>
      </div>

      <div className="flex justify-between text-sm">
        <span className="text-gray-500">Leasing per month</span>
        <span className="font-semibold text-gray-900">
          Rs {(car.price / 36).toLocaleString()}
        </span>
      </div>
    </>
  )}

</div>


       
        <div className="mt-6 flex w-full items-center justify-between">
        <Link
          href={`/cars/${car.id}`}
          className="rounded-full bg-black px-5 py-2 text-sm font-semibold text-white hover:bg-gray-900 transition"
        >
          See details
        </Link>

        <button
          className="rounded-full border border-gray-400 px-5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 transition"
          onClick={() => setOpen(true)}
        >
          Contact
        </button>
      </div>
      
      </div>
    </Card>
     {/* seller popup */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="rounded-xl">
          <DialogHeader>
            <DialogTitle>Seller Information</DialogTitle>
          </DialogHeader>

          <div className="space-y-2 text-sm">
           <p><strong>Name:</strong> {car.seller.name}</p>
<p><strong>Phone:</strong> {car.seller.phone}</p>
<p><strong>City:</strong> {car.city}</p>
<p><strong>Email:</strong> {car.seller.email}</p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
