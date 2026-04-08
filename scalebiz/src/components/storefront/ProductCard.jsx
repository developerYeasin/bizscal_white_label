"use client";

import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button.jsx";
import { useStoreConfig } from "@/contexts/StoreConfigurationContext.jsx";
import { Card, CardContent } from "@/components/ui/card.jsx";
import { cn } from "@/lib/utils.js";
import { ShoppingCart, Eye } from "lucide-react";

const ProductCard = ({ product, className }) => {
  const { addToCart, isAdding } = useCart();
  const { config: themeConfig } = useStoreConfig();

  const cardStyle = themeConfig?.product_card_style || "default";

  // Handle missing images
  const primaryImage = product.image_url || "https://via.placeholder.com/300x300?text=No+Image";
  const hoverImage = product.hover_image_url || primaryImage;

  // Quick view modal handler (optional, placeholder)
  const handleQuickView = (e) => {
    e.preventDefault();
    // Could open a quick view modal
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      productId: product.id,
      quantity: 1,
      variants: product.variants || {},
    });
  };

  // Different card styles
  const renderCard = () => {
    switch (cardStyle) {
      case "minimal":
        return (
          <Card className={cn("group overflow-hidden hover:shadow-lg transition-shadow", className)}>
            <Link to={`/products/${product.id}`}>
              <div className="relative aspect-square overflow-hidden bg-muted">
                <img
                  src={primaryImage}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="font-medium text-sm line-clamp-2 mb-2 hover:text-primary transition-colors">
                  {product.name}
                </h3>
                <div className="flex items-center justify-between">
                  <p className="text-lg font-bold" style={{ color: `var(--dynamic-primary-color)` }}>
                    ${parseFloat(product.price).toFixed(2)}
                  </p>
                  {product.stock_quantity > 0 ? (
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">In Stock</span>
                  ) : (
                    <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">Out of Stock</span>
                  )}
                </div>
              </CardContent>
            </Link>
          </Card>
        );

      case "overlay":
        return (
          <Card className={cn("group relative overflow-hidden", className)}>
            <Link to={`/products/${product.id}`}>
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={primaryImage}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button size="sm" variant="secondary" onClick={handleAddToCart}>
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>
              </div>
              <CardContent className="p-4 absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent text-white">
                <h3 className="font-medium text-sm line-clamp-2 mb-1">{product.name}</h3>
                <p className="font-bold">${parseFloat(product.price).toFixed(2)}</p>
              </CardContent>
            </Link>
          </Card>
        );

      case "shophify": // Keeping for compatibility
      case "sophify":
        return (
          <Card className={cn("group border hover:border-primary/50 transition-colors", className)}>
            <Link to={`/products/${product.id}`}>
              <div className="relative aspect-square overflow-hidden bg-gray-100">
                <img
                  src={primaryImage}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={handleQuickView}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
              <CardContent className="p-4 text-center">
                <h3 className="font-medium text-sm line-clamp-2 mb-2 hover:text-primary transition-colors">
                  {product.name}
                </h3>
                <p className="text-primary font-bold">${parseFloat(product.price).toFixed(2)}</p>
              </CardContent>
            </Link>
          </Card>
        );

      default: // default card
        return (
          <Card className={cn("group flex flex-col h-full", className)}>
            <Link to={`/products/${product.id}`} className="flex-1 flex flex-col">
              <div className="relative aspect-square overflow-hidden bg-muted">
                <img
                  src={primaryImage}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <CardContent className="p-4 flex-1 flex flex-col">
                <h3 className="font-medium text-sm line-clamp-2 mb-2 hover:text-primary transition-colors">
                  {product.name}
                </h3>
                <div className="mt-auto">
                  <p className="text-lg font-bold mb-3" style={{ color: `var(--dynamic-primary-color)` }}>
                    ${parseFloat(product.price).toFixed(2)}
                  </p>
                  <Button
                    size="sm"
                    className="w-full"
                    onClick={handleAddToCart}
                    disabled={isAdding || product.stock_quantity === 0}
                  >
                    {isAdding ? "Adding..." : "Add to Cart"}
                  </Button>
                </div>
              </CardContent>
            </Link>
          </Card>
        );
    }
  };

  return renderCard();
};

export default ProductCard;
