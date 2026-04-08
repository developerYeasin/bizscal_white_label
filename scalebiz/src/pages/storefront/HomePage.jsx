"use client";

import React from "react";
import { useStoreConfig } from "@/contexts/StoreConfigurationContext.jsx";
import { useAuth } from "@/contexts/AuthContext.jsx";
import ComponentResolver from "@/components/landing-pages/ComponentResolver.jsx";
import { Skeleton } from "@/components/ui/skeleton.jsx";
import { Button } from "@/components/ui/button.jsx";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();
  const { config: storeConfig, isLoading } = useStoreConfig();
  const { isAuthenticated } = useAuth();

  console.log("HomePage render:", { isAuthenticated, isLoading, hasStoreConfig: !!storeConfig, storeConfigKeys: storeConfig ? Object.keys(storeConfig) : [] });

  if (isLoading || !storeConfig) {
    return (
      <div className="space-y-8 bg-yellow-100">
        <div className="p-4 bg-yellow-200 font-bold text-yellow-900">
          HomePage: Loading... isAuthenticated={isAuthenticated} isLoading={isLoading} hasConfig={!!storeConfig}
        </div>
        <Skeleton className="h-[400px] w-full rounded-lg bg-yellow-300" />
        <div className="container mx-auto px-4">
          <Skeleton className="h-8 w-48 mb-6 bg-yellow-300" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-64 w-full rounded-lg bg-yellow-300" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const landingPageComponents = storeConfig.page_settings?.landingPage?.components || [];

  return (
    <div className="min-h-screen">
      {/* Hero Section with ComponentResolver */}
      {landingPageComponents.length > 0 ? (
        <ComponentResolver
          components={landingPageComponents}
          themeConfig={storeConfig.theme_settings}
          storeConfig={storeConfig}
        />
      ) : (
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to {storeConfig.store_name}</h1>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Your one-stop shop for everything you need. Browse our collection of high-quality products.
          </p>
          <Button size="lg" onClick={() => navigate('/products')}>
            Start Shopping
          </Button>
        </div>
      )}

      {/* If no components, show fallback content */}
      {landingPageComponents.length === 0 && (
        <div className="container mx-auto px-4 py-12">
          <div className="text-center py-20 border-2 border-dashed rounded-lg">
            <h2 className="text-2xl font-semibold mb-2">Start Building Your Store</h2>
            <p className="text-muted-foreground mb-6">
              No landing page components configured yet. Go to the admin panel to customize your store.
            </p>
            <Button variant="outline" onClick={() => window.open('/admin', '_blank')}>
              Open Admin Panel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
