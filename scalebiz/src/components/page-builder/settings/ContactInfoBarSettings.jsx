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

const ContactInfoBarSettings = ({
  component,
  index,
  updateNested,
  isUpdating,
}) => {
  const { data = {} } = component;
  const items = data.items || [];

  const addItem = () => {
    const newItems = [...items, { icon: "", title: "", content: "", linkUrl: "" }];
    updateNested("data.items", newItems);
  };

  const removeItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    updateNested("data.items", newItems);
  };

  const updateItem = (index, field, value) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    updateNested("data.items", newItems);
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-sm text-gray-800">Contact Info Bar Settings</h3>
      
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
        <Label>Info Items</Label>
        <div className="space-y-3">
          {items.map((item, index) => (
            <div key={index} className="border rounded-md p-3 space-y-2 relative">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 h-6 w-6"
                onClick={() => removeItem(index)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
              
              <div className="space-y-1">
                <Label className="text-xs">Icon</Label>
                <Input
                  value={item.icon || ""}
                  onChange={(e) => updateItem(index, "icon", e.target.value)}
                  placeholder="e.g., phone, email, location"
                />
              </div>
              
              <div className="space-y-1">
                <Label className="text-xs">Title</Label>
                <Input
                  value={item.title || ""}
                  onChange={(e) => updateItem(index, "title", e.target.value)}
                  placeholder="Item title"
                />
              </div>
              
              <div className="space-y-1">
                <Label className="text-xs">Content</Label>
                <Input
                  value={item.content || ""}
                  onChange={(e) => updateItem(index, "content", e.target.value)}
                  placeholder="Item content"
                />
              </div>
              
              <div className="space-y-1">
                <Label className="text-xs">Link URL (optional)</Label>
                <Input
                  value={item.linkUrl || ""}
                  onChange={(e) => updateItem(index, "linkUrl", e.target.value)}
                  placeholder="https://example.com"
                />
              </div>
            </div>
          ))}
        </div>
        
        <Button type="button" variant="outline" size="sm" onClick={addItem} className="w-full mt-2">
          <Plus className="h-4 w-4 mr-2" /> Add Item
        </Button>
      </div>
    </div>
  );
};

export default ContactInfoBarSettings;
