"use client";

import React from "react";
import { CardContent } from "@/components/ui/card.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Copy } from "lucide-react";
import { showSuccess } from "@/utils/toast.js";
import { useStoreConfig } from "@/contexts/StoreConfigurationContext.jsx";
import { Skeleton } from "@/components/ui/skeleton.jsx";
import CollapsibleCard from "@/components/ui/CollapsibleCard.jsx"; // Import CollapsibleCard
import api from "@/utils/api.js"; // Import the API instance

const SeoMarketingIntegrationsSection = () => {
  const { config, isLoading, updateNested, save, isUpdating } = useStoreConfig();

  if (isLoading || !config) {
    return (
      <CollapsibleCard title="Marketing & SEO Tools">
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </CollapsibleCard>
    );
  }

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    showSuccess("Link copied to clipboard!");
  };

  const storeId = config.id; // Assuming config.id holds the store ID

  // Get the base URL from the API configuration
  const currentApiBaseUrl = api.defaults.baseURL;
  // Extract the origin (e.g., "http://localhost:3001")
  const apiOrigin = new URL(currentApiBaseUrl).origin;

  // Construct the URLs using the API origin and the provided paths
  const sitemapUrl = `${apiOrigin}/api/v1/store/${storeId}/sitemap.xml`;
  const facebookFeedUrl = `${apiOrigin}/api/v1/store/${storeId}/facebook-feed.xml`;

  return (
    <CollapsibleCard title="Marketing & SEO Tools">
      {/* Sitemaps for Search Engine */}
      <CollapsibleCard title={
        <div className="flex items-center gap-2">
          <img src="https://res.cloudinary.com/dfsqtffsg/image/upload/v1759685853/k755zt898yyfcoyyzthv.svg" alt="Google Logo" className="h-5 w-5" />
          Sitemaps for Search Engine
        </div>
      }>
        <p className="text-sm text-muted-foreground mb-4">
          Add sitemaps to 'Google Search Console' to Rank your website.
        </p>
        <div className="flex items-center gap-2">
          <Input
            value={sitemapUrl}
            readOnly
            className="flex-1 bg-muted"
            disabled={isUpdating}
          />
          <Button variant="outline" size="icon" onClick={() => handleCopy(sitemapUrl)} disabled={isUpdating}>
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </CollapsibleCard>

      {/* Facebook Data Feed */}
      <CollapsibleCard title={
        <div className="flex items-center gap-2">
          <img src="https://res.cloudinary.com/dfsqtffsg/image/upload/v1759685818/kn9obydivpar5uhhmr9c.svg" alt="Facebook Logo" className="h-5 w-5" />
          Facebook Data Feed
        </div>
      }>
        <p className="text-sm text-muted-foreground mb-4">
          Add/Upload data feed to the Facebook catalog.
        </p>
        <div className="flex items-center gap-2">
          <Input
            value={facebookFeedUrl}
            readOnly
            className="flex-1 bg-muted"
            disabled={isUpdating}
          />
          <Button variant="outline" size="icon" onClick={() => handleCopy(facebookFeedUrl)} disabled={isUpdating}>
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </CollapsibleCard>

      {/* Setup Google Tag Manager */}
      <CollapsibleCard title={
        <div className="flex items-center gap-2">
          <img src="https://res.cloudinary.com/dfsqtffsg/image/upload/v1759685880/cgw4dmzuwug5r7wdbkir.svg" alt="GTM Logo" className="h-5 w-5" />
          Setup Google Tag Manager
        </div>
      }>
        <div className="mb-4">
          <Label htmlFor="gtmId">GTM ID</Label>
          <Input
            id="gtmId"
            value={config.integrations?.seo?.gtm_id || ''}
            onChange={(e) => updateNested('integrations.seo.gtm_id', e.target.value)}
            className="mt-1"
            disabled={isUpdating}
          />
        </div>
      </CollapsibleCard>

      {/* Setup Facebook Conversion API and Pixel */}
      <CollapsibleCard title={
        <div className="flex items-center gap-2">
          <img src="https://res.cloudinary.com/dfsqtffsg/image/upload/v1759685926/j28sscq7pvsh1zdid4ai.svg" alt="Pixel Logo" className="h-5 w-5" />
          Setup Facebook Conversion API and Pixel
        </div>
      }>
        <div className="mb-4">
          <Label htmlFor="pixelId">Pixel ID</Label>
          <Input
            id="pixelId"
            placeholder="Pixel ID"
            value={config.integrations?.seo?.fb_pixel_id || ''}
            onChange={(e) => updateNested('integrations.seo.fb_pixel_id', e.target.value)}
            className="mt-1"
            disabled={isUpdating}
          />
        </div>
        <div className="mb-4">
          <Label htmlFor="pixelAccessToken">Pixel Access Token</Label>
          <Input
            id="pixelAccessToken"
            placeholder="Pixel Access Token"
            value={config.integrations?.seo?.fb_pixel_token || ''}
            onChange={(e) => updateNested('integrations.seo.fb_pixel_token', e.target.value)}
            className="mt-1"
            disabled={isUpdating}
          />
        </div>
        <div className="mb-4">
          <Label htmlFor="pixelTestEventId">Pixel Test Event Id (Just to test. Clear after testing is done)</Label>
          <Input
            id="pixelTestEventId"
            placeholder="Pixel Test Event Id"
            value={config.integrations?.seo?.pixel_test_event_id || ''} // Directly use config value
            onChange={(e) => updateNested('integrations.seo.pixel_test_event_id', e.target.value)} // Directly update nested config
            className="mt-1"
            disabled={isUpdating}
          />
        </div>
      </CollapsibleCard>

      <div className="flex justify-end mt-4">
        <Button onClick={save} disabled={isUpdating}> {/* Simply call save() */}
          {isUpdating ? 'Saving...' : 'Update'}
        </Button>
      </div>
    </CollapsibleCard>
  );
};

export default SeoMarketingIntegrationsSection;