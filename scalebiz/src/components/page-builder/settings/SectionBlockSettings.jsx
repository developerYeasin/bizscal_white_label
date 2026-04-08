"use client";

import React from "react";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Upload, Palette } from "lucide-react";
import CollapsibleCard from "@/components/ui/CollapsibleCard.jsx";

/**
 * Settings for Section Block
 *
 * Allows editing:
 * - Background color / image
 * - Padding (top, right, bottom, left)
 * - Margin (top, right, bottom, left)
 * - Minimum height
 * - Container mode (boxed vs full-width)
 */
const SectionBlockSettings = ({ component, updateNested, isUpdating }) => {
  if (!component) {
    return (
      <CollapsibleCard title="Section Settings">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded"></div>
          <div className="h-8 bg-gray-200 rounded"></div>
          <div className="h-8 bg-gray-200 rounded"></div>
        </div>
      </CollapsibleCard>
    );
  }

  const data = component.data || {};

  const handleChange = (field, value) => {
    updateNested(`data.${field}`, value);
  };

  const handleNestedChange = (subField, value) => {
    const current = data[subField] || { top: 0, right: 0, bottom: 0, left: 0 };
    updateNested(`data.${subField}`, { ...current, ...value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, upload and get URL. For now, use local preview
      const reader = new FileReader();
      reader.onload = (event) => {
        handleChange("backgroundImage", event.target?.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <CollapsibleCard title="Section Settings" defaultOpen={true}>
      <div className="space-y-6">
        {/* Background */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">Background</h4>
            <div className="flex items-center gap-2">
              <Palette className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="section-bg-color" className="text-xs">Color</Label>
              <div className="flex gap-2 mt-1">
                <input
                  id="section-bg-color"
                  type="color"
                  value={data.backgroundColor || "#ffffff"}
                  onChange={(e) => handleChange("backgroundColor", e.target.value)}
                  className="h-9 w-12 rounded border p-1 cursor-pointer"
                />
                <Input
                  value={data.backgroundColor || "#ffffff"}
                  onChange={(e) => handleChange("backgroundColor", e.target.value)}
                  className="h-9 text-xs"
                  placeholder="#ffffff"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="section-bg-image" className="text-xs">Background Image</Label>
              <div className="flex gap-2 mt-1">
                <input
                  id="section-bg-image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: "none" }}
                  disabled={isUpdating}
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 text-xs"
                  onClick={() => document.getElementById("section-bg-image")?.click()}
                  disabled={isUpdating}
                >
                  <Upload className="h-3 w-3 mr-1" />
                  Upload
                </Button>
                {data.backgroundImage && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 text-xs text-destructive"
                    onClick={() => handleChange("backgroundImage", "")}
                  >
                    Clear
                  </Button>
                )}
              </div>
            </div>
          </div>
          {data.backgroundImage && (
            <div className="mt-2">
              <img
                src={data.backgroundImage}
                alt="Background preview"
                className="w-full h-24 object-cover rounded border"
              />
            </div>
          )}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="section-bg-size" className="text-xs">Background Size</Label>
              <select
                id="section-bg-size"
                value={data.backgroundSize || "cover"}
                onChange={(e) => handleChange("backgroundSize", e.target.value)}
                className="w-full h-9 text-xs border rounded px-2 mt-1"
              >
                <option value="cover">Cover</option>
                <option value="contain">Contain</option>
                <option value="auto">Auto</option>
                <option value="100% 100%">Stretch</option>
              </select>
            </div>
            <div>
              <Label htmlFor="section-bg-position" className="text-xs">Background Position</Label>
              <select
                id="section-bg-position"
                value={data.backgroundPosition || "center"}
                onChange={(e) => handleChange("backgroundPosition", e.target.value)}
                className="w-full h-9 text-xs border rounded px-2 mt-1"
              >
                <option value="center">Center</option>
                <option value="top">Top</option>
                <option value="bottom">Bottom</option>
                <option value="left">Left</option>
                <option value="right">Right</option>
              </select>
            </div>
          </div>
        </div>

        {/* Padding */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Padding (px)</h4>
          <div className="grid grid-cols-4 gap-2">
            {["top", "right", "bottom", "left"].map((side) => (
              <div key={side}>
                <Label htmlFor={`pad-${side}`} className="text-xs capitalize">{side}</Label>
                <Input
                  id={`pad-${side}`}
                  type="number"
                  min="0"
                  value={data.padding?.[side] ?? 0}
                  onChange={(e) => handleNestedChange("padding", { [side]: parseInt(e.target.value) || 0 })}
                  className="h-8 text-xs"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Margin */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Margin (px)</h4>
          <div className="grid grid-cols-4 gap-2">
            {["top", "right", "bottom", "left"].map((side) => (
              <div key={side}>
                <Label htmlFor={`margin-${side}`} className="text-xs capitalize">{side}</Label>
                <Input
                  id={`margin-${side}`}
                  type="number"
                  min="0"
                  value={data.margin?.[side] ?? 0}
                  onChange={(e) => handleNestedChange("margin", { [side]: parseInt(e.target.value) || 0 })}
                  className="h-8 text-xs"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Min Height */}
        <div className="space-y-2">
          <Label htmlFor="section-min-height" className="text-xs">Minimum Height</Label>
          <Input
            id="section-min-height"
            type="text"
            value={data.minHeight === "auto" ? "" : data.minHeight || ""}
            onChange={(e) => handleChange("minHeight", e.target.value || "auto")}
            className="h-8 text-xs"
            placeholder="auto or 400px"
          />
        </div>

        {/* Container Mode */}
        <div className="space-y-2">
          <Label htmlFor="section-container" className="text-xs">Layout Mode</Label>
          <select
            id="section-container"
            value={data.container ? "container" : "full"}
            onChange={(e) => handleChange("container", e.target.value === "container")}
            className="w-full h-9 text-xs border rounded px-2"
          >
            <option value="full">Full Width</option>
            <option value="container">Boxed (max-width: 1200px)</option>
          </select>
        </div>
      </div>
    </CollapsibleCard>
  );
};

export default SectionBlockSettings;
