import React, { Suspense, lazy, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchProductLandingPageById } from "@/lib/api.js";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useStore } from "@/context/StoreContext.jsx"; // Corrected import path
import { Skeleton } from "@/components/ui/skeleton";
import ProductLandingPageBuyForm from "@/components/ProductLandingPageBuyForm";
import CashOnDeliveryPopup from "@/components/CashOnDeliveryPopup";
import { useTranslation } from "react-i18next"; // Import useTranslation
import { useEffect } from "react";
import { useCart } from "@/context/CartContext"; // Import useCart
import { showSuccess } from "@/utils/toast"; // Import showSuccess

// Arcadia Static Design Components (previously implemented)
const ProductHeroSectionOne = lazy(() =>
  import("@/components/ProductLandingPage/ProductHeroSectionOne")
);
const ProductBrandLogos = lazy(() =>
  import("@/components/ProductLandingPage/ProductBrandLogos")
);
const ProductShowcaseSection = lazy(() =>
  import("@/components/ProductLandingPage/ProductShowcaseSection")
);
const ProductFeatureBlocksOne = lazy(() =>
  import("@/components/ProductLandingPage/ProductFeatureBlocksOne")
);
const CustomerTestimonialsOne = lazy(() =>
  import("@/components/ProductLandingPage/CustomerTestimonialsOne")
);
const NewsletterSectionOne = lazy(() =>
  import("@/components/ProductLandingPage/NewsletterSectionOne")
);
// Changed to regular import
import MinimalProductLandingPageFooter from "@/components/ProductLandingPage/MinimalProductLandingPageFooter";
import SimpleDetailsProductPage from "./SimpleDetailsProductPage";

// Nirvana Static Design Components (newly implemented)
const NirvanaHeroSection = lazy(() =>
  import("@/components/ProductLandingPage/NirvanaHeroSection")
);
const NirvanaWhyChooseUs = lazy(() =>
  import("@/components/ProductLandingPage/NirvanaWhyChooseUs")
);
const NirvanaAboutUs = lazy(() =>
  import("@/components/ProductLandingPage/NirvanaAboutUs")
);
const NirvanaProductShowcase = lazy(() =>
  import("@/components/ProductLandingPage/NirvanaProductShowcase")
);
const NirvanaWhyWeAreBest = lazy(() =>
  import("@/components/ProductLandingPage/NirvanaWhyWeAreBest")
);
const NirvanaTestimonials = lazy(() =>
  import("@/components/ProductLandingPage/NirvanaTestimonials")
);
const NirvanaNewsletter = lazy(() =>
  import("@/components/ProductLandingPage/NirvanaNewsletter")
);
// Changed to regular import
import NirvanaMinimalFooter from "@/components/ProductLandingPage/NirvanaMinimalFooter";

const ComponentResolver = lazy(() =>
  import("@/components/ComponentResolver.jsx")
);

