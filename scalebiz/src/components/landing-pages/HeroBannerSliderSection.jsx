"use client";

import React from "react";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Image as ImageIcon, Plus, X } from "lucide-react";
import { uploadSingleImage } from "@/utils/upload.js";
import { showError } from "@/utils/toast.js";
import { Skeleton } from "@/components/ui/skeleton.jsx";
import CollapsibleCard from "@/components/ui/CollapsibleCard.jsx";

const HeroBannerSliderSection = ({ component, index, updateNested, isUpdating }) => { // Accept updateNested, isUpdating as props
  const fileInputRefs = React.useRef({}); // Changed to an object for dynamic refs

  if (!component) { // Check for component prop
    return (
      <CollapsibleCard title="Hero Banner Slider">
        <Skeleton className="h-4 w-full mb-4" />
        <Skeleton className="h-10 w-32 mb-4" />
        <Skeleton className="h-48 w-full" />
      </CollapsibleCard>
    );
  }

  const banners = component.data?.banners || [];

  const handleAddBanner = () => {
    const newBannerData = {
      id: Date.now(), // Assign a unique ID
      title: "New Banner Title",
      imageUrl: "",
      subtitle: "New Banner Subtitle",
      ctaButton: { link: "#", text: "Shop Now" },
    };
    const updatedBanners = [...banners, newBannerData];
    updateNested(`data.banners`, updatedBanners); // Path relative to component.data
  };

  const handleRemoveBanner = (bannerIdToRemove) => {
    const newBanners = banners.filter((banner) => banner.id !== bannerIdToRemove);
    updateNested(`data.banners`, newBanners); // Path relative to component.data
    showError("Banner removed from local configuration.");
  };

  const handleUpdateBannerField = (bannerId, field, value, subfield = null) => {
    const newBanners = banners.map((banner) =>
      banner.id === bannerId
        ? {
            ...banner,
            [field]: subfield ? { ...banner[field], [subfield]: value } : value,
          }
        : banner
    );
    updateNested(`data.banners`, newBanners); // Path relative to component.data
  };

  const handleImageUpload = async (event, bannerId) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const { imageUrl } = await uploadSingleImage(file);
      handleUpdateBannerField(bannerId, 'imageUrl', imageUrl);
    } catch (error) {
      // Error is handled by the toast in the upload utility
    }
  };

  return (
    <CollapsibleCard
      title={`Hero Banner Slider (ID: ${component.id})`}
      className="border-purple-300"
    >
      <p className="text-sm text-muted-foreground mb-4">
        Manage the main rotating banners for your landing page. You can add multiple banners.
      </p>

      <div className="space-y-6 mb-6">
        {banners.length === 0 ? (
          <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center text-muted-foreground h-32 flex flex-col items-center justify-center">
            <ImageIcon className="h-8 w-8 mb-2" />
            No banners added yet. Click "Add New Banner" to get started.
          </div>
        ) : (
          banners.map((banner) => (
            <CollapsibleCard
              key={banner.id} // Use unique ID for key
              title={`Banner: ${banner.title || 'Untitled'}`}
              className="border-gray-200"
            >
              <div className="grid gap-4">
                <div>
                  <Label htmlFor={`banner-title-${component.id}-${banner.id}`}>Title</Label>
                  <Input
                    id={`banner-title-${component.id}-${banner.id}`}
                    value={banner.title}
                    onChange={(e) => handleUpdateBannerField(banner.id, 'title', e.target.value)}
                    placeholder="Banner Title"
                    disabled={isUpdating}
                  />
                </div>
                <div>
                  <Label htmlFor={`banner-subtitle-${component.id}-${banner.id}`}>Subtitle</Label>
                  <Input
                    id={`banner-subtitle-${component.id}-${banner.id}`}
                    value={banner.subtitle}
                    onChange={(e) => handleUpdateBannerField(banner.id, 'subtitle', e.target.value)}
                    placeholder="Banner Subtitle"
                    disabled={isUpdating}
                  />
                </div>
                <div>
                  <Label>Image</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="file"
                      ref={el => fileInputRefs.current[`${component.id}-${banner.id}`] = el}
                      onChange={(e) => handleImageUpload(e, banner.id)}
                      accept="image/png, image/jpeg, image/gif"
                      style={{ display: 'none' }}
                      disabled={isUpdating}
                    />
                    <Button
                      variant="outline"
                      onClick={() => fileInputRefs.current[`${component.id}-${banner.id}`]?.click()}
                      disabled={isUpdating}
                    >
                      <ImageIcon className="h-4 w-4 mr-2" />
                      {banner.imageUrl ? "Change Image" : "Upload Image"}
                    </Button>
                    {banner.imageUrl && (
                      <img src={banner.imageUrl} alt={`Banner ${banner.id}`} className="h-16 w-auto object-contain rounded-md border" />
                    )}
                  </div>
                </div>
                <div>
                  <Label htmlFor={`banner-cta-text-${component.id}-${banner.id}`}>CTA Button Text</Label>
                  <Input
                    id={`banner-cta-text-${component.id}-${banner.id}`}
                    value={banner.ctaButton?.text || ''}
                    onChange={(e) => handleUpdateBannerField(banner.id, 'ctaButton', e.target.value, 'text')}
                    placeholder="e.g., Shop Now"
                    disabled={isUpdating}
                  />
                </div>
                <div>
                  <Label htmlFor={`banner-cta-link-${component.id}-${banner.id}`}>CTA Button Link</Label>
                  <Input
                    id={`banner-cta-link-${component.id}-${banner.id}`}
                    value={banner.ctaButton?.link || ''}
                    onChange={(e) => handleUpdateBannerField(banner.id, 'ctaButton', e.target.value, 'link')}
                    placeholder="/products"
                    disabled={isUpdating}
                  />
                </div>
                <Button
                  variant="destructive"
                  className="mt-2 w-[175px]"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveBanner(banner.id);
                  }}
                  disabled={isUpdating}
                >
                  <X className="h-4 w-4 mr-2" />
                  Remove Banner
                </Button>
              </div>
            </CollapsibleCard>
          ))
        )}
      </div>

      <Button variant="outline" onClick={handleAddBanner} disabled={isUpdating}>
        <Plus className="h-4 w-4 mr-2" />
        Add New Banner
      </Button>
    </CollapsibleCard>
  );
};

export default HeroBannerSliderSection;