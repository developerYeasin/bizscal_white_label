"use client";

import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import ThemedButton from "@/components/ThemedButton";
import { useCart } from "@/context/CartContext";
import { showSuccess, showError } from "@/utils/toast";
import { Star, Heart, RefreshCw, Search, Maximize } from "lucide-react"; // Maximize for Quick View
import { cn, formatPrice } from "@/lib/utils"; // Import formatPrice
import CountdownTimer from "@/components/CountdownTimer"; // Import CountdownTimer
import { useStorePath } from "@/hooks/use-store-path"; // Import useStorePath
import { useTranslation } from "react-i18next";
import { useStore } from "@/context/StoreContext"; // Import useStore

const MultiViewProductCard = ({
  product,
  buttonStyle,
  showBuyNowButton,
  onQuickViewClick, // New prop
}) => {
  const { t } = useTranslation(); // Initialize useTranslation
  const { addToCart } = useCart();
  const getPath = useStorePath(); // Initialize useStorePath
  const { currentCurrency, currencyConversionRate } = useStore(); // Use currency context

  const handleAddToCart = (e) => {
    e.preventDefault(); // Prevent link navigation
    if (product.isStockOut) return; // Prevent action if out of stock
    onQuickViewClick(e, product); // Open quick view for selecting options
  };

  const showComingSoon = (e) => {
    e.preventDefault(); // Prevent link navigation
    showSuccess(t("feature_coming_soon"));
  };

  // Static star rating for now, as product data doesn't include ratings
  const renderStars = (filledCount = 0) => { // Default to 0 if no rating
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Star
          key={i}
          className={cn(
            "h-4 w-4",
            i < filledCount
              ? "text-yellow-400 fill-yellow-400"
              : "text-gray-300"
          )}
        />
      );
    }
    return <div className="flex justify-center space-x-0.5">{stars}</div>;
  };

  const hasSalePrice = product.price && product.price < product.regularPrice;
  const discountPercentage = hasSalePrice
    ? Math.round(((product.regularPrice - product.price) / product.regularPrice) * 100)
    : 0;
  
  const hasHoverImage = !!product.hoverImageUrl;
  // console.log("product >> ", product)

  return (
    <Card className="group relative w-full rounded-none overflow-hidden shadow-none border-none bg-transparent h-[450px] flex flex-col text-center hover:shadow-[0_5px_10px_#0000002b] transition-shadow ">
      <Link
        to={getPath(`/products/${product.id}`)}
        className="block relative overflow-hidden flex-grow"
      >
        {/* Badges */}
        <div className="absolute top-4 left-4 z-10 flex flex-col space-y-2">
          {hasSalePrice ? (
            <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
              -{discountPercentage}%
            </span>
          ):""}
          {/* Assuming 'NEW' status can be derived or is always present for some products */}
          <span className="bg-[var(--dynamic-accent-color)] text-[var(--dynamic-secondary-color)] text-xs font-bold px-3 py-1 rounded-full uppercase">
            {t('new')}
          </span>
        </div>

        {/* Product Images */}
        <div className="relative w-full h-full">
          <img
            src={product.imageUrl}
            alt={product.name}
            className={cn(
              "w-full h-full object-cover transition-opacity duration-500 ease-in-out",
              hasHoverImage ? "opacity-100 group-hover:opacity-0" : "group-hover:scale-105 transition-transform duration-300"
            )}
          />
          {hasHoverImage && (
            <img
              src={product.hoverImageUrl}
              alt={`${product.name} hover`}
              className="w-full h-full object-cover absolute top-0 left-0 transition-opacity duration-500 ease-in-out opacity-0 group-hover:opacity-100"
            />
          )}
        </div>

        {/* Countdown Timer */}
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

        {/* Hover Overlay with Icons and Button */}
        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute top-4 group-hover:right-4 -right-5 opacity-0 group-hover:opacity-100 duration-300 transition-all ease-in-out flex flex-col space-y-2">
          <ThemedButton
            size="icon"
            onClick={showComingSoon}
            className="bg-white text-dynamic-primary-color hover:bg-gray-100"
          >
            <RefreshCw className="h-4 w-4" />
          </ThemedButton>
          <ThemedButton
            size="icon"
            onClick={showComingSoon}
            className="bg-white text-dynamic-primary-color hover:bg-gray-100"
          >
            <Heart className="h-4 w-4" />
          </ThemedButton>
          <ThemedButton
            size="icon"
            onClick={showComingSoon}
            className="bg-white text-dynamic-primary-color hover:bg-gray-100"
          >
            <Maximize className="h-4 w-4" />{" "}
            {/* Using Maximize for Quick View */}
          </ThemedButton>
        </div>
        <div
          className={`absolute left-0 bottom-0 w-full px-0 h-[0px] transition-all ease-in-out duration-300 ${
            showBuyNowButton ? "group-hover:h-[80px]" : "group-hover:h-[40px]"
          }`}
        >
          <ThemedButton
            onClick={handleAddToCart} // Use new handler for Add To Cart
            className="w-full px-6 rounded-none py-0 text-sm hover:text-white hover:bg-dynamic-primary-color"
            style={buttonStyle}
            disabled={product.isStockOut}
          >
            {product.isStockOut ? t('out_of_stock') : t("add_to_cart")}
          </ThemedButton>
          {showBuyNowButton && (
            <ThemedButton
              onClick={(e) => onQuickViewClick(e, product)} // Use onQuickViewClick for Buy Now
              className="w-full px-6 rounded-none py-0 text-sm"
              style={{ backgroundColor: 'var(--dynamic-accent-color)', color: 'var(--dynamic-secondary-color)' }}
              disabled={product.isStockOut}
            >
              {t("buy_now")}
            </ThemedButton>
          )}
        </div>
      </Link>

      <CardContent className="p-4 pt-2 flex-shrink-0">
        <Link to={getPath(`/products/${product.id}`)}>
          <h3
            className="text-lg font-semibold mb-1 text-foreground hover:text-dynamic-primary-color transition-colors line-clamp-2"
            style={{ fontFamily: `var(--dynamic-heading-font)` }}
          >
            {product.name}
          </h3>
        </Link>
        <div className="flex items-baseline justify-start space-x-2 mb-2">
          {hasSalePrice ? (
            <p className="text-base text-muted-foreground line-through">
              {formatPrice(
                product.regularPrice,
                currentCurrency,
                currencyConversionRate
              )}
            </p>
          ):""}
          <p className="text-lg font-bold text-destructive">
            {formatPrice(
              hasSalePrice ? product.price : product.regularPrice,
              currentCurrency,
              currencyConversionRate
            )}
          </p>
        </div>
        {/* {renderStars(product.rating)}
        <p className="text-sm text-muted-foreground mt-1">
          ({product.reviewCount} {t('reviews')})
        </p> */}
      </CardContent>
    </Card>
  );
};

export default MultiViewProductCard;