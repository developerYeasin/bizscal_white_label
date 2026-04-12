"use client";

import React from "react";
import { Label } from "@/components/ui/label.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Plus, Trash2 } from "lucide-react";

const FeaturesTrustBadgesSettings = ({
  component,
  index,
  updateNested,
  isUpdating,
}) => {
  const { data = {} } = component;
  const badges = data.badges || [];

  const addBadge = () => {
    const newBadges = [...badges, { icon: "", title: "", subtitle: "" }];
    updateNested("data.badges", newBadges);
  };

  const removeBadge = (index) => {
    const newBadges = badges.filter((_, i) => i !== index);
    updateNested("data.badges", newBadges);
  };

  const updateBadge = (index, field, value) => {
    const newBadges = [...badges];
    newBadges[index] = { ...newBadges[index], [field]: value };
    updateNested("data.badges", newBadges);
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-sm text-gray-800">Features & Trust Badges Settings</h3>
      
      <div className="space-y-2">
        <Label htmlFor="title">Section Title</Label>
        <Input
          id="title"
          value={data.title || ""}
          onChange={(e) => updateNested("data.title", e.target.value)}
          placeholder="Enter section title..."
        />
      </div>

      <div className="space-y-2">
        <Label>Badges</Label>
        <div className="space-y-3">
          {badges.map((badge, index) => (
            <div key={index} className="border rounded-md p-3 space-y-2 relative">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 h-6 w-6"
                onClick={() => removeBadge(index)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
              
              <div className="space-y-1">
                <Label className="text-xs">Icon</Label>
                <Input
                  value={badge.icon || ""}
                  onChange={(e) => updateBadge(index, "icon", e.target.value)}
                  placeholder="e.g., truck, gift, star"
                />
              </div>
              
              <div className="space-y-1">
                <Label className="text-xs">Title</Label>
                <Input
                  value={badge.title || ""}
                  onChange={(e) => updateBadge(index, "title", e.target.value)}
                  placeholder="Badge title"
                />
              </div>
              
              <div className="space-y-1">
                <Label className="text-xs">Subtitle</Label>
                <Input
                  value={badge.subtitle || ""}
                  onChange={(e) => updateBadge(index, "subtitle", e.target.value)}
                  placeholder="Badge subtitle"
                />
              </div>
            </div>
          ))}
        </div>
        
        <Button type="button" variant="outline" size="sm" onClick={addBadge} className="w-full mt-2">
          <Plus className="h-4 w-4 mr-2" /> Add Badge
        </Button>
      </div>
    </div>
  );
};

export default FeaturesTrustBadgesSettings;
