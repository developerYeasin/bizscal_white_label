"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import { Monitor, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import { Skeleton } from "@/components/ui/skeleton.jsx";
import ComponentResolver from "@/components/landing-pages/ComponentResolver.jsx"; // Import ComponentResolver

const ProductLandingPagePreview = ({ product, landingPageConfig, isLoading }) => {
  if (isLoading) {
    return (
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Live Preview</CardTitle>
          <div className="flex gap-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Skeleton className="h-[400px] w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!product || !landingPageConfig) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Live Preview</CardTitle>
        </CardHeader>
        <CardContent className="p-4 text-center text-muted-foreground">
          No landing page configured yet.
        </CardContent>
      </Card>
    );
  }

  // Extract general settings for dynamic styles
  const generalSettings = landingPageConfig.general_settings || {};
  const primaryColor = generalSettings.primary_color || '#6B46C1';
  const secondaryColor = generalSettings.secondary_color || '#FFFFFF';
  const headingFont = generalSettings.heading_font || 'Roboto';
  const bodyFont = generalSettings.body_font || 'Open Sans';
  const themeMode = generalSettings.theme_mode || 'Light';

  const dynamicStyles = {
    '--dynamic-primary-color': primaryColor,
    '--dynamic-secondary-color': secondaryColor,
    '--dynamic-heading-font': `'${headingFont}', sans-serif`,
    '--dynamic-body-font': `'${bodyFont}', sans-serif`,
  };

  const componentsToRender = landingPageConfig.components || [];

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Live Preview</CardTitle>
        <div className="flex gap-2">
          <Button variant="outline" size="icon">
            <Monitor className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Smartphone className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="border-t border-b h-[400px] overflow-y-auto"> {/* Changed to overflow-y-auto */}
          <div
            className={`w-full min-h-full flex flex-col text-sm ${themeMode === 'Dark' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-muted-foreground'}`}
            style={dynamicStyles}
          >
            {/* Render dynamic components using ComponentResolver */}
            <ComponentResolver components={componentsToRender} themeConfig={generalSettings} />
            
            {componentsToRender.length === 0 && (
              <div className="flex-1 flex items-center justify-center p-4 text-center">
                <p>Add components to see them in the preview.</p>
              </div>
            )}

            <p className="text-center text-xs text-muted-foreground mt-4 p-2">
              This is a simplified preview. Full rendering will be available on the live site.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductLandingPagePreview;