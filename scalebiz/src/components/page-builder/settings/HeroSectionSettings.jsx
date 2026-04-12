"use client";

import React from "react";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.jsx";
import { Switch } from "@/components/ui/switch.jsx";
import { Button } from "@/components/ui/button.jsx";

/**
 * HeroSectionSettings - Settings component for hero section blocks
 */
const HeroSectionSettings = ({ component, index, updateNested, isUpdating }) => {
  const { data = {} } = component;

  const handleUpdate = (path, value) => {
    updateNested(path, value);
  };

  return (
    <div className="space-y-4">
      <div className="border-b border-gray-200 pb-4">
        <h3 className="text-sm font-semibold text-gray-800 mb-3">Hero Content</h3>
        
        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="title" className="text-xs font-medium text-gray-600">Title</Label>
          <Input
            id="title"
            value={data.title || ""}
            onChange={(e) => handleUpdate("title", e.target.value)}
            placeholder="Hero title"
            className="h-8 text-sm"
          />
        </div>

        {/* Subtitle */}
        <div className="space-y-2">
          <Label htmlFor="subtitle" className="text-xs font-medium text-gray-600">Subtitle</Label>
          <Input
            id="subtitle"
            value={data.subtitle || ""}
            onChange={(e) => handleUpdate("subtitle", e.target.value)}
            placeholder="Hero subtitle"
            className="h-8 text-sm"
          />
        </div>

        {/* Show CTA Button */}
        <div className="flex items-center justify-between">
          <Label htmlFor="showCta" className="text-xs font-medium text-gray-600">Show CTA Button</Label>
          <Switch
            id="showCta"
            checked={data.showCta !== false}
            onCheckedChange={(checked) => handleUpdate("showCta", checked)}
          />
        </div>

        {/* CTA Text */}
        <div className="space-y-2">
          <Label htmlFor="ctaText" className="text-xs font-medium text-gray-600">CTA Button Text</Label>
          <Input
            id="ctaText"
            value={data.ctaText || "Learn More"}
            onChange={(e) => handleUpdate("ctaText", e.target.value)}
            placeholder="CTA button text"
            className="h-8 text-sm"
          />
        </div>

        {/* CTA Link */}
        <div className="space-y-2">
          <Label htmlFor="ctaLink" className="text-xs font-medium text-gray-600">CTA Button Link</Label>
          <Input
            id="ctaLink"
            value={data.ctaLink || "#"}
            onChange={(e) => handleUpdate("ctaLink", e.target.value)}
            placeholder="CTA button link"
            className="h-8 text-sm"
          />
        </div>
      </div>

      {/* Display Settings */}
      <div className="border-b border-gray-200 pb-4">
        <h3 className="text-sm font-semibold text-gray-800 mb-3">Display Settings</h3>
        
        {/* Padding */}
        <div className="space-y-2">
          <Label htmlFor="padding" className="text-xs font-medium text-gray-600">Padding</Label>
          <Select
            value={data.padding || "large"}
            onValueChange={(value) => handleUpdate("padding", value)}
          >
            <SelectTrigger id="padding" className="h-8 text-sm">
              <SelectValue placeholder="Select padding" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small">Small</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="large">Large</SelectItem>
              <SelectItem value="xlarge">Extra Large</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Text Color */}
        <div className="space-y-2">
          <Label htmlFor="textColor" className="text-xs font-medium text-gray-600">Text Color</Label>
          <Input
            type="color"
            id="textColor"
            value={data.textColor || "#1f2937"}
            onChange={(e) => handleUpdate("textColor", e.target.value)}
            className="h-10 w-full"
          />
        </div>

        {/* Background Color */}
        <div className="space-y-2">
          <Label htmlFor="backgroundColor" className="text-xs font-medium text-gray-600">Background Color</Label>
          <Input
            type="color"
            id="backgroundColor"
            value={data.backgroundColor || "#ffffff"}
            onChange={(e) => handleUpdate("backgroundColor", e.target.value)}
            className="h-10 w-full"
          />
        </div>
      </div>

      {/* Advanced Settings */}
      <div>
        <h3 className="text-sm font-semibold text-gray-800 mb-3">Advanced Settings</h3>
        
        <div className="space-y-2">
          <Label htmlFor="marginTop" className="text-xs font-medium text-gray-600">Margin Top (px)</Label>
          <Input
            type="number"
            id="marginTop"
            value={data.marginTop || 0}
            onChange={(e) => handleUpdate("marginTop", parseInt(e.target.value) || 0)}
            min="0"
            max="100"
            className="h-8 text-sm"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="marginBottom" className="text-xs font-medium text-gray-600">Margin Bottom (px)</Label>
          <Input
            type="number"
            id="marginBottom"
            value={data.marginBottom || 0}
            onChange={(e) => handleUpdate("marginBottom", parseInt(e.target.value) || 0)}
            min="0"
            max="100"
            className="h-8 text-sm"
          />
        </div>
      </div>
    </div>
  );
};

export default HeroSectionSettings;
