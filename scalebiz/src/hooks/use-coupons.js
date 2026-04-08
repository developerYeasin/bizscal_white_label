"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/utils/api.js";
import { showSuccess, showError } from "@/utils/toast.js";

// Fetch paginated coupons
const fetchCoupons = async ({ page = 1, limit = 10 }) => {
  const response = await api.get("/owner/coupons", { params: { page, limit } });
  return response.data;
};

// Create a new coupon
const createCoupon = async (newCoupon) => {
  const response = await api.post("/owner/coupons", newCoupon);
  return response.data;
};

// Update an existing coupon
const updateCoupon = async (updatedCoupon) => {
  const { id, ...payload } = updatedCoupon;
  const response = await api.put(`/owner/coupons/${id}`, payload);
  return response.data;
};

// Delete a coupon
const deleteCoupon = async (id) => {
  await api.delete(`/owner/coupons/${id}`);
  return id;
};

export const useCoupons = (page, limit) => {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["coupons", { page, limit }],
    queryFn: () => fetchCoupons({ page, limit }),
    keepPreviousData: true,
  });

  const createCouponMutation = useMutation({
    mutationFn: createCoupon,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
      showSuccess(response.message || "Coupon created successfully!");
    },
    onError: (err) => {
      showError(err.response?.data?.message || "Failed to create coupon.");
    },
  });

  const updateCouponMutation = useMutation({
    mutationFn: updateCoupon,
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
      queryClient.invalidateQueries({ queryKey: ["coupon", variables.id] });
      showSuccess(response.message || "Coupon updated successfully!");
    },
    onError: (err) => {
      showError(err.response?.data?.message || "Failed to update coupon.");
    },
  });

  const deleteCouponMutation = useMutation({
    mutationFn: deleteCoupon,
    onSuccess: (deletedCouponId) => {
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
      showSuccess("Coupon deleted successfully!");
    },
    onError: (err) => {
      showError(err.response?.data?.message || "Failed to delete coupon.");
    },
  });

  return {
    couponsData: data,
    isLoading,
    error,
    createCoupon: createCouponMutation.mutate,
    isCreating: createCouponMutation.isPending,
    updateCoupon: updateCouponMutation.mutate,
    isUpdating: updateCouponMutation.isPending,
    deleteCoupon: deleteCouponMutation.mutate,
  };
};