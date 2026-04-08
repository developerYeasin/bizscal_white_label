"use client";

import React from "react";
import CollapsibleCard from "@/components/ui/CollapsibleCard.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Textarea } from "@/components/ui/textarea.jsx";
import { Image as ImageIcon, X } from "lucide-react";
import { uploadSingleImage } from "@/utils/upload.js";
import { showError } from "@/utils/toast.js";

const MarketingBannerSettings = ({ component, index, updateNested, isUpdating }) => { // Accept updateNested, isUpdating as props
  const fileInputRef = React.useRef(null);

  const handleUpdateField = (field, value, subfield = null) => {
    console.log(`MarketingBannerSettings: Updating field: ${field}, value: ${value}, subfield: ${subfield}`);
    if (subfield) {
      updateNested(`data.${field}.${subfield}`, value); // Path relative to component.data
    } else {
      updateNested(`data.${field}`, value); // Path relative to component.data
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    try {
      const { imageUrl } = await uploadSingleImage(file);
      handleUpdateField('imageUrl', imageUrl);
    } catch (error) {
      // Error handled by toast utility
    }
  };

  const handleRemoveImage = () => {
    handleUpdateField('imageUrl', '');
    showError("Image removed from local configuration.");
  };

  return (
    <CollapsibleCard
      title={`Marketing Banner (ID: ${component.id})`}
    >
      <div className="grid gap-4">
        <div>
          <Label htmlFor={`marketing-banner-title-${component.id}`}>Title</Label>
          <Input
            id={`marketing-banner-title-${component.id}`}
            value={component.data.title || ''}
            onChange={(e) => handleUpdateField('title', e.target.value)}
            placeholder="Banner Title"
            disabled={isUpdating}
          />
        </div>
        <div>
          <Label htmlFor={`marketing-banner-subtitle-${component.id}`}>Subtitle</Label>
          <Textarea
            id={`marketing-banner-subtitle-${component.id}`}
            value={component.data.subtitle || ''}
            onChange={(e) => handleUpdateField('subtitle', e.target.value)}
            placeholder="Banner Subtitle"
            disabled={isUpdating}
          />
        </div>
        <div>
          <Label>Background Image</Label>
          <div className="flex items-center gap-2 mt-1">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/png, image/jpeg, image/gif"
              style={{ display: 'none' }}
              disabled={isUpdating}
            />
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUpdating}
            >
              <ImageIcon className="h-4 w-4 mr-2" />
              {component.data.imageUrl ? "Change Image" : "Upload Image"}
            </Button>
            {component.data.imageUrl && (
              <>
                <img src={component.data.imageUrl} alt="Marketing Banner" className="h-16 w-auto object-contain rounded-md border" />
                <Button variant="destructive" size="icon" onClick={handleRemoveImage} disabled={isUpdating}>
                  <X className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>
        <div>
          <Label htmlFor={`marketing-banner-cta-text-${component.id}`}>CTA Button Text</Label>
          <Input
            id={`marketing-banner-cta-text-${component.id}`}
            value={component.data.ctaButton?.text || ''}
            onChange={(e) => handleUpdateField('ctaButton.text', e.target.value)}
            placeholder="e.g., Shop Now"
            disabled={isUpdating}
          />
        </div>
        <div>
          <Label htmlFor={`marketing-banner-cta-link-${component.id}`}>CTA Button Link</Label>
          <Input
            id={`marketing-banner-cta-link-${component.id}`}
            value={component.data.ctaButton?.link || ''}
            onChange={(e) => handleUpdateField('ctaButton.link', e.target.value)}
            placeholder="/products"
            disabled={isUpdating}
          />
        </div>
      </div>
    </CollapsibleCard>
  );
};

export default MarketingBannerSettings;