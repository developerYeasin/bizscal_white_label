"use client";

import React from "react";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Upload } from "lucide-react";
import CollapsibleCard from "@/components/ui/CollapsibleCard.jsx";

const ImageBlockSettings = ({ component, updateNested, isUpdating }) => {
  if (!component) return null;
  const data = component.data || {};

  const handleChange = (field, value) => {
    updateNested(`data.${field}`, value);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        handleChange("src", event.target?.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <CollapsibleCard title="Image Settings" defaultOpen={true}>
      <div className="space-y-4">
        <div>
          <Label className="text-xs">Image Source</Label>
          <div className="flex gap-2 mt-1">
            <Input
              value={data.src || ""}
              onChange={(e) => handleChange("src", e.target.value)}
              className="h-9 text-xs"
              placeholder="https://..."
            />
            <input
              id="image-block-upload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: "none" }}
              disabled={isUpdating}
            />
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 shrink-0"
              onClick={() => document.getElementById("image-block-upload")?.click()}
              disabled={isUpdating}
            >
              <Upload className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div>
          <Label className="text-xs">Alt Text</Label>
          <Input
            value={data.alt || ""}
            onChange={(e) => handleChange("alt", e.target.value)}
            className="text-sm mt-1"
            placeholder="Image description..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-xs">Width</Label>
            <Input
              value={data.width || "100%"}
              onChange={(e) => handleChange("width", e.target.value)}
              className="h-9 text-xs mt-1"
              placeholder="e.g. 100% or 300px"
            />
          </div>
          <div>
            <Label className="text-xs">Max Width</Label>
            <Input
              value={data.maxWidth || "100%"}
              onChange={(e) => handleChange("maxWidth", e.target.value)}
              className="h-9 text-xs mt-1"
              placeholder="e.g. 100%"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-xs">Alignment</Label>
            <select
              value={data.align || "center"}
              onChange={(e) => handleChange("align", e.target.value)}
              className="w-full h-9 text-xs border rounded px-2 mt-1"
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </div>
          <div>
            <Label className="text-xs">Border Radius (px)</Label>
            <Input
              type="number"
              value={data.borderRadius ?? 0}
              onChange={(e) => handleChange("borderRadius", parseInt(e.target.value) || 0)}
              className="h-9 text-xs mt-1"
            />
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
    </CollapsibleCard>
  );
};

export default ImageBlockSettings;
