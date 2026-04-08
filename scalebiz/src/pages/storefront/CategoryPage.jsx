"use client";

import React from "react";
import { useParams, Navigate } from "react-router-dom";
import { useCategories } from "@/hooks/use-categories.js";
import { useStoreProducts } from "@/hooks/use-store-products.js";
import ProductCard from "@/components/storefront/ProductCard.jsx";
import { Skeleton } from "@/components/ui/skeleton.jsx";

const CategoryPage = () => {
  const { slug } = useParams();

  const { categories } = useCategories();
  const category = categories?.find((c) => c.slug === slug);

  const { products, isLoading, total, currentPage, totalPages, setPage } = useStoreProducts({
    category_id: category?.id,
    limit: 12,
    enabled: !!category,
  });

  if (!slug) {
    return <Navigate to="/" replace />;
  }

  if (!category && !isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Category Not Found</h1>
        <p className="text-muted-foreground">The category you're looking for doesn't exist.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Category Header */}
      <div className="mb-8">
        {isLoading ? (
          <Skeleton className="h-10 w-48 mb-2" />
        ) : (
          <h1 className="text-3xl font-bold" style={{ fontFamily: `var(--dynamic-heading-font)` }}>
            {category?.name || "Category"}
          </h1>
        )}
        {category?.description && (
          <p className="text-muted-foreground mt-2">{category.description}</p>
        )}
        <p className="text-sm text-muted-foreground mt-2">
          {total} product{total !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Products Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="border rounded-lg overflow-hidden">
              <Skeleton className="h-64 w-full" />
              <div className="p-4 space-y-2">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground">No products in this category yet.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-12">
              <Button
                variant="outline"
                onClick={() => setPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => setPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CategoryPage;
