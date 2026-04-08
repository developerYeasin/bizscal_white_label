"use client";

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/hooks/use-cart.js";
import { Button } from "@/components/ui/button.jsx";
import { Skeleton } from "@/components/ui/skeleton.jsx";
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from "lucide-react";
import { Separator } from "@/components/ui/separator.jsx";

const CartPage = () => {
  const navigate = useNavigate();
  const {
    cartItems,
    cartTotal,
    cartSubtotal,
    updateCartItem,
    removeCartItem,
    clearCart,
    isLoading,
    isUpdating,
  } = useCart();

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity < 1) {
      removeCartItem(itemId);
    } else {
      updateCartItem({ itemId, quantity: newQuantity });
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-80 w-full" />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <ShoppingBag className="h-20 w-20 mx-auto text-muted-foreground/30 mb-6" />
        <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
        <p className="text-muted-foreground mb-8">Looks like you haven't added anything to your cart yet.</p>
        <Button size="lg" onClick={() => navigate('/products')}>
          Start Shopping
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8" style={{ fontFamily: `var(--dynamic-heading-font)` }}>
        Shopping Cart
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="border rounded-lg p-4 flex gap-4"
            >
              {/* Product Image */}
              <Link to={`/products/${item.product_id}`} className="flex-shrink-0">
                <div className="h-24 w-24 rounded-md overflow-hidden bg-muted">
                  {item.product?.image_url ? (
                    <img
                      src={item.product.image_url}
                      alt={item.product.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                      No image
                    </div>
                  )}
                </div>
              </Link>

              {/* Product Details */}
              <div className="flex-1 flex flex-col">
                <div className="flex justify-between">
                  <div>
                    <Link
                      to={`/products/${item.product_id}`}
                      className="font-medium hover:text-primary transition-colors"
                    >
                      {item.product?.name}
                    </Link>
                    {item.selected_variants && Object.keys(item.selected_variants).length > 0 && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {Object.entries(item.selected_variants)
                          .map(([key, value]) => `${key}: ${value}`)
                          .join(", ")}
                      </p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => removeCartItem(item.id)}
                    disabled={isUpdating}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>

                <div className="mt-auto flex items-center justify-between">
                  {/* Quantity */}
                  <div className="flex items-center border rounded-md">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      disabled={isUpdating}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      disabled={isUpdating}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-medium">
                      ${(item.price_at_purchase * item.quantity).toFixed(2)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      ${item.price_at_purchase.toFixed(2)} each
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Clear Cart */}
          <div className="flex justify-end">
            <Button variant="ghost" size="sm" onClick={() => {
              if (window.confirm("Clear all items from cart?")) {
                clearCart();
              }
            }}>
              Clear Cart
            </Button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="border rounded-lg p-6 sticky top-24">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal ({cartItems.length} items)</span>
                <span>${cartSubtotal?.toFixed(2) || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-muted-foreground">Calculated at checkout</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-base">
                <span>Estimated Total</span>
                <span>${cartTotal?.toFixed(2) || 0}</span>
              </div>
            </div>

            <div className="mt-6">
              <Button size="lg" className="w-full" onClick={() => navigate('/checkout')}>
                Proceed to Checkout
              </Button>
            </div>

            <div className="mt-4 text-center">
              <Link to="/products" className="text-sm text-primary hover:underline flex items-center justify-center gap-1">
                <ArrowLeft className="h-4 w-4" />
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
