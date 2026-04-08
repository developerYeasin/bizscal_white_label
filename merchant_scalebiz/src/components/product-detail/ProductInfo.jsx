"use client";

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import ThemedButton from "@/components/ThemedButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Star,
  Heart,
  RefreshCw,
  Share2,
  Plus,
  Minus,
  ShoppingBag,
} from "lucide-react"; // Added ShoppingBag icon
import { cn, formatPrice } from "@/lib/utils"; // Import formatPrice
import { useCart } from "@/context/CartContext";
import { showSuccess, showError } from "@/utils/toast";
import { Button } from "@/components/ui/button";
import CashOnDeliveryPopup from "@/components/CashOnDeliveryPopup"; // Import the new popup
import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router-dom";
import { useStore } from "@/context/StoreContext.jsx"; // Import useStore

const ProductInfo = ({ product, setMainDisplayedImage }) => {
  // Accept setMainDisplayedImage
  const { t } = useTranslation(); // Initialize useTranslation
  const { addToCart } = useCart();
  const navigate = useNavigate(); // Initialize useNavigate
  const { onOpenCartSidebar } = useOutletContext();
  const { currentCurrency, currencyConversionRate, storeConfig } = useStore(); // Use currency context and storeConfig

  // Get theme and product page settings from storeConfig
  const productPageSettings = storeConfig?.pages?.productPage || {};
  const showSku = productPageSettings.show_sku !== false;
  const showStock = productPageSettings.show_stock_status !== false;
  const buyNowEnabled = storeConfig?.theme?.buyNowButtonEnabled !== 0;

  // // console.log("[ProductInfo] currentCurrency:", currentCurrency, "conversionRate:", currencyConversionRate);
  console.log("product >> ", product);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(""); // No default selection
  const [selectedSize, setSelectedSize] = useState(""); // No default selection
  const [selectedImageVariant, setSelectedImageVariant] = useState(""); // No default selection
  const [isCashOnDeliveryPopupOpen, setIsCashOnDeliveryPopupOpen] =
    useState(false); // State for COD popup

  // Calculate current price based on selected variants
  const basePrice = parseFloat(product.salePrice || product.price || 0); // Explicit parseFloat
  let currentPrice = basePrice;

  const selectedColorOption = product.colors?.find(
    (c) => c.value === selectedColor,
  );
  if (selectedColorOption && selectedColorOption.extraPrice) {
    currentPrice += selectedColorOption.extraPrice;
  }

  const selectedSizeOption = product.sizes?.find(
    (s) => s.value === selectedSize,
  );
  if (selectedSizeOption && selectedSizeOption.extraPrice) {
    currentPrice += selectedSizeOption.extraPrice;
  }

  const selectedImageVariantOption = product.imageVariants?.find(
    (iv) => iv.value === selectedImageVariant,
  );
  if (selectedImageVariantOption && selectedImageVariantOption.extraPrice) {
    currentPrice += selectedImageVariantOption.extraPrice;
  }

  // DEBUG LOGS
  // console.log("ProductInfo - product object:", product);
  // console.log(
  //   "ProductInfo - product.price:",
  //   product.price,
  //   "product.salePrice:",
  //   product.salePrice
  // );
  // console.log("ProductInfo - basePrice:", basePrice);
  // console.log(
  //   "ProductInfo - currentPrice (after variants):",
  //   currentPrice
  // );
  // console.log("ProductInfo - currentCurrency:", currentCurrency);
  // console.log(
  //   "ProductInfo - currencyConversionRate:",
  //   currencyConversionRate
  // );

  // Placeholder for star rating
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
              : "text-gray-300",
          )}
        />,
      );
    }
    return <div className="flex space-x-0.5">{stars}</div>;
  };

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
    if (
      product.imageVariants &&
      product.imageVariants.length > 0 &&
      !selectedImageVariant
    ) {
      const errorMessage = t("please_select_all_variants");
      // console.log(
      //   "Validation failed: Image Variant not selected. Message:",
      //   errorMessage
      // );
      showError(errorMessage);
      return false;
    }
    // console.log("All variants selected or not required.");
    return true;
  };

  const getSelectedVariantOptions = () => {
    const options = [];
    const selectedColorOption = product.colors?.find(
      (c) => c.value === selectedColor,
    );
    const selectedSizeOption = product.sizes?.find(
      (s) => s.value === selectedSize,
    );
    const selectedImageVariantOption = product.imageVariants?.find(
      (iv) => iv.value === selectedImageVariant,
    );

    if (selectedColorOption) {
      options.push({
        type: "color",
        value: selectedColorOption.value,
        label: selectedColorOption.label,
        hex: selectedColorOption.hex,
        extraPrice: selectedColorOption.extraPrice,
      });
    }
    if (selectedSizeOption) {
      options.push({
        type: "size",
        value: selectedSizeOption.value,
        label: selectedSizeOption.label,
        extraPrice: selectedSizeOption.extraPrice,
      });
    }
    if (selectedImageVariantOption) {
      options.push({
        type: "image",
        value: selectedImageVariantOption.value,
        label: selectedImageVariantOption.label,
        imageUrl: selectedImageVariantOption.imageUrl,
        extraPrice: selectedImageVariantOption.extraPrice,
      });
    }
    return options;
  };

  const handleAddToCart = () => {
    if (product.isStockOut) {
      showError(t("product_out_of_stock"));
      return;
    }
    if (product && validateVariants()) {
      addToCart(product, quantity, currentPrice, getSelectedVariantOptions());
      showSuccess(`${product.name} ${t("added_to_cart")}!`);
      onOpenCartSidebar(); // Open cart sidebar after adding to cart
    } else if (!product) {
      showError(t("could_not_add_to_cart"));
    }
  };

  const handleBuyNow = () => {
    if (product.isStockOut) {
      showError(t("product_out_of_stock"));
      return;
    }
    if (product && validateVariants()) {
      // Add to cart and then navigate to checkout
      addToCart(product, quantity, currentPrice, getSelectedVariantOptions());
      showSuccess(
        `${product.name} ${t("added_to_cart")}. ${t(
          "redirecting_to_checkout",
        )}...`,
      );
      navigate("/checkout");
    } else if (!product) {
      showError(t("could_not_proceed_purchase"));
    }
  };

  const handleCashOnDeliveryOrder = () => {
    if (product.isStockOut) {
      showError(t("product_out_of_stock"));
      return;
    }
    if (product && validateVariants()) {
      // Only open the popup, the popup itself will handle the order creation
      // showSuccess(`${t("opening_cod_popup")}...`); // Updated message
      setIsCashOnDeliveryPopupOpen(true); // Open COD popup
    } else if (!product) {
      showError(t("could_not_proceed_purchase"));
    }
  };

  const showComingSoon = () => {
    showSuccess(t("feature_coming_soon"));
  };

  // When an image variant is selected
  const handleImageVariantChange = (variantValue) => {
    setSelectedImageVariant(variantValue);
    const selectedOption = product.imageVariants?.find(
      (v) => v.value === variantValue,
    );
    if (selectedOption && selectedOption.imageUrl) {
      setMainDisplayedImage(selectedOption.imageUrl); // Update main image in gallery
    }
  };

  return (
    <div className="space-y-6">
      {/* Product Name & Price */}
      <h1
        className="text-3xl md:text-4xl font-bold"
        style={{
          color: `var(--dynamic-primary-color)`,
          fontFamily: `var(--dynamic-heading-font)`,
        }}
      >
        {product.name}
      </h1>
      <div className="flex items-center space-x-4 mb-4">
        {product.salePrice && (
          <p className="text-2xl font-bold text-destructive line-through">
            {formatPrice(
              product.price,
              currentCurrency,
              currencyConversionRate,
            )}
          </p>
        )}
        <p className="text-3xl font-bold text-dynamic-primary-color">
          {formatPrice(currentPrice, currentCurrency, currencyConversionRate)}{" "}
          {/* Use currentPrice here */}
        </p>
        {/* <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          {renderStars(product.rating || 4)}
          <span>
            ({product.reviewCount || 0} {t("reviews")})
          </span>
        </div> */}
      </div>

      {/* Short Description */}
      <p
        className="text-base text-muted-foreground leading-relaxed"
        dangerouslySetInnerHTML={{
          __html:
            product.shortDescription ||
            product.description?.substring(0, 150) + "...",
        }}
      />

      {/* SKU */}
      {showSku && product.sku && (
        <p className="text-sm text-muted-foreground">
          SKU:{" "}
          <span className="font-medium text-foreground">{product.sku}</span>
        </p>
      )}

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
                      : "border-border",
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
              {t(selectedSizeOption?.label) ||
                t(selectedSize) ||
                t("select_size")}
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
                      : "border-border bg-background text-foreground hover:bg-accent",
                  )}
                >
                  {t(size.label)}{" "}
                  {size.extraPrice > 0 &&
                    `(+${formatPrice(
                      size.extraPrice,
                      currentCurrency,
                      currencyConversionRate,
                    )})`}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      )}

      {/* Image Variants (New Section) */}
      {product.imageVariants && product.imageVariants.length > 0 && (
        <div>
          <Label
            htmlFor="image-variant-select"
            className="block text-sm font-medium mb-2"
          >
            {t("image_variant")}:{" "}
            <span className="font-semibold text-foreground">
              {selectedImageVariantOption?.label ||
                selectedImageVariant ||
                t("select_image_variant")}
            </span>
          </Label>
          {/* Change from Select to RadioGroup */}
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
                      : "border-border hover:border-gray-400",
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
      {showStock && (
        product.isStockOut ? (
          <p className="text-sm text-red-600 font-medium">{t("out_of_stock")}</p>
        ) : (
          <p className="text-sm text-green-600 font-medium">
            {t("in_stock")} {product.stockQuantity || 300} {t("items")}
          </p>
        )
      )}

      {/* New: Cash On Delivery Button */}
      <ThemedButton
        onClick={handleCashOnDeliveryOrder}
        className="w-full h-12 text-base bg-green-600 hover:bg-green-700 text-white flex items-center justify-center space-x-2 animate-pulse-scale"
        disabled={product.isStockOut}
      >
        <ShoppingBag className="h-5 w-5" />
        <span>
          {product.isStockOut ? t("out_of_stock") : t("do_on_cash_on_delivery")}
        </span>
      </ThemedButton>
      {/* Quantity and Add to Cart / Buy Now */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center border rounded-md">
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10 rounded-none rounded-l-md"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={product.isStockOut}
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
            disabled={product.isStockOut}
          />
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10 rounded-none rounded-r-md"
            onClick={() => setQuantity(quantity + 1)}
            disabled={product.isStockOut}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-grow gap-2 flex-wrap ">
          {" "}
          {/* New wrapper div */}
          <ThemedButton
            onClick={handleAddToCart}
            className="flex-1 h-10 text-base" // Changed to flex-1
            disabled={product.isStockOut}
          >
            {product.isStockOut ? t("out_of_stock") : t("add_to_cart")}
          </ThemedButton>
          {buyNowEnabled && (
            <ThemedButton
              onClick={handleBuyNow}
              className="flex-1 h-10 text-base bg-green-600 hover:bg-green-700 text-white" // Changed to flex-1
              disabled={product.isStockOut}
            >
              {product.isStockOut ? t("out_of_stock") : t("buy_now")}
            </ThemedButton>
          )}
        </div>
      </div>

      {/* Additional Actions */}
      <div className="flex items-center space-x-4 text-sm flex-wrap ">
        <Button
          variant="ghost"
          className="flex items-center space-x-1 text-muted-foreground hover:text-dynamic-primary-color"
          onClick={showComingSoon}
          disabled={product.isStockOut}
        >
          <RefreshCw className="h-4 w-4" />
          <span>{t("add_to_compare")}</span>
        </Button>
        <Button
          variant="ghost"
          className="flex items-center space-x-1 text-muted-foreground hover:text-dynamic-primary-color"
          onClick={showComingSoon}
          disabled={product.isStockOut}
        >
          <Heart className="h-4 w-4" />
          <span>{t("add_to_wishlist")}</span>
        </Button>
        <Link
          to="#"
          className="text-muted-foreground hover:text-dynamic-primary-color"
          onClick={showComingSoon}
        >
          {t("size_guide")}
        </Link>
      </div>

      {/* Social Share */}
      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
        <span>{t("share")}:</span>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-dynamic-primary-color"
          onClick={showComingSoon}
        >
          <Share2 className="h-4 w-4" />
        </Button>
        {/* Add more social icons as needed */}
      </div>

      {/* Cash On Delivery Popup */}
      <CashOnDeliveryPopup
        isOpen={isCashOnDeliveryPopupOpen}
        onClose={() => setIsCashOnDeliveryPopupOpen(false)}
        initialProduct={product}
        initialQuantity={quantity}
        initialSelectedVariants={getSelectedVariantOptions()}
      />
    </div>
  );
};

export default ProductInfo;
