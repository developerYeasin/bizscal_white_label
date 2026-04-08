import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import ThemedButton from "@/components/ThemedButton";
import { useCart } from "@/context/CartContext";
import { showSuccess } from "@/utils/toast";
import CountdownTimer from "@/components/CountdownTimer"; // Import CountdownTimer
import { useStorePath } from "@/hooks/use-store-path"; // Import useStorePath
import { cn, formatPrice } from "@/lib/utils"; // Import cn for conditional classnames, formatPrice
import { useTranslation } from "react-i18next";
import { useStore } from "@/context/StoreContext"; // Import useStore

const SophifyProductCard = ({ product, buttonStyle, onQuickViewClick }) => {
  // Added onQuickViewClick prop
  const { t } = useTranslation(); // Initialize useTranslation
  const { addToCart } = useCart();
  const getPath = useStorePath(); // Initialize useStorePath
  const { currentCurrency, currencyConversionRate } = useStore(); // Use currency context

  const hasOptions =
    (product.sizes && product.sizes.length > 0) ||
    (product.colors && product.colors.length > 0);

  const handleBuyNowClick = (e) => {
    e.preventDefault(); // Prevent default link navigation
    if (product.isStockOut) return; // Prevent action if out of stock
    onQuickViewClick(e, product); // Open quick view for selecting options or direct buy
  };

  const hasHoverImage = !!product.hoverImageUrl;
  const hasSalePrice = product.salePrice && product.salePrice < product.price;


  return (
    <Card className="group relative w-full rounded-none overflow-hidden shadow-none border-none  transition-shadow hover:shadow-[0px_5px_14px_0px_#11111130] bg-transparent h-[250px] flex flex-col text-center">
      <Link
        to={getPath(`/products/${product.id}`)}
        className="block relative overflow-hidden flex-grow"
      >
        <div className="relative w-full h-full">
          <img
            src={product.imageUrl}
            alt={product.name}
            className={cn(
              "w-full h-full object-cover transition-opacity duration-500 ease-in-out",
              hasHoverImage
                ? "opacity-100 group-hover:opacity-0"
                : "group-hover:scale-105 transition-transform duration-300"
            )}
          />
          {hasHoverImage && (
            <img
              src={product.hoverImageUrl}
              alt={`${product.name} hover`}
              className="w-full h-full object-cover absolute top-0 left-0 transition-opacity duration-500 ease-in-out opacity-0 group-hover:opacity-100"
            />
          )}
          {product.offerCountDown && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-100 group-hover:opacity-0 transition-opacity duration-300">
              <CountdownTimer targetDate={product.offerCountDown} />
            </div>
          )}
          {product.isStockOut && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-xl font-bold uppercase z-20">
              {t('out_of_stock')}
            </div>
          )}
        </div>
      </Link>
      <CardContent className="flex-shrink-0 p-0 ">
        <Link
          to={getPath(`/products/${product.id}`)}
          className="flex bg-white flex-shrink-0 w-full h-full flex-col justify-start  "
        >
          <h3
            className=" text-start px-2 mt-2 text-md font-medium text-foreground hover:text-dynamic-primary-color transition-colors line-clamp-2"
            style={{ fontFamily: `var(--dynamic-heading-font)` }}
          >
            {product.name}
          </h3>
          <div className="flex items-baseline justify-start px-2 space-x-2 mb-2">
            {hasSalePrice && (
              <p className="text-sm text-muted-foreground line-through">
                {formatPrice(product.regularPrice, currentCurrency, currencyConversionRate)}
              </p>
            )}
            <p className="text-lg font-semibold text-muted-foreground">
              {formatPrice(product.price, currentCurrency, currencyConversionRate)}
            </p>
          </div>
        </Link>
      </CardContent>
    </Card>
  );
};

export default SophifyProductCard;