"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/utils/api.js";

// This function will fetch the counts of orders for various statuses.
const fetchOrderStatusCounts = async () => {
  const response = await api.get("/owner/orders-status-counts"); // Updated API endpoint
  // We expect the backend to return an object with counts, e.g., { pending: 25, shipped: 10 }
  return response.data.data.counts;
};

export const usePendingOrdersCount = () => {
  return useQuery({
    queryKey: ["pendingOrdersCount"],
    queryFn: fetchOrderStatusCounts,
    // Optional: refetch every minute to keep the count fresh
    refetchInterval: 60000,
  });
};