"use client";

import React from "react";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Textarea } from "@/components/ui/textarea.jsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.jsx";
import { Switch } from "@/components/ui/switch.jsx";
import { Button } from "@/components/ui/button.jsx";

/**
 * ProductBlockSettings - Settings component for product-related blocks
 * Supports: productSection, productCarousel, productHeroSectionOne, productShowcaseSection, etc.
 */
const ProductBlockSettings = ({ component, index, updateNested, isUpdating }) => {
  const { data = {} } = component;

  const handleUpdate = (path, value) => {
    updateNested(path, value);
  };

  return (
    <div className="space-y-4">
      <div className="border-b pb-4">
        <h3 className="text-sm font-semibold text-gray-800 mb-3">Product Settings</h3>
        
        {/* Product Collection/Category */}
        <div className="space-y-2">
          <Label htmlFor="collection">Collection/Category</Label>
          <Select
            value={data.collection || "all"}
            onValueChange={(value) => handleUpdate("collection", value)}
          >
            <SelectTrigger id="collection">
              <SelectValue placeholder="Select collection" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Products</SelectItem>
              <SelectItem value="new">New Arrivals</SelectItem>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="best-sellers">Best Sellers</SelectItem>
              <SelectItem value="sale">Sale Items</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Product Card Style */}
        <div className="space-y-2">
          <Label htmlFor="cardStyle">Product Card Style</Label>
          <Select
            value={data.productCardStyle || "default"}
            onValueChange={(value) => handleUpdate("productCardStyle", value)}
          >
            <SelectTrigger id="cardStyle">
              <SelectValue placeholder="Select card style" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="minimal">Minimal</SelectItem>
              <SelectItem value="overlay">Overlay</SelectItem>
              <SelectItem value="multiView">Multi-View</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Products Per Row */}
        <div className="space-y-2">
          <Label htmlFor="productsPerRow">Products Per Row</Label>
          <Select
            value={data.productsPerRow || 4}
            onValueChange={(value) => handleUpdate("productsPerRow", value)}
          >
            <SelectTrigger id="productsPerRow">
              <SelectValue placeholder="Select rows" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1</SelectItem>
              <SelectItem value="2">2</SelectItem>
              <SelectItem value="3">3</SelectItem>
              <SelectItem value="4">4</SelectItem>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="6">6</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Products Per Page */}
        <div className="space-y-2">
          <Label htmlFor="productsPerPage">Products Per Page</Label>
          <Input
            type="number"
            id="productsPerPage"
            value={data.productsPerPage || 12}
            onChange={(e) => handleUpdate("productsPerPage", parseInt(e.target.value) || 12)}
            min="1"
            max="100"
          />
        </div>

        {/* Show Product Price */}
        <div className="flex items-center justify-between">
          <Label htmlFor="showPrice">Show Product Price</Label>
          <Switch
            id="showPrice"
            checked={data.showPrice !== false}
            onCheckedChange={(checked) => handleUpdate("showPrice", checked)}
          />
        </div>

        {/* Show Product Rating */}
        <div className="flex items-center justify-between">
          <Label htmlFor="showRating">Show Product Rating</Label>
          <Switch
            id="showRating"
            checked={data.showRating !== false}
            onCheckedChange={(checked) => handleUpdate("showRating", checked)}
          />
        </div>

        {/* Show Quick View Button */}
        <div className="flex items-center justify-between">
          <Label htmlFor="showQuickView">Show Quick View Button</Label>
          <Switch
            id="showQuickView"
            checked={data.showQuickView !== false}
            onCheckedChange={(checked) => handleUpdate("showQuickView", checked)}
          />
        </div>

        {/* Show Add to Cart Button */}
        <div className="flex items-center justify-between">
          <Label htmlFor="addToCart">Show Add to Cart Button</Label>
          <Switch
            id="addToCart"
            checked={data.addToCart !== false}
            onCheckedChange={(checked) => handleUpdate("addToCart", checked)}
          />
        </div>

        {/* Show Out of Stock */}
        <div className="flex items-center justify-between">
          <Label htmlFor="showOutOfStock">Show Out of Stock Products</Label>
          <Switch
            id="showOutOfStock"
            checked={data.showOutOfStock !== false}
            onCheckedChange={(checked) => handleUpdate("showOutOfStock", checked)}
          />
        </div>
      </div>

      {/* SEO Settings */}
      <div className="border-b pb-4">
        <h3 className="text-sm font-semibold text-gray-800 mb-3">SEO Settings</h3>
        
        <div className="space-y-2">
          <Label htmlFor="metaTitle">Meta Title</Label>
          <Input
            id="metaTitle"
            value={data.metaTitle || ""}
            onChange={(e) => handleUpdate("metaTitle", e.target.value)}
            placeholder="Page meta title"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="metaDescription">Meta Description</Label>
          <Textarea
            id="metaDescription"
            value={data.metaDescription || ""}
            onChange={(e) => handleUpdate("metaDescription", e.target.value)}
            placeholder="Page meta description"
            rows={3}
          />
        </div>
      </div>

      {/* Display Settings */}
      <div>
        <h3 className="text-sm font-semibold text-gray-800 mb-3">Display Settings</h3>
        
        <div className="space-y-2">
          <Label htmlFor="backgroundColor">Background Color</Label>
          <Input
            type="color"
            id="backgroundColor"
            value={data.backgroundColor || "#ffffff"}
            onChange={(e) => handleUpdate("backgroundColor", e.target.value)}
            className="h-10 w-full"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="paddingTop">Top Padding (px)</Label>
          <Input
            type="number"
            id="paddingTop"
            value={data.paddingTop || 40}
            onChange={(e) => handleUpdate("paddingTop", parseInt(e.target.value) || 40)}
            min="0"
            max="100"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="paddingBottom">Bottom Padding (px)</Label>
          <Input
            type="number"
            id="paddingBottom"
            value={data.paddingBottom || 40}
            onChange={(e) => handleUpdate("paddingBottom", parseInt(e.target.value) || 40)}
            min="0"
            max="100"
          />
        </div>
      </div>
    </div>
  );
};

export default ProductBlockSettings;
