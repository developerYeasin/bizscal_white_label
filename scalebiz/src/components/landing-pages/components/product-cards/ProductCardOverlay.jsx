"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card.jsx";
import { Link } from "react-router-dom";
import ThemedButton from "../ThemedButton.jsx";
import { ShoppingCart } from "lucide-react";

const ProductCardOverlay = ({ product, themeConfig }) => {
  if (!product) return null;

  const primaryColor = themeConfig?.primary_color || 'var(--dynamic-primary-color)';

  return (
    <Card className="relative overflow-hidden rounded-lg shadow-md group">
      <Link to={`/products/${product.id}`}>
        <img
          src={product.image_url || "https://via.placeholder.com/300x300?text=No+Image"}
          alt={product.name}
          className="w-full h-64 object-cover"
        />
        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4">
          <h3 className="text-lg font-semibold mb-1 text-white">{product.name}</h3>
          <p className="text-sm text-gray-200 mb-2">
            {product.categories && product.categories.length > 0 ? product.categories[0].name : "Uncategorized"}
          </p>
          <p className="text-xl font-bold text-white mb-4">
            ৳ {parseFloat(product.price).toFixed(2)}
          </p>
          <ThemedButton variant="secondary" className="bg-white text-[${primaryColor}] hover:bg-gray-100">
            <ShoppingCart className="h-4 w-4 mr-2" /> View Product
          </ThemedButton>
        </div>
      </Link>
    </Card>
  );
};

export default ProductCardOverlay;