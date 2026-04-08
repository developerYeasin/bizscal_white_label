"use client";

import React from "react";
import { CardContent } from "@/components/ui/card.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Plus, Trash2 } from "lucide-react";
import { useStoreConfig } from "@/contexts/StoreConfigurationContext.jsx";
import { Skeleton } from "@/components/ui/skeleton.jsx";
import CollapsibleCard from "@/components/ui/CollapsibleCard.jsx"; // Import CollapsibleCard

const SocialLinksSection = () => {
  const { config, isLoading, updateNested, save, isUpdating } = useStoreConfig();

  if (isLoading || !config) {
    return (
      <CollapsibleCard title="Social Links">
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </CollapsibleCard>
    );
  }

  const socialLinks = config.layout_settings?.footer?.socialLinks || [];

  const handleUpdateLink = (index, field, value) => {
    const newLinks = [...socialLinks];
    newLinks[index] = { ...newLinks[index], [field]: value };
    updateNested('layout_settings.footer.socialLinks', newLinks);
  };

  const handleAddLink = () => {
    const newLinks = [...socialLinks, { platform: '', url: '' }];
    updateNested('layout_settings.footer.socialLinks', newLinks);
  };

  const handleRemoveLink = (index) => {
    const newLinks = socialLinks.filter((_, i) => i !== index);
    updateNested('layout_settings.footer.socialLinks', newLinks);
  };

  return (
    <CollapsibleCard title="Social Links">
      <div className="space-y-4 mb-6">
        {socialLinks.map((link, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <Label htmlFor={`platform-${index}`}>Platform</Label>
              <Input
                id={`platform-${index}`}
                value={link.platform}
                onChange={(e) => handleUpdateLink(index, 'platform', e.target.value)}
                placeholder="e.g., facebook"
                className="mt-1"
              />
            </div>
            <div className="md:col-span-2 flex items-end gap-2">
              <div className="flex-1">
                <Label htmlFor={`url-${index}`}>URL</Label>
                <Input
                  id={`url-${index}`}
                  value={link.url}
                  onChange={(e) => handleUpdateLink(index, 'url', e.target.value)}
                  placeholder="https://..."
                  className="mt-1"
                />
              </div>
              <Button variant="outline" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleRemoveLink(index)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
      <Button variant="outline" onClick={handleAddLink}>
        <Plus className="h-4 w-4 mr-2" />
        Add Link
      </Button>
      <div className="flex justify-end mt-4">
        <Button onClick={save} disabled={isUpdating}>
          {isUpdating ? 'Saving...' : 'Update Social Links'}
        </Button>
      </div>
    </CollapsibleCard>
  );
};

export default SocialLinksSection;