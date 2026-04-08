"use client";

import { useStoreConfig } from "@/contexts/StoreConfigurationContext.jsx";

export const useHasStore = () => {
  const { config, isLoading, error } = useStoreConfig();
  // A store is considered "existing" if it has a store_name.
  // Ensure config is not null/undefined before accessing store_name
  const hasStore = !!config && !!config.store_name; 
  // console.log("useHasStore:", { config, isLoading, error, hasStore }); // Removed logging
  return { hasStore, isLoading, error };
};