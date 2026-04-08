"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/utils/api.js";
import { showSuccess, showError, showInfo } from "@/utils/toast.js";

// Fetch all available subscription plans
const fetchSubscriptionPlans = async () => {
  const response = await api.get("/owner/subscriptions");
  return response.data;
};

// Fetch current user's subscription status
const fetchCurrentSubscription = async () => {
  const response = await api.get("/owner/subscription");
  return response.data;
};

// Fetch billing history
const fetchBillingHistory = async () => {
  const response = await api.get("/owner/billing-history");
  return response.data;
};

// Subscribe to a plan
const subscribeToPlan = async (payload) => {
  const response = await api.post("/owner/subscribe", payload);
  return response.data;
};

// Verify payment
const verifyPayment = async (payload) => {
  const response = await api.post("/owner/payment/verify", payload);
  return response.data;
};

// Cancel subscription
const cancelSubscription = async () => {
  const response = await api.post("/owner/subscription/cancel");
  return response.data;
};

export const useSubscriptionPlans = () => {
  return useQuery({
    queryKey: ["subscriptionPlans"],
    queryFn: fetchSubscriptionPlans,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useCurrentSubscription = () => {
  return useQuery({
    queryKey: ["currentSubscription"],
    queryFn: fetchCurrentSubscription,
    staleTime: 1000 * 60, // 1 minute
    refetchInterval: 1000 * 60, // Refetch every minute to keep status fresh
  });
};

export const useBillingHistory = () => {
  return useQuery({
    queryKey: ["billingHistory"],
    queryFn: fetchBillingHistory,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useSubscribeMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: subscribeToPlan,
    onSuccess: (data) => {
      showInfo(data.payment_details || "Subscription initiated. Please complete payment.");
      queryClient.invalidateQueries({ queryKey: ["currentSubscription"] });
      queryClient.invalidateQueries({ queryKey: ["billingHistory"] });
    },
    onError: (err) => {
      showError(err.response?.data?.message || "Failed to initiate subscription.");
    },
  });
};

export const useVerifyPaymentMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: verifyPayment,
    onSuccess: (data) => {
      showSuccess(data.message || "Payment verified successfully!");
      queryClient.invalidateQueries({ queryKey: ["currentSubscription"] });
      queryClient.invalidateQueries({ queryKey: ["billingHistory"] });
    },
    onError: (err) => {
      showError(err.response?.data?.message || "Failed to verify payment.");
    },
  });
};

export const useCancelSubscriptionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: cancelSubscription,
    onSuccess: (data) => {
      showSuccess(data.message || "Subscription cancelled successfully!");
      queryClient.invalidateQueries({ queryKey: ["currentSubscription"] });
      queryClient.invalidateQueries({ queryKey: ["billingHistory"] });
    },
    onError: (err) => {
      showError(err.response?.data?.message || "Failed to cancel subscription.");
    },
  });
};