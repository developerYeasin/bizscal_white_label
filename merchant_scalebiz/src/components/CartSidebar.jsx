"use client";

import React from "react";
import { Link } from "react-router-dom";
import CustomSidebar from "./CustomSidebar"; // NEW IMPORT
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Plus, Minus, ShoppingBag, RefreshCcw } from "lucide-react";
import { useCart } from "@/context/CartContext";
import ThemedButton from "@/components/ThemedButton";
import { useTranslation } from "react-i18next";
import { useStorePath } from "@/hooks/use-store-path";
import { cn, formatPrice } from "@/lib/utils"; // Import formatPrice
import { useStore } from "@/context/StoreContext"; // Import useStore
import { useNavigate } from "react-router-dom";

const CartSidebar = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const { cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();
  const getPath = useStorePath();
  const { currentCurrency, currencyConversionRate, storeConfig } = useStore(); // Use currency context and storeConfig
  const navigate = useNavigate();
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  
  // Get free shipping threshold from storeConfig, defaulting to 0 if not found
  const freeShippingThreshold = parseFloat(storeConfig?.deliverySettings?.buy_amount_to_get_free_delivery || 0);
  const remainingForFreeShipping = freeShippingThreshold - cartTotal;

  return (
    <CustomSidebar
      isOpen={isOpen}
      onClose={onClose}
      title={`${t("your_cart_title")} ${totalItems} ${t("items")}`}
    >
      {cartItems.length === 0 ? (
        <div className="flex-grow flex flex-col items-center justify-center text-center px-6">
          <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
          <p className="text-lg text-muted-foreground mb-6">
            {t("cart_empty")}
          </p>
          <ThemedButton
            onClick={() => {
              navigate("/collections/all");
              onClose();
            }}
          >
            {t("continue_shopping_button")}
          </ThemedButton>
        </div>
      ) : (
        <>
          <div className="flex-grow overflow-y-auto px-2 py-2 sm:px-6 sm:py-4">
            <ul className="divide-y divide-border">
              {cartItems.map((item) => (
                <li key={item.id} className="flex py-4 relative">
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="absolute -left-2 top-4 text-muted-foreground hover:text-destructive p-1"
                    aria-label={`Remove ${item.name}`}
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <Link
                    to={getPath(`/products/${item.id}`)}
                    onClick={onClose}
                    className="flex-shrink-0 ml-6"
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-md mr-2 sm:mr-4"
                    />
                  </Link>
                  <div className="flex-grow flex flex-col justify-between">
                    <Link
                      to={getPath(`/products/${item.id}`)}
                      onClick={onClose}
                      className="hover:underline"
                    >
                      <h3 className="text-sm font-medium text-foreground line-clamp-1">
                        {item.name}
                      </h3>
                    </Link>
                    {item.colors && item.colors.length > 0 && (
                      <p className="text-xs text-muted-foreground">
                        {t("color")}: {item.colors[0].label}
                      </p>
                    )}
                    {item.sizes && item.sizes.length > 0 && (
                      <p className="text-xs text-muted-foreground">
                        {t("size")}: {item.sizes[0].label}
                      </p>
                    )}
                    <div className="flex items-center mt-2 text-xs text-muted-foreground">
                      <span className="mr-1">{t("qty")}:</span>
                      <Input
                        id={`qty-${item.id}`}
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          updateQuantity(item.id, parseInt(e.target.value) || 1)
                        }
                        className="w-10 h-6 text-center text-xs border-0 bg-transparent focus-visible:ring-0 p-0"
                        min="1"
                      />
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity)}
                        className="ml-1 text-muted-foreground hover:text-dynamic-primary-color"
                        aria-label="Update quantity"
                      >
                        <RefreshCcw className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                  <p className="text-base font-bold text-destructive flex-shrink-0 ml-2 ms:ml-4">
                    {formatPrice(
                      item.price * item.quantity,
                      currentCurrency,
                      currencyConversionRate
                    )}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t border-border pt-4 mt-auto px-6 pb-6 flex-shrink-0">
            <div className="flex justify-between items-center text-base font-bold mb-4">
              <span className="text-foreground uppercase">
                {t("subtotal")}:
              </span>
              <span className="text-destructive">
                {formatPrice(
                  cartTotal,
                  currentCurrency,
                  currencyConversionRate
                )}
              </span>
            </div>

            {freeShippingThreshold > 0 && remainingForFreeShipping > 0 ? (
              <div className="bg-blue-50 text-blue-700 text-sm p-3 rounded-md text-center mb-4">
                {t("spend_more_for_free_shipping", {
                  amount: formatPrice(
                    remainingForFreeShipping,
                    currentCurrency,
                    currencyConversionRate
                  ),
                })}
              </div>
            ) : ( freeShippingThreshold > 0 &&
              <div className="bg-green-50 text-green-700 text-sm p-3 rounded-md text-center mb-4">
                {t("you_got_free_shipping")}
              </div>
            )}

            <div className="flex space-x-2">
              <Link to={getPath("/cart")} onClick={onClose} className="flex-1">
                <ThemedButton
                  variant="outline"
                  className="w-full border-blue-500 text-blue-500 hover:bg-blue-50 hover:text-blue-500"
                >
                  {t("view_cart")}
                </ThemedButton>
              </Link>
              <Link
                to={getPath("/checkout")}
                onClick={onClose}
                className="flex-1"
              >
                <ThemedButton className="w-full bg-blue-500 text-white hover:bg-blue-600">
                  {t("checkout")}
                </ThemedButton>
              </Link>
            </div>
          </div>
        </>
      )}
    </CustomSidebar>
  );
};

export default CartSidebar;