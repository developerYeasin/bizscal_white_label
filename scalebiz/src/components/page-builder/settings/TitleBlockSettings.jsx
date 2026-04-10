"use client";

import React from "react";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Textarea } from "@/components/ui/textarea.jsx";
import CollapsibleCard from "@/components/ui/CollapsibleCard.jsx";

const TitleBlockSettings = ({ component, updateNested }) => {
  if (!component) return null;
  const data = component.data || {};

  const handleChange = (field, value) => {
    updateNested(`data.${field}`, value);
  };

  return (
    <CollapsibleCard title="Title Settings" defaultOpen={true}>
      <div className="space-y-4">
        <div>
          <Label className="text-xs">Title Text</Label>
          <Textarea
            value={data.text || ""}
            onChange={(e) => handleChange("text", e.target.value)}
            className="text-sm mt-1"
            placeholder="Enter title..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-xs">HTML Tag</Label>
            <select
              value={data.tag || "h2"}
              onChange={(e) => handleChange("tag", e.target.value)}
              className="w-full h-9 text-xs border rounded px-2 mt-1"
            >
              <option value="h1">H1</option>
              <option value="h2">H2</option>
              <option value="h3">H3</option>
              <option value="h4">H4</option>
              <option value="h5">H5</option>
              <option value="h6">H6</option>
              <option value="div">DIV</option>
            </select>
          </div>
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
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-xs">Font Size (px)</Label>
            <Input
              type="number"
              value={parseInt(data.fontSize) || ""}
              onChange={(e) => handleChange("fontSize", e.target.value)}
              className="h-9 text-xs mt-1"
              placeholder="Default"
            />
          </div>
          <div>
            <Label className="text-xs">Font Weight</Label>
            <select
              value={data.fontWeight || "600"}
              onChange={(e) => handleChange("fontWeight", e.target.value)}
              className="w-full h-9 text-xs border rounded px-2 mt-1"
            >
              <option value="300">Light</option>
              <option value="400">Regular</option>
              <option value="500">Medium</option>
              <option value="600">Semi Bold</option>
              <option value="700">Bold</option>
              <option value="800">Extra Bold</option>
            </select>
          </div>
        </div>

        <div>
          <Label className="text-xs">Text Color</Label>
          <div className="flex gap-2 mt-1">
            <input
              type="color"
              value={data.color === "inherit" ? "#000000" : data.color || "#000000"}
              onChange={(e) => handleChange("color", e.target.value)}
              className="h-9 w-12 rounded border p-1 cursor-pointer"
            />
            <Input
              value={data.color || "inherit"}
              onChange={(e) => handleChange("color", e.target.value)}
              className="h-9 text-xs"
              placeholder="inherit"
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

export default TitleBlockSettings;
