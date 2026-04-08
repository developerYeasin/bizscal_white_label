"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "@/lib/api.js";
import ProductCardResolver from "@/components/ProductCardResolver.jsx";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useStore } from "@/context/StoreContext.jsx";
import FilterSidebar from "@/components/FilterSidebar";
import { PRICE_RANGE_DEFAULTS } from "@/data/filterOptions";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "react-i18next"; // Import useTranslation
import { Link } from "react-router-dom"; // Import Link for "View All Products"
import ThemedButton from "@/components/ThemedButton"; // Import ThemedButton
import { useStorePath } from "@/hooks/use-store-path"; // Import useStorePath

const Collection = () => {
  const { t } = useTranslation(); // Initialize useTranslation
  const { collectionId = "all" } = useParams();
  const { storeConfig, isLoading: isStoreLoading } = useStore();
  const getPath = useStorePath();

  const [activeFilters, setActiveFilters] = useState({
    categories: [],
    gender: "",
    priceRange: undefined, // Changed to undefined initially
    productTypes: [],
  });

  const productsQueryEnabled = !isStoreLoading;

  const {
    data: products,
    isLoading: areProductsLoading,
    error,
  } = useQuery({
    queryKey: ["products", collectionId, activeFilters],
    queryFn: () => fetchProducts({ collectionId, ...activeFilters, limit:999999999999999 }),
    enabled: productsQueryEnabled, // Only fetch products once the store config is loaded
  });

  useEffect(() => {
    // console.log(
    //   "Collection Page: isStoreLoading =",
    //   isStoreLoading,
    //   "productsQueryEnabled =",
    //   productsQueryEnabled,
    //   "areProductsLoading =",
    //   areProductsLoading,
    //   "products error =",
    //   error
    // );
  }, [isStoreLoading, productsQueryEnabled, areProductsLoading, error]);

  const handleFilterChange = useCallback((newFilters) => {
    setActiveFilters((currentFilters) => {
      if (JSON.stringify(currentFilters) === JSON.stringify(newFilters)) {
        return currentFilters;
      }
      return newFilters;
    });
  }, []);

  const getCollectionTitle = (id) => {
    if (!id || id === "all") return t("all_products");
    return t("collection_title", {
      collectionName: id
        .replace(/-/g, " ")
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" "),
    });
  };

  if (isStoreLoading) {
    return <div>Loading...</div>; // Or a more sophisticated loading skeleton for the whole page
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-100 dark:bg-red-900 p-4">
        <p className="text-lg text-red-600">{t("error_loading_collection")}</p>
      </div>
    );
  }
  return (
    <div className="min-h-screen flex flex-col">
      {storeConfig && (
        <Header
          layout={storeConfig.layout}
          storeName={storeConfig.storeConfiguration.storeName}
          logoUrl={storeConfig.storeConfiguration.logoUrl}
        />
      )}
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1
          className="text-3xl md:text-4xl font-bold text-center mb-8"
          style={{
            color: `var(--dynamic-primary-color)`,
            fontFamily: `var(--dynamic-heading-font)`,
          }}
        >
          {getCollectionTitle(collectionId)}
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <FilterSidebar
              onFilterChange={handleFilterChange}
              initialFilters={activeFilters}
            />
          </div>
          <div className="md:col-span-3">
            {areProductsLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, index) => (
                  <div key={index} className="flex flex-col space-y-3">
                    <Skeleton className="h-[450px] w-full rounded-lg" />
                  </div>
                ))}
              </div>
            ) : products?.length === 0 ? (
              <p className="text-center text-lg text-muted-foreground mt-10">
                {t("no_products_found_matching_filters")}
              </p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products?.map((product) => (
                  <ProductCardResolver key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      {storeConfig && (
        <Footer
          layout={storeConfig.layout.footer}
          copyrightText={storeConfig.layout.footer.copyrightText}
          socialLinks={storeConfig.layout.footer.socialLinks}
          logoUrl={storeConfig.storeConfiguration.logoUrl}
          storeName={storeConfig.storeConfiguration.storeName}
        />
      )}
    </div>
  );
};

export default Collection;