"use client";

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchAllProductsAndSearch } from "@/lib/api"; // Use fetchAllProductsAndSearch
import { useDebounce } from "@/hooks/use-debounce";
import CustomModal from "./CustomModal"; // NEW IMPORT
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2, X } from "lucide-react"; // Added X for close button
import { Skeleton } from "@/components/ui/skeleton";
import { cn, formatPrice } from "@/lib/utils"; // Import formatPrice
import { useTranslation } from "react-i18next";
import { useStorePath } from "@/hooks/use-store-path";
import { useStore } from "@/context/StoreContext"; // Import useStore

const SearchModal = ({ isOpen, onClose }) => {
  const { t } = useTranslation(); // Initialize useTranslation
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500); // Debounce for 500ms
  const navigate = useNavigate();
  const getPath = useStorePath();
  const { currentCurrency, currencyConversionRate } = useStore(); // Use currency context

  const {
    data: searchResults,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["searchProducts", debouncedSearchTerm],
    queryFn: () => fetchAllProductsAndSearch({ title: debouncedSearchTerm }), // Pass searchTerm as 'title'
    enabled: !!debouncedSearchTerm && debouncedSearchTerm.length > 2, // Only fetch if debounced term exists and is long enough
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onClose();
      // Navigate to the collections page with the search term
      navigate(
        getPath(
          `/collections/all?search=${encodeURIComponent(searchTerm.trim())}`
        )
      );
    }
  };

  const handleProductClick = () => {
    onClose(); // Close modal when a product link is clicked
  };

  return (
    <CustomModal isOpen={isOpen} onClose={onClose} className=" sm:w-[50%] max-w-[95%] max-h-[95%] rounded-none">
      <div className="flex items-center justify-between border-b pb-4 mb-4 px-6 pr-10 pt-6">
        <form onSubmit={handleSearchSubmit} className="flex-grow flex items-center">
          <Input
            type="text"
            placeholder={t("enter_keyword")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow border-none focus-visible:ring-0 focus-visible:ring-offset-0 text-lg h-12"
            autoFocus
          />
          <Button
            type="submit"
            variant="ghost"
            size="icon"
            className="h-12 w-12"
          >
            <Search className="h-6 w-6" />
            <span className="sr-only">{t("search")}</span>
          </Button>
        </form>
        {/* Removed the explicit close button here, CustomModal provides one */}
      </div>
      <div className="flex-grow overflow-y-auto px-6"> {/* Removed -mx-2 */}
        {searchTerm.length > 2 ? (
          <>
            <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase px-2">
              {t("products_from_product")}
            </h3>
            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center space-x-4 p-2">
                    <Skeleton className="h-16 w-16 rounded-md" />
                    <div className="flex-grow space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                      <Skeleton className="h-4 w-1/4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <p className="text-destructive text-center p-2">
                {t("error_loading_search_results")}
              </p>
            ) : searchResults && searchResults.length > 0 ? (
              <ul className="space-y-2">
                {searchResults.map((product) => (
                  <li key={product.id}>
                    <Link
                      to={getPath(`/products/${product.id}`)}
                      onClick={handleProductClick}
                      className="flex items-center space-x-4 p-2 hover:bg-accent rounded-md transition-colors"
                    >
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="h-16 w-16 object-cover rounded-md flex-shrink-0"
                      />
                      <div className="flex-grow">
                        <p
                          className="font-medium text-foreground hover:text-dynamic-primary-color"
                          style={{
                            fontFamily: `var(--dynamic-heading-font)`,
                          }}
                        >
                          {product.name}
                        </p>
                        {product.sku && (
                          <p className="text-xs text-muted-foreground">
                            SKU: {product.sku}
                          </p>
                        )}
                        <p className="text-sm font-semibold text-dynamic-primary-color">
                          {formatPrice(product.price, currentCurrency, currencyConversionRate)}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p
                className="text-muted-foreground text-center py-8 px-2"
                dangerouslySetInnerHTML={{
                  __html: t("no_products_for_search", {
                    searchTerm: searchTerm,
                  }),
                }}
              ></p>
            )}
            {searchResults && searchResults.length > 0 && (
              <div className="mt-6 text-center px-2">
                <Link
                  to={getPath(
                    `/collections/all?search=${encodeURIComponent(
                      searchTerm.trim()
                    )}`
                  )}
                  onClick={handleProductClick}
                  className="text-dynamic-primary-color hover:underline font-medium"
                >
                  {t("view_all_product_results")}
                </Link>
              </div>
            )}
          </>
        ) : (
          <p className="text-muted-foreground text-center py-8 px-2">
            {t("start_typing_to_search")}
          </p>
        )}
      </div>
    </CustomModal>
  );
};

export default SearchModal;