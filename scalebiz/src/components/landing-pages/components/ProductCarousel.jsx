"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/utils/api.js";
import ProductCard from "@/components/storefront/ProductCard.jsx";
import { Skeleton } from "@/components/ui/skeleton.jsx";
import { Card, CardContent } from "@/components/ui/card.jsx";
import { cn } from "@/lib/utils.js";

const ProductCarousel = ({ data, className, storeConfig }) => {
  const { title, product_ids, category_id, limit = 4 } = data;

  // Determine if we are in admin preview (storeConfig present) or storefront
  const isAdminPreview = !!storeConfig;

  const shouldFetch = true; // always fetch if component rendered

  const { data: products, isLoading, error } = useQuery({
    queryKey: isAdminPreview
      ? ["adminProducts", product_ids, category_id, limit, title]
      : ["storeProducts", product_ids, category_id, limit, title],
    queryFn: async () => {
      const params = { limit };

      if (isAdminPreview) {
        // Admin endpoint for store owner's products
        // It uses title for search, category_ids, gender, price range
        if (category_id) {
          params.category_ids = category_id;
        }
        if (title) {
          params.title = title;
        }
        // Note: product_ids filtering will be done client-side after fetch
        const response = await api.get("/owner/products", { params });
        let products = response.data.data.products || [];

        // If specific product_ids are requested, filter on client
        if (product_ids?.length > 0) {
          products = products.filter((p) => product_ids.includes(p.id));
        }

        // If still empty and we have product_ids, try to fetch those products individually? For now, just return what we have.
        return products;
      } else {
        // Storefront public endpoint
        if (product_ids?.length > 0) {
          params.ids = product_ids.join(",");
        } else if (category_id) {
          params.category_id = category_id;
        }
        // map sort if needed? title might be a query
        const response = await api.get("/products", { params });
        return response.data.data.products || [];
      }
    },
    enabled: shouldFetch,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  if (!title && !products?.length) {
    return null;
  }

  return (
    <section className={cn("py-8 md:py-12 bg-background", className)}>
      <div className="container mx-auto px-4 sm:px-6">
        {title && (
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8" style={{ color: `var(--dynamic-primary-color)`, fontFamily: `var(--dynamic-heading-font)` }}>
            {title}
          </h2>
        )}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: limit }).map((_, index) => (
              <Card key={index} className="rounded-lg overflow-hidden shadow-md">
                <Skeleton className="w-full h-48 rounded-t-lg" />
                <CardContent className="p-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : products && products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-8">
            No products to display. Add products to your store.
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductCarousel;
