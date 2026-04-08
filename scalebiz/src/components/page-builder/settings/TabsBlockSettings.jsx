"use client";

import React, { useCallback } from "react";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Button } from "@/components/ui/button.jsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.jsx";
import { Separator } from "@/components/ui/separator.jsx";
import { Plus, Trash2 } from "lucide-react";

/**
 * Tabs Block Settings
 *
 * Allows managing tabs list and general tab styling.
 */
const TabsBlockSettings = ({ component, updateNested, isUpdating }) => {
  const { data } = component;

  const handleChange = useCallback((field, value) => {
    updateNested(`data.${field}`, value);
  }, [updateNested]);

  const handleTabChange = useCallback((index, field, value) => {
    const tabs = [...(data.tabs || [])];
    tabs[index] = { ...tabs[index], [field]: value };
    updateNested("data.tabs", tabs);
  }, [data.tabs, updateNested]);

  const handleNestedTabChange = useCallback((index, nestedField, value) => {
    const tabs = [...(data.tabs || [])];
    tabs[index] = { ...tabs[index], [nestedField]: value };
    updateNested("data.tabs", tabs);
  }, [data.tabs, updateNested]);

  const addTab = () => {
    const newTab = {
      id: `tab-${Date.now()}`,
      title: "New Tab",
      content: "",
    };
    updateNested("data.tabs", [...(data.tabs || []), newTab]);
  };

  const removeTab = (index) => {
    const tabs = data.tabs?.filter((_, i) => i !== index) || [];
    updateNested("data.tabs", tabs);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-xs">Tabs</Label>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {(data.tabs || []).map((tab, index) => (
            <div key={index} className="p-2 border rounded bg-muted/30">
              <div className="flex items-center justify-between mb-2">
                <Input
                  value={tab.title}
                  onChange={(e) => handleTabChange(index, "title", e.target.value)}
                  className="h-7 text-xs"
                  placeholder="Tab title"
                  disabled={isUpdating}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => removeTab(index)}
                  disabled={isUpdating || data.tabs?.length <= 1}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
              <Input
                value={tab.content || ""}
                onChange={(e) => handleNestedTabChange(index, "content", e.target.value)}
                className="h-7 text-xs"
                placeholder="Tab content (HTML supported)"
                disabled={isUpdating}
              />
            </div>
          ))}
        </div>
        <Button
          variant="outline"
          size="sm"
          className="w-full mt-2"
          onClick={addTab}
          disabled={isUpdating}
        >
          <Plus className="h-3 w-3 mr-1" /> Add Tab
        </Button>
      </div>

      <Separator />

      <div className="space-y-3">
        <div className="space-y-2">
          <Label className="text-xs">Layout</Label>
          <Select
            value={data.layout || "horizontal"}
            onValueChange={(val) => handleChange("layout", val)}
            disabled={isUpdating}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="horizontal">Horizontal</SelectItem>
              <SelectItem value="vertical">Vertical</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-xs">Variant</Label>
          <Select
            value={data.variant || "default"}
            onValueChange={(val) => handleChange("variant", val)}
            disabled={isUpdating}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="card">Card</SelectItem>
              <SelectItem value="pills">Pills</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default TabsBlockSettings;
