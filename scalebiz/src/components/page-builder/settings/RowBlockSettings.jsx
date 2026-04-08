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
 * Settings for Row Block
 *
 * Controls flexbox properties:
 * - justify-content
 * - align-items
 * - flex-wrap
 * - gap
 * - padding/margin
 * - background color
 */
const RowBlockSettings = ({ component, updateNested, isUpdating }) => {
  if (!component) {
    return (
      <CollapsibleCard title="Row Settings">
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
    <CollapsibleCard title="Row Settings" defaultOpen={true}>
      <div className="space-y-6">
        {/* Flex Properties */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Flex Layout</h4>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="row-justify" className="text-xs">Justify Content</Label>
              <Select
                value={data.justifyContent || "flex-start"}
                onValueChange={(val) => handleChange("justifyContent", val)}
              >
                <SelectTrigger id="row-justify" className="h-9 text-xs">
                  <SelectValue placeholder="Justify" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="flex-start">Start</SelectItem>
                  <SelectItem value="center">Center</SelectItem>
                  <SelectItem value="flex-end">End</SelectItem>
                  <SelectItem value="space-between">Space Between</SelectItem>
                  <SelectItem value="space-around">Space Around</SelectItem>
                  <SelectItem value="space-evenly">Space Evenly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="row-align" className="text-xs">Align Items</Label>
              <Select
                value={data.alignItems || "stretch"}
                onValueChange={(val) => handleChange("alignItems", val)}
              >
                <SelectTrigger id="row-align" className="h-9 text-xs">
                  <SelectValue placeholder="Align" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="stretch">Stretch</SelectItem>
                  <SelectItem value="flex-start">Start</SelectItem>
                  <SelectItem value="center">Center</SelectItem>
                  <SelectItem value="flex-end">End</SelectItem>
                  <SelectItem value="baseline">Baseline</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="row-wrap" className="text-xs">Flex Wrap</Label>
            <Select
              value={data.flexWrap || "wrap"}
              onValueChange={(val) => handleChange("flexWrap", val)}
            >
              <SelectTrigger id="row-wrap" className="h-9 text-xs">
                <SelectValue placeholder="Wrap" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="wrap">Wrap</SelectItem>
                <SelectItem value="nowrap">No Wrap</SelectItem>
                <SelectItem value="wrap-reverse">Wrap Reverse</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Gap */}
        <div className="space-y-2">
          <Label htmlFor="row-gap" className="text-xs">Gap (spacing between columns) (px)</Label>
          <Input
            id="row-gap"
            type="number"
            min="0"
            value={data.gap ?? 16}
            onChange={(e) => handleChange("gap", parseInt(e.target.value) || 0)}
            className="h-9 text-xs"
          />
        </div>

        {/* Background */}
        <div className="space-y-2">
          <Label htmlFor="row-bg" className="text-xs">Background Color</Label>
          <div className="flex gap-2">
            <input
              id="row-bg"
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
                <Label htmlFor={`row-pad-${side}`} className="text-xs capitalize">{side}</Label>
                <Input
                  id={`row-pad-${side}`}
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
                <Label htmlFor={`row-margin-${side}`} className="text-xs capitalize">{side}</Label>
                <Input
                  id={`row-margin-${side}`}
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
      </div>
    </CollapsibleCard>
  );
};

export default RowBlockSettings;
