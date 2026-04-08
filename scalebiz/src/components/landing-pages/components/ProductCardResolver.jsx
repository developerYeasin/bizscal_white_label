"use client";

import React from "react";
import ProductCardDefault from "./product-cards/ProductCardDefault.jsx";
import ProductCardMinimal from "./product-cards/ProductCardMinimal.jsx";
import ProductCardOverlay from "./product-cards/ProductCardOverlay.jsx";
import ProductCardThemeOne from "./product-cards/ProductCardThemeOne.jsx";
import MultiViewProductCard from "./product-cards/MultiViewProductCard.jsx";
import SophifyProductCard from "./product-cards/SophifyProductCard.jsx";
import { useThemeConfig } from "@/contexts/ThemeSettingsContext.jsx"; // Import useThemeConfig

const cardMap = {
  default: ProductCardDefault,
  minimal: ProductCardMinimal,
  overlay: ProductCardOverlay,
  themeOne: ProductCardThemeOne,
  multiView: MultiViewProductCard,
  shophify: SophifyProductCard,
};

const ProductCardResolver = ({ product, type = "default" }) => {
  const { config: themeConfig } = useThemeConfig(); // Get theme config

  if (!product) return null;

  const CardComponent = cardMap[type] || ProductCardDefault;

  return <CardComponent product={product} themeConfig={themeConfig} />;
};

export default ProductCardResolver;