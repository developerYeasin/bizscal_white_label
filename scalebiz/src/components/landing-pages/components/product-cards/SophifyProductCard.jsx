"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card.jsx";
import { Link } from "react-router-dom";
import ThemedButton from "../ThemedButton.jsx";
import { ShoppingCart, Heart, Eye } from "lucide-react";

const SophifyProductCard = ({ product, themeConfig }) => {
  if (!product) return null;

  const primaryColor = themeConfig?.primary_color || 'var(--dynamic-primary-color)';

  return (
    <Card className="relative overflow-hidden rounded-lg shadow-md group">
      <div className="relative w-full h-64 overflow-hidden">
        <Link to={`/products/${product.id}`}>
          <img
            src={product.image_url || "https://via.placeholder.com/300x300?text=No+Image"}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </Link>
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <ThemedButton variant="secondary" size="icon" className="bg-white text-gray-700 hover:bg-gray-100">
            <ShoppingCart className="h-4 w-4" />
          </ThemedButton>
          <ThemedButton variant="secondary" size="icon" className="bg-white text-gray-700 hover:bg-gray-100">
            <Heart className="h-4 w-4" />
          </ThemedButton>
          <ThemedButton variant="secondary" size="icon" className="bg-white text-gray-700 hover:bg-gray-100">
            <Eye className="h-4 w-4" />
          </ThemedButton>
        </div>
      </div>
      <CardContent className="p-4 text-center">
        <p className="text-sm text-muted-foreground mb-1">
          {product.categories && product.categories.length > 0 ? product.categories[0].name : "Uncategorized"}
        </p>
        <Link to={`/products/${product.id}`}>
          <h3 className="text-lg font-semibold mb-2 text-foreground hover:text-[${primaryColor}] transition-colors" style={{ color: primaryColor }}>
            {product.name}
          </h3>
        </Link>
        <p className="text-xl font-bold" style={{ color: primaryColor }}>
          ৳ {parseFloat(product.price).toFixed(2)}
        </p>
      </CardContent>
    </Card>
  );
};

export default SophifyProductCard;