"use client";

import React from "react";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Textarea } from "@/components/ui/textarea.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Plus, Trash2, Copy, Image as ImageIcon, X } from "lucide-react"; // Added X here
import { useStoreConfig } from "@/contexts/StoreConfigurationContext.jsx";
import { Skeleton } from "@/components/ui/skeleton.jsx";
import CollapsibleCard from "@/components/ui/CollapsibleCard.jsx";
import { showSuccess, showError } from "@/utils/toast.js";
import { uploadSingleImage } from "@/utils/upload.js";

const FooterSettingsSection = () => {
  const { config, isLoading, updateNested, save, isUpdating } = useStoreConfig();
  const paymentIconInputRef = React.useRef(null);

  if (isLoading || !config) {
    return (
      <CollapsibleCard title="Footer Settings">
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-40 w-full" />
          <div className="flex justify-end">
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      </CollapsibleCard>
    );
  }

  const footer = config.layout_settings?.footer || {};
  const storeInfo = footer.storeInfo || {};
  const newsletter = footer.newsletter || {};
  const bottomLinks = footer.bottomLinks || [];
  const socialLinks = footer.socialLinks || [];
  const openingHours = footer.openingHours || [];
  const paymentIcons = footer.paymentIcons || [];

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    showSuccess("Copied to clipboard!");
  };

  // --- Bottom Links Handlers ---
  const handleAddBottomLink = () => {
    updateNested('layout_settings.footer.bottomLinks', [...bottomLinks, { path: '', title: '' }]);
  };

  const handleUpdateBottomLink = (index, field, value) => {
    const newLinks = [...bottomLinks];
    newLinks[index] = { ...newLinks[index], [field]: value };
    updateNested('layout_settings.footer.bottomLinks', newLinks);
  };

  const handleRemoveBottomLink = (index) => {
    const newLinks = bottomLinks.filter((_, i) => i !== index);
    updateNested('layout_settings.footer.bottomLinks', newLinks);
  };

  // --- Social Links Handlers ---
  const handleAddSocialLink = () => {
    updateNested('layout_settings.footer.socialLinks', [...socialLinks, { platform: '', url: '' }]);
  };

  const handleUpdateSocialLink = (index, field, value) => {
    const newLinks = [...socialLinks];
    newLinks[index] = { ...newLinks[index], [field]: value };
    updateNested('layout_settings.footer.socialLinks', newLinks);
  };

  const handleRemoveSocialLink = (index) => {
    const newLinks = socialLinks.filter((_, i) => i !== index);
    updateNested('layout_settings.footer.socialLinks', newLinks);
  };

  // --- Opening Hours Handlers ---
  const handleAddOpeningHour = () => {
    updateNested('layout_settings.footer.openingHours', [...openingHours, { day: '', hours: '' }]);
  };

  const handleUpdateOpeningHour = (index, field, value) => {
    const newHours = [...openingHours];
    newHours[index] = { ...newHours[index], [field]: value };
    updateNested('layout_settings.footer.openingHours', newHours);
  };

  const handleRemoveOpeningHour = (index) => {
    const newHours = openingHours.filter((_, i) => i !== index);
    updateNested('layout_settings.footer.openingHours', newHours);
  };

  // --- Payment Icons Handlers ---
  const handleUploadPaymentIcon = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    try {
      const { imageUrl } = await uploadSingleImage(file);
      updateNested('layout_settings.footer.paymentIcons', [...paymentIcons, imageUrl]);
      save(); // Save immediately after successful upload
    } catch (error) {
      // Error is handled by the toast in the upload utility
    }
  };

  const handleRemovePaymentIcon = (indexToRemove) => {
    const newIcons = paymentIcons.filter((_, index) => index !== indexToRemove);
    updateNested('layout_settings.footer.paymentIcons', newIcons);
    save(); // Save immediately after removal
    showError("Payment icon removed.");
  };

  return (
    <CollapsibleCard title="Footer Settings">
      <div className="space-y-8">
        {/* Store Information */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Store Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="footerEmail">Email</Label>
              <Input
                id="footerEmail"
                value={storeInfo.email || ''}
                onChange={(e) => updateNested('layout_settings.footer.storeInfo.email', e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="footerPhone">Phone</Label>
              <Input
                id="footerPhone"
                value={storeInfo.phone || ''}
                onChange={(e) => updateNested('layout_settings.footer.storeInfo.phone', e.target.value)}
                className="mt-1"
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="footerAddress">Address</Label>
              <Textarea
                id="footerAddress"
                value={storeInfo.address || ''}
                onChange={(e) => updateNested('layout_settings.footer.storeInfo.address', e.target.value)}
                rows={3}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="footerWebsite">Website</Label>
              <Input
                id="footerWebsite"
                value={storeInfo.website || ''}
                onChange={(e) => updateNested('layout_settings.footer.storeInfo.website', e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="newsletterPlaceholder">Placeholder Text</Label>
              <Input
                id="newsletterPlaceholder"
                value={newsletter.placeholder || ''}
                onChange={(e) => updateNested('layout_settings.footer.newsletter.placeholder', e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="newsletterButtonText">Button Text</Label>
              <Input
                id="newsletterButtonText"
                value={newsletter.buttonText || ''}
                onChange={(e) => updateNested('layout_settings.footer.newsletter.buttonText', e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
        </div>

        {/* Bottom Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Bottom Links</h3>
          <div className="space-y-4">
            {bottomLinks.map((link, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div>
                  <Label htmlFor={`bottomLinkTitle-${index}`}>Title</Label>
                  <Input
                    id={`bottomLinkTitle-${index}`}
                    value={link.title}
                    onChange={(e) => handleUpdateBottomLink(index, 'title', e.target.value)}
                    placeholder="Link Title"
                    className="mt-1"
                  />
                </div>
                <div className="md:col-span-2 flex items-end gap-2">
                  <div className="flex-1">
                    <Label htmlFor={`bottomLinkPath-${index}`}>Path</Label>
                    <Input
                      id={`bottomLinkPath-${index}`}
                      value={link.path}
                      onChange={(e) => handleUpdateBottomLink(index, 'path', e.target.value)}
                      placeholder="/path-to-page"
                      className="mt-1"
                    />
                  </div>
                  <Button variant="outline" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleRemoveBottomLink(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <Button variant="outline" className="mt-4" onClick={handleAddBottomLink}>
            <Plus className="h-4 w-4 mr-2" />
            Add Bottom Link
          </Button>
        </div>

        {/* Social Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Social Links</h3>
          <div className="space-y-4">
            {socialLinks.map((link, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div>
                  <Label htmlFor={`socialPlatform-${index}`}>Platform</Label>
                  <Input
                    id={`socialPlatform-${index}`}
                    value={link.platform}
                    onChange={(e) => handleUpdateSocialLink(index, 'platform', e.target.value)}
                    placeholder="e.g., facebook"
                    className="mt-1"
                  />
                </div>
                <div className="md:col-span-2 flex items-end gap-2">
                  <div className="flex-1">
                    <Label htmlFor={`socialUrl-${index}`}>URL</Label>
                    <Input
                      id={`socialUrl-${index}`}
                      value={link.url}
                      onChange={(e) => handleUpdateSocialLink(index, 'url', e.target.value)}
                      placeholder="https://..."
                      className="mt-1"
                    />
                  </div>
                  <Button variant="outline" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleRemoveSocialLink(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <Button variant="outline" className="mt-4" onClick={handleAddSocialLink}>
            <Plus className="h-4 w-4 mr-2" />
            Add Social Link
          </Button>
        </div>

        {/* Opening Hours */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Opening Hours</h3>
          <div className="space-y-4">
            {openingHours.map((hour, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div>
                  <Label htmlFor={`openingDay-${index}`}>Day(s)</Label>
                  <Input
                    id={`openingDay-${index}`}
                    value={hour.day}
                    onChange={(e) => handleUpdateOpeningHour(index, 'day', e.target.value)}
                    placeholder="e.g., Monday - Friday"
                    className="mt-1"
                  />
                </div>
                <div className="md:col-span-2 flex items-end gap-2">
                  <div className="flex-1">
                    <Label htmlFor={`openingHours-${index}`}>Hours</Label>
                    <Input
                      id={`openingHours-${index}`}
                      value={hour.hours}
                      onChange={(e) => handleUpdateOpeningHour(index, 'hours', e.target.value)}
                      placeholder="e.g., 08:00 - 20:00"
                      className="mt-1"
                    />
                  </div>
                  <Button variant="outline" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleRemoveOpeningHour(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <Button variant="outline" className="mt-4" onClick={handleAddOpeningHour}>
            <Plus className="h-4 w-4 mr-2" />
            Add Opening Hour
          </Button>
        </div>

        {/* Payment Icons */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Payment Icons</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Upload images for payment methods accepted in your footer.
          </p>
          <input
            type="file"
            ref={paymentIconInputRef}
            onChange={handleUploadPaymentIcon}
            accept="image/png, image/jpeg, image/gif"
            style={{ display: 'none' }}
          />
          <Button className="mb-4" onClick={() => paymentIconInputRef.current.click()} disabled={isUpdating}>
            Upload Payment Icon
          </Button>
          <div className="flex flex-wrap gap-4">
            {paymentIcons.length === 0 ? (
              <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center text-muted-foreground flex flex-col items-center justify-center w-full h-24">
                <ImageIcon className="h-8 w-8 mb-2" />
                No payment icons uploaded.
              </div>
            ) : (
              paymentIcons.map((src, index) => (
                <div key={index} className="relative w-24 h-16 rounded-md overflow-hidden border flex items-center justify-center">
                  <img src={src} alt={`Payment Icon ${index + 1}`} className="max-w-full max-h-full object-contain" />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-1 right-1 h-6 w-6 rounded-full"
                    onClick={() => handleRemovePaymentIcon(index)}
                    disabled={isUpdating}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Copyright Text */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Copyright Text</h3>
          <Input
            id="copyrightText"
            value={footer.copyrightText || ''}
            onChange={(e) => updateNested('layout_settings.footer.copyrightText', e.target.value)}
            placeholder="© 2024 Your Shop. All rights reserved."
            className="mt-1"
          />
        </div>

        <div className="flex justify-end mt-8">
          <Button onClick={save} disabled={isUpdating}>
            {isUpdating ? 'Saving...' : 'Save Footer Settings'}
          </Button>
        </div>
      </div>
    </CollapsibleCard>
  );
};

export default FooterSettingsSection;