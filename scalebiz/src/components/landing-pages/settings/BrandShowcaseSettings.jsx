"use client";

import React from "react";
import CollapsibleCard from "@/components/ui/CollapsibleCard.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Image as ImageIcon, Plus, X } from "lucide-react";
import { uploadSingleImage } from "@/utils/upload.js";
import { showError } from "@/utils/toast.js";

const BrandShowcaseSettings = ({ component, index, updateNested, isUpdating }) => { // Accept updateNested, isUpdating as props
  const fileInputRefs = React.useRef({});

  const handleUpdateField = (field, value) => {
    console.log(`BrandShowcaseSettings: Updating field: ${field}, value: ${value}`);
    updateNested(`data.${field}`, value); // Path relative to component.data
  };

  const handleAddBrand = () => {
    const newBrand = { id: Date.now(), name: "New Brand", link: "#", imageUrl: "" }; // Assign unique ID
    const updatedBrands = [...(component.data.brands || []), newBrand];
    handleUpdateField('brands', updatedBrands);
  };

  const handleRemoveBrand = (brandIdToRemove) => {
    const updatedBrands = (component.data.brands || []).filter((brand) => brand.id !== brandIdToRemove);
    handleUpdateField('brands', updatedBrands);
    showError("Brand removed from local configuration.");
  };

  const handleUpdateBrandField = (brandId, field, value) => {
    console.log(`BrandShowcaseSettings: Updating brand ${brandId} field: ${field}, value: ${value}`);
    const updatedBrands = [...(component.data.brands || [])].map((brand) =>
      brand.id === brandId ? { ...brand, [field]: value } : brand
    );
    handleUpdateField('brands', updatedBrands);
  };

  const handleImageUpload = async (event, brandId) => {
    const file = event.target.files[0];
    if (!file) return;
    try {
      const { imageUrl } = await uploadSingleImage(file);
      handleUpdateBrandField(brandId, 'imageUrl', imageUrl);
    } catch (error) {
      // Error handled by toast utility
    }
  };

  return (
    <CollapsibleCard
      title={`Brand Showcase (ID: ${component.id})`}
    >
      <div className="grid gap-4">
        <div>
          <Label htmlFor={`brand-showcase-title-${component.id}`}>Section Title</Label>
          <Input
            id={`brand-showcase-title-${component.id}`}
            value={component.data.title || ''}
            onChange={(e) => handleUpdateField('title', e.target.value)}
            placeholder="e.g., Our Brands"
            disabled={isUpdating}
          />
        </div>

        <h3 className="text-lg font-semibold mt-4">Brands</h3>
        <div className="space-y-4">
          {(component.data.brands || []).map((brand) => (
            <div key={brand.id} className="border p-3 rounded-md relative"> {/* Use unique ID for key */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 text-destructive hover:text-destructive"
                onClick={() => handleRemoveBrand(brand.id)}
                disabled={isUpdating}
              >
                <X className="h-4 w-4" />
              </Button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`brand-name-${component.id}-${brand.id}`}>Name</Label>
                  <Input
                    id={`brand-name-${component.id}-${brand.id}`}
                    value={brand.name || ''}
                    onChange={(e) => handleUpdateBrandField(brand.id, 'name', e.target.value)}
                    placeholder="Brand Name"
                    disabled={isUpdating}
                  />
                </div>
                <div>
                  <Label htmlFor={`brand-link-${component.id}-${brand.id}`}>Link</Label>
                  <Input
                    id={`brand-link-${component.id}-${brand.id}`}
                    value={brand.link || ''}
                    onChange={(e) => handleUpdateBrandField(brand.id, 'link', e.target.value)}
                    placeholder="/brands/brand-name"
                    disabled={isUpdating}
                  />
                </div>
                <div className="md:col-span-2">
                  <Label>Logo Image</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="file"
                      ref={el => fileInputRefs.current[`${component.id}-${brand.id}`] = el}
                      onChange={(e) => handleImageUpload(e, brand.id)}
                      accept="image/png, image/jpeg, image/gif"
                      style={{ display: 'none' }}
                      disabled={isUpdating}
                    />
                    <Button
                      variant="outline"
                      onClick={() => fileInputRefs.current[`${component.id}-${brand.id}`]?.click()}
                      disabled={isUpdating}
                    >
                      <ImageIcon className="h-4 w-4 mr-2" />
                      {brand.imageUrl ? "Change Logo" : "Upload Logo"}
                    </Button>
                    {brand.imageUrl && (
                      <img src={brand.imageUrl} alt={brand.name} className="h-16 w-auto object-contain rounded-md border" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <Button variant="outline" onClick={handleAddBrand} disabled={isUpdating}>
          <Plus className="h-4 w-4 mr-2" />
          Add Brand
        </Button>
      </div>
    </CollapsibleCard>
  );
};

export default BrandShowcaseSettings;