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

const NewsletterSubscriptionSettings = ({ component, index, updateNested, isUpdating }) => { // Accept updateNested, isUpdating as props
  const fileInputRef = React.useRef(null);

  const handleUpdateField = (field, value) => {
    console.log(`NewsletterSubscriptionSettings: Updating field: ${field}, value: ${value}`);
    updateNested(`data.${field}`, value); // Path relative to component.data
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
      title={`Newsletter Subscription (ID: ${component.id})`}
    >
      <div className="grid gap-4">
        <div>
          <Label htmlFor={`newsletter-title-${component.id}`}>Title</Label>
          <Input
            id={`newsletter-title-${component.id}`}
            value={component.data.title || ''}
            onChange={(e) => handleUpdateField('title', e.target.value)}
            placeholder="Newsletter Title"
            disabled={isUpdating}
          />
        </div>
        <div>
          <Label htmlFor={`newsletter-subtitle-${component.id}`}>Subtitle</Label>
          <Textarea
            id={`newsletter-subtitle-${component.id}`}
            value={component.data.subtitle || ''}
            onChange={(e) => handleUpdateField('subtitle', e.target.value)}
            placeholder="Newsletter Subtitle"
            disabled={isUpdating}
          />
        </div>
        <div>
          <Label htmlFor={`newsletter-placeholder-${component.id}`}>Email Input Placeholder</Label>
          <Input
            id={`newsletter-placeholder-${component.id}`}
            value={component.data.placeholder || ''}
            onChange={(e) => handleUpdateField('placeholder', e.target.value)}
            placeholder="Your email address"
            disabled={isUpdating}
          />
        </div>
        <div>
          <Label htmlFor={`newsletter-button-text-${component.id}`}>Button Text</Label>
          <Input
            id={`newsletter-button-text-${component.id}`}
            value={component.data.buttonText || ''}
            onChange={(e) => handleUpdateField('buttonText', e.target.value)}
            placeholder="Subscribe"
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
                <img src={component.data.imageUrl} alt="Newsletter Background" className="h-16 w-auto object-contain rounded-md border" />
                <Button variant="destructive" size="icon" onClick={handleRemoveImage} disabled={isUpdating}>
                  <X className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </CollapsibleCard>
  );
};

export default NewsletterSubscriptionSettings;