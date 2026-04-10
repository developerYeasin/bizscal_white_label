"use client";

import React from "react";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Textarea } from "@/components/ui/textarea.jsx";
import CollapsibleCard from "@/components/ui/CollapsibleCard.jsx";

const TextBlockSettings = ({ component, updateNested }) => {
  if (!component) return null;
  const data = component.data || {};

  const handleChange = (field, value) => {
    updateNested(`data.${field}`, value);
  };

  return (
    <CollapsibleCard title="Text Settings" defaultOpen={true}>
      <div className="space-y-4">
        <div>
          <Label className="text-xs">HTML Content</Label>
          <Textarea
            value={data.content || ""}
            onChange={(e) => handleChange("content", e.target.value)}
            className="text-sm mt-1 font-mono"
            placeholder="<p>Add your content here...</p>"
            rows={8}
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
              <option value="justify">Justify</option>
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

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-xs">Padding Top (px)</Label>
            <Input
              type="number"
              value={data.paddingTop ?? 0}
              onChange={(e) => handleChange("paddingTop", parseInt(e.target.value) || 0)}
              className="h-9 text-xs mt-1"
            />
          </div>
          <div>
            <Label className="text-xs">Padding Bottom (px)</Label>
            <Input
              type="number"
              value={data.paddingBottom ?? 0}
              onChange={(e) => handleChange("paddingBottom", parseInt(e.target.value) || 0)}
              className="h-9 text-xs mt-1"
            />
          </div>
        </div>
      </div>
    </CollapsibleCard>
  );
};

export default TextBlockSettings;
