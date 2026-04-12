import React, { useEffect } from "react";
import { useStoreConfig } from "@/contexts/StoreConfigurationContext";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const ConfigLoader = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const { dispatch, config, isLoading, error, fetchInitialConfig } =
    useStoreConfig();
  const navigate = useNavigate();
  useEffect(() => {
    if (isAuthenticated) {
      // The StoreConfigurationProvider already handles initial fetching based on isAuthenticated.
      // This component just ensures the provider is aware of auth changes.
      // If you need to trigger a *re-fetch* explicitly on auth change,
      // you might add a dispatch here, but the Provider's useEffect should cover initial load.
      
      return;
    }
    //  else {
    //   navigate("/login");
    // }
  }, [isAuthenticated, fetchInitialConfig]); // Added fetchInitialConfig as a dependency if it's a stable function to re-fetch.

  if (isLoading) {
    return <div>Loading configuration...</div>; // Or a proper skeleton loader
  }

  if (error) {
    return (
      <div>Error loading configuration: {error.message || "Unknown error"}</div>
    );
  }

  if (!config) {
    // navigate("/login");
    // return <div>No configuration loaded. Please ensure you are logged in.</div>;
  }

  return <>{children}</>;
};

export default ConfigLoader;
