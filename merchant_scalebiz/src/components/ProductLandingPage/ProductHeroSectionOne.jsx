"use client";

import React from "react";
import { Link } from "react-router-dom";
import ThemedButton from "@/components/ThemedButton";
import { useCart } from "@/context/CartContext";
import { showSuccess } from "@/utils/toast";
import { ShoppingCart, PlayCircle } from "lucide-react"; // Using ShoppingCart for Add To Cart
import { cn } from "@/lib/utils";
import { useStorePath } from "@/hooks/use-store-path";
import { useTranslation } from "react-i18next"; // Import useTranslation
import { Button } from "@/components/ui/button"; // Import Button for navigation

const ProductHeroSectionOne = ({ product, onBuyNowClick, data, nextProductId, prevProductId }) => {
  const { t } = useTranslation(); // Initialize useTranslation
  const { addToCart } = useCart();
  const getPath = useStorePath();

  // Debugging logs
  // console.log("ProductHeroSectionOne received nextProductId:", nextProductId, " (type:", typeof nextProductId, ")");
  // console.log("ProductHeroSectionOne received prevProductId:", prevProductId, " (type:", typeof prevProductId, ")");

  if (!product) {
    return null;
  }

  const { title, description } = data; // Destructure data prop

  const handleAddToCart = () => {
    addToCart(product, 1);
    showSuccess(`${product.name} ${t('added_to_cart')}!`);
    onBuyNowClick(); // Trigger COD popup on Add To Cart
  };

  return (
    <section className="relative w-full bg-background py-10 md:py-20 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 product-showcase grid grid-cols-1 lg:grid-cols-2 items-center gap-10 md:gap-20">
        <div className="product-content relative z-10 text-center lg:text-left order-2 lg:order-1">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-5" style={{ fontFamily: `var(--dynamic-heading-font)` }}>
            {title || "The Essential Trench"} <br /><span className="text-dynamic-primary-color font-semibold"></span>
          </h1>
          <p className="text-base sm:text-lg leading-relaxed max-w-md mx-auto lg:mx-0 mb-8 text-muted-foreground" style={{ fontFamily: `var(--dynamic-body-font)` }}>
            {description || product.description || "A timeless classic reimagined for the modern wardrobe. Effortlessly transition from work to weekend with this versatile trench, crafted for style and comfort."}
          </p>
          <div className="product-actions flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-5">
            <ThemedButton
              onClick={handleAddToCart}
              className="btn-primary bg-foreground text-white hover:opacity-80 rounded-full px-6 py-3 flex items-center gap-2 font-semibold w-full sm:w-auto"
            >
              <ShoppingCart className="h-5 w-5" />
              <span>{t('add_to_cart')}</span>
            </ThemedButton>
            <Link to={getPath("/collections/all")} className="btn-secondary text-foreground hover:text-dynamic-primary-color rounded-full px-6 py-3 flex items-center gap-2 font-semibold w-full sm:w-auto">
              <PlayCircle className="h-5 w-5" />
              <span>{t('view_lookbook')}</span>
            </Link>
          </div>
        </div>
        <div className="product-visuals relative z-10 flex justify-center items-center order-1 lg:order-2 min-h-[300px] sm:min-h-[400px]">
          <div className="background-shape absolute w-[100%] h-[100%] sm:w-[120%] sm:h-[120%] bg-dynamic-primary-color rounded-[45%_55%_70%_30%_/_30%_30%_70%_70%] opacity-80 animate-morph"></div>
          <img
            src={product.imageUrl || "https://i.ibb.co/L5B7nF1/woman-fashion-no-bg.png"}
            alt={product.name}
            className="product-image relative z-20 w-full max-w-[250px] sm:max-w-sm md:max-w-[450px] drop-shadow-lg"
          />
          <div className="price-tag absolute top-5 right-5 sm:top-10 sm:right-10 z-30 bg-background text-foreground w-28 h-28 sm:w-32 sm:h-32 rounded-full flex justify-center items-center text-center font-semibold text-base sm:text-xl leading-tight border-2 border-dashed border-dynamic-primary-color">
            {t('complete_the_look')}<br />{t('from')} ${product.price.toFixed(2)}
          </div>
        </div>
        <div className="slider-nav absolute bottom-5 right-5 flex items-center gap-4 z-30 hidden lg:flex">
          <span className="page-number text-5xl sm:text-7xl font-bold text-foreground opacity-10">01</span>
          <div className="nav-controls flex items-center gap-2">
            {prevProductId && (
              <Link to={getPath(`/single-product/${prevProductId}`)} className="text-foreground hover:text-dynamic-primary-color font-semibold text-sm">
                <Button variant="outline" size="sm">
                  {t('prev')}
                </Button>
              </Link>
            )}
            <span className="text-foreground">&bull; &bull; &bull;</span>
            {nextProductId && (
              <Link to={getPath(`/single-product/${nextProductId}`)} className="text-foreground hover:text-dynamic-primary-color font-semibold text-sm">
                <Button variant="outline" size="sm">
                  {t('next')}
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductHeroSectionOne;