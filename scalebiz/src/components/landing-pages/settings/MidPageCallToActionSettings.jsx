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

const MidPageCallToActionSettings = ({ component, index, updateNested, isUpdating }) => { // Accept updateNested, isUpdating as props
  const fileInputRef = React.useRef(null);

  const handleUpdateField = (field, value, subfield = null) => {
    console.log(`MidPageCallToActionSettings: Updating field: ${field}, value: ${value}, subfield: ${subfield}`);
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
      title={`Mid-Page Call to Action (ID: ${component.id})`}
    >
      <div className="grid gap-4">
        <div>
          <Label htmlFor={`midpage-cta-pretitle-${component.id}`}>Pretitle</Label>
          <Input
            id={`midpage-cta-pretitle-${component.id}`}
            value={component.data.pretitle || ''}
            onChange={(e) => handleUpdateField('pretitle', e.target.value)}
            placeholder="e.g., Limited Offer"
            disabled={isUpdating}
          />
        </div>
        <div>
          <Label htmlFor={`midpage-cta-title-${component.id}`}>Title</Label>
          <Input
            id={`midpage-cta-title-${component.id}`}
            value={component.data.title || ''}
            onChange={(e) => handleUpdateField('title', e.target.value)}
            placeholder="Call to Action Title"
            disabled={isUpdating}
          />
        </div>
        <div>
          <Label htmlFor={`midpage-cta-subtitle-${component.id}`}>Subtitle</Label>
          <Textarea
            id={`midpage-cta-subtitle-${component.id}`}
            value={component.data.subtitle || ''}
            onChange={(e) => handleUpdateField('subtitle', e.target.value)}
            placeholder="Call to Action Subtitle"
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
                <img src={component.data.imageUrl} alt="Mid-Page CTA" className="h-16 w-auto object-contain rounded-md border" />
                <Button variant="destructive" size="icon" onClick={handleRemoveImage} disabled={isUpdating}>
                  <X className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>
        <div>
          <Label htmlFor={`midpage-cta-button-text-${component.id}`}>CTA Button Text</Label>
          <Input
            id={`midpage-cta-button-text-${component.id}`}
            value={component.data.ctaButton?.text || ''}
            onChange={(e) => handleUpdateField('ctaButton.text', e.target.value)}
            placeholder="e.g., Shop Now"
            disabled={isUpdating}
          />
        </div>
        <div>
          <Label htmlFor={`midpage-cta-button-link-${component.id}`}>CTA Button Link</Label>
          <Input
            id={`midpage-cta-button-link-${component.id}`}
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

export default MidPageCallToActionSettings;