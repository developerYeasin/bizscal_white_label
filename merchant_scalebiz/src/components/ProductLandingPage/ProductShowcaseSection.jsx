"use client";

import React from "react";
import { Link } from "react-router-dom";
import ThemedButton from "@/components/ThemedButton";
import { useCart } from "@/context/CartContext";
import { showSuccess } from "@/utils/toast";
import { cn, formatPrice } from "@/lib/utils"; // Import formatPrice
import { useStorePath } from "@/hooks/use-store-path";
import { useTranslation } from "react-i18next";
import { useStore } from "@/context/StoreContext"; // Import useStore

const ProductShowcaseSection = ({ product, onBuyNowClick, data }) => { // Added data prop
  const { t } = useTranslation(); // Initialize useTranslation
  const { addToCart } = useCart();
  const getPath = useStorePath();
  const { currentCurrency, currencyConversionRate } = useStore(); // Use currency context

  // console.log("[ProductShowcaseSection] currentCurrency:", currentCurrency, "conversionRate:", currencyConversionRate);

  if (!product) {
    return null;
  }

  const { title, description, features, reverseLayout = false } = data; // Destructure from data prop

  const handleAddToCart = () => {
    addToCart(product, 1);
    showSuccess(`${product.name} ${t('added_to_cart')}!`);
  };

  return (
    <section className="relative w-full bg-white py-12 md:py-20 overflow-hidden">
      <div className={cn(
        "container mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center",
        reverseLayout ? "lg:grid-cols-2-reverse" : "" // Custom class for reversing order
      )}>
        {/* Image Area with Price Badge */}
        <div className={cn(
          "relative flex justify-center",
          reverseLayout ? "lg:order-2 lg:justify-start" : "lg:order-1 lg:justify-end"
        )}>
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full max-w-xs sm:max-w-lg h-auto object-contain z-10"
          />
          <div className="absolute top-5 right-5 sm:top-10 sm:right-10 bg-red-500 text-white rounded-full p-3 sm:p-4 text-center font-bold text-lg sm:text-xl animate-pulse-scale">
            {t('only')} <br /> {formatPrice(product.price, currentCurrency, currencyConversionRate)}
          </div>
        </div>

        {/* Content Area */}
        <div className={cn(
          "relative z-10 text-center lg:text-left space-y-4 sm:space-y-6",
          reverseLayout ? "lg:order-1" : "lg:order-2"
        )}>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 sm:mb-4 leading-tight" style={{ fontFamily: `var(--dynamic-heading-font)` }}>
            {title}
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-md mx-auto lg:mx-0" style={{ fontFamily: `var(--dynamic-body-font)` }}>
            {description || product.description}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 sm:mt-6">
            {features.map((feature, index) => (
              <div key={index} className="text-center sm:text-left">
                <h3 className="text-lg font-semibold" style={{ fontFamily: `var(--dynamic-heading-font)` }}>{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
          <div className="pt-4 flex justify-center lg:justify-start">
            <ThemedButton onClick={onBuyNowClick} className="px-6 py-3 text-lg bg-red-500 hover:bg-red-600 text-white">
              {t('buy_now')}
            </ThemedButton>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductShowcaseSection;