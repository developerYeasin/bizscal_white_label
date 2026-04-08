"use client";

import React from "react";
import { CardContent } from "@/components/ui/card.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Switch } from "@/components/ui/switch.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Input } from "@/components/ui/input.jsx";
import { useStoreConfig } from "@/contexts/StoreConfigurationContext.jsx"; // Keep for logo_url
import { useThemeConfig } from "@/contexts/ThemeSettingsContext.jsx"; // New import for theme settings
import { Skeleton } from "@/components/ui/skeleton.jsx";
import { Link } from "react-router-dom";
import CollapsibleCard from "@/components/ui/CollapsibleCard.jsx"; // Import CollapsibleCard

const ShopTheme = () => {
  const { config: storeConfig, isLoading: storeConfigLoading } = useStoreConfig(); // Only need to read storeConfig here
  const { config: themeConfig, isLoading: themeConfigLoading, updateNested, save: saveThemeConfig, isUpdating: isUpdatingThemeConfig } = useThemeConfig(); // Use themeConfig's update and save

  if (storeConfigLoading || themeConfigLoading || !storeConfig || !themeConfig) {
    return (
      <CollapsibleCard title="Shop Theme">
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </CollapsibleCard>
    );
  }

  const themePrimaryColor = themeConfig.primary_color || '#000000';
  const themeSecondaryColor = themeConfig.secondary_color || '#FFFFFF'; // Get secondary color
  const isUpdating = isUpdatingThemeConfig; // Use themeConfig's updating state
  console.log('themeConfig >> ', themeConfig);

  return (
    <CollapsibleCard title="Shop Theme">
      <CardContent>
        <div className="mb-4">
          <Label htmlFor="theme-primary-color" className="block text-sm font-medium text-foreground mb-2">
            Theme Primary Color
          </Label>
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-full border border-gray-300"
              style={{ backgroundColor: themePrimaryColor }}
            />
            <Input
              id="theme-primary-color"
              type="color"
              value={themePrimaryColor}
              onChange={(e) => updateNested('primary_color', e.target.value)}
              className="w-16 h-10 p-0 border-none cursor-pointer"
              disabled={isUpdating}
            />
            <Input
              value={themePrimaryColor}
              onChange={(e) => updateNested('primary_color', e.target.value)}
              className="flex-1"
              disabled={isUpdating}
            />
          </div>
        </div>
        <div className="mb-4">
          <Label htmlFor="theme-secondary-color" className="block text-sm font-medium text-foreground mb-2">
            Theme Secondary Color
          </Label>
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-full border border-gray-300"
              style={{ backgroundColor: themeSecondaryColor }}
            />
            <Input
              id="theme-secondary-color"
              type="color"
              value={themeSecondaryColor}
              onChange={(e) => updateNested('secondary_color', e.target.value)}
              className="w-16 h-10 p-0 border-none cursor-pointer"
              disabled={isUpdating}
            />
            <Input
              value={themeSecondaryColor}
              onChange={(e) => updateNested('secondary_color', e.target.value)}
              className="flex-1"
              disabled={isUpdating}
            />
          </div>
          <Button className="w-full mt-4" onClick={saveThemeConfig} disabled={isUpdating}>
            {isUpdating ? 'Saving...' : 'Save Theme Colors'}
          </Button>
        </div>
        <div className="flex items-center justify-between mt-4">
          <Label htmlFor="dark-mode-toggle" className="text-sm">
            Dark Mode
          </Label>
          <Switch
            id="dark-mode-toggle"
            checked={themeConfig.theme_mode === 'Dark'}
            onCheckedChange={(checked) => updateNested('theme_mode', checked ? 'Dark' : 'Light')}
            disabled={isUpdating}
          />
        </div>
        <Button variant="outline" className="w-full mt-4" asChild>
          <Link to="/customize-theme">Customize Shop Theme</Link>
        </Button>
      </CardContent>
    </CollapsibleCard>
  );
};

export default ShopTheme;