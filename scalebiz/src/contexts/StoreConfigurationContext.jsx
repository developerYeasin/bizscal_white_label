"use client";

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { useStoreConfiguration } from '@/hooks/use-store-configuration';

// Provide a default value to createContext to ensure useContext always returns an object
const StoreConfigurationContext = createContext({
  config: null,
  isLoading: true, // Default loading state
  error: null,
  isUpdating: false,
  updateNested: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  save: () => {}, 
});

export const useStoreConfig = () => useContext(StoreConfigurationContext);

export const StoreConfigurationProvider = ({ children }) => {
  const { configuration, isLoading, error, updateConfiguration, isUpdating } = useStoreConfiguration();
  const [localConfig, setLocalConfig] = useState(null);
  const localConfigRef = useRef(localConfig); // Create a ref for localConfig

  useEffect(() => {
    if (configuration) {
      setLocalConfig(JSON.parse(JSON.stringify(configuration))); // Deep copy for initial load
    }
  }, [configuration]);

  // Keep the ref updated with the latest localConfig
  useEffect(() => {
    localConfigRef.current = localConfig;
  }, [localConfig]);

  const updateNested = useCallback((path, value) => {
    setLocalConfig(prev => {
      if (!prev) return null;

      const keys = path.split('.');
      const newConfig = JSON.parse(JSON.stringify(prev)); // Deep copy for immutability

      let current = newConfig;
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (i === keys.length - 1) {
          // This is the final key, set the value
          if (Array.isArray(current) && !isNaN(parseInt(key))) {
            current[parseInt(key)] = value;
          } else {
            current[key] = value;
          }
        } else {
          // Not the final key, ensure the path exists
          if (Array.isArray(current) && !isNaN(parseInt(key))) {
            // If current is an array and key is an index
            if (!current[parseInt(key)]) {
              // Determine if the next part of the path is an array index or object key
              const nextKeyIsIndex = !isNaN(parseInt(keys[i + 1]));
              current[parseInt(key)] = nextKeyIsIndex ? [] : {};
            }
            current = current[parseInt(key)];
          } else {
            // If current is an object
            if (!current[key]) {
              // Determine if the next part of the path is an array index or object key
              const nextKeyIsIndex = !isNaN(parseInt(keys[i + 1]));
              current[key] = nextKeyIsIndex ? [] : {};
            }
            current = current[key];
          }
        }
      }
      return newConfig;
    });
  }, []); // setLocalConfig is stable, so no deps needed

  const saveChanges = useCallback(() => {
    if (localConfigRef.current) { // Use the ref to get the latest config
      const payload = { ...localConfigRef.current };
      console.log("StoreConfigurationContext: Sending payload to API:", payload); // Added log
      updateConfiguration(payload);
    }
  }, [updateConfiguration]); // updateConfiguration may change? It comes from useStoreConfiguration which returns a stable mutate function? Actually updateConfiguration is a mutation function from useMutation, which is stable (returns mutate). So safe.

  const value = React.useMemo(() => ({
    config: localConfig,
    isLoading,
    error,
    isUpdating,
    updateNested,
    save: saveChanges,
  }), [localConfig, isLoading, error, isUpdating, updateNested]);

  return (
    <StoreConfigurationContext.Provider value={value}>
      {children}
    </StoreConfigurationContext.Provider>
  );
};