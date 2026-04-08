"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Monitor, Smartphone, ExternalLink } from "lucide-react";
import { useThemeConfig } from "@/contexts/ThemeSettingsContext.jsx";
import { useStoreConfig } from "@/contexts/StoreConfigurationContext.jsx";
import ComponentResolver from "@/components/landing-pages/ComponentResolver.jsx";

const ThemePreviewPanel = () => {
  const { config: themeConfig, isLoading: themeConfigLoading } = useThemeConfig();
  const { config: storeConfig } = useStoreConfig();
  const [viewMode, setViewMode] = React.useState('mobile');

  if (themeConfigLoading || !themeConfig || !storeConfig) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="h-[400px] flex items-center justify-center">
            <p className="text-muted-foreground">Loading preview...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const landingComponents = storeConfig.page_settings?.landingPage?.components || [];

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Preview</CardTitle>
          <div className="flex gap-1">
            <Button
              variant={viewMode === 'mobile' ? 'default' : 'ghost'}
              size="icon"
              className="h-8 w-8"
              onClick={() => setViewMode('mobile')}
            >
              <Smartphone className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'desktop' ? 'default' : 'ghost'}
              size="icon"
              className="h-8 w-8"
              onClick={() => setViewMode('desktop')}
            >
              <Monitor className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto p-0">
        <div
          className={`transition-all duration-300 ${viewMode === 'mobile' ? 'max-w-[375px] mx-auto border-x' : 'w-full'}`}
          style={{ minHeight: '600px' }}
        >
          {/* Storefront Preview */}
          <div
            className="w-full min-h-[600px] flex flex-col"
            style={{
              backgroundColor: themeConfig.theme_mode === 'Dark' ? '#1a1a1a' : '#ffffff',
              color: themeConfig.theme_mode === 'Dark' ? '#ffffff' : '#000000',
            }}
          >
            {/* Header */}
            <header className="bg-background border-b">
              <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-12">
                  <span className="text-sm font-bold">{storeConfig.store_name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs">EN</span>
                    <span>🛒</span>
                  </div>
                </div>
              </div>
            </header>

            {/* Banner Search */}
            <div className="bg-muted p-3">
              <div className="container mx-auto">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="w-full py-1 px-3 text-sm border rounded"
                    style={{ borderColor: themeConfig.primary_color }}
                  />
                </div>
              </div>
            </div>

            {/* Main */}
            <main className="flex-1 p-3">
              {landingComponents.length > 0 ? (
                <ComponentResolver
                  components={landingComponents}
                  themeConfig={themeConfig}
                  storeConfig={storeConfig}
                />
              ) : (
                <div className="text-center py-10">
                  <p className="text-sm text-muted-foreground">Add blocks to see preview</p>
                </div>
              )}
            </main>

            {/* Footer */}
            <footer className="bg-muted border-t py-4 text-xs text-center text-muted-foreground">
              <p>&copy; {new Date().getFullYear()} {storeConfig.store_name}</p>
            </footer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ThemePreviewPanel;
