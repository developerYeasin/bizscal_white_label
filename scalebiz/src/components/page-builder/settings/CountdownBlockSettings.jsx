"use client";

import React, { useCallback } from "react";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.jsx";
import { Calendar } from "lucide-react";

/**
 * Countdown Block Settings
 *
 * Configure target date, appearance, and labels.
 */
const CountdownBlockSettings = ({ component, updateNested, isUpdating }) => {
  const { data } = component;

  const handleChange = useCallback((field, value) => {
    updateNested(`data.${field}`, value);
  }, [updateNested]);

  const handleLabelChange = useCallback((field, value) => {
    updateNested("data.labels", { ...data.labels, [field]: value });
  }, [data.labels, updateNested]);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-xs flex items-center gap-2">
          <Calendar className="h-3 w-3" /> Target Date
        </Label>
        <Input
          type="datetime-local"
          value={data.targetDate || ""}
          onChange={(e) => handleChange("targetDate", e.target.value)}
          className="h-8"
          disabled={isUpdating}
        />
      </div>

      <div className="space-y-2">
        <Label className="text-xs">Style</Label>
        <Select
          value={data.style || "minimal"}
          onValueChange={(val) => handleChange("style", val)}
          disabled={isUpdating}
        >
          <SelectTrigger className="h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="minimal">Minimal</SelectItem>
            <SelectItem value="card">Card</SelectItem>
            <SelectItem value="gradient">Gradient</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-xs">Layout</Label>
        <Select
          value={data.layout || "compact"}
          onValueChange={(val) => handleChange("layout", val)}
          disabled={isUpdating}
        >
          <SelectTrigger className="h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="compact">Compact</SelectItem>
            <SelectItem value="expanded">Expanded</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Separator />

      <div className="space-y-2">
        <Label className="text-xs">Labels</Label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="text-[10px] text-muted-foreground">Days</Label>
            <Input
              value={data.labels?.days || "Days"}
              onChange={(e) => handleLabelChange("days", e.target.value)}
              className="h-7 text-xs"
              disabled={isUpdating}
            />
          </div>
          <div>
            <Label className="text-[10px] text-muted-foreground">Hours</Label>
            <Input
              value={data.labels?.hours || "Hours"}
              onChange={(e) => handleLabelChange("hours", e.target.value)}
              className="h-7 text-xs"
              disabled={isUpdating}
            />
          </div>
          <div>
            <Label className="text-[10px] text-muted-foreground">Minutes</Label>
            <Input
              value={data.labels?.minutes || "Minutes"}
              onChange={(e) => handleLabelChange("minutes", e.target.value)}
              className="h-7 text-xs"
              disabled={isUpdating}
            />
          </div>
          <div>
            <Label className="text-[10px] text-muted-foreground">Seconds</Label>
            <Input
              value={data.labels?.seconds || "Seconds"}
              onChange={(e) => handleLabelChange("seconds", e.target.value)}
              className="h-7 text-xs"
              disabled={isUpdating}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountdownBlockSettings;
