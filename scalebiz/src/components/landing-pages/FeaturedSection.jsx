"use client";

import React from "react";
import { CardContent } from "@/components/ui/card.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Image, X } from "lucide-react";
import { uploadMultipleImages } from "@/utils/upload.js";
import { showError } from "@/utils/toast.js";
import { Skeleton } from "@/components/ui/skeleton.jsx";
import CollapsibleCard from "@/components/ui/CollapsibleCard.jsx";

const FeaturedSection = ({ config, updateNested, isUpdating }) => { // Accept config, updateNested, isUpdating as props
  const imagesInputRef = React.useRef(null);
  const maxImages = 2;

  const handleUpdateField = (field, value) => {
    console.log(`FeaturedSection: Updating field: ${field}, value: ${value}`);
    updateNested(field, value);
  };

  const handleUpload = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    if ((config.featured_section_images?.length || 0) + files.length > maxImages) {
      showError(`You can upload a maximum of ${maxImages} images.`);
      return;
    }

    try {
      const { images } = await uploadMultipleImages(files);
      const newImageUrls = images.map(img => img.imageUrl);
      handleUpdateField('featured_section_images', [...(config.featured_section_images || []), ...newImageUrls]);
    } catch (error) {
      // Error is handled by the toast in the upload utility
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    const newImages = (config.featured_section_images || []).filter((_, index) => index !== indexToRemove);
    handleUpdateField('featured_section_images', newImages);
    showError("Image removed from local configuration.");
  };

  if (!config) { // Check for config prop
    return (
      <CollapsibleCard title="Featured section">
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-24 w-full" />
        </div>
      </CollapsibleCard>
    );
  }

  const currentImageCount = config.featured_section_images?.length || 0;

  return (
    <CollapsibleCard title="Featured section">
      <p className="text-sm text-muted-foreground mb-4">
        You can upload up to {maxImages} items for a better visual impact on your website
      </p>
      <input
        type="file"
        ref={imagesInputRef}
        onChange={handleUpload}
        accept="image/png, image/jpeg, image/gif"
        style={{ display: 'none' }}
        multiple
        disabled={isUpdating || currentImageCount >= maxImages}
      />
      <Button className="mb-4" onClick={() => imagesInputRef.current.click()} disabled={isUpdating || currentImageCount >= maxImages}>
        Upload ({currentImageCount}/{maxImages})
      </Button>
      {currentImageCount === 0 ? (
        <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center text-muted-foreground h-24 flex items-center justify-center">
          <Image className="h-8 w-8 text-muted-foreground mr-2" />
          No featured items found. Click "Upload" to add new items.
        </div>
      ) : (
        <div className="flex flex-wrap gap-4">
          {config.featured_section_images.map((src, index) => (
            <div key={index} className="relative w-24 h-24 rounded-md overflow-hidden border">
              <img src={src} alt={`Featured ${index + 1}`} className="w-full h-full object-cover" />
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
      )}
    </CollapsibleCard>
  );
};

export default FeaturedSection;