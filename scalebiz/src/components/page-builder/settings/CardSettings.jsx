"use client";

import React from "react";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.jsx";
import { Switch } from "@/components/ui/switch.jsx";
import { Button } from "@/components/ui/button.jsx";

/**
 * CardSettings - Settings component for card blocks
 */
const CardSettings = ({ component, index, updateNested, isUpdating }) => {
  const { data = {} } = component;

  const handleUpdate = (path, value) => {
    updateNested(path, value);
  };

  return (
    <div className="space-y-4">
      <div className="border-b border-gray-200 pb-4">
        <h3 className="text-sm font-semibold text-gray-800 mb-3">Card Content</h3>
        
        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="title" className="text-xs font-medium text-gray-600">Title</Label>
          <Input
            id="title"
            value={data.title || ""}
            onChange={(e) => handleUpdate("title", e.target.value)}
            placeholder="Card title"
            className="h-8 text-sm"
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description" className="text-xs font-medium text-gray-600">Description</Label>
          <Input
            id="description"
            value={data.description || ""}
            onChange={(e) => handleUpdate("description", e.target.value)}
            placeholder="Card description"
            className="h-8 text-sm"
          />
        </div>

        {/* Image URL */}
        <div className="space-y-2">
          <Label htmlFor="imageUrl" className="text-xs font-medium text-gray-600">Image URL</Label>
          <Input
            id="imageUrl"
            value={data.imageUrl || ""}
            onChange={(e) => handleUpdate("imageUrl", e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="h-8 text-sm"
          />
        </div>

        {/* Button Text */}
        <div className="space-y-2">
          <Label htmlFor="buttonText" className="text-xs font-medium text-gray-600">Button Text</Label>
          <Input
            id="buttonText"
            value={data.buttonText || ""}
            onChange={(e) => handleUpdate("buttonText", e.target.value)}
            placeholder="Learn More"
            className="h-8 text-sm"
          />
        </div>

        {/* Button Link */}
        <div className="space-y-2">
          <Label htmlFor="buttonLink" className="text-xs font-medium text-gray-600">Button Link</Label>
          <Input
            id="buttonLink"
            value={data.buttonLink || "#"}
            onChange={(e) => handleUpdate("buttonLink", e.target.value)}
            placeholder="#"
            className="h-8 text-sm"
          />
        </div>

        {/* Image Position */}
        <div className="space-y-2">
          <Label htmlFor="imagePosition" className="text-xs font-medium text-gray-600">Image Position</Label>
          <Select
            value={data.imagePosition || "top"}
            onValueChange={(value) => handleUpdate("imagePosition", value)}
          >
            <SelectTrigger id="imagePosition" className="h-8 text-sm">
              <SelectValue placeholder="Select position" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="top">Top</SelectItem>
              <SelectItem value="bottom">Bottom</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Show Button */}
        <div className="flex items-center justify-between">
          <Label htmlFor="showButton" className="text-xs font-medium text-gray-600">Show Button</Label>
          <Switch
            id="showButton"
            checked={data.buttonText !== ""}
            onCheckedChange={(checked) => handleUpdate("buttonText", checked ? "Learn More" : "")}
          />
        </div>

        {/* Show Image */}
        <div className="flex items-center justify-between">
          <Label htmlFor="showImage" className="text-xs font-medium text-gray-600">Show Image</Label>
          <Switch
            id="showImage"
            checked={data.imageUrl !== ""}
            onCheckedChange={(checked) => handleUpdate("imageUrl", checked ? "" : "")}
          />
        </div>
      </div>

      {/* Style Settings */}
      <div className="border-b border-gray-200 pb-4">
        <h3 className="text-sm font-semibold text-gray-800 mb-3">Style Settings</h3>
        
        {/* Button Style */}
        <div className="space-y-2">
          <Label htmlFor="buttonStyle" className="text-xs font-medium text-gray-600">Button Style</Label>
          <Select
            value={data.buttonStyle || "primary"}
            onValueChange={(value) => handleUpdate("buttonStyle", value)}
          >
            <SelectTrigger id="buttonStyle" className="h-8 text-sm">
              <SelectValue placeholder="Select style" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="primary">Primary</SelectItem>
              <SelectItem value="secondary">Secondary</SelectItem>
              <SelectItem value="outline">Outline</SelectItem>
              <SelectItem value="ghost">Ghost</SelectItem>
            </SelectContent>
          </Select>
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
      </div>
    </div>
  );
};

export default CardSettings;
