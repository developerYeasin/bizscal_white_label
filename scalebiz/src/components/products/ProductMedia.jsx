"use client";

import React from "react";
import { CardContent } from "@/components/ui/card.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Image, Video } from "lucide-react";
import { Input } from "@/components/ui/input.jsx";
import { uploadSingleImage } from "@/utils/upload.js";
import CollapsibleCard from "@/components/ui/CollapsibleCard.jsx"; // Import CollapsibleCard

const ProductMedia = ({ imageUrl, setImageUrl, hoverImageUrl, setHoverImageUrl, videoUrl, setVideoUrl }) => {
  const mainImageInputRef = React.useRef(null);
  const hoverImageInputRef = React.useRef(null);

  const handleFileSelect = async (event, imageType) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const { imageUrl: uploadedUrl } = await uploadSingleImage(file);
      if (imageType === 'main') {
        setImageUrl(uploadedUrl);
      } else {
        setHoverImageUrl(uploadedUrl);
      }
    } catch (error) {
      // Error is handled by the toast in the upload utility
    }
  };

  return (
    <CollapsibleCard title="Media">
      <div className="grid gap-4">
        <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center flex flex-col items-center justify-center">
          <input
            type="file"
            ref={mainImageInputRef}
            onChange={(e) => handleFileSelect(e, 'main')}
            accept="image/png, image/jpeg, image/gif"
            style={{ display: 'none' }}
          />
          {imageUrl ? (
            <img src={imageUrl} alt="Product Main Image" className="h-24 w-auto object-contain mb-2" />
          ) : (
            <Image className="h-12 w-12 text-muted-foreground mb-2" />
          )}
          <p className="text-sm text-muted-foreground mb-2">
            Drag and drop main image here, or click add image. Supported formats: JPG, PNG, Max size: 4MB
          </p>
          <Button variant="outline" onClick={() => mainImageInputRef.current.click()}>
            {imageUrl ? "Change Main Image" : "Add Main Image"}
          </Button>
        </div>
        <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center flex flex-col items-center justify-center">
          <input
            type="file"
            ref={hoverImageInputRef}
            onChange={(e) => handleFileSelect(e, 'hover')}
            accept="image/png, image/jpeg, image/gif"
            style={{ display: 'none' }}
          />
          {hoverImageUrl ? (
            <img src={hoverImageUrl} alt="Product Hover Image" className="h-24 w-auto object-contain mb-2" />
          ) : (
            <Image className="h-12 w-12 text-muted-foreground mb-2" />
          )}
          <p className="text-sm text-muted-foreground mb-2">
            Drag and drop hover image here, or click add image. Supported formats: JPG, PNG, Max size: 4MB
          </p>
          <Button variant="outline" onClick={() => hoverImageInputRef.current.click()}>
            {hoverImageUrl ? "Change Hover Image" : "Add Hover Image"}
          </Button>
        </div>
        <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center flex flex-col items-center justify-center">
          <Video className="h-12 w-12 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground mb-2">
            Paste the video link here
          </p>
          <Input
            placeholder="https://www.youtube.com/watch?v=..."
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            className="mt-1"
          />
        </div>
      </div>
    </CollapsibleCard>
  );
};

export default ProductMedia;