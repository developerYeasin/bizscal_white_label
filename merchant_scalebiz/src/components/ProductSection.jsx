"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "@/lib/api.js";
import ProductCardResolver from "./ProductCardResolver.jsx";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Carousel,
  CarouselContent,
  CarouselItem, // Added CarouselItem
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom"; // Import Link
import ThemedButton from "./ThemedButton"; // Import ThemedButton
import { useTranslation } from "react-i18next"; // Import useTranslation
import { useStorePath } from "@/hooks/use-store-path"; // Import useStorePath

const ProductSection = ({ data, className, productCardStyle }) => {
  const { t } = useTranslation(); // Initialize useTranslation
  // Added productCardStyle prop
  const {
    title,
    tabs,
    query,
    displayStyle = "carousel",
    productsPerView = 4,
    gridCols = 4,
    showViewMoreButton = false, // New prop
  } = data;
  const [activeTab, setActiveTab] = React.useState(
    // Use React.useState for consistency
    tabs && tabs.length > 0 ? tabs[0].label : "default"
  );
  const getPath = useStorePath(); // Initialize useStorePath

  const currentQuery = tabs
    ? tabs.find((tab) => tab.label === activeTab)?.query
    : query;

  const {
    data: products,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["products", title, activeTab, currentQuery],
    queryFn: () => fetchProducts(currentQuery || {}),
    enabled: !!currentQuery,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const autoplayPlugin = React.useRef(
    Autoplay({
      delay: 3000,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
    })
  );

  if (!title && (!tabs || tabs.length === 0) && !query) {
    return null;
  }

  const renderProductCards = (prods) =>
    prods.map((product) => (
      <ProductCardResolver
        key={product.id}
        product={product}
        componentCardStyle={productCardStyle}
      /> // Pass componentCardStyle
    ));

  const renderLoadingSkeletons = (count) =>
    Array.from({ length: count }).map((_, index) => (
      <Skeleton key={index} className="h-[450px] w-full rounded-lg" />
    ));

  return (
    <section className={cn("py-8 md:py-0 px-0 lg:px-6 bg-background", className)}>
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
            <div className="w-full flex items-center justify-center ">
              <TabsList className=" py-0 sm:w-[50%] w-full justify-center gap-2 mb-8">
                {tabs.map((tab) => (
                  <TabsTrigger
                    key={tab.label}
                    value={tab.label}
                    className="text-base font-medium "
                  >
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
            <TabsContent value={activeTab}>
              {" "}
              {/* Changed to activeTab to ensure content renders for the current tab */}
              {isLoading ? (
                <div
                  className={`grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-${gridCols} gap-6`}
                >
                  {renderLoadingSkeletons(gridCols)}
                </div>
              ) : error ? (
                <p className="text-center text-destructive">
                  {t('error_loading_products_for', { tab: activeTab })}
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
                          className="pl-4 shrink-0 basis-1/2 sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
                        >
                          <div className="p-1">
                            <ProductCardResolver
                              product={product}
                              componentCardStyle={productCardStyle}
                            />{" "}
                            {/* Pass componentCardStyle */}
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious
                      variant="secondary"
                      className="absolute left-0 sm:left-4 top-1/2 -translate-y-1/2 z-10 hidden sm:flex"
                    >
                      <ChevronLeft className="h-5 w-5" />
                      <span className="sr-only">{t('previous_slide')}</span>
                    </CarouselPrevious>
                    <CarouselNext
                      variant="secondary"
                      className="absolute right-0 sm:right-4 top-1/2 -translate-y-1/2 z-10 hidden sm:flex"
                    >
                      <ChevronRight className="h-5 w-5" />
                      <span className="sr-only">{t('next_slide')}</span>
                    </CarouselNext>
                  </Carousel>
                ) : (
                  // grid style
                  <div
                    className={`grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-${gridCols} gap-6`}
                  >
                    {renderProductCards(products)}
                  </div>
                )
              ) : (
                <p className="text-center text-muted-foreground">
                  {t('no_products_found_for', { tab: activeTab })}
                </p>
              )}
            </TabsContent>
          </Tabs>
        ) : (
          // No tabs, just a single product display
          isLoading ? (
            <div
              className={`grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-${gridCols} gap-6`}
            >
              {renderLoadingSkeletons(gridCols)}
            </div>
          ) : error ? (
            <p className="text-center text-destructive">
              {t('error_loading_products')}
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
                      className="pl-4 shrink-0 basis-1/2 sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
                    >
                      <div className="p-1">
                        <ProductCardResolver
                          product={product}
                          componentCardStyle={productCardStyle}
                        />{" "}
                        {/* Pass componentCardStyle */}
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious
                  variant="secondary"
                  className="absolute left-0 sm:left-4 top-1/2 -translate-y-1/2 z-10 hidden sm:flex"
                >
                  <ChevronLeft className="h-5 w-5" />
                  <span className="sr-only">{t('previous_slide')}</span>
                </CarouselPrevious>
                <CarouselNext
                  variant="secondary"
                  className="absolute right-0 sm:right-4 top-1/2 -translate-y-1/2 z-10 hidden sm:flex"
                >
                  <ChevronRight className="h-5 w-5" />
                  <span className="sr-only">{t('next_slide')}</span>
                </CarouselNext>
              </Carousel>
            ) : (
              // grid style
              <>
                <div
                  className={`grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-${gridCols} gap-6`}
                >
                  {renderProductCards(products)}
                </div>
                {showViewMoreButton && (
                  <div className="text-center mt-10">
                    <Link to={getPath("/collections/all")}>
                      <ThemedButton>{t('view_all_products')}</ThemedButton>
                    </Link>
                  </div>
                )}
              </>
            )
          ) : (
            <p className="text-center text-muted-foreground">
              {t('no_products_found')}
            </p>
          )
        )}
      </div>
    </section>
  );
};

export default ProductSection;