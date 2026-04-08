"use client";

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import CustomModal from "./CustomModal"; // NEW IMPORT
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Star,
  Heart,
  RefreshCw,
  Share2, // Using Share2 as a generic share icon
  Plus,
  Minus,
  X,
  Facebook,
  Twitter,
  Linkedin,
  Send, // Assuming Send for the 'paper plane' icon
} from "lucide-react";
import ThemedButton from "./ThemedButton";
import { useCart } from "@/context/CartContext";
import { showSuccess, showError } from "@/utils/toast";
import { cn, formatPrice } from "@/lib/utils"; // Import formatPrice
import { useTranslation } from "react-i18next";
import { useStorePath } from "@/hooks/use-store-path";
import { useOutletContext } from "react-router-dom";
import { useStore } from "@/context/StoreContext"; // Import useStore

const ProductQuickViewModal = ({ product, isOpen, onClose }) => {
  const { t } = useTranslation();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const getPath = useStorePath();
  const { onOpenCartSidebar } = useOutletContext();
  const { currentCurrency, currencyConversionRate } = useStore(); // Use currency context

  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(""); // No default selection
  const [selectedSize, setSelectedSize] = useState(""); // No default selection
  const [selectedImageVariant, setSelectedImageVariant] = useState(""); // No default selection
  const [mainImage, setMainImage] = useState("");
  const [currentThumbnailIndex, setCurrentThumbnailIndex] = useState(0);

  useEffect(() => {
    if (isOpen && product) {
      setQuantity(1);
      setSelectedColor(""); // Ensure no default selection on open
      setSelectedSize(""); // Ensure no default selection on open
      setSelectedImageVariant(""); // Ensure no default selection on open
      setMainImage(product.images?.[0] || product.imageUrl || "");
      setCurrentThumbnailIndex(0);
    }
  }, [isOpen, product]);

  if (!product) {
    return null;
  }

  // Calculate current price based on selected variants
  const basePrice = parseFloat(product.salePrice || product.price || 0); // Explicit parseFloat
  let currentPrice = basePrice;

  const selectedColorOption = product.colors?.find(
    (c) => c.value === selectedColor
  );
  if (selectedColorOption && selectedColorOption.extraPrice) {
    currentPrice += selectedColorOption.extraPrice;
  }

  const selectedSizeOption = product.sizes?.find(
    (s) => s.value === selectedSize
  );
  if (selectedSizeOption && selectedSizeOption.extraPrice) {
    currentPrice += selectedSizeOption.extraPrice;
  }

  const selectedImageVariantOption = product.imageVariants?.find(
    (iv) => iv.value === selectedImageVariant
  );
  if (selectedImageVariantOption && selectedImageVariantOption.extraPrice) {
    currentPrice += selectedImageVariantOption.extraPrice;
  }

  const validateVariants = () => {
    // console.log("Validating variants for product:", product.name);
    // console.log("Selected Color:", selectedColor, "Available Colors:", product.colors);
    // console.log("Selected Size:", selectedSize, "Available Sizes:", product.sizes);
    // console.log("Selected Image Variant:", selectedImageVariant, "Available Image Variants:", product.imageVariants);

    if (product.colors && product.colors.length > 0 && !selectedColor) {
      const errorMessage = t("please_select_all_variants");
      // console.log("Validation failed: Color not selected. Message:", errorMessage);
      showError(errorMessage);
      return false;
    }
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      const errorMessage = t("please_select_all_variants");
      // console.log("Validation failed: Size not selected. Message:", errorMessage);
      showError(errorMessage);
      return false;
    }
    if (product.imageVariants && product.imageVariants.length > 0 && !selectedImageVariant) {
      const errorMessage = t("please_select_all_variants");
      // console.log("Validation failed: Image Variant not selected. Message:", errorMessage);
      showError(errorMessage);
      return false;
    }
    // console.log("All variants selected or not required.");
    return true;
  };

  const getSelectedVariantOptions = () => {
    const options = [];
    if (selectedColorOption) {
      options.push({ type: 'color', value: selectedColorOption.value, label: selectedColorOption.label, hex: selectedColorOption.hex, extraPrice: selectedColorOption.extraPrice });
    }
    if (selectedSizeOption) {
      options.push({ type: 'size', value: selectedSizeOption.value, label: selectedSizeOption.label, extraPrice: selectedSizeOption.extraPrice });
    }
    if (selectedImageVariantOption) {
      options.push({ type: 'image', value: selectedImageVariantOption.value, label: selectedImageVariantOption.label, imageUrl: selectedImageVariantOption.imageUrl, extraPrice: selectedImageVariantOption.extraPrice });
    }
    return options;
  };

  const handleAddToCart = () => {
    if (product && validateVariants()) {
      addToCart(product, quantity, currentPrice, getSelectedVariantOptions());
      showSuccess(`${product.name} ${t("added_to_cart")}!`);
      onClose();
      onOpenCartSidebar(); // Open cart sidebar after adding to cart
    } else if (!product) {
      showError(t("could_not_add_to_cart"));
    }
  };

  const handleBuyNow = () => {
    if (product && validateVariants()) {
      addToCart(product, quantity, currentPrice, getSelectedVariantOptions());
      showSuccess(
        `${product.name} ${t("added_to_cart")}. ${t(
          "redirecting_to_checkout"
        )}...`
      );
      onClose();
      navigate(getPath("/checkout"));
    } else if (!product) {
      showError(t("could_not_proceed_purchase"));
    }
  };

  const showComingSoon = () => {
    showSuccess(t("feature_coming_soon"));
  };

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
    return <div className="flex space-x-0.5">{stars}</div>;
  };

  const handleThumbnailClick = (image, index) => {
    setMainImage(image);
    setCurrentThumbnailIndex(index);
  };

  const handlePrevThumbnail = () => {
    setCurrentThumbnailIndex((prevIndex) => {
      const newIndex =
        prevIndex === 0 ? product.images.length - 1 : prevIndex - 1;
      setMainImage(product.images[newIndex]);
      return newIndex;
    });
  };

  const handleNextThumbnail = () => {
    setCurrentThumbnailIndex((prevIndex) => {
      const newIndex =
        prevIndex === product.images.length - 1 ? 0 : prevIndex + 1;
      setMainImage(product.images[newIndex]);
      return newIndex;
    });
  };

  // When an image variant is selected
  const handleImageVariantChange = (variantValue) => {
    setSelectedImageVariant(variantValue);
    const selectedOption = product.imageVariants?.find(
      (v) => v.value === variantValue
    );
    if (selectedOption && selectedOption.imageUrl) {
      setMainImage(selectedOption.imageUrl); // Update main image in modal
    }
  };

  const hasSalePrice = product.salePrice && product.salePrice < product.price;

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      title="Product Quick View" // Added title
      fullScreen={false} // Use fullScreen prop
      className="w-[90%] md:w-[70%] lg:w-[70%] pb-4 "
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 p-6">
        {/* Left Section: Images */}
        <div className="relative bg-gray-50 flex flex-col items-center justify-center rounded-md p-4">
          {/* "New" Badge */}
          <span className="absolute top-6 left-6 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase z-10">
            {t("new")}
          </span>
          <img
            src={mainImage}
            alt={product.name}
            className="max-w-full max-h-[400px] object-contain rounded-md"
          />
          {product.images && product.images.length > 1 && (
            <div className="relative w-full mt-4">
              <div className="flex justify-center items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  onClick={handlePrevThumbnail}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <div className="flex overflow-hidden space-x-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      className={cn(
                        "w-16 h-16 rounded-md overflow-hidden border-2 transition-colors",
                        mainImage === image
                          ? "border-dynamic-primary-color"
                          : "border-transparent hover:border-border"
                      )}
                      onClick={() => handleThumbnailClick(image, index)}
                    >
                      <img
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  onClick={handleNextThumbnail}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Right Section: Product Info */}
        <div className="p-0 space-y-4">
          <div className="flex items-center justify-between">
            <h2
              className="text-2xl font-bold"
              style={{ fontFamily: `var(--dynamic-heading-font)` }}
            >
              {product.name}
            </h2>
            {/* Placeholder for Brand Logo */}
            {product.brandLogoUrl && (
              <img src={product.brandLogoUrl} alt="Brand" className="h-8" />
            )}
          </div>

          {/* <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            {renderStars(product.rating || 0)}
            <span>
              ({product.reviewCount || 0} {t("reviews")})
            </span>
          </div> */}

          <div className="flex items-center space-x-2">
            {hasSalePrice && (
              <p className="text-xl font-bold text-destructive line-through">
                {formatPrice(
                  product.price,
                  currentCurrency,
                  currencyConversionRate
                )}
              </p>
            )}
            <p className="text-2xl font-bold text-dynamic-primary-color">
              {formatPrice(
                currentPrice,
                currentCurrency,
                currencyConversionRate
              )}
            </p>
          </div>

          <p
            className="text-sm text-muted-foreground leading-relaxed"
            dangerouslySetInnerHTML={{
              __html:
                product.shortDescription ||
                product.description?.substring(0, 150) + "...",
            }}
          />

          {/* Color Options */}
          {product.colors && product.colors.length > 0 && (
            <div>
              <Label
                htmlFor="color-select"
                className="block text-sm font-medium mb-2"
              >
                {t("color")}:{" "}
                <span className="font-semibold text-foreground">
                  {selectedColorOption?.label || selectedColor || t("select_color")}
                </span>
              </Label>
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
                        selectedColor === color.value
                          ? "border-dynamic-primary-color"
                          : "border-border"
                      )}
                      style={{ backgroundColor: color.hex }}
                    />
                    <Label htmlFor={`color-${color.value}`} className="sr-only">
                      {color.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}

          {/* Size Options (now a RadioGroup) */}
          {product.sizes && product.sizes.length > 0 && (
            <div>
              <Label
                htmlFor="size-select"
                className="block text-sm font-medium mb-2"
              >
                {t("size")}:{" "}
                <span className="font-semibold text-foreground">
                  {t(selectedSizeOption?.label) || t(selectedSize) || t("select_size")}
                </span>
              </Label>
              <RadioGroup
                value={selectedSize}
                onValueChange={setSelectedSize}
                className="flex flex-wrap gap-2"
              >
                {product.sizes.map((size) => (
                  <div key={size.value}>
                    <RadioGroupItem
                      value={size.value}
                      id={`size-${size.value}`}
                      className="sr-only"
                    />
                    <Label
                      htmlFor={`size-${size.value}`}
                      className={cn(
                        "flex items-center justify-center h-9 px-4 rounded-md border-2 cursor-pointer transition-colors",
                        selectedSize === size.value
                          ? "border-dynamic-primary-color bg-dynamic-primary-color text-dynamic-secondary-color"
                          : "border-border bg-background text-foreground hover:bg-accent"
                      )}
                    >
                      {t(size.label)}{" "}
                      {size.extraPrice > 0 && `(+${formatPrice(size.extraPrice, currentCurrency, currencyConversionRate)})`}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}

          {/* Image Variants */}
          {product.imageVariants && product.imageVariants.length > 0 && (
            <div>
              <Label
                htmlFor="image-variant-select"
                className="block text-sm font-medium mb-2"
              >
                {t("image_variant")}:{" "}
                <span className="font-semibold text-foreground">
                  {selectedImageVariantOption?.label || selectedImageVariant || t("select_image_variant")}
                </span>
              </Label>
              <RadioGroup
                value={selectedImageVariant}
                onValueChange={handleImageVariantChange}
                className="flex space-x-2"
              >
                {product.imageVariants.map((variant) => (
                  <div key={variant.value}>
                    <RadioGroupItem
                      value={variant.value}
                      id={`image-variant-${variant.value}`}
                      className="sr-only"
                    />
                    <Label
                      htmlFor={`image-variant-${variant.value}`}
                      className={cn(
                        "flex items-center justify-center w-16 h-16 rounded-md overflow-hidden border-2 cursor-pointer transition-colors",
                        selectedImageVariant === variant.value
                          ? "border-dynamic-primary-color"
                          : "border-border hover:border-gray-400"
                      )}
                    >
                      <img
                        src={variant.imageUrl}
                        alt={variant.label}
                        className="w-full h-full object-cover"
                      />
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}

          {/* Stock Info */}
          <p className="text-sm text-green-600 font-medium">
            {t("in_stock")} {product.stockQuantity || 300} {t("items")}
          </p>

          {/* Quantity and Add to Cart / Buy Now */}
          <div className="flex items-start md:items-center flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
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
                onChange={(e) =>
                  setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                }
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
            <div className="flex flex-grow space-x-2">
              <ThemedButton
                onClick={handleAddToCart}
                className="flex-1 h-10 text-base "
              >
                {t("add_to_cart")}
              </ThemedButton>
              <ThemedButton
                onClick={handleBuyNow}
                className="flex-1 h-10 text-base  bg-red-500 hover:bg-red-600 text-white"
              >
                {t("buy_now")}
              </ThemedButton>
            </div>
          </div>

          {/* Additional Actions */}
          <div className="flex items-center gap-4 flex-wrap text-sm border-b pb-4">
            <Button
              variant="ghost"
              className="flex items-center space-x-1 p-0 text-muted-foreground hover:text-dynamic-primary-color"
              onClick={showComingSoon}
            >
              <RefreshCw className="h-4 w-4" />
              <span>{t("add_to_compare")}</span>
            </Button>
            <Button
              variant="ghost"
              className="flex items-center space-x-1 p-0 text-muted-foreground hover:text-dynamic-primary-color"
              onClick={showComingSoon}
            >
              <Heart className="h-4 w-4" />
              <span>{t("add_to_wishlist")}</span>
            </Button>
          </div>

          {/* SKU and Share */}
          <div className="space-y-2">
            {product.sku && (
              <p className="text-sm text-muted-foreground">
                SKU:{" "}
                <span className="font-medium text-foreground">
                  {product.sku}
                </span>
              </p>
            )}
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span>{t("share")}:</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-blue-600"
                onClick={showComingSoon}
              >
                <Facebook className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-gray-800"
                onClick={showComingSoon}
              >
                <Twitter className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-red-600"
                onClick={showComingSoon}
              >
                <Share2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-blue-700"
                onClick={showComingSoon}
              >
                <Linkedin className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-blue-400"
                onClick={showComingSoon}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </CustomModal>
  );
};

export default ProductQuickViewModal;