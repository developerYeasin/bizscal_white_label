"use client";

import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { useStoreConfiguration } from '@/hooks/use-store-configuration';
import { useAuth } from './AuthContext'; // Assuming AuthContext is available

const initialState = {
  config: null,
  isLoading: true,
  error: null,
  isUpdating: false,
  // For undo/redo
  history: [null], // Array of past configurations
  currentIndex: 0,
  canUndo: false,
  canRedo: false,
};

function storeConfigReducer(state, action) {
  switch (action.type) {
    case "SET_CONFIG": {
      const newConfig = action.payload;
      const newHistory = state.history.slice(0, state.currentIndex + 1);
      return {
        ...state,
        config: newConfig,
        isLoading: false,
        error: null,
        history: [...newHistory, newConfig],
        currentIndex: newHistory.length,
        canUndo: newHistory.length > 0,
        canRedo: false,
      };
    }
    case "IS_LOADING":
      return { ...state, isLoading: action.payload };
    case "ERROR":
      return { ...state, error: action.payload, isLoading: false };
    case "IS_UPDATING":
      return { ...state, isUpdating: action.payload };
    case "UPDATE_CONFIG": {
      const { path, value } = action.payload;
      if (!state.config) return state;

      const newConfig = JSON.parse(JSON.stringify(state.config));
      let current = newConfig;
      const keys = path.split('.');

      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (i === keys.length - 1) {
          if (Array.isArray(current) && !isNaN(parseInt(key))) {
            current[parseInt(key)] = value;
          } else {
            current[key] = value;
          }
        } else {
          if (Array.isArray(current) && !isNaN(parseInt(key))) {
            if (!current[parseInt(key)]) {
              const nextKeyIsIndex = !isNaN(parseInt(keys[i + 1]));
              current[parseInt(key)] = nextKeyIsIndex ? [] : {};
            }
            current = current[parseInt(key)];
          } else {
            if (!current[key]) {
              const nextKeyIsIndex = !isNaN(parseInt(keys[i + 1]));
              current[key] = nextKeyIsIndex ? [] : {};
            }
            current = current[key];
          }
        }
      }

      const newHistory = state.history.slice(0, state.currentIndex + 1);
      return {
        ...state,
        config: newConfig,
        history: [...newHistory, newConfig],
        currentIndex: newHistory.length,
        canUndo: true,
        canRedo: false,
      };
    }
    case "UNDO": {
      if (!state.canUndo) return state;
      const newIndex = state.currentIndex - 1;
      return {
        ...state,
        config: state.history[newIndex],
        currentIndex: newIndex,
        canUndo: newIndex > 0,
        canRedo: true,
      };
    }
    case "REDO": {
      if (!state.canRedo) return state;
      const newIndex = state.currentIndex + 1;
      return {
        ...state,
        config: state.history[newIndex],
        currentIndex: newIndex,
        canUndo: true,
        canRedo: newIndex < state.history.length - 1,
      };
    }
    default:
      return state;
  }
}

const StoreConfigurationContext = createContext(initialState);

export const useStoreConfig = () => useContext(StoreConfigurationContext);

export const StoreConfigurationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(storeConfigReducer, initialState);
  const { isAuthenticated } = useAuth();
  const {
    fetchConfigurationManually,
    updateConfigurationAsync,
    isUpdating: apiIsUpdating,
  } = useStoreConfiguration();

  // Initial fetch of configuration
  useEffect(() => {
    const loadConfiguration = async () => {
      if (isAuthenticated) {
        dispatch({ type: "IS_LOADING", payload: true });
        try {
          const fetchedConfig = await fetchConfigurationManually();
          dispatch({ type: "SET_CONFIG", payload: fetchedConfig });
        } catch (err) {
          console.error("Failed to fetch store configuration:", err);
          dispatch({ type: "ERROR", payload: err });
        }
      } else {
        // If not authenticated, ensure loading state is false and config is null
        dispatch({ type: "IS_LOADING", payload: false });
        dispatch({ type: "SET_CONFIG", payload: null });
      }
    };
    loadConfiguration();
  }, [isAuthenticated, fetchConfigurationManually]);

  // When API is updating, update context's isUpdating state
  useEffect(() => {
    dispatch({ type: "IS_UPDATING", payload: apiIsUpdating });
  }, [apiIsUpdating]);

  const updateNested = useCallback((path, value) => {
    dispatch({ type: "UPDATE_CONFIG", payload: { path, value } });
  }, []);

  const saveChanges = useCallback(async () => {
    if (state.config) {
      dispatch({ type: "IS_UPDATING", payload: true });
      try {
        // The `updateConfigurationAsync` from the hook handles the API call.
        // It returns the updated configuration from the API response.
        const updatedConfig = await updateConfigurationAsync(state.config);
        // Correctly handle the update. If the API returns the updated config, use it.
        if (updatedConfig && updatedConfig.data && updatedConfig.data.configuration) {
           dispatch({ type: "SET_CONFIG", payload: updatedConfig.data.configuration });
        }

      } catch (err) {
        console.error("Error saving store configuration:", err);
        dispatch({ type: "ERROR", payload: err });
      } finally {
        dispatch({ type: "IS_UPDATING", payload: false });
      }
    }
  }, [state.config, updateConfigurationAsync]);

  const undo = useCallback(() => {
    dispatch({ type: "UNDO" });
  }, []);

  const redo = useCallback(() => {
    dispatch({ type: "REDO" });
  }, []);

  const value = React.useMemo(() => ({
    config: state.config,
    isLoading: state.isLoading,
    error: state.error,
    isUpdating: state.isUpdating,
    updateNested,
    save: saveChanges,
    undo,
    redo,
    canUndo: state.canUndo,
    canRedo: state.canRedo,
    dispatch, // Expose dispatch for more granular control if needed by ConfigLoader
  }), [state, updateNested, saveChanges, undo, redo, dispatch]);

  return (
    <StoreConfigurationContext.Provider value={value}>
      {children}
    </StoreConfigurationContext.Provider>
  );
};