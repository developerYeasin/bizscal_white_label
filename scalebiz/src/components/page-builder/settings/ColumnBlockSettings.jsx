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
import CollapsibleCard from "@/components/ui/CollapsibleCard.jsx";

/**
 * Settings for Column Block
 *
 * Controls column width, order, alignment, spacing, background.
 * Typically used inside a Row.
 */
const ColumnBlockSettings = ({ component, updateNested, isUpdating }) => {
  if (!component) {
    return (
      <CollapsibleCard title="Column Settings">
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
    <CollapsibleCard title="Column Settings" defaultOpen={true}>
      <div className="space-y-6">
        {/* Width */}
        <div className="space-y-2">
          <Label htmlFor="col-width" className="text-xs">Width (%)</Label>
          <div className="flex items-center gap-2">
            <Input
              id="col-width"
              type="range"
              min="1"
              max="100"
              value={data.width || 100}
              onChange={(e) => handleChange("width", parseInt(e.target.value))}
              className="flex-1"
            />
            <span className="text-xs text-muted-foreground w-12 text-right">
              {data.width || 100}%
            </span>
          </div>
          <div className="flex gap-2 flex-wrap">
            {[25, 33, 50, 66, 75, 100].map((w) => (
              <Button
                key={w}
                variant="outline"
                size="sm"
                className="h-7 text-[10px]"
                onClick={() => handleChange("width", w)}
              >
                {w}%
              </Button>
            ))}
          </div>
        </div>

        {/* Order */}
        <div className="space-y-2">
          <Label htmlFor="col-order" className="text-xs">Order (reorder within row)</Label>
          <Input
            id="col-order"
            type="number"
            value={data.order || 0}
            onChange={(e) => handleChange("order", parseInt(e.target.value))}
            className="h-9 text-xs"
          />
        </div>

        {/* Align Self */}
        <div className="space-y-2">
          <Label htmlFor="col-align-self" className="text-xs">Align Self</Label>
          <Select
            value={data.alignSelf || "auto"}
            onValueChange={(val) => handleChange("alignSelf", val)}
          >
            <SelectTrigger id="col-align-self" className="h-9 text-xs">
              <SelectValue placeholder="Align" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="auto">Auto</SelectItem>
              <SelectItem value="flex-start">Start</SelectItem>
              <SelectItem value="center">Center</SelectItem>
              <SelectItem value="flex-end">End</SelectItem>
              <SelectItem value="stretch">Stretch</SelectItem>
              <SelectItem value="baseline">Baseline</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Background */}
        <div className="space-y-2">
          <Label htmlFor="col-bg" className="text-xs">Background Color</Label>
          <div className="flex gap-2">
            <input
              id="col-bg"
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
                <Label htmlFor={`col-pad-${side}`} className="text-xs capitalize">{side}</Label>
                <Input
                  id={`col-pad-${side}`}
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
                <Label htmlFor={`col-margin-${side}`} className="text-xs capitalize">{side}</Label>
                <Input
                  id={`col-margin-${side}`}
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
          <Label htmlFor="col-min-height" className="text-xs">Minimum Height</Label>
          <Input
            id="col-min-height"
            type="text"
            value={data.minHeight === "auto" ? "" : data.minHeight || ""}
            onChange={(e) => handleChange("minHeight", e.target.value || "auto")}
            className="h-8 text-xs"
            placeholder="auto or 300px"
          />
        </div>
      </div>
    </CollapsibleCard>
  );
};

export default ColumnBlockSettings;
