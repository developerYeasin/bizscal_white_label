"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Switch } from "@/components/ui/switch.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.jsx";
import { cn } from "@/lib/utils.js";
import { useStoreConfig } from "@/contexts/StoreConfigurationContext.jsx";
import { Skeleton } from "@/components/ui/skeleton.jsx";
import { Separator } from "@/components/ui/separator.jsx";

const ProductPageSettings = () => {
  const { config, isLoading, updateNested, isUpdating } = useStoreConfig();
  // Product page config is nested under page_settings.productPage
  const pp = config?.page_settings?.productPage;

  if (isLoading || !config) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    );
  }

  // Ensure pp exists
  if (!pp) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Product Page Layout</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Product page settings not available.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Product Page Layout</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Main Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="page-layout" className="block text-sm font-medium mb-2">Page Layout</Label>
            <Select
              value={pp.layout || 'standard'}
              onValueChange={(value) => updateNested('page_settings.productPage.layout', value)}
              disabled={isUpdating}
            >
              <SelectTrigger id="page-layout">
                <SelectValue placeholder="Select Layout" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Standard (Image Left, Info Right)</SelectItem>
                <SelectItem value="split">Split 50/50 (Equal Columns)</SelectItem>
                <SelectItem value="full-width">Full Width (Image Top, Info Below)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="gallery-position" className="block text-sm font-medium mb-2">Gallery Position</Label>
            <Select
              value={pp.gallery_position || 'left'}
              onValueChange={(value) => updateNested('page_settings.productPage.gallery_position', value)}
              disabled={isUpdating}
            >
              <SelectTrigger id="gallery-position">
                <SelectValue placeholder="Select Position" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="left">Left</SelectItem>
                <SelectItem value="right">Right</SelectItem>
                <SelectItem value="top">Top</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Separator />

        {/* Gallery Settings */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold">Gallery Settings</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="gallery-style" className="block text-sm font-medium mb-2">Gallery Style</Label>
              <Select
                value={pp.gallery_style || 'grid'}
                onValueChange={(value) => updateNested('page_settings.productPage.gallery_style', value)}
                disabled={isUpdating}
              >
                <SelectTrigger id="gallery-style">
                  <SelectValue placeholder="Select Style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="grid">Grid with Thumbnails</SelectItem>
                  <SelectItem value="carousel">Carousel Slider</SelectItem>
                  <SelectItem value="single">Single Image (No Thumbnails)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {pp.gallery_style === 'grid' && (
              <div>
                <Label htmlFor="thumbnail-position" className="block text-sm font-medium mb-2">Thumbnail Position</Label>
                <Select
                  value={pp.thumbnail_position || 'bottom'}
                  onValueChange={(value) => updateNested('page_settings.productPage.thumbnail_position', value)}
                  disabled={isUpdating}
                >
                  <SelectTrigger id="thumbnail-position">
                    <SelectValue placeholder="Select Position" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bottom">Bottom</SelectItem>
                    <SelectItem value="left">Left (Vertical)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="enable-zoom" className="text-sm">Enable Image Zoom</Label>
            <Switch
              id="enable-zoom"
              checked={pp.enable_zoom ?? true}
              onCheckedChange={(checked) => updateNested('page_settings.productPage.enable_zoom', checked)}
              disabled={isUpdating}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="enable-video" className="text-sm">Enable Product Video</Label>
            <Switch
              id="enable-video"
              checked={pp.enable_video ?? true}
              onCheckedChange={(checked) => updateNested('page_settings.productPage.enable_video', checked)}
              disabled={isUpdating}
            />
          </div>
        </div>

        <Separator />

        {/* Product Info Settings */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold">Product Information</h4>
          <div className="flex items-center justify-between">
            <Label htmlFor="show-sku" className="text-sm">Show SKU</Label>
            <Switch
              id="show-sku"
              checked={pp.show_sku ?? true}
              onCheckedChange={(checked) => updateNested('page_settings.productPage.show_sku', checked)}
              disabled={isUpdating}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="show-barcode" className="text-sm">Show Barcode</Label>
            <Switch
              id="show-barcode"
              checked={pp.show_barcode ?? false}
              onCheckedChange={(checked) => updateNested('page_settings.productPage.show_barcode', checked)}
              disabled={isUpdating}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="show-stock" className="text-sm">Show Stock Status</Label>
            <Switch
              id="show-stock"
              checked={pp.show_stock_status ?? true}
              onCheckedChange={(checked) => updateNested('page_settings.productPage.show_stock_status', checked)}
              disabled={isUpdating}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="sticky-cart" className="text-sm">Sticky Add to Cart Bar (on scroll)</Label>
            <Switch
              id="sticky-cart"
              checked={pp.sticky_add_to_cart ?? false}
              onCheckedChange={(checked) => updateNested('page_settings.productPage.sticky_add_to_cart', checked)}
              disabled={isUpdating}
            />
          </div>
        </div>

        <Separator />

        {/* Page Sections */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold">Visible Sections</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { key: 'gallery', label: 'Image Gallery' },
              { key: 'info', label: 'Product Info' },
              { key: 'description', label: 'Description' },
              { key: 'specifications', label: 'Specifications' },
              { key: 'reviews', label: 'Customer Reviews' },
              { key: 'related', label: 'Related Products' },
              { key: 'faq', label: 'FAQ' },
              { key: 'trustBadges', label: 'Trust Badges' },
            ].map(({ key, label }) => (
              <div key={key} className="flex items-center justify-between py-2">
                <Label htmlFor={`section-${key}`} className="text-sm font-normal">{label}</Label>
                <Switch
                  id={`section-${key}`}
                  checked={pp.sections?.[key] || false}
                  onCheckedChange={(checked) => updateNested(`page_settings.productPage.sections.${key}`, checked)}
                  disabled={isUpdating}
                />
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Related Products */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold">Related Products</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="related-count" className="block text-sm font-medium mb-2">Number to Show</Label>
              <Input
                id="related-count"
                type="number"
                min="1"
                max="20"
                value={pp.related_products_count || 8}
                onChange={(e) => updateNested('page_settings.productPage.related_products_count', parseInt(e.target.value) || 8)}
                disabled={isUpdating}
              />
            </div>
            <div>
              <Label htmlFor="related-style" className="block text-sm font-medium mb-2">Display Style</Label>
              <Select
                value={pp.related_products_style || 'carousel'}
                onValueChange={(value) => updateNested('page_settings.productPage.related_products_style', value)}
                disabled={isUpdating}
              >
                <SelectTrigger id="related-style">
                  <SelectValue placeholder="Select Style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="grid">Grid</SelectItem>
                  <SelectItem value="carousel">Carousel</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductPageSettings;
