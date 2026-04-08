"use client";

import React from "react";
import CollapsibleCard from "@/components/ui/CollapsibleCard.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Image as ImageIcon, Plus, X } from "lucide-react";
import { uploadSingleImage } from "@/utils/upload.js";
import { showError } from "@/utils/toast.js";

const FeaturedCategoriesSettings = ({ component, index, updateNested, isUpdating }) => { // Accept updateNested, isUpdating as props
  const fileInputRefs = React.useRef({});

  const handleUpdateField = (field, value) => {
    console.log(`FeaturedCategoriesSettings: Updating field: ${field}, value: ${value}`);
    updateNested(`data.${field}`, value); // Path relative to component.data
  };

  const handleAddCategory = () => {
    const newCategory = { id: Date.now(), name: "New Category", link: "#", imageUrl: "" }; // Assign unique ID
    const updatedCategories = [...(component.data.categories || []), newCategory];
    handleUpdateField('categories', updatedCategories);
  };

  const handleRemoveCategory = (catIdToRemove) => {
    const updatedCategories = (component.data.categories || []).filter((category) => category.id !== catIdToRemove);
    handleUpdateField('categories', updatedCategories);
    showError("Category removed from local configuration.");
  };

  const handleUpdateCategoryField = (catId, field, value) => {
    console.log(`FeaturedCategoriesSettings: Updating category ${catId} field: ${field}, value: ${value}`);
    const updatedCategories = [...(component.data.categories || [])].map((category) =>
      category.id === catId ? { ...category, [field]: value } : category
    );
    handleUpdateField('categories', updatedCategories);
  };

  const handleImageUpload = async (event, catId) => {
    const file = event.target.files[0];
    if (!file) return;
    try {
      const { imageUrl } = await uploadSingleImage(file);
      handleUpdateCategoryField(catId, 'imageUrl', imageUrl);
    } catch (error) {
      // Error handled by toast utility
    }
  };

  return (
    <CollapsibleCard
      title={`Featured Categories (ID: ${component.id})`}
    >
      <div className="grid gap-4">
        <div>
          <Label htmlFor={`featured-categories-title-${component.id}`}>Title</Label>
          <Input
            id={`featured-categories-title-${component.id}`}
            value={component.data.title || ''}
            onChange={(e) => handleUpdateField('title', e.target.value)}
            placeholder="Section Title"
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <div className="md:col-span-2">
                  <Label>Image</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="file"
                      ref={el => fileInputRefs.current[`${component.id}-${category.id}`] = el}
                      onChange={(e) => handleImageUpload(e, category.id)}
                      accept="image/png, image/jpeg, image/gif"
                      style={{ display: 'none' }}
                      disabled={isUpdating}
                    />
                    <Button
                      variant="outline"
                      onClick={() => fileInputRefs.current[`${component.id}-${category.id}`]?.click()}
                      disabled={isUpdating}
                    >
                      <ImageIcon className="h-4 w-4 mr-2" />
                      {category.imageUrl ? "Change Image" : "Upload Image"}
                    </Button>
                    {category.imageUrl && (
                      <img src={category.imageUrl} alt={category.name} className="h-16 w-auto object-contain rounded-md border" />
                    )}
                  </div>
                </div>
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

export default FeaturedCategoriesSettings;