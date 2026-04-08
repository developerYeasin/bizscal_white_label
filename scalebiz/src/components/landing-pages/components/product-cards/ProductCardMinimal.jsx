"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card.jsx";
import { Link } from "react-router-dom";
import ThemedButton from "../ThemedButton.jsx";
import { ShoppingCart } from "lucide-react";

const ProductCardMinimal = ({ product, themeConfig }) => {
  if (!product) return null;

  const primaryColor = themeConfig?.primary_color || 'var(--dynamic-primary-color)';

  return (
    <Card className="relative overflow-hidden rounded-lg border-none shadow-none bg-transparent group">
      <Link to={`/products/${product.id}`}>
        <div className="relative w-full h-64 overflow-hidden rounded-md">
          <img
            src={product.image_url || "https://via.placeholder.com/300x300?text=No+Image"}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <CardContent className="p-2 text-center">
          <h3 className="text-base font-medium mb-1 text-foreground group-hover:text-[${primaryColor}] transition-colors" style={{ color: primaryColor }}>
            {product.name}
          </h3>
          <p className="text-sm text-muted-foreground mb-2">
            {product.categories && product.categories.length > 0 ? product.categories[0].name : "Uncategorized"}
          </p>
          <p className="text-lg font-bold" style={{ color: primaryColor }}>
            ৳ {parseFloat(product.price).toFixed(2)}
          </p>
        </CardContent>
      </Link>
      <div className="absolute bottom-0 left-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <ThemedButton className="w-full text-xs py-1">
          <ShoppingCart className="h-3 w-3 mr-1" /> Add to Cart
        </ThemedButton>
      </div>
    </Card>
  );
};

export default ProductCardMinimal;