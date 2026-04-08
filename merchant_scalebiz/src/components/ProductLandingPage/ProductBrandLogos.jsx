"use client";

import React from "react";
import { cn } from "@/lib/utils";

const ProductBrandLogos = ({ className, data }) => {
  const { brands } = data; // Destructure brands from data prop

  if (!brands || brands.length === 0) {
    return null;
  }

  return (
    <section className={cn("py-8 md:py-12 bg-white", className)}>
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-wrap justify-center items-center gap-6 md:gap-12">
          {brands.map((brand, index) => (
            <img
              key={index}
              src={brand.imageUrl}
              alt={brand.name}
              className="h-6 sm:h-8 md:h-10 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300"
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductBrandLogos;