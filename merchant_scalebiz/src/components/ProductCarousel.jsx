"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "@/lib/api";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"; // Added CarouselItem
import ProductCardResolver from "./ProductCardResolver";
import { Skeleton } from "@/components/ui/skeleton";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next"; // Import useTranslation
import { useStorePath } from "@/hooks/use-store-path"; // Import useStorePath

const ProductCarousel = ({ data, productCardStyle }) => { // Added productCardStyle prop
  const { t } = useTranslation(); // Initialize useTranslation
  const { title, query } = data;
  const collectionId = query?.collectionId;
  const getPath = useStorePath(); // Initialize useStorePath

  const { data: products, isLoading, error } = useQuery({
    queryKey: ['products', collectionId],
    queryFn: () => fetchProducts({ collectionId }),
    enabled: !!collectionId, // Only run query if collectionId exists
  });

  const autoplayPlugin = React.useRef(
    Autoplay({
      delay: 3000,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
    })
  );

  if (isLoading) {
    return (
      <section className="py-8 md:py-12 pb-16 md:pb-20 px-0 sm:px-6 bg-background">
        <div className="container mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8" style={{ color: `var(--dynamic-primary-color)`, fontFamily: `var(--dynamic-heading-font)` }}>
            {title}
          </h2>
          <div className="flex -ml-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="pl-4 shrink-0 basis-1/2 sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5">
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
    console.error(`Error fetching products for carousel "${title}":`, error);
    return null; // Don't render the component if there's an error
  }

  if (!products || products.length === 0) {
    return null; // Don't render if no products are found
  }

  return (
    <section className="py-8 md:py-12 pb-16 md:pb-20 px-4 sm:px-6 bg-background">
      <div className="container px-0 sm:px-4 mx-auto">
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
              <CarouselItem key={index} className="pl-4 shrink-0 basis-1/2 sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5">
                <div className="p-1">
                  <ProductCardResolver product={product} componentCardStyle={productCardStyle} /> {/* Pass componentCardStyle */}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious variant="secondary" className="absolute left-0 sm:left-4 top-1/2 -translate-y-1/2 z-10 hidden sm:flex">
            <ChevronLeft className="h-5 w-5" />
            <span className="sr-only">{t('previous_slide')}</span>
          </CarouselPrevious>
          <CarouselNext variant="secondary" className="absolute right-0 sm:right-4 top-1/2 -translate-y-1/2 z-10 hidden sm:flex">
            <ChevronRight className="h-5 w-5" />
            <span className="sr-only">{t('next_slide')}</span>
          </CarouselNext>
        </Carousel>
      </div>
    </section>
  );
};

export default ProductCarousel;