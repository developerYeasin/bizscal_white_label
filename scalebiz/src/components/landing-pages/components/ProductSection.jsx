"use client";

import React, { useState } from "react";
import { useStoreProducts } from "@/hooks/use-store-products.js";
import ProductCard from "@/components/storefront/ProductCard.jsx";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils.js";

const ProductSection = ({ data, className, storeConfig }) => {
  const {
    title,
    tabs,
    query,
    displayStyle = "carousel",
    gridCols = 4,
  } = data;

  const [activeTab, setActiveTab] = useState(
    tabs && tabs.length > 0 ? tabs[0].label : "default"
  );

  // Determine query parameters based on active tab
  const getQueryParams = () => {
    const currentTab = tabs?.find((tab) => tab.label === activeTab);
    const q = currentTab?.query || query || {};

    // Convert to API params
    const params = { limit: gridCols * 2 }; // fetch enough for carousel

    if (q.collectionId) {
      if (q.collectionId === "featured") {
        // For featured, we can either fetch all and slice, or have a flag
        // For now, we'll just fetch latest
        params.sort = "newest";
      } else if (q.collectionId === "best-sellers") {
        // Could sort by sales? For now, use price desc as proxy
        params.sort = "price-desc";
      } else if (typeof q.collectionId === "number") {
        params.category_id = q.collectionId;
      }
    } else if (q.categoryId) {
      params.category_id = q.categoryId;
    } else if (q.search) {
      params.search = q.search;
    } else {
      // Default: latest products
      params.sort = "newest";
    }

    return params;
  };

  const queryParams = getQueryParams();

  const {
    products,
    isLoading,
    error,
  } = useStoreProducts({
    ...queryParams,
    limit: gridCols * 2,
    enabled: !!title, // only fetch if section has title
  });

  const autoplayPlugin = React.useRef(
    Autoplay({
      delay: 3000,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
    })
  );

  if (!title) {
    return null;
  }

  const renderProductCards = (prods) =>
    prods.map((product) => (
      <ProductCard key={product.id} product={product} />
    ));

  const renderLoadingSkeletons = (count) =>
    Array.from({ length: count }).map((_, index) => (
      <Skeleton key={index} className="h-[400px] w-full rounded-lg" />
    ));

  return (
    <section className={cn("py-8 md:py-12 bg-background", className)}>
      <div className="container mx-auto px-4 sm:px-6">
        <h2
          className="text-2xl md:text-3xl font-bold text-center mb-8"
          style={{
            color: `var(--dynamic-primary-color)`,
            fontFamily: `var(--dynamic-heading-font)`,
          }}
        >
          {title}
        </h2>

        {tabs && tabs.length > 0 ? (
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <div className="w-full flex items-center justify-center">
              <TabsList className="py-0 sm:w-[50%] w-full justify-center gap-2 mb-8">
                {tabs.map((tab) => (
                  <TabsTrigger
                    key={tab.label}
                    value={tab.label}
                    className="text-base font-medium"
                  >
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
            <TabsContent key={activeTab} value={activeTab}>
              {isLoading ? (
                <div
                  className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-${gridCols} gap-6`}
                >
                  {renderLoadingSkeletons(gridCols)}
                </div>
              ) : error ? (
                <p className="text-center text-destructive">
                  Error loading products for {activeTab}.
                </p>
              ) : products && products.length > 0 ? (
                displayStyle === "carousel" ? (
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
                        <CarouselItem
                          key={index}
                          className="pl-4 shrink-0 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
                        >
                          <div className="p-1">
                            <ProductCard product={product} />
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious
                      variant="secondary"
                      className="absolute left-0 sm:left-4 top-1/2 -translate-y-1/2 z-10 hidden sm:flex"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </CarouselPrevious>
                    <CarouselNext
                      variant="secondary"
                      className="absolute right-0 sm:right-4 top-1/2 -translate-y-1/2 z-10 hidden sm:flex"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </CarouselNext>
                  </Carousel>
                ) : (
                  <div
                    className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-${gridCols} gap-6`}
                  >
                    {renderProductCards(products)}
                  </div>
                )
              ) : (
                <p className="text-center text-muted-foreground">
                  No products found for {activeTab}.
                </p>
              )}
            </TabsContent>
          </Tabs>
        ) : (
          // No tabs
          isLoading ? (
            <div
              className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-${gridCols} gap-6`}
            >
              {renderLoadingSkeletons(gridCols)}
            </div>
          ) : error ? (
            <p className="text-center text-destructive">Error loading products.</p>
          ) : products && products.length > 0 ? (
            displayStyle === "carousel" ? (
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
                    <CarouselItem
                      key={index}
                      className="pl-4 shrink-0 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
                    >
                      <div className="p-1">
                        <ProductCard product={product} />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious
                  variant="secondary"
                  className="absolute left-0 sm:left-4 top-1/2 -translate-y-1/2 z-10 hidden sm:flex"
                >
                  <ChevronLeft className="h-5 w-5" />
                </CarouselPrevious>
                <CarouselNext
                  variant="secondary"
                  className="absolute right-0 sm:right-4 top-1/2 -translate-y-1/2 z-10 hidden sm:flex"
                >
                  <ChevronRight className="h-5 w-5" />
                </CarouselNext>
              </Carousel>
            ) : (
              <div
                className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-${gridCols} gap-6`}
              >
                {renderProductCards(products)}
              </div>
            )
          ) : (
            <p className="text-center text-muted-foreground">No products found.</p>
          )
        )}
      </div>
    </section>
  );
};

export default ProductSection;
