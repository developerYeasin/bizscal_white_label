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

const HeroBannerSliderSection = ({
  component,
  index,
  updateNested,
  isUpdating,
}) => {
  const { data = {} } = component;
  const slides = data.slides || [];

  const addSlide = () => {
    const newSlides = [...slides, { title: "", subtitle: "", imageUrl: "", linkUrl: "", buttonText: "" }];
    updateNested("data.slides", newSlides);
  };

  const removeSlide = (index) => {
    const newSlides = slides.filter((_, i) => i !== index);
    updateNested("data.slides", newSlides);
  };

  const updateSlide = (index, field, value) => {
    const newSlides = [...slides];
    newSlides[index] = { ...newSlides[index], [field]: value };
    updateNested("data.slides", newSlides);
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-sm text-gray-800">Hero Banner Slider Settings</h3>
      
      <div className="space-y-2">
        <Label htmlFor="autoplay">Autoplay</Label>
        <Select
          value={String(data.autoplay || false)}
          onValueChange={(value) => updateNested("data.autoplay", value === "true")}
        >
          <SelectTrigger className="h-9">
            <SelectValue placeholder="Select option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="true">Yes</SelectItem>
            <SelectItem value="false">No</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="autoplayDelay">Autoplay Delay (ms)</Label>
        <Input
          id="autoplayDelay"
          type="number"
          value={data.autoplayDelay || 5000}
          onChange={(e) => updateNested("data.autoplayDelay", parseInt(e.target.value) || 5000)}
        />
      </div>

      <div className="space-y-2">
        <Label>Slides</Label>
        <div className="space-y-3">
          {slides.map((slide, index) => (
            <div key={index} className="border rounded-md p-3 space-y-2 relative">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 h-6 w-6"
                onClick={() => removeSlide(index)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
              
              <div className="space-y-1">
                <Label className="text-xs">Title</Label>
                <Input
                  value={slide.title || ""}
                  onChange={(e) => updateSlide(index, "title", e.target.value)}
                  placeholder="Slide title"
                />
              </div>
              
              <div className="space-y-1">
                <Label className="text-xs">Subtitle</Label>
                <Input
                  value={slide.subtitle || ""}
                  onChange={(e) => updateSlide(index, "subtitle", e.target.value)}
                  placeholder="Slide subtitle"
                />
              </div>
              
              <div className="space-y-1">
                <Label className="text-xs">Image URL</Label>
                <Input
                  value={slide.imageUrl || ""}
                  onChange={(e) => updateSlide(index, "imageUrl", e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              
              <div className="space-y-1">
                <Label className="text-xs">Link URL</Label>
                <Input
                  value={slide.linkUrl || ""}
                  onChange={(e) => updateSlide(index, "linkUrl", e.target.value)}
                  placeholder="https://example.com"
                />
              </div>
              
              <div className="space-y-1">
                <Label className="text-xs">Button Text</Label>
                <Input
                  value={slide.buttonText || ""}
                  onChange={(e) => updateSlide(index, "buttonText", e.target.value)}
                  placeholder="Shop Now"
                />
              </div>
            </div>
          ))}
        </div>
        
        <Button type="button" variant="outline" size="sm" onClick={addSlide} className="w-full mt-2">
          <Plus className="h-4 w-4 mr-2" /> Add Slide
        </Button>
      </div>
    </div>
  );
};

export default HeroBannerSliderSection;
