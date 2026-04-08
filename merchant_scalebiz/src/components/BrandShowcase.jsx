import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useStorePath } from "@/hooks/use-store-path";

const BrandShowcase = ({ data, className }) => {
  const { title, brands } = data;
  const getPath = useStorePath();

  if (!brands || brands.length === 0) {
    return null;
  }

  return (
    <section className={cn("py-8 md:py-12 bg-muted", className)}>
      <div className="container mx-auto px-4 sm:px-6">
        {title && (
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8" style={{ color: `var(--dynamic-primary-color)`, fontFamily: `var(--dynamic-heading-font)` }}>
            {title}
          </h2>
        )}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6 items-center justify-center">
          {brands.map((brand, index) => (
            <Link to={getPath(brand.link)} key={index} className="flex justify-center items-center p-2">
              <img
                src={brand.imageUrl}
                alt={brand.name}
                className="max-h-16 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300"
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandShowcase;