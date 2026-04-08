"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import { Monitor, Smartphone, Search } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import { useThemeConfig } from "@/contexts/ThemeSettingsContext.jsx";
import { Skeleton } from "@/components/ui/skeleton.jsx";
import ComponentResolver from "@/components/landing-pages/ComponentResolver.jsx"; // Import ComponentResolver
import { useStoreConfig } from "@/contexts/StoreConfigurationContext.jsx"; // Import useStoreConfig

const ShopPreview = ({ viewMode = 'mobile' }) => {
  const { config: themeConfig, isLoading: themeConfigLoading } = useThemeConfig();
  const { config: fullStoreConfig, isLoading: storeConfigLoading } = useStoreConfig();

  const isLoading = themeConfigLoading || storeConfigLoading;

  if (isLoading || !themeConfig || !fullStoreConfig) {
    return (
      <div className="h-[400px] w-full flex items-center justify-center">
        <Skeleton className="h-[300px] w-full" />
      </div>
    );
  }

  // Use theme settings for dynamic styling in preview
  const dynamicPrimaryColor = themeConfig.primary_color;
  const dynamicSecondaryColor = themeConfig.secondary_color;
  const dynamicThemeMode = themeConfig.theme_mode;
  const dynamicHeadingFont = themeConfig.typography?.headingFont;
  const dynamicBodyFont = themeConfig.typography?.bodyFont;

  const dynamicStyles = {
    '--dynamic-primary-color': dynamicPrimaryColor,
    '--dynamic-secondary-color': dynamicSecondaryColor,
    '--dynamic-heading-font': `'${dynamicHeadingFont}', sans-serif`,
    '--dynamic-body-font': `'${dynamicBodyFont}', sans-serif`,
  };

  const componentsToRender = fullStoreConfig.page_settings?.landingPage?.components || [];

  return (
    <div className={`relative w-full h-full overflow-y-auto ${viewMode === 'mobile' ? 'max-w-sm mx-auto border-x' : ''}`}>
      <div
        className={`w-full min-h-full flex flex-col items-center justify-start text-sm ${dynamicThemeMode === 'Dark' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-muted-foreground'}`}
        style={dynamicStyles}
      >
        {/* Top Bar */}
        <div className="w-full bg-black text-white p-2 flex justify-between items-center">
          <span>Welcome to Scalebiz</span>
          <div className="flex items-center gap-2">
            <img src="https://picsum.photos/seed/shop-logo-preview/20/20" alt="Logo" className="h-5 w-5 rounded-full" />
            <span>EN</span>
            <span>🛒</span>
          </div>
        </div>
        {/* Main Content Area */}
        <div className="p-4 w-full">
          <h2 className={`text-2xl font-bold mb-4 ${dynamicThemeMode === 'Dark' ? 'text-white' : 'text-foreground'}`}>Scalebiz</h2>
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search your desired product"
              className="w-full p-2 pl-8 border rounded-md"
              style={{ borderColor: dynamicPrimaryColor }}
            />
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Button className="absolute right-0 top-0 h-full rounded-l-none" style={{ backgroundColor: dynamicSecondaryColor, borderColor: dynamicSecondaryColor }}>
              <Search className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex space-x-2 overflow-x-auto pb-2">
            <div className="flex-shrink-0 w-24 h-24 bg-gray-200 rounded-md flex items-center justify-center">
              <img src="https://picsum.photos/seed/preview-cat1/96/96" alt="Category" className="w-full h-full object-cover rounded-md" />
              <span className="absolute text-xs text-center text-white bg-black/50 p-1 rounded-md">All products</span>
            </div>
            <div className="flex-shrink-0 w-24 h-24 bg-gray-200 rounded-md flex items-center justify-center">
              <img src="https://picsum.photos/seed/preview-cat2/96/96" alt="Category" className="w-full h-full object-cover rounded-md" />
              <span className="absolute text-xs text-center text-white bg-black/50 p-1 rounded-md">Inner item</span>
            </div>
            <div className="flex-shrink-0 w-24 h-24 bg-gray-200 rounded-md flex items-center justify-center">
              <img src="https://picsum.photos/seed/preview-cat3/96/96" alt="Category" className="w-full h-full object-cover rounded-md" />
              <span className="absolute text-xs text-center text-white bg-black/50 p-1 rounded-md">Borka</span>
            </div>
            <div className="flex-shrink-0 w-24 h-24 bg-gray-200 rounded-md flex items-center justify-center">
              <img src="https://picsum.photos/seed/preview-cat4/96/96" alt="Category" className="w-full h-full object-cover rounded-md" />
              <span className="absolute text-xs text-center text-white bg-black/50 p-1 rounded-md">Gown</span>
            </div>
          </div>
          {/* Render dynamic components using ComponentResolver */}
          <ComponentResolver
          components={componentsToRender}
          themeConfig={themeConfig}
          storeConfig={fullStoreConfig}
        />
          
          {componentsToRender.length === 0 && (
            <div className="flex-1 flex items-center justify-center p-4 text-center">
              <p>Add components to see them in the preview.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopPreview;