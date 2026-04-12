"use client";

import React from "react";
import { Label } from "@/components/ui/label.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Button } from "@/components/ui/button.jsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.jsx";
import { Plus, Trash2 } from "lucide-react";

const MegaMenuWithCategoriesSettings = ({
  component,
  index,
  updateNested,
  isUpdating,
}) => {
  const { data = {} } = component;
  const menuItems = data.menuItems || [];

  const addMenuItem = () => {
    const newItems = [...menuItems, { name: "", linkUrl: "", icon: "", subItems: [] }];
    updateNested("data.menuItems", newItems);
  };

  const removeMenuItem = (index) => {
    const newItems = menuItems.filter((_, i) => i !== index);
    updateNested("data.menuItems", newItems);
  };

  const updateMenuItem = (index, field, value) => {
    const newItems = [...menuItems];
    newItems[index] = { ...newItems[index], [field]: value };
    updateNested("data.menuItems", newItems);
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-sm text-gray-800">Mega Menu Settings</h3>
      
      <div className="space-y-2">
        <Label htmlFor="backgroundColor">Background Color</Label>
        <Input
          id="backgroundColor"
          type="color"
          value={data.backgroundColor || "#1C2434"}
          onChange={(e) => updateNested("data.backgroundColor", e.target.value)}
          className="h-10"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="textColor">Text Color</Label>
        <Input
          id="textColor"
          type="color"
          value={data.textColor || "#ffffff"}
          onChange={(e) => updateNested("data.textColor", e.target.value)}
          className="h-10"
        />
      </div>

      <div className="space-y-2">
        <Label>Menu Items</Label>
        <div className="space-y-3">
          {menuItems.map((item, index) => (
            <div key={index} className="border rounded-md p-3 space-y-2 relative">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 h-6 w-6"
                onClick={() => removeMenuItem(index)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
              
              <div className="space-y-1">
                <Label className="text-xs">Item Name</Label>
                <Input
                  value={item.name || ""}
                  onChange={(e) => updateMenuItem(index, "name", e.target.value)}
                  placeholder="Menu item name"
                />
              </div>
              
              <div className="space-y-1">
                <Label className="text-xs">Icon (optional)</Label>
                <Input
                  value={item.icon || ""}
                  onChange={(e) => updateMenuItem(index, "icon", e.target.value)}
                  placeholder="e.g., shopping-bag, heart"
                />
              </div>
              
              <div className="space-y-1">
                <Label className="text-xs">Link URL</Label>
                <Input
                  value={item.linkUrl || ""}
                  onChange={(e) => updateMenuItem(index, "linkUrl", e.target.value)}
                  placeholder="https://example.com"
                />
              </div>
            </div>
          ))}
        </div>
        
        <Button type="button" variant="outline" size="sm" onClick={addMenuItem} className="w-full mt-2">
          <Plus className="h-4 w-4 mr-2" /> Add Menu Item
        </Button>
      </div>
    </div>
  );
};

export default MegaMenuWithCategoriesSettings;
