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

const SaleBannerSettings = ({
  component,
  index,
  updateNested,
  isUpdating,
}) => {
  const { data = {} } = component;
  const banners = data.banners || [];

  const addBanner = () => {
    const newBanners = [...banners, { title: "", subtitle: "", imageUrl: "", linkUrl: "" }];
    updateNested("data.banners", newBanners);
  };

  const removeBanner = (index) => {
    const newBanners = banners.filter((_, i) => i !== index);
    updateNested("data.banners", newBanners);
  };

  const updateBanner = (index, field, value) => {
    const newBanners = [...banners];
    newBanners[index] = { ...newBanners[index], [field]: value };
    updateNested("data.banners", newBanners);
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-sm text-gray-800">Sale Banner Settings</h3>
      
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
        <Label htmlFor="backgroundColor">Background Color</Label>
        <Input
          id="backgroundColor"
          type="color"
          value={data.backgroundColor || "#ef4444"}
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
        <Label>Banners</Label>
        <div className="space-y-3">
          {banners.map((banner, index) => (
            <div key={index} className="border rounded-md p-3 space-y-2 relative">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 h-6 w-6"
                onClick={() => removeBanner(index)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
              
              <div className="space-y-1">
                <Label className="text-xs">Title</Label>
                <Input
                  value={banner.title || ""}
                  onChange={(e) => updateBanner(index, "title", e.target.value)}
                  placeholder="Banner title"
                />
              </div>
              
              <div className="space-y-1">
                <Label className="text-xs">Subtitle</Label>
                <Input
                  value={banner.subtitle || ""}
                  onChange={(e) => updateBanner(index, "subtitle", e.target.value)}
                  placeholder="Banner subtitle"
                />
              </div>
              
              <div className="space-y-1">
                <Label className="text-xs">Image URL</Label>
                <Input
                  value={banner.imageUrl || ""}
                  onChange={(e) => updateBanner(index, "imageUrl", e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              
              <div className="space-y-1">
                <Label className="text-xs">Link URL</Label>
                <Input
                  value={banner.linkUrl || ""}
                  onChange={(e) => updateBanner(index, "linkUrl", e.target.value)}
                  placeholder="https://example.com"
                />
              </div>
            </div>
          ))}
        </div>
        
        <Button type="button" variant="outline" size="sm" onClick={addBanner} className="w-full mt-2">
          <Plus className="h-4 w-4 mr-2" /> Add Banner
        </Button>
      </div>
    </div>
  );
};

export default SaleBannerSettings;
