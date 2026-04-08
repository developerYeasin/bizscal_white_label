import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/utils/api.js";
import { showSuccess, showError } from "@/utils/toast.js";

// Fetch cart
const fetchCart = async () => {
  const response = await api.get("/cart");
  return response.data.data.cart;
};

// Add item to cart
const addToCart = async ({ productId, quantity = 1, variants = {} }) => {
  const response = await api.post("/cart/items", {
    product_id: productId,
    quantity,
    selected_variants: variants,
  });
  return response.data;
};

// Update cart item
const updateCartItem = async (itemId, quantity) => {
  const response = await api.put(`/cart/items/${itemId}`, { quantity });
  return response.data;
};

// Remove cart item
const removeCartItem = async (itemId) => {
  await api.delete(`/cart/items/${itemId}`);
};

// Clear cart
const clearCart = async () => {
  await api.delete("/cart");
};

export const useCart = () => {
  const queryClient = useQueryClient();

  const {
    data: cart,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["cart"],
    queryFn: fetchCart,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const addMutation = useMutation({
    mutationFn: addToCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      showSuccess("Item added to cart!");
    },
    onError: (err) => {
      showError(err.response?.data?.message || "Failed to add item to cart.");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ itemId, quantity }) => updateCartItem(itemId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (err) => {
      showError(err.response?.data?.message || "Failed to update cart item.");
    },
  });

  const removeMutation = useMutation({
    mutationFn: removeCartItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      showSuccess("Item removed from cart.");
    },
    onError: (err) => {
      showError(err.response?.data?.message || "Failed to remove item from cart.");
    },
  });

  const clearMutation = useMutation({
    mutationFn: clearCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (err) => {
      showError(err.response?.data?.message || "Failed to clear cart.");
    },
  });

  const cartItems = cart?.items || [];
  const cartTotal = cart?.total_amount || 0;
  const cartSubtotal = cart?.subtotal_amount || 0;
  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return {
    cart,
    cartItems,
    cartTotal,
    cartSubtotal,
    cartItemCount,
    isLoading,
    error,
    addToCart: addMutation.mutate,
    updateCartItem: updateMutation.mutate,
    removeCartItem: removeMutation.mutate,
    clearCart: clearMutation.mutate,
    isAdding: addMutation.isPending,
    isUpdating: updateMutation.isPending,
    isRemoving: removeMutation.isPending,
    isClearing: clearMutation.isPending,
  };
};
