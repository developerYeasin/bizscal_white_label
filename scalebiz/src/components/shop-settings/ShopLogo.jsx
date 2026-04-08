"use client";

import React from "react";
import { CardContent } from "@/components/ui/card.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Upload } from "lucide-react";
import { uploadSingleImage } from "@/utils/upload.js";
import { useStoreConfig } from "@/contexts/StoreConfigurationContext.jsx";
import { Skeleton } from "@/components/ui/skeleton.jsx";
import CollapsibleCard from "@/components/ui/CollapsibleCard.jsx"; // Import CollapsibleCard

const ShopLogo = () => {
  const { config, isLoading, updateNested, save } = useStoreConfig();
  const logoInputRef = React.useRef(null);

  const handleUploadLogo = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    try {
      const { imageUrl } = await uploadSingleImage(file);
      updateNested('logo_url', imageUrl);
      // Automatically save after successful upload
      save();
    } catch (error) {
      // Error is handled by the toast in the upload utility
    }
  };

  if (isLoading || !config) {
    return (
      <CollapsibleCard title="Shop Logo">
        <Skeleton className="h-24 w-full" />
      </CollapsibleCard>
    );
  }

  return (
    <CollapsibleCard title="Shop Logo">
      <CardContent className="text-center">
        <div className="flex flex-col items-center justify-center p-4 border rounded-md mb-4 min-h-[120px]">
          {config.logo_url ? (
            <img src={config.logo_url} alt="Shop Logo" className="h-16 object-contain mb-2" />
          ) : (
            <p className="text-muted-foreground">No logo uploaded.</p>
          )}
          <p className="text-sm text-muted-foreground">Recommended size is 200×50 pixels. Max size: 4MB.</p>
        </div>
        <input
          type="file"
          ref={logoInputRef}
          onChange={handleUploadLogo}
          accept="image/png, image/jpeg, image/gif"
          style={{ display: 'none' }}
        />
        <Button variant="outline" className="w-full" onClick={() => logoInputRef.current.click()}>
          <Upload className="h-4 w-4 mr-2" />
          Upload Shop Logo
        </Button>
      </CardContent>
    </CollapsibleCard>
  );
};

export default ShopLogo;