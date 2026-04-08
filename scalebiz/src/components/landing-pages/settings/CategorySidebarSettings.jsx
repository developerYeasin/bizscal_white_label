"use client";

import React from "react";
import CollapsibleCard from "@/components/ui/CollapsibleCard.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Plus, X } from "lucide-react";
import { showError } from "@/utils/toast.js";

const CategorySidebarSettings = ({ component, index, updateNested, isUpdating }) => { // Accept updateNested, isUpdating as props

  const handleUpdateField = (field, value) => {
    console.log(`CategorySidebarSettings: Updating field: ${field}, value: ${value}`);
    updateNested(`data.${field}`, value); // Path relative to component.data
  };

  const handleAddCategory = () => {
    const newCategory = { id: Date.now(), name: "New Category", link: "#" }; // Assign unique ID
    const updatedCategories = [...(component.data.categories || []), newCategory];
    handleUpdateField('categories', updatedCategories);
  };

  const handleRemoveCategory = (catIdToRemove) => {
    const updatedCategories = (component.data.categories || []).filter((category) => category.id !== catIdToRemove);
    handleUpdateField('categories', updatedCategories);
    showError("Category removed from local configuration.");
  };

  const handleUpdateCategoryField = (catId, field, value) => {
    console.log(`CategorySidebarSettings: Updating category ${catId} field: ${field}, value: ${value}`);
    const updatedCategories = [...(component.data.categories || [])].map((category) =>
      category.id === catId ? { ...category, [field]: value } : category
    );
    handleUpdateField('categories', updatedCategories);
  };

  return (
    <CollapsibleCard
      title={`Category Sidebar (ID: ${component.id})`}
    >
      <div className="grid gap-4">
        <div>
          <Label htmlFor={`category-sidebar-title-${component.id}`}>Title</Label>
          <Input
            id={`category-sidebar-title-${component.id}`}
            value={component.data.title || ''}
            onChange={(e) => handleUpdateField('title', e.target.value)}
            placeholder="Sidebar Title"
            disabled={isUpdating}
          />
        </div>

        <h3 className="text-lg font-semibold mt-4">Categories</h3>
        <div className="space-y-4">
          {(component.data.categories || []).map((category) => (
            <div key={category.id} className="border p-3 rounded-md relative"> {/* Use unique ID for key */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 text-destructive hover:text-destructive"
                onClick={() => handleRemoveCategory(category.id)}
                disabled={isUpdating}
              >
                <X className="h-4 w-4" />
              </Button>
              <div>
                <Label htmlFor={`category-name-${component.id}-${category.id}`}>Name</Label>
                <Input
                  id={`category-name-${component.id}-${category.id}`}
                  value={category.name || ''}
                  onChange={(e) => handleUpdateCategoryField(category.id, 'name', e.target.value)}
                  placeholder="Category Name"
                  disabled={isUpdating}
                />
              </div>
              <div>
                <Label htmlFor={`category-link-${component.id}-${category.id}`}>Link</Label>
                <Input
                  id={`category-link-${component.id}-${category.id}`}
                  value={category.link || ''}
                  onChange={(e) => handleUpdateCategoryField(category.id, 'link', e.target.value)}
                  placeholder="/collections/category"
                  disabled={isUpdating}
                />
              </div>
            </div>
          ))}
        </div>
        <Button variant="outline" onClick={handleAddCategory} disabled={isUpdating}>
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </div>
    </CollapsibleCard>
  );
};

export default CategorySidebarSettings;