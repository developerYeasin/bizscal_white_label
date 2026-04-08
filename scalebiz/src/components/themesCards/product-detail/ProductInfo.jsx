"use client";

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import ThemedButton from "@/components/ThemedButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, Heart, RefreshCw, Share2, Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { showSuccess, showError } from "@/utils/toast";
import { Button } from "@/components/ui/button";

const ProductInfo = ({ product }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate(); // Initialize useNavigate
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0]?.value || "");
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0]?.value || "");

  // Placeholder for star rating and review count
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

  const handleAddToCart = () => {
    if (product) {
      // In a real app, you'd check for selected options (color, size)
      addToCart(product, quantity);
      showSuccess(`${product.name} added to cart!`);
    } else {
      showError("Could not add product to cart.");
    }
  };

  const handleBuyNow = () => {
    if (product) {
      // Add to cart and then navigate to checkout
      addToCart(product, quantity);
      showSuccess(`${product.name} added to cart. Redirecting to checkout...`);
      navigate("/checkout");
    } else {
      showError("Could not proceed with purchase.");
    }
  };

  const showComingSoon = () => {
    showSuccess("This feature is coming soon!");
  };

  return (
    <div className="space-y-6">
      {/* Product Name & Price */}
      <h1 className="text-3xl md:text-4xl font-bold" style={{ color: `var(--dynamic-primary-color)`, fontFamily: `var(--dynamic-heading-font)` }}>
        {product.name}
      </h1>
      <div className="flex items-center space-x-4 mb-4">
        {product.salePrice && (
          <p className="text-2xl font-bold text-destructive line-through">
            ${product.price.toFixed(2)}
          </p>
        )}
        <p className="text-3xl font-bold text-dynamic-primary-color">
          ${(product.salePrice || product.price).toFixed(2)}
        </p>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          {renderStars(product.rating || 4)}
          <span>({product.reviewCount || 0} Reviews)</span>
        </div>
      </div>

      {/* Short Description */}
      <p className="text-base text-muted-foreground leading-relaxed">
        {product.shortDescription || product.description?.substring(0, 150) + "..."}
      </p>

      {/* SKU */}
      {product.sku && (
        <p className="text-sm text-muted-foreground">
          SKU: <span className="font-medium text-foreground">{product.sku}</span>
        </p>
      )}

      {/* Color Options */}
      {product.colors && product.colors.length > 0 && (
        <div>
          <Label htmlFor="color-select" className="block text-sm font-medium mb-2">Color: <span className="font-semibold text-foreground">{selectedColor}</span></Label>
          <RadioGroup
            value={selectedColor}
            onValueChange={setSelectedColor}
            className="flex space-x-2"
          >
            {product.colors.map((color) => (
              <div key={color.value} className="flex items-center">
                <RadioGroupItem
                  value={color.value}
                  id={`color-${color.value}`}
                  className={cn(
                    "h-6 w-6 rounded-full border-2",
                    selectedColor === color.value ? "border-dynamic-primary-color" : "border-border"
                  )}
                  style={{ backgroundColor: color.hex }}
                />
                <Label htmlFor={`color-${color.value}`} className="sr-only">{color.label}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      )}

      {/* Size Options */}
      {product.sizes && product.sizes.length > 0 && (
        <div>
          <Label htmlFor="size-select" className="block text-sm font-medium mb-2">Size: <span className="font-semibold text-foreground">{selectedSize}</span></Label>
          <Select value={selectedSize} onValueChange={setSelectedSize}>
            <SelectTrigger id="size-select" className="w-[180px]">
              <SelectValue placeholder="Select a size" />
            </SelectTrigger>
            <SelectContent>
              {product.sizes.map((size) => (
                <SelectItem key={size.value} value={size.value}>
                  {size.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Quantity and Add to Cart / Buy Now */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center border rounded-md">
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10 rounded-none rounded-l-md"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <Input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-16 h-10 text-center border-y-0 border-x focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none"
            min="1"
          />
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10 rounded-none rounded-r-md"
            onClick={() => setQuantity(quantity + 1)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <ThemedButton onClick={handleAddToCart} className="flex-grow h-10 text-base">
          Add to Cart
        </ThemedButton>
        <ThemedButton onClick={handleBuyNow} className="flex-grow h-10 text-base bg-green-600 hover:bg-green-700 text-white">
          BUY NOW
        </ThemedButton>
      </div>

      {/* Additional Actions */}
      <div className="flex items-center space-x-4 text-sm">
        <Button variant="ghost" className="flex items-center space-x-1 text-muted-foreground hover:text-dynamic-primary-color" onClick={showComingSoon}>
          <RefreshCw className="h-4 w-4" />
          <span>Add to Compare</span>
        </Button>
        <Button variant="ghost" className="flex items-center space-x-1 text-muted-foreground hover:text-dynamic-primary-color" onClick={showComingSoon}>
          <Heart className="h-4 w-4" />
          <span>Add to Wishlist</span>
        </Button>
        <Link to="#" className="text-muted-foreground hover:text-dynamic-primary-color" onClick={showComingSoon}>
          Size Guide
        </Link>
      </div>

      {/* Social Share */}
      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
        <span>Share:</span>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-dynamic-primary-color" onClick={showComingSoon}>
          <Share2 className="h-4 w-4" />
        </Button>
        {/* Add more social icons as needed */}
      </div>
    </div>
  );
};

export default ProductInfo;