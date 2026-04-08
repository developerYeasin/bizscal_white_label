"use client";

import React from "react";
import { Link } from "react-router-dom";
import ThemedButton from "@/components/ThemedButton";
import { cn } from "@/lib/utils";
import { useStorePath } from "@/hooks/use-store-path";
import { useTranslation } from "react-i18next"; // Import useTranslation

const NirvanaProductShowcase = ({ product, onBuyNowClick, data }) => { // Added data prop
  const { t } = useTranslation(); // Initialize useTranslation
  const getPath = useStorePath();

  if (!product) {
    return null;
  }

  const { title, description, reverseLayout = false } = data; // Destructure from data prop

  return (
    <section className={cn("py-12 md:py-20 bg-white overflow-hidden", reverseLayout ? "lg:flex-row-reverse" : "")}>
      <div className="container mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Image with Watercolor Background */}
        <div className={cn("relative flex justify-center", reverseLayout ? "lg:order-2" : "lg:order-1")}>
          <div className="absolute inset-0 flex items-center justify-center">
            <img
             src={product.imageUrl}// Placeholder watercolor splash
              alt="Watercolor Splash"
              className="w-full h-full object-contain opacity-70"
            />
          </div>
          <img
            src={product.imageUrl}
            alt={product.name}
            className="relative z-10 w-full max-w-xs sm:max-w-sm h-auto object-contain"
          />
        </div>

        {/* Content Area */}
        <div className={cn("relative z-10 text-center lg:text-left space-y-4 sm:space-y-6", reverseLayout ? "lg:order-1" : "lg:order-2")}>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 sm:mb-4 leading-tight" style={{ fontFamily: `var(--dynamic-heading-font)` }}>
            {title}
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-md mx-auto lg:mx-0" style={{ fontFamily: `var(--dynamic-body-font)` }}>
            {description}
          </p>
          {/* Changed to Buy Now button that opens the popup */}
          <div className="flex justify-center lg:justify-start">
            <ThemedButton onClick={onBuyNowClick} className="px-8 py-3 text-lg bg-blue-500 hover:bg-blue-600 text-white">
              {t('buy_now')}
            </ThemedButton>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NirvanaProductShowcase;