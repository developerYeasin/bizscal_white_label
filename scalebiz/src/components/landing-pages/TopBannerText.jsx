"use client";

import React from "react";
import { CardContent } from "@/components/ui/card.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Image, X } from "lucide-react";
import { uploadSingleImage } from "@/utils/upload.js";
import { Skeleton } from "@/components/ui/skeleton.jsx";
import { cn } from "@/lib/utils.js";
import CollapsibleCard from "@/components/ui/CollapsibleCard.jsx";
import { showError } from "@/utils/toast.js";

const TopBannerText = ({ config, updateNested, isUpdating }) => { // Accept config, updateNested, isUpdating as props
  const bannerInputRef = React.useRef(null);

  const handleUpdateField = (field, value) => {
    console.log(`TopBannerText: Updating field: ${field}, value: ${value}`);
    updateNested(field, value);
  };

  const handleUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    try {
      const { imageUrl } = await uploadSingleImage(file);
      handleUpdateField('top_banner_image_url', imageUrl);
    } catch (error) {
      // Error is handled by the toast in the upload utility
    }
  };

  const handleRemoveBanner = () => {
    handleUpdateField('top_banner_image_url', '');
    showError("Top banner image removed from local configuration.");
  };

  if (!config) { // Check for config prop
    return (
      <CollapsibleCard title="Top banner">
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-48 w-full" />
        </div>
      </CollapsibleCard>
    );
  }

  return (
    <CollapsibleCard title="Top banner">
      <p className="text-sm text-muted-foreground mb-4">
        Select upto 1 items to get a better visual impact on your website
      </p>
      <input
        type="file"
        ref={bannerInputRef}
        onChange={handleUpload}
        accept="image/png, image/jpeg, image/gif"
        style={{ display: 'none' }}
        disabled={isUpdating || !!config.top_banner_image_url}
      />
      <Button className="mb-4" onClick={() => bannerInputRef.current.click()} disabled={isUpdating || !!config.top_banner_image_url}>
        Upload ({config.top_banner_image_url ? '1' : '0'}/1)
      </Button>
      <div className={cn(
        "relative border-2 border-dashed border-gray-300 rounded-md h-48",
        config.top_banner_image_url
          ? "p-0"
          : "p-6 text-center flex flex-col items-center justify-center"
      )}>
        {config.top_banner_image_url ? (
          <>
            <img
              src={config.top_banner_image_url}
              alt="Top Banner"
              className="block w-full h-full object-cover rounded-md"
              onError={(e) => console.error("Failed to load top banner image:", e.target.src)}
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 h-6 w-6 rounded-full z-10"
              onClick={handleRemoveBanner}
              disabled={isUpdating}
            >
              <X className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <>
            <Image className="h-12 w-12 text-muted-foreground mb-2 relative z-10" />
            <p className="text-sm text-muted-foreground relative z-10">
              You haven't uploaded any banner yet. Your uploaded banner will appear here.
            </p>
          </>
        )}
      </div>
    </CollapsibleCard>
  );
};

export default TopBannerText;