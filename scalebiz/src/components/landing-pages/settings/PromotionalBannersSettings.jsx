"use client";

import React from "react";
import CollapsibleCard from "@/components/ui/CollapsibleCard.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Textarea } from "@/components/ui/textarea.jsx";
// Removed Select, SelectContent, SelectItem, SelectTrigger, SelectValue from shadcn/ui
import Select from 'react-select'; // Imported react-select
import { Image as ImageIcon, Plus, X } from "lucide-react";
import { uploadSingleImage } from "@/utils/upload.js";
import { showError } from "@/utils/toast.js";

const PromotionalBannersSettings = ({ component, index, updateNested, isUpdating }) => { // Accept updateNested, isUpdating as props
  const fileInputRefs = React.useRef({});

  // Options for the sm_span dropdown
  const spanOptions = Array.from({ length: 12 }, (_, i) => ({
    value: String(i + 1),
    label: String(i + 1),
  }));

  // Custom styles for react-select to match shadcn/ui theme
  const customSelectStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: 'hsl(var(--background))',
      borderColor: state.isFocused ? 'hsl(var(--ring))' : 'hsl(var(--border))',
      boxShadow: state.isFocused ? '0 0 0 1px hsl(var(--ring))' : 'none',
      '&:hover': {
        borderColor: 'hsl(var(--ring))',
      },
      minHeight: '40px',
      borderRadius: 'var(--radius)',
      color: 'hsl(var(--foreground))',
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? 'hsl(var(--primary))'
        : state.isFocused
        ? 'hsl(var(--accent))'
        : 'hsl(var(--background))',
      color: state.isSelected
        ? 'hsl(var(--primary-foreground))'
        : 'hsl(var(--foreground))',
      '&:active': {
        backgroundColor: 'hsl(var(--primary))',
      },
    }),
    singleValue: (provided) => ({
      ...provided,
      color: 'hsl(var(--foreground))',
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: 'hsl(var(--popover))',
      borderColor: 'hsl(var(--border))',
      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)', // Mimic shadcn shadow
      borderRadius: 'var(--radius)',
      zIndex: 99999, // Ensure it's above other elements
    }),
    menuPortal: (base) => ({ ...base, zIndex: 99999 }), // Ensure the portal itself has a high z-index
  };

  // Updated handleUpdateField to directly construct the path for nested properties
  const handleUpdateField = (propertyPath, value) => {
    updateNested(`data.${propertyPath}`, value); // Path relative to component.data
  };

  const handleAddBanner = () => {
    const newBanner = {
      id: Date.now(), // Assign a unique ID
      imageUrl: "",
      pretitle: "Limited Time",
      title: "New Promotion",
      subtitle: "Don't miss out on our amazing deals!",
      ctaButton: { link: "#", text: "Shop Now" },
      size: "medium",
      position: "left",
      sm_span: 6, // Default sm_span value
    };
    const updatedBanners = [...(component.data.banners || []), newBanner];
    handleUpdateField('banners', updatedBanners);
  };

  const handleRemoveBanner = (bannerIdToRemove) => {
    const updatedBanners = (component.data.banners || []).filter((banner) => banner.id !== bannerIdToRemove);
    handleUpdateField('banners', updatedBanners);
    showError("Banner removed from local configuration.");
  };

  // Updated handleUpdateBannerField to directly construct the path for nested properties
  const handleUpdateBannerField = (bannerId, propertyPath, value) => {
    const bannerIndex = (component.data.banners || []).findIndex(b => b.id === bannerId);
    if (bannerIndex === -1) return;

    updateNested(`data.banners.${bannerIndex}.${propertyPath}`, value); // Path relative to component.data
  };

  const handleImageUpload = async (event, bannerId) => {
    const file = event.target.files[0];
    if (!file) return;
    try {
      const { imageUrl } = await uploadSingleImage(file);
      handleUpdateBannerField(bannerId, 'imageUrl', imageUrl);
    } catch (error) {
      // Error handled by toast utility
    }
  };

  return (
    <CollapsibleCard
      title={`Promotional Banners (ID: ${component.id})`}
    >
      <p className="text-sm text-muted-foreground mb-4">
        Add multiple promotional banners to highlight offers or collections.
      </p>

      <div className="space-y-6">
        {(component.data.banners || []).map((banner) => (
            <div key={banner.id} className="border p-4 rounded-md relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 text-destructive hover:text-destructive"
              onClick={() => handleRemoveBanner(banner.id)}
              disabled={isUpdating}
            >
              <X className="h-4 w-4" />
            </Button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`banner-pretitle-${component.id}-${banner.id}`}>Pretitle</Label>
                <Input
                  id={`banner-pretitle-${component.id}-${banner.id}`}
                  value={banner.pretitle || ''}
                  onChange={(e) => handleUpdateBannerField(banner.id, 'pretitle', e.target.value)}
                  placeholder="e.g., Limited Time"
                  disabled={isUpdating}
                />
              </div>
              <div>
                <Label htmlFor={`banner-title-${component.id}-${banner.id}`}>Title</Label>
                <Input
                  id={`banner-title-${component.id}-${banner.id}`}
                  value={banner.title || ''}
                  onChange={(e) => handleUpdateBannerField(banner.id, 'title', e.target.value)}
                  placeholder="Banner Title"
                  disabled={isUpdating}
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor={`banner-subtitle-${component.id}-${banner.id}`}>Subtitle</Label>
                <Textarea
                  id={`banner-subtitle-${component.id}-${banner.id}`}
                  value={banner.subtitle || ''}
                  onChange={(e) => handleUpdateBannerField(banner.id, 'subtitle', e.target.value)}
                  placeholder="Banner Subtitle"
                  disabled={isUpdating}
                />
              </div>
              <div>
                <Label htmlFor={`banner-cta-text-${component.id}-${banner.id}`}>CTA Button Text</Label>
                <Input
                  id={`banner-cta-text-${component.id}-${banner.id}`}
                  value={banner.ctaButton?.text || ''}
                  onChange={(e) => handleUpdateBannerField(banner.id, 'ctaButton.text', e.target.value)}
                  placeholder="e.g., Shop Now"
                  disabled={isUpdating}
                />
              </div>
              <div>
                <Label htmlFor={`banner-cta-link-${component.id}-${banner.id}`}>CTA Button Link</Label>
                <Input
                  id={`banner-cta-link-${component.id}-${banner.id}`}
                  value={banner.ctaButton?.link || ''}
                  onChange={(e) => handleUpdateBannerField(banner.id, 'ctaButton.link', e.target.value)}
                  placeholder="/products"
                  disabled={isUpdating}
                />
              </div>
              <div>
                <Label htmlFor={`banner-size-${component.id}-${banner.id}`}>Size</Label>
                <Select
                  id={`banner-size-${component.id}-${banner.id}`}
                  options={[{ value: 'medium', label: 'Medium' }, { value: 'large', label: 'Large' }]}
                  value={[{ value: 'medium', label: 'Medium' }, { value: 'large', label: 'Large' }].find(option => option.value === (banner.size || 'medium'))}
                  onChange={(selectedOption) => handleUpdateBannerField(banner.id, 'size', selectedOption.value)}
                  isDisabled={isUpdating}
                  styles={customSelectStyles}
                  menuPortalTarget={document.body}
                />
              </div>
              <div>
                <Label htmlFor={`banner-position-${component.id}-${banner.id}`}>Text Position</Label>
                <Select
                  id={`banner-position-${component.id}-${banner.id}`}
                  options={[{ value: 'left', label: 'Left' }, { value: 'right', label: 'Right' }]}
                  value={[{ value: 'left', label: 'Left' }, { value: 'right', label: 'Right' }].find(option => option.value === (banner.position || 'left'))}
                  onChange={(selectedOption) => handleUpdateBannerField(banner.id, 'position', selectedOption.value)}
                  isDisabled={isUpdating}
                  styles={customSelectStyles}
                  menuPortalTarget={document.body}
                />
              </div>
              <div>
                <Label htmlFor={`banner-sm-span-${component.id}-${banner.id}`}>Small/Medium Span (1-12)</Label>
                <Select
                  id={`banner-sm-span-${component.id}-${banner.id}`}
                  options={spanOptions}
                  value={spanOptions.find(option => option.value === String(banner.sm_span || 6))}
                  onChange={(selectedOption) => handleUpdateBannerField(banner.id, 'sm_span', Number(selectedOption.value))}
                  isDisabled={isUpdating}
                  styles={customSelectStyles}
                  menuPortalTarget={document.body} // Render outside the modal to prevent clipping
                />
              </div>
              <div className="md:col-span-2">
                <Label>Background Image</Label>
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
            </div>
          </div>
        ))}
      </div>
      <Button variant="outline" onClick={handleAddBanner} disabled={isUpdating}>
        <Plus className="h-4 w-4 mr-2" />
        Add Banner
      </Button>
    </CollapsibleCard>
  );
};

export default PromotionalBannersSettings;