"use client";

import React from "react";
import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

const ProductCardFeaturedSidebar = ({ product }) => {
  // Placeholder for star rating - in a real app, this would come from product data
  const renderStars = (filledCount = 4) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Star
          key={i}
          className={cn(
            "h-4 w-4",
            i < filledCount ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
          )}
        />
      );
    }
    return <div className="flex space-x-0.5">{stars}</div>;
  };

  const hasSalePrice = product.salePrice && product.salePrice < product.price;

  return (
    <Link to={`/products/${product.id}`} className="flex items-center space-x-3 group p-2 -mx-2 rounded-md hover:bg-accent transition-colors duration-200">
      <img
        src={product.imageUrl}
        alt={product.name}
        className="h-24 w-24 object-cover rounded-md flex-shrink-0" // Increased image size to h-24 w-24
      />
      <div className="flex-grow">
        <p className="text-sm font-medium text-foreground group-hover:text-dynamic-primary-color transition-colors line-clamp-2">
          {product.name}
        </p>
        {renderStars(product.rating || 4)}
        <div className="flex items-center space-x-2 mt-1">
          {hasSalePrice && (
            <p className="text-sm text-muted-foreground line-through">
              ${product.price.toFixed(2)}
            </p>
          )}
          <p className="text-base font-semibold text-destructive">
            ${(hasSalePrice ? product.salePrice : product.price).toFixed(2)}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default ProductCardFeaturedSidebar;