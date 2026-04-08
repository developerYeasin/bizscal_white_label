"use client";

import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import ThemedButton from "@/components/ThemedButton";
import { useCart } from "@/context/CartContext";
import { showSuccess, showError } from "@/utils/toast";
import { Star, Heart, RefreshCw, Search, Maximize } from "lucide-react"; // Maximize for Quick View
import { cn } from "@/lib/utils";

const MultiViewProductCard = ({ product, buttonStyle }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault(); // Prevent link navigation
    // In a real app, this would likely open a product options modal
    showError("Please select options for this product.");
  };

  const showComingSoon = (e) => {
    e.preventDefault(); // Prevent link navigation
    showSuccess("This feature is coming soon!");
  };

  // Static star rating for now, as product data doesn't include ratings
  const renderStars = (filledCount = 4) => {
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

  const hasSalePrice = product.salePrice && product.salePrice < product.price;
  const discountPercentage = hasSalePrice
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;

  return (
    <Card className="group relative w-full rounded-none overflow-hidden shadow-none border-none bg-transparent h-[450px] flex flex-col text-center hover:shadow-[0_5px_10px_#0000002b] transition-shadow ">
      <Link
        to={`/products/${product.id}`}
        className="block relative overflow-hidden flex-grow"
      >
        {/* Badges */}
        <div className="absolute top-4 left-4 z-10 flex flex-col space-y-2">
          {hasSalePrice && (
            <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
              -{discountPercentage}%
            </span>
          )}
          {/* Assuming 'NEW' status can be derived or is always present for some products */}
          <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
            New
          </span>
        </div>

        {/* Product Images */}
        <div className="relative w-full h-full">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover transition-opacity duration-300 ease-in-out opacity-100 group-hover:opacity-0"
          />
          {product.hoverImageUrl && (
            <img
              src={product.hoverImageUrl}
              alt={`${product.name} hover`}
              className="w-full h-full object-cover absolute top-0 left-0 transition-opacity duration-300 ease-in-out opacity-0 group-hover:opacity-100"
            />
          )}
        </div>

        {/* Countdown Timer (Static for now) */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm rounded-md p-2 shadow-md flex space-x-3 text-sm font-semibold text-foreground opacity-100 group-hover:opacity-0 transition-opacity duration-300">
          <div className="flex flex-col items-center">
            <span>94</span>
            <span className="text-xs text-muted-foreground">Days</span>
          </div>
          <div className="flex flex-col items-center">
            <span>19</span>
            <span className="text-xs text-muted-foreground">Hrs</span>
          </div>
          <div className="flex flex-col items-center">
            <span>10</span>
            <span className="text-xs text-muted-foreground">Min</span>
          </div>
          <div className="flex flex-col items-center">
            <span>32</span>
            <span className="text-xs text-muted-foreground">Sec</span>
          </div>
        </div>

        {/* Hover Overlay with Icons and Button */}
        <div className="absolute inset-0 bg-black/20 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
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
        <div className="absolute left-0 bottom-0 w-full px-0 group-hover:h-[40px] h-[0px] transition-all ease-in-out duration-300">
          <ThemedButton
            onClick={handleAddToCart}
            className="w-full px-6 rounded-none py-0 text-sm hover:text-white hover:bg-dynamic-primary-color"
            style={buttonStyle}
          >
            Add To Cart
          </ThemedButton>
        </div>
      </Link>

      <CardContent className="p-4 pt-2 flex-shrink-0">
        <Link to={`/products/${product.id}`}>
          <h3
            className="text-lg font-semibold mb-1 text-foreground hover:text-dynamic-primary-color transition-colors"
            style={{ fontFamily: `var(--dynamic-heading-font)` }}
          >
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center justify-center space-x-2 mb-2">
          {hasSalePrice && (
            <p className="text-base text-muted-foreground line-through">
              ${product.price.toFixed(2)}
            </p>
          )}
          <p className="text-lg font-bold text-destructive">
            ${(hasSalePrice ? product.salePrice : product.price).toFixed(2)}
          </p>
        </div>
        {renderStars(product.rating || 0)}
        <p className="text-sm text-muted-foreground mt-1">
          ({product.reviewCount || 0} Reviews)
        </p>
      </CardContent>
    </Card>
  );
};

export default MultiViewProductCard;
