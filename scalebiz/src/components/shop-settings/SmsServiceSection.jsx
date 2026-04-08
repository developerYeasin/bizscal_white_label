"use client";

import React from "react";
import { CardContent } from "@/components/ui/card.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Button } from "@/components/ui/button.jsx";
import { useStoreConfig } from "@/contexts/StoreConfigurationContext.jsx";
import { Skeleton } from "@/components/ui/skeleton.jsx";
import CollapsibleCard from "@/components/ui/CollapsibleCard.jsx"; // Import CollapsibleCard

const SmsServiceSection = () => {
  const { config, isLoading, updateNested, save, isUpdating } = useStoreConfig();

  if (isLoading || !config) {
    return (
      <CollapsibleCard title="SMS Service">
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </CollapsibleCard>
    );
  }

  return (
    <CollapsibleCard title="SMS Service">
      <h3 className="text-lg font-semibold mb-2">Configure BULK SMS BD</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Create an account on <a href="#" className="text-blue-500 hover:underline">BULK SMS BD</a> to obtain your credentials.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end mb-6">
        <div>
          <label htmlFor="apiKey">Api key <span className="text-destructive">*</span></label>
          <Input
            id="apiKey"
            placeholder="Api key"
            className="mt-1"
            value={config.notification_settings?.sms?.api_key || ''}
            onChange={(e) => updateNested('notification_settings.sms.api_key', e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="senderId">Sender ID <span className="text-destructive">*</span></label>
          <Input
            id="senderId"
            placeholder="Sender ID"
            className="mt-1"
            value={config.notification_settings?.sms?.sender_id || ''}
            onChange={(e) => updateNested('notification_settings.sms.sender_id', e.target.value)}
          />
        </div>
      </div>
      <div className="flex justify-end">
        <Button onClick={save} disabled={isUpdating}>
          {isUpdating ? 'Saving...' : 'Update SMS Settings'}
        </Button>
      </div>
    </CollapsibleCard>
  );
};

export default SmsServiceSection;