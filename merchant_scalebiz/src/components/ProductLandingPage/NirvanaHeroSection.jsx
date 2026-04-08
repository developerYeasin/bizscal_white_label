"use client";

import React from "react";
import { Link } from "react-router-dom";
import ThemedButton from "@/components/ThemedButton";
import { useCart } from "@/context/CartContext";
import { showSuccess } from "@/utils/toast";
import { User, Heart } from "lucide-react"; // Icons for floating cards
import { cn } from "@/lib/utils";
import { useStorePath } from "@/hooks/use-store-path";
import { useTranslation } from "react-i18next"; // Import useTranslation

const NirvanaHeroSection = ({ product, onBuyNowClick, data }) => { // Accept data prop
  const { t } = useTranslation(); // Initialize useTranslation
  const { addToCart } = useCart();
  const getPath = useStorePath();

  if (!product) {
    return null;
  }

  const { title, description } = data; // Destructure from data prop

  const handleAddToCart = () => {
    addToCart(product, 1);
    showSuccess(`${product.name} ${t('added_to_cart')}!`);
  };

  return (
    <section className="relative w-full bg-gray-50 py-16 md:py-24 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Content Area */}
        <div className="relative z-10 text-center lg:text-left space-y-6">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 leading-tight" style={{ fontFamily: `var(--dynamic-heading-font)` }}>
            {title || t("keep_yourself_fresher")}
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-md mx-auto lg:mx-0" style={{ fontFamily: `var(--dynamic-body-font)` }}>
            {description || t("perfume_symbolizes_perfection")}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
            <ThemedButton onClick={onBuyNowClick} className="px-8 py-3 text-lg bg-blue-500 hover:bg-blue-600 text-white w-full sm:w-auto flex items-center justify-center">
              {t('buy_now')}
            </ThemedButton>
            <ThemedButton asChild className="px-8 py-3 text-lg bg-black hover:bg-gray-800 text-white w-full sm:w-auto">
              <Link to={getPath("/collections/all")} className="flex items-center justify-center">
                {t('explore_more')}
              </Link>
            </ThemedButton>
          </div>
        </div>

        {/* Right Image Area with Floating Cards */}
        <div className="relative flex justify-center lg:justify-end min-h-[300px] sm:min-h-[400px]">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full max-w-xs sm:max-w-lg h-auto object-contain z-10"
          />
          {/* Floating Cards */}
          <div className="absolute top-1/4 left-0 sm:left-10 bg-white p-3 rounded-lg shadow-lg flex items-center space-x-2 z-20 animate-float-one">
            <User className="h-5 w-5 text-blue-500" />
            <div>
              <p className="text-sm font-semibold">10k+</p>
              <p className="text-xs text-muted-foreground">{t('happy_customers')}</p>
            </div>
          </div>
          <div className="absolute top-1/4 right-0 sm:right-10 bg-white p-3 rounded-lg shadow-lg flex items-center space-x-2 z-20 animate-float-two">
            <Heart className="h-5 w-5 text-yellow-500" />
            <div>
              <p className="text-sm font-semibold">12k+</p>
              <p className="text-xs text-muted-foreground">{t('users')}</p>
            </div>
          </div>
          {/* Background elements */}
          <div className="absolute -bottom-10 -left-10 w-32 h-32 sm:w-40 sm:h-40 bg-blue-100 rounded-full opacity-50 animate-pulse-slow"></div>
          <div className="absolute -top-10 -right-10 w-24 h-24 sm:w-32 sm:h-32 bg-yellow-100 rounded-full opacity-50 animate-pulse-slow delay-500"></div>
        </div>
      </div>
    </section>
  );
};

export default NirvanaHeroSection;