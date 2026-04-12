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

const HeroBannerWithProductSettings = ({
  component,
  index,
  updateNested,
  isUpdating,
}) => {
  const { data = {} } = component;

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-sm text-gray-800">Hero Banner with Product Settings</h3>
      
      <div className="space-y-2">
        <Label htmlFor="title">Banner Title</Label>
        <Input
          id="title"
          value={data.title || ""}
          onChange={(e) => updateNested("data.title", e.target.value)}
          placeholder="Enter banner title..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="subtitle">Subtitle</Label>
        <Input
          id="subtitle"
          value={data.subtitle || ""}
          onChange={(e) => updateNested("data.subtitle", e.target.value)}
          placeholder="Enter subtitle..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="imageUrl">Image URL</Label>
        <Input
          id="imageUrl"
          value={data.imageUrl || ""}
          onChange={(e) => updateNested("data.imageUrl", e.target.value)}
          placeholder="https://example.com/image.jpg"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          value={data.phone || ""}
          onChange={(e) => updateNested("data.phone", e.target.value)}
          placeholder="09642922922"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="backgroundColor">Background Color</Label>
        <Input
          id="backgroundColor"
          type="color"
          value={data.backgroundColor || "#FF9F1C"}
          onChange={(e) => updateNested("data.backgroundColor", e.target.value)}
          className="h-10"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="textColor">Text Color</Label>
        <Input
          id="textColor"
          type="color"
          value={data.textColor || "#FFFFFF"}
          onChange={(e) => updateNested("data.textColor", e.target.value)}
          className="h-10"
        />
      </div>
    </div>
  );
};

export default HeroBannerWithProductSettings;
