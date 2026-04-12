"use client";

import React from "react";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.jsx";
import { Switch } from "@/components/ui/switch.jsx";
import { Button } from "@/components/ui/button.jsx";

/**
 * CardLayoutSettings - Settings component for card layout blocks
 */
const CardLayoutSettings = ({ component, index, updateNested, isUpdating }) => {
  const { data = {} } = component;

  const handleUpdate = (path, value) => {
    updateNested(path, value);
  };

  return (
    <div className="space-y-4">
      <div className="border-b border-gray-200 pb-4">
        <h3 className="text-sm font-semibold text-gray-800 mb-3">Layout Settings</h3>
        
        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="title" className="text-xs font-medium text-gray-600">Title</Label>
          <Input
            id="title"
            value={data.title || ""}
            onChange={(e) => handleUpdate("title", e.target.value)}
            placeholder="Section title"
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
            placeholder="Section subtitle"
            className="h-8 text-sm"
          />
        </div>

        {/* Columns */}
        <div className="space-y-2">
          <Label htmlFor="columns" className="text-xs font-medium text-gray-600">Number of Columns</Label>
          <Select
            value={data.columns || 3}
            onValueChange={(value) => handleUpdate("columns", parseInt(value))}
          >
            <SelectTrigger id="columns" className="h-8 text-sm">
              <SelectValue placeholder="Select columns" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 Column</SelectItem>
              <SelectItem value="2">2 Columns</SelectItem>
              <SelectItem value="3">3 Columns</SelectItem>
              <SelectItem value="4">4 Columns</SelectItem>
              <SelectItem value="5">5 Columns</SelectItem>
              <SelectItem value="6">6 Columns</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Gap */}
        <div className="space-y-2">
          <Label htmlFor="gap" className="text-xs font-medium text-gray-600">Gap Size</Label>
          <Select
            value={data.gap || "medium"}
            onValueChange={(value) => handleUpdate("gap", value)}
          >
            <SelectTrigger id="gap" className="h-8 text-sm">
              <SelectValue placeholder="Select gap" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small">Small</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="large">Large</SelectItem>
              <SelectItem value="xlarge">Extra Large</SelectItem>
            </SelectContent>
          </Select>
        </div>

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

        {/* Border Radius */}
        <div className="space-y-2">
          <Label htmlFor="borderRadius" className="text-xs font-medium text-gray-600">Border Radius</Label>
          <Select
            value={data.borderRadius || "medium"}
            onValueChange={(value) => handleUpdate("borderRadius", value)}
          >
            <SelectTrigger id="borderRadius" className="h-8 text-sm">
              <SelectValue placeholder="Select radius" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="small">Small</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="large">Large</SelectItem>
              <SelectItem value="xlarge">Extra Large</SelectItem>
              <SelectItem value="full">Full</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Shadow */}
        <div className="space-y-2">
          <Label htmlFor="shadow" className="text-xs font-medium text-gray-600">Shadow</Label>
          <Select
            value={data.shadow || "medium"}
            onValueChange={(value) => handleUpdate("shadow", value)}
          >
            <SelectTrigger id="shadow" className="h-8 text-sm">
              <SelectValue placeholder="Select shadow" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="small">Small</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="large">Large</SelectItem>
              <SelectItem value="xlarge">Extra Large</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Show Border */}
        <div className="flex items-center justify-between">
          <Label htmlFor="border" className="text-xs font-medium text-gray-600">Show Border</Label>
          <Switch
            id="border"
            checked={data.border || false}
            onCheckedChange={(checked) => handleUpdate("border", checked)}
          />
        </div>

        {/* Border Color */}
        {data.border && (
          <div className="space-y-2">
            <Label htmlFor="borderColor" className="text-xs font-medium text-gray-600">Border Color</Label>
            <Input
              type="color"
              id="borderColor"
              value={data.borderColor || "#e5e7eb"}
              onChange={(e) => handleUpdate("borderColor", e.target.value)}
              className="h-10 w-full"
            />
          </div>
        )}
      </div>

      {/* Background Settings */}
      <div className="border-b border-gray-200 pb-4">
        <h3 className="text-sm font-semibold text-gray-800 mb-3">Background Settings</h3>
        
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

      {/* Display Settings */}
      <div>
        <h3 className="text-sm font-semibold text-gray-800 mb-3">Display Settings</h3>
        
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

export default CardLayoutSettings;
