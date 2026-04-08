"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAllProductsAndSearch } from "@/lib/api.js";
import ProductCardResolver from "./ProductCardResolver.jsx";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

const AllProductsSection = ({ className, productCardStyle }) => {
  const { t } = useTranslation();

  const {
    data: products,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["allProducts"], // Removed searchTerm from queryKey
    queryFn: () => fetchAllProductsAndSearch({}), // Fetch all products without a search term
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return (
    <section className={cn("py-8 md:py-12 bg-background", className)}>
      <div className="container mx-auto px-1 sm:px-6">
        <h2
          className="text-2xl md:text-3xl font-bold text-center mb-8"
          style={{
            color: `var(--dynamic-primary-color)`,
            fontFamily: `var(--dynamic-heading-font)`,
          }}
        >
          {t('all_products')}
        </h2>

        {isLoading && !products ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <Skeleton key={index} className="h-[450px] w-full rounded-lg" />
            ))}
          </div>
        ) : error ? (
          <p className="text-center text-destructive">
            {t('error_loading_products')}
          </p>
        ) : products && products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-6">
            {products.map((product) => (
              <ProductCardResolver
                key={product.id}
                product={product}
                componentCardStyle={productCardStyle}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">
            {t('no_products_found')} {/* Generic message */}
          </p>
        )}
      </div>
    </section>
  );
};

export default AllProductsSection;