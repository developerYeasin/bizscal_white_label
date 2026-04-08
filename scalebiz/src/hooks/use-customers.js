"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/utils/api.js";

const fetchCustomers = async ({ page = 1, limit = 10, search }) => {
  const params = { page, limit };
  if (search) {
    params.search = search;
  }
  const response = await api.get("/owner/store/customers", { params });
  return response.data;
};

export const useCustomers = (page, limit, search) => {
  return useQuery({
    queryKey: ["customers", { page, limit, search }],
    queryFn: () => fetchCustomers({ page, limit, search }),
    keepPreviousData: true,
  });
};