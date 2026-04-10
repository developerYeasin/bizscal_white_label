"use client";

import React from "react";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Textarea } from "@/components/ui/textarea.jsx";
import CollapsibleCard from "@/components/ui/CollapsibleCard.jsx";

const DescriptionBlockSettings = ({ component, updateNested }) => {
  if (!component) return null;
  const data = component.data || {};

  const handleChange = (field, value) => {
    updateNested(`data.${field}`, value);
  };

  return (
    <CollapsibleCard title="Description Settings" defaultOpen={true}>
      <div className="space-y-4">
        <div>
          <Label className="text-xs">Description Text</Label>
          <Textarea
            value={data.text || ""}
            onChange={(e) => handleChange("text", e.target.value)}
            className="text-sm mt-1"
            placeholder="Enter description..."
            rows={4}
          />
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
            <Label className="text-xs">Font Size (px)</Label>
            <Input
              type="number"
              value={parseInt(data.fontSize) || 16}
              onChange={(e) => handleChange("fontSize", e.target.value)}
              className="h-9 text-xs mt-1"
            />
          </div>
        </div>

        <div>
          <Label className="text-xs">Text Color</Label>
          <div className="flex gap-2 mt-1">
            <input
              type="color"
              value={data.color || "#666666"}
              onChange={(e) => handleChange("color", e.target.value)}
              className="h-9 w-12 rounded border p-1 cursor-pointer"
            />
            <Input
              value={data.color || "#666666"}
              onChange={(e) => handleChange("color", e.target.value)}
              className="h-9 text-xs"
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

export default DescriptionBlockSettings;
