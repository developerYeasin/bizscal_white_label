import React, { lazy, Suspense, useState } from "react";
import { useStore } from "@/context/StoreContext.jsx";
import { Skeleton } from "@/components/ui/skeleton";
import SophifyProductCard from "./product-cards/SophifyProductCard";
import ProductQuickViewModal from "./ProductQuickViewModal"; // Import the new quick view modal
import { useStorePath } from "@/hooks/use-store-path"; // Import useStorePath

const ProductCardDefault = lazy(() =>
  import("./product-cards/ProductCardDefault")
);
const ProductCardMinimal = lazy(() =>
  import("./product-cards/ProductCardMinimal")
);
const ProductCardOverlay = lazy(() =>
  import("./product-cards/ProductCardOverlay")
);
const ProductCardThemeOne = lazy(() =>
  import("./product-cards/ProductCardThemeOne")
);
const MultiViewProductCard = lazy(() =>
  import("./product-cards/MultiViewProductCard")
);

const cardMap = {
  default: ProductCardDefault,
  minimal: ProductCardMinimal,
  overlay: ProductCardOverlay,
  themeOne: ProductCardThemeOne,
  multiView: MultiViewProductCard,
  shophify: SophifyProductCard,
};

const ProductCardResolver = ({ product, componentCardStyle }) => {
  const { storeConfig } = useStore();
  const [isQuickViewModalOpen, setIsQuickViewModalOpen] = useState(false); // State for quick view modal
  const [selectedProductForQuickView, setSelectedProductForQuickView] =
    useState(null); // Product for quick view
  const getPath = useStorePath(); // Initialize useStorePath

  if (!storeConfig) {
    return <Skeleton className="h-[450px] w-full rounded-lg" />;
  }

  const showBuyNowButton = storeConfig.theme?.buyNowButtonEnabled === 1;

  // Determine style: product.cardType -> componentCardStyle -> layout config -> theme config -> 'default'

  const themeCardStyle = storeConfig.theme?.productCardStyle;

  const resolvedCardStyle =
    (product.cardType && cardMap[product.cardType] ? product.cardType : null) ||
    (componentCardStyle && cardMap[componentCardStyle]
      ? componentCardStyle
      : null) ||
    (themeCardStyle && cardMap[themeCardStyle] ? themeCardStyle : null) ||
    "default";

  // Button color only comes from the specific layout config
  const buttonColor = storeConfig.theme?.primaryColor;

  const buttonStyle = buttonColor
    ? { backgroundColor: buttonColor, borderColor: buttonColor }
    : undefined;

  const CardComponent = cardMap[resolvedCardStyle] || ProductCardDefault;

  const handleOpenQuickViewModal = (e, prod) => {
    e.preventDefault(); // Prevent default link navigation
    setSelectedProductForQuickView(prod);
    setIsQuickViewModalOpen(true);
  };

  const handleCloseQuickViewModal = () => {
    setIsQuickViewModalOpen(false);
    setSelectedProductForQuickView(null);
  };
  // console.log("resolvedCardStyle >>", resolvedCardStyle);
  // console.log("storeConfig >>", storeConfig);
  // SophifyProductCard does not get the buy now button
  const shouldShowBuyNowOnCard =
    showBuyNowButton && resolvedCardStyle !== "shophify";

  return (
    <>
      <Suspense fallback={<Skeleton className="h-[450px] w-full rounded-lg" />}>
        <CardComponent
          product={product}
          buttonStyle={buttonStyle}
          showBuyNowButton={shouldShowBuyNowOnCard}
          onQuickViewClick={handleOpenQuickViewModal} // Pass the new handler
          getPath={getPath} // Pass getPath to product card components
        />
      </Suspense>
      {isQuickViewModalOpen && selectedProductForQuickView && (
        <ProductQuickViewModal
          product={selectedProductForQuickView}
          isOpen={isQuickViewModalOpen}
          onClose={handleCloseQuickViewModal}
        />
      )}
    </>
  );
};

export default ProductCardResolver;
