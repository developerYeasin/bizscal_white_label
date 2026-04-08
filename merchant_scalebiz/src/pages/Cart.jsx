"use client";

import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "@/context/CartContext.jsx";
import ThemedButton from "@/components/ThemedButton.jsx";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useStore } from "@/context/StoreContext.jsx";
import { Trash2, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input"; // <--- ADDED THIS LINE
import { useTranslation } from "react-i18next";
import { useStorePath } from "@/hooks/use-store-path";
import { formatPrice } from "@/lib/utils"; // Import formatPrice

const Cart = () => {
  const { t } = useTranslation(); // Initialize useTranslation
  const { cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();
  const { storeConfig, currentCurrency, currencyConversionRate } = useStore(); // Use currency context
  const getPath = useStorePath(); // Initialize useStorePath

  return (
    <div className="min-h-screen flex flex-col bg-muted/40">
      {storeConfig && (
        <Header layout={storeConfig.layout} storeName={storeConfig.storeConfiguration.storeName} logoUrl={storeConfig.storeConfiguration.logoUrl} />
      )}
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8" style={{ color: `var(--dynamic-primary-color)`, fontFamily: `var(--dynamic-heading-font)` }}>
          {t('shopping_cart')}
        </h1>

        {cartItems.length === 0 ? (
          <div className="text-center bg-card p-8 rounded-lg shadow-sm">
            <p className="text-lg text-muted-foreground mb-6">{t('cart_empty')}</p>
            <Link to={getPath("/collections/all")}>
              <ThemedButton>
                {t('continue_shopping')}
              </ThemedButton>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8">
              <div className="bg-card rounded-lg shadow-sm">
                <ul className="divide-y divide-border">
                  {cartItems.map((item) => (
                    <li key={item.id} className="flex flex-col sm:flex-row p-6 items-start sm:items-center">
                      <img src={item.imageUrl} alt={item.name} className="w-24 h-24 object-cover rounded-md mr-0 sm:mr-6 mb-4 sm:mb-0 flex-shrink-0" />
                      <div className="flex-grow">
                        <Link to={getPath(`/products/${item.id}`)} className="hover:underline">
                          <h2 className="text-lg font-semibold text-foreground">
                            {item.name}
                          </h2>
                        </Link>
                        <p className="text-muted-foreground text-sm">
                          {formatPrice(item.price, currentCurrency, currencyConversionRate)}
                        </p>
                        <div className="flex items-center mt-4">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-full"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <Label htmlFor={`quantity-${item.id}`} className="sr-only">Quantity for {item.name}</Label>
                          <Input
                            id={`quantity-${item.id}`}
                            name={`quantity-${item.id}`}
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                            className="w-16 h-8 text-center mx-2 border-0 bg-transparent focus-visible:ring-0"
                            min="1"
                          />
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-full"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex flex-col items-end ml-0 sm:ml-4 mt-4 sm:mt-0 self-stretch justify-between">
                        <p className="text-lg font-bold text-foreground">
                          {formatPrice(item.price * item.quantity, currentCurrency, currencyConversionRate)}
                        </p>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFromCart(item.id)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="lg:col-span-4">
              <div className="bg-card p-6 rounded-lg shadow-sm h-fit sticky top-24">
                <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: `var(--dynamic-heading-font)` }}>
                  {t('order_summary')}
                </h2>
                <div className="space-y-2">
                  <div className="flex justify-between text-muted-foreground">
                    <span>{t('subtotal')}</span>
                    <span>{formatPrice(cartTotal, currentCurrency, currencyConversionRate)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>{t('shipping')}</span>
                    <span>Free</span>
                  </div>
                </div>
                <div className="flex justify-between text-xl font-bold border-t pt-4 mt-4">
                  <span>{t('total')}</span>
                  <span>{formatPrice(cartTotal, currentCurrency, currencyConversionRate)}</span>
                </div>
                <Link to={getPath("/checkout")} className="block mt-6">
                  <ThemedButton className="w-full">
                    {t('proceed_to_checkout')}
                  </ThemedButton>
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>
      {storeConfig && (
        <Footer layout={storeConfig.layout.footer} copyrightText={storeConfig.layout.footer.copyrightText} socialLinks={storeConfig.layout.footer.socialLinks} logoUrl={storeConfig.storeConfiguration.logoUrl} storeName={storeConfig.storeConfiguration.storeName} />
      )}
    </div>
  );
};

export default Cart;