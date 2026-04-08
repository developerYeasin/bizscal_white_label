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
 * Testimonials Block Settings
 *
 * Manages testimonials list and display options.
 */
const TestimonialsBlockSettings = ({ component, updateNested, isUpdating }) => {
  const { data } = component;

  const handleChange = useCallback((field, value) => {
    updateNested(`data.${field}`, value);
  }, [updateNested]);

  const handleTestimonialChange = useCallback((index, field, value) => {
    const testimonials = [...(data.testimonials || [])];
    testimonials[index] = { ...testimonials[index], [field]: value };
    updateNested("data.testimonials", testimonials);
  }, [data.testimonials, updateNested]);

  const addTestimonial = () => {
    const newTestimonial = {
      id: `testimonial-${Date.now()}`,
      name: "Customer Name",
      role: "Title",
      company: "",
      content: "This is a great product!",
      rating: 5,
      avatar: "",
    };
    updateNested("data.testimonials", [...(data.testimonials || []), newTestimonial]);
  };

  const removeTestimonial = (index) => {
    const testimonials = data.testimonials?.filter((_, i) => i !== index) || [];
    updateNested("data.testimonials", testimonials);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-xs">Testimonials</Label>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {(data.testimonials || []).map((testimonial, index) => (
            <div key={index} className="p-2 border rounded bg-muted/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium">#{index + 1}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => removeTestimonial(index)}
                  disabled={isUpdating || data.testimonials?.length <= 1}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
              <div className="space-y-1">
                <Input
                  value={testimonial.name || ""}
                  onChange={(e) => handleTestimonialChange(index, "name", e.target.value)}
                  className="h-7 text-xs"
                  placeholder="Name"
                  disabled={isUpdating}
                />
                <div className="flex gap-2">
                  <Input
                    value={testimonial.role || ""}
                    onChange={(e) => handleTestimonialChange(index, "role", e.target.value)}
                    className="h-7 text-xs flex-1"
                    placeholder="Role"
                    disabled={isUpdating}
                  />
                  <Input
                    type="number"
                    min="1"
                    max="5"
                    value={testimonial.rating || 5}
                    onChange={(e) => handleTestimonialChange(index, "rating", parseInt(e.target.value))}
                    className="h-7 text-xs w-16"
                    disabled={isUpdating}
                  />
                </div>
                <Input
                  value={testimonial.content || ""}
                  onChange={(e) => handleTestimonialChange(index, "content", e.target.value)}
                  className="h-7 text-xs"
                  placeholder="Testimonial text"
                  disabled={isUpdating}
                />
              </div>
            </div>
          ))}
        </div>
        <Button
          variant="outline"
          size="sm"
          className="w-full mt-2"
          onClick={addTestimonial}
          disabled={isUpdating}
        >
          <Plus className="h-3 w-3 mr-1" /> Add Testimonial
        </Button>
      </div>

      <Separator />

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label className="text-xs">Layout</Label>
          <Select
            value={data.layout || "grid"}
            onValueChange={(val) => handleChange("layout", val)}
            disabled={isUpdating}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="grid">Grid</SelectItem>
              <SelectItem value="featured">Featured</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-xs">Columns</Label>
          <Select
            value={String(data.columns || 2)}
            onValueChange={(val) => handleChange("columns", parseInt(val))}
            disabled={isUpdating}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1</SelectItem>
              <SelectItem value="2">2</SelectItem>
              <SelectItem value="3">3</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="showAvatar"
            checked={data.showAvatar !== false}
            onChange={(e) => handleChange("showAvatar", e.target.checked)}
            disabled={isUpdating}
            className="h-4 w-4"
          />
          <Label htmlFor="showAvatar" className="text-xs">Avatar</Label>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="showRating"
            checked={data.showRating !== false}
            onChange={(e) => handleChange("showRating", e.target.checked)}
            disabled={isUpdating}
            className="h-4 w-4"
          />
          <Label htmlFor="showRating" className="text-xs">Rating</Label>
        </div>
      </div>
    </div>
  );
};

export default TestimonialsBlockSettings;
