"use client";

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CustomModal from "./CustomModal"; // NEW IMPORT
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Minus, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { showSuccess, showError } from "@/utils/toast";
import ThemedButton from "./ThemedButton";
import { cn, formatPrice } from "@/lib/utils"; // Import formatPrice
import { useStore } from "@/context/StoreContext"; // Import useStore

const BuyNowPopup = ({ product, isOpen, onClose }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const { currentCurrency, currencyConversionRate } = useStore(); // Use currency context

  useEffect(() => {
    if (isOpen) {
      setQuantity(1); // Reset quantity when opening the popup
    }
  }, [isOpen]);

  if (!product) {
    return null;
  }

  const handleBuyNow = () => {
    if (product) {
      addToCart(product, quantity);
      showSuccess(`${product.name} added to cart. Redirecting to checkout...`);
      onClose();
      navigate("/checkout");
    } else {
      showError("Could not proceed with purchase.");
    }
  };

  return (
    <CustomModal isOpen={isOpen} onClose={onClose} title="Quick Buy" className="sm:max-w-md">
      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center mt-4">
          <div className="flex justify-center">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-32 h-32 object-cover rounded-md"
            />
          </div>
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="text-lg font-semibold" style={{ fontFamily: `var(--dynamic-heading-font)` }}>
              {product.name}
            </h3>
            <p className="text-xl font-bold text-dynamic-primary-color">
              {formatPrice(product.price, currentCurrency, currencyConversionRate)}
            </p>
            <p className="text-sm text-muted-foreground">
              {product.shortDescription || product.description?.substring(0, 70) + "..."}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center sm:justify-start space-x-4 mt-6">
          <div className="flex items-center border rounded-md">
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 rounded-none rounded-l-md"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <Input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-16 h-9 text-center border-y-0 border-x focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none"
              min="1"
            />
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 rounded-none rounded-r-md"
              onClick={() => setQuantity(quantity + 1)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <ThemedButton onClick={handleBuyNow} className="flex-grow h-9 text-base">
            Buy Now
          </ThemedButton>
        </div>
      </div>
    </CustomModal>
  );
};

export default BuyNowPopup;