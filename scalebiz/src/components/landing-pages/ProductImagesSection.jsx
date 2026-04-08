"use client";

import React from "react";
import { CardContent } from "@/components/ui/card.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import { X } from "lucide-react";
import { showSuccess, showError } from "@/utils/toast.js";
import { uploadMultipleImages } from "@/utils/upload.js";
import { Skeleton } from "@/components/ui/skeleton.jsx";
import CollapsibleCard from "@/components/ui/CollapsibleCard.jsx";

const ProductImagesSection = ({ config, updateNested, isUpdating }) => { // Accept config, updateNested, isUpdating as props
  const maxLength = 100;
  const imagesInputRef = React.useRef(null);
  const maxImages = 6;

  const handleUpdateField = (field, value) => {
    console.log(`ProductImagesSection: Updating field: ${field}, value: ${value}`);
    updateNested(field, value);
  };

  const handleUploadImages = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    if ((config.product_images_section_images?.length || 0) + files.length > maxImages) {
      showError(`You can upload a maximum of ${maxImages} images in total.`);
      return;
    }

    try {
      const { images } = await uploadMultipleImages(files);
      const newImageUrls = images.map(img => img.imageUrl);
      handleUpdateField('product_images_section_images', [...(config.product_images_section_images || []), ...newImageUrls]);
    } catch (error) {
      // Error is handled by the toast in the upload utility
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    const newImages = (config.product_images_section_images || []).filter((_, index) => index !== indexToRemove);
    handleUpdateField('product_images_section_images', newImages);
    showError("Image removed from local configuration.");
  };

  if (!config) { // Check for config prop
    return (
      <CollapsibleCard title="Product images">
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-full" />
          <div className="flex flex-wrap gap-4">
            <Skeleton className="h-24 w-24" />
            <Skeleton className="h-24 w-24" />
          </div>
        </div>
      </CollapsibleCard>
    );
  }

  const currentImageCount = config.product_images_section_images?.length || 0;

  return (
    <CollapsibleCard title="Product images">
      <p className="text-sm text-muted-foreground mb-4">
        Upload upto {maxImages} items to get a better visual impact on your website
      </p>
      <input
        type="file"
        ref={imagesInputRef}
        onChange={handleUploadImages}
        accept="image/png, image/jpeg, image/gif"
        style={{ display: 'none' }}
        multiple
        disabled={isUpdating || currentImageCount >= maxImages}
      />
      <Button className="mb-4" onClick={() => imagesInputRef.current.click()} disabled={isUpdating || currentImageCount >= maxImages}>
        Upload ({currentImageCount}/{maxImages})
      </Button>
      <div className="mb-4">
        <Label htmlFor="sectionTitle">Section title</Label>
        <Input
          id="sectionTitle"
          placeholder="Input your section title"
          className="mt-1"
          value={config.product_images_section_title || ''}
          onChange={(e) => handleUpdateField('product_images_section_title', e.target.value)}
          maxLength={maxLength}
          disabled={isUpdating}
        />
        <p className="text-xs text-muted-foreground text-right mt-1">
          Character limit: {maxLength - (config.product_images_section_title || '').length}/{maxLength}
        </p>
      </div>
      <div className="flex flex-wrap gap-4">
        {(config.product_images_section_images || []).map((src, index) => (
          <div key={index} className="relative w-24 h-24 rounded-md overflow-hidden border">
            <img src={src} alt={`Product ${index + 1}`} className="w-full h-full object-cover" />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-1 right-1 h-6 w-6 rounded-full"
              onClick={() => handleRemoveImage(index)}
              disabled={isUpdating}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </CollapsibleCard>
  );
};

export default ProductImagesSection;