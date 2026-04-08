"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/utils/api.js";
import { showSuccess, showError } from "@/utils/toast.js";

// Fetch paginated orders
const fetchOrders = async ({ page = 1, limit = 10, status, search }) => {
  const params = { page, limit };
  if (status && status !== "All Orders") {
    // API expects status like 'confirmed', not 'Order Confirmed'
    params.status = status.replace("Order ", "").toLowerCase();
  }
  if (search) {
    params.search = search;
  }
  const response = await api.get("/owner/store/orders", { params });
  return response.data;
};

// Fetch a single order by ID
const fetchOrderById = async (id) => {
  const response = await api.get(`/owner/store/orders/${id}`); // Updated API endpoint
  return response.data.data.order;
};

// Fetch orders summary
const fetchOrdersSummary = async (period) => {
  const response = await api.get("/owner/store/orders-summary", {
    params: { period }
  });
  return response.data.data;
};

// Create a new order
const createOrder = async (newOrder) => {
  const response = await api.post("/owner/orders", newOrder);
  return response.data;
};

// Update an existing order
const updateOrder = async (updatedOrder) => {
  const { id, ...payload } = updatedOrder;
  const response = await api.put(`/owner/orders/${id}`, payload);
  return response.data;
};

// Delete an order
const deleteOrder = async (id) => {
  await api.delete(`/owner/orders/${id}`);
  return id;
};

export const useOrders = (page, limit, status, search) => {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["orders", { page, limit, status, search }],
    queryFn: () => fetchOrders({ page, limit, status, search }),
    keepPreviousData: true,
  });

  const createOrderMutation = useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      showSuccess("Order created successfully!");
    },
    onError: (err) => {
      showError(err.response?.data?.message || "Failed to create order.");
    },
  });

  const updateOrderMutation = useMutation({
    mutationFn: updateOrder,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["order", variables.id] });
      showSuccess(data.message || "Order updated successfully!");
    },
    onError: (err) => {
      showError(err.response?.data?.message || "Failed to update order.");
    },
  });

  const deleteOrderMutation = useMutation({
    mutationFn: deleteOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      showSuccess("Order deleted successfully!");
    },
    onError: (err) => {
      showError(err.response?.data?.message || "Failed to delete order.");
    },
  });

  return {
    ordersData: data,
    isLoading,
    error,
    createOrder: createOrderMutation.mutate,
    isCreating: createOrderMutation.isPending,
    updateOrder: updateOrderMutation.mutate,
    isUpdating: updateOrderMutation.isPending,
    deleteOrder: deleteOrderMutation.mutate,
  };
};

export const useOrderById = (id) => {
  return useQuery({
    queryKey: ["order", id],
    queryFn: () => fetchOrderById(id),
    enabled: !!id,
  });
};

export const useOrdersSummary = (period) => {
  return useQuery({
    queryKey: ["ordersSummary", period],
    queryFn: () => fetchOrdersSummary(period),
  });
};