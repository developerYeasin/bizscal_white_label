"use client";

import React from "react";
import { CardContent } from "@/components/ui/card.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Textarea } from "@/components/ui/textarea.jsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.jsx";
import { Button } from "@/components/ui/button.jsx";
import { useStoreConfig } from "@/contexts/StoreConfigurationContext.jsx";
import { Skeleton } from "@/components/ui/skeleton.jsx";
import CollapsibleCard from "@/components/ui/CollapsibleCard.jsx"; // Import CollapsibleCard

const ShopBasicInfo = () => {
  const { config, isLoading, updateNested, save, isUpdating } = useStoreConfig();

  if (isLoading || !config) {
    return (
      <CollapsibleCard title="Shop Basic Info">
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-20 w-full" />
          <div className="flex justify-end">
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      </CollapsibleCard>
    );
  }

  return (
    <CollapsibleCard title="Shop Basic Info">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <Label htmlFor="businessId">Business ID</Label>
          <Input id="businessId" value={config.id || ''} readOnly className="mt-1 bg-muted" />
        </div>
        <div>
          <Label htmlFor="businessName">Business Name</Label>
          <Input
            id="businessName"
            value={config.store_name || ''}
            onChange={(e) => updateNested('store_name', e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="shopEmail">Shop Email</Label>
          <Input
            id="shopEmail"
            value={config.layout_settings?.footer?.storeInfo?.email || ''}
            onChange={(e) => updateNested('layout_settings.footer.storeInfo.email', e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="shopPhoneNumber">Shop Phone Number</Label>
          <Input
            id="shopPhoneNumber"
            value={config.layout_settings?.footer?.storeInfo?.phone || ''}
            onChange={(e) => updateNested('layout_settings.footer.storeInfo.phone', e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="country">Country</Label>
          <Select
            value={config.localization_settings?.country || ''}
            onValueChange={(value) => updateNested('localization_settings.country', value)}
          >
            <SelectTrigger id="country" className="mt-1">
              <SelectValue placeholder="Select Country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Bangladesh">Bangladesh</SelectItem>
              <SelectItem value="USA">USA</SelectItem>
              <SelectItem value="Canada">Canada</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="mb-4">
        <Label htmlFor="shopAddress">Shop Address</Label>
        <Textarea
          id="shopAddress"
          value={config.layout_settings?.footer?.storeInfo?.address || ''}
          onChange={(e) => updateNested('layout_settings.footer.storeInfo.address', e.target.value)}
          rows={3}
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="topbarAnnouncement">Topbar Announcement Message</Label>
        <Input
          id="topbarAnnouncement"
          value={config.layout_settings?.announcementBar?.text || ''}
          onChange={(e) => updateNested('layout_settings.announcementBar.text', e.target.value)}
          className="mt-1"
        />
      </div>
      <div className="flex justify-end mt-4">
        <Button onClick={save} disabled={isUpdating}>
          {isUpdating ? 'Saving...' : 'Update Shop Info'}
        </Button>
      </div>
    </CollapsibleCard>
  );
};

export default ShopBasicInfo;