"use client";

import React, { useEffect, useState } from "react"; // Import useState
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchProductById, fetchCategories } from "@/lib/api.js"; // Import fetchCategories
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useStore } from "@/context/StoreContext.jsx";
import ProductImageGallery from "@/components/product-detail/ProductImageGallery";
import ProductInfo from "@/components/product-detail/ProductInfo";
import ProductPolicyBlocks from "@/components/product-detail/ProductPolicyBlocks";
import ProductFeaturedSection from "@/components/product-detail/ProductFeaturedSection";
import ProductDescriptionTabs from "@/components/product-detail/ProductDescriptionTabs";
import ProductRelatedCarousel from "@/components/product-detail/ProductRelatedCarousel";
import RightColumnBanner from "@/components/product-detail/RightColumnBanner"; // NEW: Import RightColumnBanner
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"; // Assuming shadcn breadcrumb
import { useTranslation } from "react-i18next";
import { useStorePath } from "@/hooks/use-store-path";
import { getNumericPriceForGTM } from "@/lib/utils"; // Import for GTM

const ProductDetail = () => {
  const { t } = useTranslation(); // Initialize useTranslation
  const { productId } = useParams();
  const {
    storeConfig,
    isLoading: isStoreLoading,
    currentCurrency,
    currencyConversionRate,
  } = useStore(); // Get currency info
  // Product page theme settings
  const productPageConfig = storeConfig?.pages?.productPage || {};
  const layout = productPageConfig.layout || 'standard';
  const galleryPosition = productPageConfig.gallery_position || 'left';
  const enableZoom = productPageConfig.enable_zoom !== false;
  const sections = productPageConfig.sections || {};
  const relatedCount = productPageConfig.related_products_count || 8;
  const relatedStyle = productPageConfig.related_products_style || 'carousel';
  const getPath = useStorePath(); // Initialize useStorePath

  const productQueryEnabled = !!productId;

  const {
    data: product,
    isLoading: isProductLoading,
    error: productError,
  } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => fetchProductById(productId),
    enabled: productQueryEnabled,
  });

  // Fetch all categories to map slug to ID for related products
  const {
    data: categories,
    isLoading: isCategoriesLoading,
    error: categoriesError,
  } = useQuery({
    queryKey: ["allCategories"],
    queryFn: fetchCategories,
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  // State to manage the main image displayed in the gallery
  const [mainDisplayedImage, setMainDisplayedImage] = useState("");

  useEffect(() => {
    if (product && product.images && product.images.length > 0) {
      setMainDisplayedImage(product.images[0]);
    } else if (product && product.imageUrl) {
      setMainDisplayedImage(product.imageUrl);
    }
  }, [product]); // Update when product data changes

  // GTM: view_item event
  useEffect(() => {
    if (product && !isProductLoading && !productError && window.dataLayer) {
      const itemPrice = getNumericPriceForGTM(
        product.price,
        currentCurrency,
        currencyConversionRate
      );
      window.dataLayer.push({ ecommerce: null }); // Clear previous ecommerce object
      window.dataLayer.push({
        event: "view_item",
        ecommerce: {
          items: [
            {
              item_id: product.sku || product.id.toString(),
              item_name: product.name,
              currency: currentCurrency,
              price: itemPrice,
              item_category: product.category || "N/A",
              item_brand: product.brand || "N/A", // Assuming product might have a brand
            },
          ],
        },
      });
      // console.log("GTM: 'view_item' event pushed for product:", product.name);
    }
  }, [
    product,
    isProductLoading,
    productError,
    currentCurrency,
    currencyConversionRate,
  ]);

  useEffect(() => {
    // console.log(
    //   "ProductDetail Page: isStoreLoading =",
    //   isStoreLoading,
    //   "productQueryEnabled =",
    //   productQueryEnabled,
    //   "isProductLoading =",
    //   isProductLoading,
    //   "product error =",
    //   productError,
    //   "isCategoriesLoading =",
    //   isCategoriesLoading,
    //   "categories error =",
    //   categoriesError
    // );
  }, [
    isStoreLoading,
    productQueryEnabled,
    isProductLoading,
    productError,
    isCategoriesLoading,
    categoriesError,
  ]);

  if (isStoreLoading || isProductLoading || isCategoriesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
        <p className="text-lg text-gray-500">Loading product details...</p>
      </div>
    );
  }

  if (productError || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-100 dark:bg-red-900 p-4">
        <p className="text-lg text-red-600">
          Product not found or an error occurred.
        </p>
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
          themeId={storeConfig.storeConfiguration.themeId}
        />
      )}
      <main className="flex-grow container mx-auto px-4 sm:px-6 py-8 md:py-12">
        {/* Breadcrumbs */}
        <Breadcrumb className="mb-8">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to={getPath("/")}>{t("home")}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to={getPath(`/collections/${product.category || "all"}`)}>
                  {product.category
                    ? product.category.charAt(0).toUpperCase() +
                      product.category.slice(1)
                    : t("shop")}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{product.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Main Column */}
          <div className="lg:col-span-9">
            {isHorizontal ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                {galleryFirst && (
                  <div className={`lg:col-span-${layout === 'standard' ? 7 : 6}`}>
                    <ProductImageGallery
                      images={product.images}
                      mainImage={mainDisplayedImage}
                      setMainImage={setMainDisplayedImage}
                      enableZoom={enableZoom}
                    />
                  </div>
                )}
                <div className={`lg:col-span-${galleryFirst ? (layout === 'standard' ? 5 : 6) : (layout === 'standard' ? 5 : 6)}`}>
                  <ProductInfo
                    product={product}
                    setMainDisplayedImage={setMainDisplayedImage}
                  />
                </div>
                {!galleryFirst && (
                  <div className={`lg:col-span-${layout === 'standard' ? 7 : 6}`}>
                    <ProductImageGallery
                      images={product.images}
                      mainImage={mainDisplayedImage}
                      setMainImage={setMainDisplayedImage}
                      enableZoom={enableZoom}
                    />
                  </div>
                )}
              </div>
            ) : (
              <>
                <div className="mb-8">
                  <ProductImageGallery
                    images={product.images}
                    mainImage={mainDisplayedImage}
                    setMainImage={setMainDisplayedImage}
                    enableZoom={enableZoom}
                  />
                </div>
                <div>
                  <ProductInfo
                    product={product}
                    setMainDisplayedImage={setMainDisplayedImage}
                  />
                </div>
              </>
            )}

            {/* Description Tabs */}
            {sections.description && (
              <div className="mt-12">
                <ProductDescriptionTabs product={product} />
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          {sections.trustBadges && (
            <div className="lg:col-span-3 space-y-8">
              <ProductPolicyBlocks faqs={product.faqs} />
              <RightColumnBanner bannerData={product.right_col_banner} />
              <ProductFeaturedSection collectionId="featured" />
            </div>
          )}
        </div>

        {/* Related Products */}
        {sections.related && (
          <div className="mt-12">
            <ProductRelatedCarousel categoryId={product.categoryIds} />
          </div>
        )}
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

export default ProductDetail;