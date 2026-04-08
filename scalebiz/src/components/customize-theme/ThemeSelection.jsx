"use client";

import React from "react";
import ThemeCard from "./ThemeCard.jsx";
import { useThemeConfig } from "@/contexts/ThemeSettingsContext.jsx";
import { useStoreConfig } from "@/contexts/StoreConfigurationContext.jsx";
import { Skeleton } from "@/components/ui/skeleton.jsx";
import { useState } from "react";
import { useEffect } from "react";

const ThemeSelection = () => {
  const {
    config: themeConfig,
    isLoading: themeConfigLoading,
    updateStoreThemeId, // Use the new function
    isUpdating: isUpdatingThemeConfig,
    availableThemes,
    // Removed: save: saveThemeConfig, // No longer directly needed here
  } = useThemeConfig();
  const {
    config: storeConfig,
    isUpdating: isUpdatingStoreConfig,
  } = useStoreConfig();
  const [myThemeId, setMyThemeId] = useState(storeConfig?.theme_id);

  const isLoading =
    themeConfigLoading || isUpdatingThemeConfig || isUpdatingStoreConfig;

  // Update myThemeId when storeConfig.theme_id changes
  useEffect(() => {
    if (storeConfig?.theme_id) {
      setMyThemeId(storeConfig.theme_id);
    }
  }, [storeConfig?.theme_id]);

  if (isLoading || !themeConfig || !storeConfig || !availableThemes) {
    return (
      <div className="mb-6">
        <Skeleton className="h-7 w-32 mb-4" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <Skeleton className="h-60 w-full" />
          <Skeleton className="h-60 w-full" />
          <Skeleton className="h-60 w-full" />
          <Skeleton className="h-60 w-full" />
        </div>
      </div>
    );
  }

  const handleSelectTheme = (selectedThemeIdString) => {
    // selectedThemeIdString is like "basic-1"
    // Now, update the top-level theme_id directly in the storeConfig
    updateStoreThemeId(selectedThemeIdString);
    // The actual API save will happen when the "Apply Theme" button is clicked in ThemeControls.
  };

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-4">Themes</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {availableThemes.map((theme) => (
          <ThemeCard
            key={theme.id} // Use the unique database ID for React keys
            title={theme.name}
            imageSrc={theme.imageSrc}
            themeId={theme.theme_id}
            status={theme.status}
            myTheme={myThemeId === theme.theme_id}
            isSelected={storeConfig.theme_id === theme.theme_id} // Compare with the theme_id string
            onSelect={() => handleSelectTheme(theme.theme_id)} // Pass the theme_id string
            disabled={isLoading}
          />
        ))}
      </div>
    </div>
  );
};

export default ThemeSelection;