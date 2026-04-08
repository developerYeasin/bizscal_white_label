"use client";

import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useStoreProduct } from "@/hooks/use-store-products.js";
import { useCart } from "@/hooks/use-cart.js";
import { useStoreConfig } from "@/contexts/StoreConfigurationContext.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Skeleton } from "@/components/ui/skeleton.jsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.jsx";
import { Separator } from "@/components/ui/separator.jsx";
import { Minus, Plus, ShoppingCart, Heart, Share2, ChevronLeft, Check } from "lucide-react";
import { showSuccess } from "@/utils/toast.js";

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { config: themeConfig } = useStoreConfig();
  const { addToCart, isAdding } = useCart();

  const { data: product, isLoading, error } = useStoreProduct(id);

  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState({});
  const [activeImage, setActiveImage] = useState(0);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Skeleton className="aspect-square rounded-lg" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <p className="text-muted-foreground mb-6">The product you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => navigate('/products')}>Browse Products</Button>
      </div>
    );
  }

  const images = product.images || [product.image_url].filter(Boolean);

  const handleVariantChange = (variantName, value) => {
    setSelectedVariants((prev) => ({
      ...prev,
      [variantName]: value,
    }));
  };

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      quantity: selectedQuantity,
      selected_variants: selectedVariants,
    });
  };

  const incrementQuantity = () => setSelectedQuantity((q) => q + 1);
  const decrementQuantity = () => setSelectedQuantity((q) => Math.max(1, q - 1));

  // Format variants for display
  const variants = product.variants || [];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="gap-2">
          <ChevronLeft className="h-4 w-4" />
          Back
        </Button>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square rounded-lg overflow-hidden bg-muted">
            <img
              src={images[activeImage] || "https://via.placeholder.com/600x600?text=No+Image"}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  className={`aspect-square rounded-md overflow-hidden border-2 transition-colors ${
                    activeImage === idx ? "border-primary" : "border-transparent"
                  }`}
                  onClick={() => setActiveImage(idx)}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: `var(--dynamic-heading-font)` }}>
              {product.name}
            </h1>
            <div className="flex items-center gap-4">
              <p className="text-2xl font-bold" style={{ color: `var(--dynamic-primary-color)` }}>
                ${parseFloat(product.price).toFixed(2)}
              </p>
              {product.regular_price && parseFloat(product.regular_price) > parseFloat(product.price) && (
                <span className="text-sm text-muted-foreground line-through">
                  ${parseFloat(product.regular_price).toFixed(2)}
                </span>
              )}
            </div>
          </div>

          {/* Stock Status */}
          <div className="flex items-center gap-2">
            {product.stock_quantity > 0 ? (
              <span className="flex items-center text-sm text-green-600">
                <Check className="h-4 w-4 mr-1" />
                In Stock ({product.stock_quantity} available)
              </span>
            ) : (
              <span className="text-sm text-red-600">Out of Stock</span>
            )}
            {product.condition && (
              <span className="text-sm text-muted-foreground">• {product.condition}</span>
            )}
          </div>

          {/* Description */}
          {product.description && (
            <div className="prose max-w-none">
              <p className="text-muted-foreground">{product.description}</p>
            </div>
          )}

          <Separator />

          {/* Variants */}
          {variants.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-semibold">Options</h3>
              {variants.map((variant) => (
                <div key={variant.name}>
                  <label className="block text-sm font-medium mb-2">{variant.name}</label>
                  <Select
                    value={selectedVariants[variant.name] || ""}
                    onValueChange={(value) => handleVariantChange(variant.name, value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={`Select ${variant.name}`} />
                    </SelectTrigger>
                    <SelectContent>
                      {variant.options?.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label} {option.price_adjustment ? `(+$${option.price_adjustment})` : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
          )}

          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium mb-2">Quantity</label>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={decrementQuantity}
                disabled={selectedQuantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="text-lg font-medium w-12 text-center">{selectedQuantity}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={incrementQuantity}
                disabled={selectedQuantity >= product.stock_quantity}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Add to Cart */}
          <div className="flex gap-3">
            <Button
              size="lg"
              className="flex-1"
              onClick={handleAddToCart}
              disabled={isAdding || product.stock_quantity === 0}
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              {isAdding ? "Adding..." : "Add to Cart"}
            </Button>
            <Button variant="outline" size="icon">
              <Heart className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="icon">
              <Share2 className="h-5 w-5" />
            </Button>
          </div>

          {/* Product Details */}
          <div className="border-t pt-6 space-y-4">
            {product.sku && (
              <p className="text-sm">
                <span className="font-medium">SKU:</span> {product.sku}
              </p>
            )}
            {product.barcode && (
              <p className="text-sm">
                <span className="font-medium">Barcode:</span> {product.barcode}
              </p>
            )}
            {product.gender && (
              <p className="text-sm">
                <span className="font-medium">Gender:</span> {product.gender}
              </p>
            )}
            {product.brand && (
              <p className="text-sm">
                <span className="font-medium">Brand:</span> {product.brand}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
