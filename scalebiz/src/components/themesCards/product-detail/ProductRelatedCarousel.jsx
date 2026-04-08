"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "@/lib/api";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import ProductCardResolver from "@/components/ProductCardResolver";
import { Skeleton } from "@/components/ui/skeleton";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ProductRelatedCarousel = ({ title = "Product Same Category", categoryId }) => {
  const autoplayPlugin = React.useRef(
    Autoplay({
      delay: 3000,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
    })
  );

  const { data: products, isLoading, error } = useQuery({
    queryKey: ['relatedProducts', categoryId],
    queryFn: () => fetchProducts({ categories: [categoryId], limit: 8 }), // Fetch up to 8 related products
    enabled: !!categoryId,
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) {
    return (
      <section className="py-8 md:py-12 bg-background">
        <div className="container mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8" style={{ color: `var(--dynamic-primary-color)`, fontFamily: `var(--dynamic-heading-font)` }}>
            {title}
          </h2>
          <div className="flex -ml-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="pl-4 shrink-0 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5">
                 <div className="p-1">
                    <Skeleton className="h-[450px] w-full rounded-lg" />
                 </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    console.error(`Error fetching related products for category "${categoryId}":`, error);
    return null;
  }

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section className="py-8 md:py-12 bg-background">
      <div className="container mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8" style={{ color: `var(--dynamic-primary-color)`, fontFamily: `var(--dynamic-heading-font)` }}>
          {title}
        </h2>
        <Carousel
          opts={{
            align: "start",
            loop: true,
            dragFree: true,
          }}
          plugins={[autoplayPlugin.current]}
          className="w-full relative"
        >
          <CarouselContent className="-ml-4">
            {products.map((product, index) => (
              <CarouselItem key={index} className="pl-4 shrink-0 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5">
                <div className="p-1">
                  <ProductCardResolver product={product} />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious variant="secondary" className="absolute left-0 sm:left-4 top-1/2 -translate-y-1/2 z-10 hidden sm:flex">
            <ChevronLeft className="h-5 w-5" />
            <span className="sr-only">Previous slide</span>
          </CarouselPrevious>
          <CarouselNext variant="secondary" className="absolute right-0 sm:right-4 top-1/2 -translate-y-1/2 z-10 hidden sm:flex">
            <ChevronRight className="h-5 w-5" />
            <span className="sr-only">Next slide</span>
          </CarouselNext>
        </Carousel>
      </div>
    </section>
  );
};

export default ProductRelatedCarousel;