const ProductLandingPage = () => {
  const { t } = useTranslation(); // Initialize useTranslation
  const { id } = useParams();
  const {
    storeConfig: globalStoreConfig,
    isLoading: isGlobalStoreLoading,
    error: globalStoreError,
  } = useStore();
  const { addToCart } = useCart(); // Initialize useCart
  const [isCashOnDeliveryPopupOpen, setIsCashOnDeliveryPopupOpen] =
    useState(false);
  const [selectedVariantsForPopup, setSelectedVariantsForPopup] = useState([]); // New state for variants

  // New state for live preview config
  const [liveLandingPagePreviewConfig, setLiveLandingPagePreviewConfig] = useState(null);

  useEffect(() => {
    const handleLandingPagePreviewMessage = (event) => {
      // IMPORTANT: Always check the origin for security
      if (event.origin !== "http://localhost:8080" && event.origin !== "https://merchant.bizscal.com") {
        return;
      }

      const { type, payload } = event.data;
      // console.log("LIVE_LANDING_PAGE_PREVIEW_UPDATE received:", payload.config);
      if (type === "LIVE_LANDING_PAGE_PREVIEW_UPDATE") {
        setLiveLandingPagePreviewConfig(payload.config);
      }
    };

    window.addEventListener("message", handleLandingPagePreviewMessage);
    return () => window.removeEventListener("message", handleLandingPagePreviewMessage);
  }, []);


  const {
    data: fetchedLandingPageData,
    isLoading: isFetchingLandingPage,
    error: fetchLandingPageError,
  } = useQuery({
    queryKey: ["productLandingPage", id],
    queryFn: () => fetchProductLandingPageById(id),
    enabled: !!id, // Corrected: Query should always run if not in live preview mode
    staleTime: 1000 * 60 * 5,
  });

  // Determine the actual landing page data to use: livePreviewConfig takes precedence
  const landingPageData = liveLandingPagePreviewConfig || fetchedLandingPageData;
  const isLandingPageLoading = isFetchingLandingPage || (liveLandingPagePreviewConfig && !landingPageData);
  const landingPageError = fetchLandingPageError;


  if (isLandingPageLoading || isGlobalStoreLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
        <p className="text-lg text-gray-500">
          {t("loading_product_landing_page")}
        </p>
      </div>
    );
  }

  if (landingPageError || !landingPageData) {
    console.error("Error loading product landing page:", landingPageError);
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-100 dark:bg-red-900 p-4">
        <p className="text-lg text-red-600">
          {t("product_landing_page_not_found")}
        </p>
      </div>
    );
  }

  const {
    pageTitle,
    pageDescription,
    headerEnable,
    footerEnable,
    components,
    product,
    storeName,
    storeLogoUrl,
    template, // Access template information
    next_single_product_id, // Extract next product ID
    previous_single_product_id, // Extract previous product ID
  } = landingPageData;

  // Debugging logs for ProductLandingPage
  // console.log("ProductLandingPage: next_single_product_id:", next_single_product_id, " (type:", typeof next_single_product_id, ")");
  // console.log("ProductLandingPage: previous_single_product_id:", previous_single_product_id, " (type:", typeof previous_single_product_id, ")");


  const templateName = template?.name; // Get the template name

  const headerStoreName =
    storeName || globalStoreConfig?.storeConfiguration?.storeName;
  const headerLogoUrl =
    storeLogoUrl || globalStoreConfig?.storeConfiguration?.logoUrl;
  const themeId = globalStoreConfig?.storeConfiguration?.themeId;
  const layout = globalStoreConfig?.layout;

  const handleOpenCashOnDeliveryPopup = (e, variants = []) => {
    if (product) {
      addToCart(product, 1, variants); // Add the product to the cart with quantity 1 and variants
      showSuccess(`${product.name} ${t("added_to_cart")}!`);
      setSelectedVariantsForPopup(variants); // Store variants for the popup
    }
    setIsCashOnDeliveryPopupOpen(true);
  };

  const handleCloseCashOnDeliveryPopup = () => {
    setIsCashOnDeliveryPopupOpen(false);
    setSelectedVariantsForPopup([]); // Clear variants on close
  };

  // Determine which template component to render
  let templateComponentType = null;
  if (templateName === "Nirvana Template") {
    templateComponentType = "nirvanaTemplate";
  } else if (templateName === "Arcadia Template") {
    templateComponentType = "arcadiaTemplate";
  }
// console.log("landingPageData >> ", landingPageData);
// console.log("selectedVariantsForPopup >> ", selectedVariantsForPopup);

  return (
    <div className="min-h-screen flex flex-col">
      
      {headerEnable && layout && (
        <Header
          layout={layout}
          storeName={headerStoreName}
          logoUrl={headerLogoUrl}
          themeId={themeId}
        />
      )}

      <main className="flex-grow">
        <Suspense
          fallback={
            <div className="min-h-[50vh] flex items-center justify-center">
              <p className="text-lg text-gray-500">{t("loading_content")}</p>
            </div>
          }
        >
          {components && components.length > 0 ? (
            // Render dynamic components if available
            components.map((component, index) => (
              <ComponentResolver
                key={index}
                type={component.type}
                data={component.data}
                product={product} // Pass product to dynamic components
                onBuyNowClick={handleOpenCashOnDeliveryPopup} // Pass handler to dynamic components
                nextProductId={next_single_product_id} // Pass next product ID
                prevProductId={previous_single_product_id} // Pass previous product ID
              />
            ))
          ) : templateComponentType ? (
            // Render static template components via ComponentResolver
            <ComponentResolver
              type={templateComponentType}
              product={product}
              onBuyNowClick={handleOpenCashOnDeliveryPopup}
              nextProductId={next_single_product_id} // Pass next product ID
              prevProductId={previous_single_product_id} // Pass previous product ID
            />
          ) : (
            // Fallback if no dynamic components and no recognized templateName
            <div className="container mx-auto px-4 py-8 text-center">
              <p className="text-lg text-muted-foreground">
                {t("no_content_configured_landing_page")}
              </p>
            </div>
          )}

          {/* Inline Buy Now Form - always at the bottom before the footer */}

          {/* <section className="py-8 md:py-12 bg-muted">
              <div className="container mx-auto px-4 sm:px-6">
                <ProductLandingPageBuyForm product={product} />
              </div>
            </section> */} 
        </Suspense>
      </main>

      {footerEnable &&
        (templateName === "Nirvana Template" ? (
          <NirvanaMinimalFooter
            storeName={headerStoreName}
            logoUrl={headerLogoUrl}
          />
        ) : (
          <MinimalProductLandingPageFooter
            storeName={headerStoreName}
            logoUrl={headerLogoUrl}
          />
        ))}

      {/* Cash On Delivery Popup */}
      {product && (
        <CashOnDeliveryPopup
          isOpen={isCashOnDeliveryPopupOpen}
          onClose={handleCloseCashOnDeliveryPopup}
          initialProduct={product}
          initialQuantity={1} // Pass initial quantity as 1
          initialSelectedVariants={selectedVariantsForPopup} // Pass selected variants
        />
      )}
    </div>
  );
};

export default ProductLandingPage;