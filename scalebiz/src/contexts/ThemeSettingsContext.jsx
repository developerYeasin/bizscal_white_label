"use client";

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { useAvailableThemes } from '@/hooks/use-available-themes';
import { useStoreConfig } from '@/contexts/StoreConfigurationContext.jsx';

const ThemeSettingsContext = createContext({
  config: null,
  isLoading: true,
  error: null,
  isUpdating: false,
  updateNested: () => {}, // Kept for existing components, now maps to updateThemeSetting
  updateStoreThemeId: () => {}, // New function for top-level theme_id
  save: () => {},
  availableThemes: [],
});

export const useThemeConfig = () => useContext(ThemeSettingsContext);

export const ThemeSettingsProvider = ({ children }) => {
  const {
    config: storeConfig,
    isLoading: storeConfigLoading,
    error: storeConfigError,
    updateNested: updateStoreConfigNested, // This is the key
    save: saveStoreConfig,
    isUpdating: isUpdatingStoreConfig
  } = useStoreConfig();

  const { data: availableThemes, isLoading: isLoadingAvailableThemes, error: errorAvailableThemes } = useAvailableThemes();

  // The theme settings are now directly derived from storeConfig.theme_settings
  // We don't need a separate localThemeConfig state here, as all updates will go directly to storeConfig.
  // The UI components will read from storeConfig.theme_settings directly.

  const selectedThemeSettings = React.useMemo(() => {
    if (!storeConfig || !availableThemes) return null;
    const selectedTheme = availableThemes.find(theme => theme.theme_id === storeConfig.theme_id);
    return {
      ...storeConfig.theme_settings, // Use the actual theme_settings object
      selected_theme_name: selectedTheme ? selectedTheme.name : "Basic",
      // Also include the top-level theme_id for consistency if needed by UI
      theme_id: storeConfig.theme_id,
    };
  }, [storeConfig, availableThemes]);

  // Function to update a specific field within theme_settings
  const updateThemeSetting = useCallback((path, value) => {
    updateStoreConfigNested(`theme_settings.${path}`, value);
  }, [updateStoreConfigNested]);

  // Function to update the top-level theme_id in storeConfig
  const updateStoreThemeId = useCallback((themeId) => {
    updateStoreConfigNested('theme_id', themeId);
  }, [updateStoreConfigNested]);

  const saveChanges = useCallback(() => {
    saveStoreConfig();
  }, [saveStoreConfig]);

  const value = React.useMemo(() => ({
    config: selectedThemeSettings,
    isLoading: storeConfigLoading || isLoadingAvailableThemes,
    error: storeConfigError || errorAvailableThemes,
    isUpdating: isUpdatingStoreConfig,
    updateNested: updateThemeSetting,
    updateStoreThemeId,
    save: saveChanges,
    availableThemes,
  }), [selectedThemeSettings, storeConfigLoading, isLoadingAvailableThemes, storeConfigError, errorAvailableThemes, isUpdatingStoreConfig, updateThemeSetting, updateStoreThemeId, saveChanges, availableThemes]);

  return (
    <ThemeSettingsContext.Provider value={value}>
      {children}
    </ThemeSettingsContext.Provider>
  );
};