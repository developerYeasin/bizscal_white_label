"use client";

import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button.jsx";
import { ArrowLeft, Loader2 } from "lucide-react";
// Removed: import { useProductById } from "@/hooks/use-products.js";
import { useProductLandingPage } from "@/hooks/use-product-landing-page.js";
import { Skeleton } from "@/components/ui/skeleton.jsx";
import ComponentResolver from "@/components/landing-pages/ComponentResolver.jsx";

const ProductLandingPageViewPage = () => {
  const { productId } = useParams();
  const id = productId ? parseInt(productId) : null;
  const navigate = useNavigate();

  // Removed: const { data: product, isLoading: isLoadingProduct, error: productError } = useProductById(id);
  const {
    landingPage,
    isLoading: isLoadingLandingPage,
    error: landingPageError,
  } = useProductLandingPage(id);

  // Extract product directly from landingPage if available
  const product = landingPage?.product;

  const isLoading = isLoadingLandingPage; // Only depend on landingPage loading
  const error = landingPageError; // Only depend on landingPage error

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
        <p className="text-lg text-muted-foreground">Loading product landing page...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-destructive">
        <p>Error: {error.message}</p>
        <Button onClick={() => navigate(`/single-product-pages/edit/${id}`)} className="mt-4">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Settings
        </Button>
      </div>
    );
  }

  if (!product || !landingPage) { // Ensure product data is available
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-muted-foreground">
        <p>No landing page configuration found for this product.</p>
        <Button onClick={() => navigate(`/single-product-pages/edit/${id}`)} className="mt-4">
          <ArrowLeft className="h-4 w-4 mr-2" /> Go to Settings
        </Button>
      </div>
    );
  }

  // Extract general settings for dynamic styles
  const generalSettings = landingPage.settings_json?.general_settings || {};
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

  const componentsToRender = landingPage.settings_json?.components || [];

  return (
    <div
      className={`min-h-screen flex flex-col ${themeMode === 'Dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'}`}
      style={dynamicStyles}
    >
      <div className="w-full bg-background text-foreground p-4 shadow-sm flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(`/single-product-pages`)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">Preview: {product.name} Landing Page</h1>
        </div>
        <Button onClick={() => navigate(`/single-product-pages/edit/${id}`)}>
          Edit Page
        </Button>
      </div>

      <main className="flex-1">
        <ComponentResolver components={componentsToRender} themeConfig={generalSettings} />
        {componentsToRender.length === 0 && (
          <div className="text-center text-muted-foreground py-16">
            <p>This landing page has no components configured.</p>
            <p>Go to settings to add dynamic sections.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default ProductLandingPageViewPage;