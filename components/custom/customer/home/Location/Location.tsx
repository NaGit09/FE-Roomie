"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { LocationCard } from "../Location/LocationCard";
import { LOCATIONS } from "@/constant/hot-location";

export default function Location() {
  return (
    <section className="w-full py-16">
      <div className="mx-auto max-w-7xl px-4">
        {/* Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {LOCATIONS.map((item, index) => (
            <LocationCard
              key={item.id}
              item={item}
              className={cn(
                index === 0 && "sm:col-span-2 sm:h-80",
                index === 3 && "sm:col-span-2 sm:h-80",
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
