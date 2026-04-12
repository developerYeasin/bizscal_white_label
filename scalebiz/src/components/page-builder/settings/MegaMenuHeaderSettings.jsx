"use client";

import React from "react";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.jsx";
import { Switch } from "@/components/ui/switch.jsx";
import { Button } from "@/components/ui/button.jsx";

/**
 * MegaMenuHeaderSettings - Settings component for mega menu header blocks
 */
const MegaMenuHeaderSettings = ({ component, index, updateNested, isUpdating }) => {
  const { data = {} } = component;

  const handleUpdate = (path, value) => {
    updateNested(path, value);
  };

  return (
    <div className="space-y-4">
      <div className="border-b border-gray-200 pb-4">
        <h3 className="text-sm font-semibold text-gray-800 mb-3">Header Settings</h3>
        
        {/* Background Color */}
        <div className="space-y-2">
          <Label htmlFor="backgroundColor" className="text-xs font-medium text-gray-600">Background Color</Label>
          <Input
            type="color"
            id="backgroundColor"
            value={data.backgroundColor || "#f97316"}
            onChange={(e) => handleUpdate("backgroundColor", e.target.value)}
            className="h-10 w-full"
          />
        </div>

        {/* Text Color */}
        <div className="space-y-2">
          <Label htmlFor="textColor" className="text-xs font-medium text-gray-600">Text Color</Label>
          <Input
            type="color"
            id="textColor"
            value={data.textColor || "#ffffff"}
            onChange={(e) => handleUpdate("textColor", e.target.value)}
            className="h-10 w-full"
          />
        </div>

        {/* Padding */}
        <div className="space-y-2">
          <Label htmlFor="padding" className="text-xs font-medium text-gray-600">Padding</Label>
          <Select
            value={data.padding || "medium"}
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

        {/* Show Search Bar */}
        <div className="flex items-center justify-between">
          <Label htmlFor="showSearch" className="text-xs font-medium text-gray-600">Show Search Bar</Label>
          <Switch
            id="showSearch"
            checked={data.showSearch !== false}
            onCheckedChange={(checked) => handleUpdate("showSearch", checked)}
          />
        </div>

        {/* Show Navigation */}
        <div className="flex items-center justify-between">
          <Label htmlFor="showNav" className="text-xs font-medium text-gray-600">Show Navigation</Label>
          <Switch
            id="showNav"
            checked={data.showNav !== false}
            onCheckedChange={(checked) => handleUpdate("showNav", checked)}
          />
        </div>

        {/* Show Cart */}
        <div className="flex items-center justify-between">
          <Label htmlFor="showCart" className="text-xs font-medium text-gray-600">Show Cart</Label>
          <Switch
            id="showCart"
            checked={data.showCart !== false}
            onCheckedChange={(checked) => handleUpdate("showCart", checked)}
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

export default MegaMenuHeaderSettings;
