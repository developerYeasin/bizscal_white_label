"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/utils/api.js";
import { format } from "date-fns";

const fetchOrderReport = async ({ filter, startDate, endDate }) => {
  const params = {};
  if (filter && filter !== "custom") {
    params.filter = filter;
  } else if (filter === "custom" && startDate && endDate) {
    params.filter = "custom";
    // Format dates to ISO string for backend, using XXX for UTC offset
    params.startDate = format(startDate, "yyyy-MM-dd'T'00:00:00.000XXX");
    params.endDate = format(endDate, "yyyy-MM-dd'T'23:59:59.999XXX");
  } else {
    // Default to 'this_month' if no filter or custom dates are provided
    params.filter = "this_month";
  }

  const response = await api.get("/owner/orders/report", { params });
  return response.data;
};

export const useOrderReport = (filter, startDate, endDate) => {
  return useQuery({
    queryKey: ["orderReport", { filter, startDate: startDate?.toISOString(), endDate: endDate?.toISOString() }],
    queryFn: () => fetchOrderReport({ filter, startDate, endDate }),
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5, // Data considered fresh for 5 minutes
  });
};