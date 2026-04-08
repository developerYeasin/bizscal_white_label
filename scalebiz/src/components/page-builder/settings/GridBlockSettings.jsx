"use client";

import React from "react";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.jsx";
import { Button } from "@/components/ui/button.jsx";
import CollapsibleCard from "@/components/ui/CollapsibleCard.jsx";

/**
 * Settings for Grid Block
 *
 * Controls CSS grid properties:
 * - Number of columns (2-6)
 * - Gap
 * - Responsive behavior
 * - Padding, margin, background
 */
const GridBlockSettings = ({ component, updateNested, isUpdating }) => {
  if (!component) {
    return (
      <CollapsibleCard title="Grid Settings">
        <div className="animate-pulse space-y-4">
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

  return (
    <CollapsibleCard title="Grid Settings" defaultOpen={true}>
      <div className="space-y-6">
        {/* Columns */}
        <div className="space-y-3">
          <Label htmlFor="grid-columns" className="text-xs">Number of Columns</Label>
          <div className="flex items-center gap-2">
            <Input
              id="grid-columns"
              type="range"
              min="1"
              max="6"
              value={data.columns || 2}
              onChange={(e) => handleChange("columns", parseInt(e.target.value))}
              className="flex-1"
            />
            <span className="text-xs text-muted-foreground w-8 text-right">
              {data.columns || 2}
            </span>
          </div>
          <div className="flex gap-2 flex-wrap">
            {[1, 2, 3, 4, 5, 6].map((c) => (
              <Button
                key={c}
                variant="outline"
                size="sm"
                className={`h-7 text-[10px] ${data.columns === c ? "bg-primary text-primary-foreground" : ""}`}
                onClick={() => handleChange("columns", c)}
              >
                {c}
              </Button>
            ))}
          </div>
        </div>

        {/* Gap */}
        <div className="space-y-2">
          <Label htmlFor="grid-gap" className="text-xs">Gap (px)</Label>
          <div className="flex items-center gap-2">
            <Input
              id="grid-gap"
              type="range"
              min="0"
              max="60"
              value={data.gap ?? 16}
              onChange={(e) => handleChange("gap", parseInt(e.target.value))}
              className="flex-1"
            />
            <span className="text-xs text-muted-foreground w-12 text-right">
              {data.gap ?? 16}px
            </span>
          </div>
        </div>

        {/* Background */}
        <div className="space-y-2">
          <Label htmlFor="grid-bg" className="text-xs">Background Color</Label>
          <div className="flex gap-2">
            <input
              id="grid-bg"
              type="color"
              value={data.backgroundColor || "transparent"}
              onChange={(e) => handleChange("backgroundColor", e.target.value)}
              className="h-9 w-12 rounded border p-1 cursor-pointer"
            />
            <Input
              value={data.backgroundColor || "transparent"}
              onChange={(e) => handleChange("backgroundColor", e.target.value)}
              className="h-9 text-xs"
              placeholder="transparent"
            />
          </div>
        </div>

        {/* Padding */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Padding (px)</h4>
          <div className="grid grid-cols-4 gap-2">
            {["top", "right", "bottom", "left"].map((side) => (
              <div key={side}>
                <Label htmlFor={`grid-pad-${side}`} className="text-xs capitalize">{side}</Label>
                <Input
                  id={`grid-pad-${side}`}
                  type="number"
                  min="0"
                  value={data.padding?.[side] ?? 16}
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
                <Label htmlFor={`grid-margin-${side}`} className="text-xs capitalize">{side}</Label>
                <Input
                  id={`grid-margin-${side}`}
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

        {/* Fixed columns info */}
        <div className="border-t pt-4 mt-4">
          <p className="text-xs text-muted-foreground">
            This grid uses fixed column count. For auto-fill with minimum width, set columnMinWidth
            in advanced settings.
          </p>
        </div>
      </div>
    </CollapsibleCard>
  );
};

export default GridBlockSettings;
