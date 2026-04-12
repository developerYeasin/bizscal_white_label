"use client";

import React from "react";
import { Label } from "@/components/ui/label.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Plus, Trash2 } from "lucide-react";

const CategoryNavigationSettings = ({
  component,
  index,
  updateNested,
  isUpdating,
}) => {
  const { data = {} } = component;
  const categories = data.categories || [];

  const addCategory = () => {
    const newCategories = [...categories, { name: "", linkUrl: "", icon: "" }];
    updateNested("data.categories", newCategories);
  };

  const removeCategory = (index) => {
    const newCategories = categories.filter((_, i) => i !== index);
    updateNested("data.categories", newCategories);
  };

  const updateCategory = (index, field, value) => {
    const newCategories = [...categories];
    newCategories[index] = { ...newCategories[index], [field]: value };
    updateNested("data.categories", newCategories);
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-sm text-gray-800">Category Navigation Settings</h3>
      
      <div className="space-y-2">
        <Label htmlFor="title">Navigation Title</Label>
        <Input
          id="title"
          value={data.title || ""}
          onChange={(e) => updateNested("data.title", e.target.value)}
          placeholder="Enter navigation title..."
        />
      </div>

      <div className="space-y-2">
        <Label>Categories</Label>
        <div className="space-y-3">
          {categories.map((category, index) => (
            <div key={index} className="border rounded-md p-3 space-y-2 relative">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 h-6 w-6"
                onClick={() => removeCategory(index)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
              
              <div className="space-y-1">
                <Label className="text-xs">Category Name</Label>
                <Input
                  value={category.name || ""}
                  onChange={(e) => updateCategory(index, "name", e.target.value)}
                  placeholder="Category name"
                />
              </div>
              
              <div className="space-y-1">
                <Label className="text-xs">Icon (optional)</Label>
                <Input
                  value={category.icon || ""}
                  onChange={(e) => updateCategory(index, "icon", e.target.value)}
                  placeholder="e.g., shopping-bag, t-shirt"
                />
              </div>
              
              <div className="space-y-1">
                <Label className="text-xs">Link URL</Label>
                <Input
                  value={category.linkUrl || ""}
                  onChange={(e) => updateCategory(index, "linkUrl", e.target.value)}
                  placeholder="https://example.com/category"
                />
              </div>
            </div>
          ))}
        </div>
        
        <Button type="button" variant="outline" size="sm" onClick={addCategory} className="w-full mt-2">
          <Plus className="h-4 w-4 mr-2" /> Add Category
        </Button>
      </div>
    </div>
  );
};

export default CategoryNavigationSettings;
