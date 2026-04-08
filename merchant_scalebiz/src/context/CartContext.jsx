import React, { createContext, useState, useContext, useEffect } from "react";
import { useStore } from "./StoreContext"; // Import useStore
import { getNumericPriceForGTM } from "@/lib/utils"; // Import for GTM

const CartContext = createContext(undefined);
const LOCAL_STORAGE_KEY = "dyad_cart_items";

export const CartProvider = ({ children }) => {
  const { currentCurrency, currencyConversionRate } = useStore(); // Get currency info
  // Initialize cart items from localStorage or an empty array
  const [cartItems, setCartItems] = useState(() => {
    try {
      const storedCartItems = localStorage.getItem(LOCAL_STORAGE_KEY);
      return storedCartItems ? JSON.parse(storedCartItems) : [];
    } catch (error) {
      console.error("Failed to parse cart items from localStorage:", error);
      return [];
    }
  });

  // Save cart items to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cartItems));
    } catch (error) {
      console.error("Failed to save cart items to localStorage:", error);
    }
  }, [cartItems]);

  const addToCart = (product, quantity, adjustedPrice, selectedVariantOptions = []) => {
    // console.log("[CartContext] Adding product to cart:", { productId: product.id, productName: product.name, productCategory: product.category, quantity, adjustedPrice, selectedVariantOptions });

    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (item) => item.id === product.id
      );

      let updatedItems;
      let itemAddedToCart;

      if (existingItemIndex > -1) {
        updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += quantity;
        // If variants are passed, update them (e.g., if user changes selection in quick view)
        if (selectedVariantOptions.length > 0) {
          updatedItems[existingItemIndex].selectedVariantOptions = selectedVariantOptions;
        }
        // Also update the price if it's different (e.g., if variants changed)
        updatedItems[existingItemIndex].price = adjustedPrice;
        itemAddedToCart = updatedItems[existingItemIndex];
      } else {
        itemAddedToCart = { ...product, quantity, price: adjustedPrice, selectedVariantOptions };
        updatedItems = [...prevItems, itemAddedToCart];
      }

      // GTM: add_to_cart event
      if (window.dataLayer) {
        const itemPrice = getNumericPriceForGTM(adjustedPrice, currentCurrency, currencyConversionRate);
        window.dataLayer.push({ ecommerce: null }); // Clear previous ecommerce object
        window.dataLayer.push({
          event: 'add_to_cart',
          ecommerce: {
            currency: currentCurrency,
            value: (itemPrice * quantity),
            items: [{
              item_id: product.sku || product.id.toString(),
              item_name: product.name,
              currency: currentCurrency,
              price: itemPrice,
              quantity: quantity,
              item_category: product.category || 'N/A',
              item_brand: product.brand || 'N/A'
            }]
          }
        });
        // console.log("GTM: 'add_to_cart' event pushed for product:", product.name, "quantity:", quantity);
      }

      return updatedItems;
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.id !== productId)
    );
  };

  const updateQuantity = (productId, quantity) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId ? { ...item, quantity: Math.max(1, quantity) } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartTotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a StoreProvider");
  }
  return context;
};