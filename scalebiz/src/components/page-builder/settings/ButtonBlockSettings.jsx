"use client";

import React from "react";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import CollapsibleCard from "@/components/ui/CollapsibleCard.jsx";

const ButtonBlockSettings = ({ component, updateNested, activeTab }) => {
  if (!component) return null;
  const data = component.data || {};

  const handleChange = (field, value) => {
    updateNested(`data.${field}`, value);
  };

  if (activeTab === "actions") {
    return (
      <div className="space-y-4">
        <div>
          <Label className="text-xs">Link URL</Label>
          <Input
            value={data.url || ""}
            onChange={(e) => handleChange("url", e.target.value)}
            className="text-sm mt-1"
            placeholder="https://..."
          />
        </div>
      </div>
    );
  }

  if (activeTab === "styles") {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-xs">Variant</Label>
            <select
              value={data.variant || "default"}
              onChange={(e) => handleChange("variant", e.target.value)}
              className="w-full h-9 text-xs border rounded px-2 mt-1"
            >
              <option value="default">Default</option>
              <option value="outline">Outline</option>
              <option value="secondary">Secondary</option>
              <option value="ghost">Ghost</option>
              <option value="link">Link</option>
              <option value="destructive">Destructive</option>
            </select>
          </div>
          <div>
            <Label className="text-xs">Size</Label>
            <select
              value={data.size || "default"}
              onChange={(e) => handleChange("size", e.target.value)}
              className="w-full h-9 text-xs border rounded px-2 mt-1"
            >
              <option value="sm">Small</option>
              <option value="default">Default</option>
              <option value="lg">Large</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-xs">Alignment</Label>
            <select
              value={data.align || "left"}
              onChange={(e) => handleChange("align", e.target.value)}
              className="w-full h-9 text-xs border rounded px-2 mt-1"
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </div>
          <div>
            <Label className="text-xs">Width</Label>
            <select
              value={data.width || "auto"}
              onChange={(e) => handleChange("width", e.target.value)}
              className="w-full h-9 text-xs border rounded px-2 mt-1"
            >
              <option value="auto">Auto</option>
              <option value="full">Full Width</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-xs">Margin Top (px)</Label>
            <Input
              type="number"
              value={data.marginTop ?? 0}
              onChange={(e) => handleChange("marginTop", parseInt(e.target.value) || 0)}
              className="h-9 text-xs mt-1"
            />
          </div>
          <div>
            <Label className="text-xs">Margin Bottom (px)</Label>
            <Input
              type="number"
              value={data.marginBottom ?? 16}
              onChange={(e) => handleChange("marginBottom", parseInt(e.target.value) || 0)}
              className="h-9 text-xs mt-1"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-xs">Button Text</Label>
        <Input
          value={data.text || ""}
          onChange={(e) => handleChange("text", e.target.value)}
          className="text-sm mt-1"
          placeholder="Enter button text..."
        />
      </div>
    </div>
  );
};

export default ButtonBlockSettings;
