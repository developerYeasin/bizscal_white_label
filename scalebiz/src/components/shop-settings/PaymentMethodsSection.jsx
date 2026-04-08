"use client";

import React from "react";
import { CardContent } from "@/components/ui/card.jsx";
import { Checkbox } from "@/components/ui/checkbox.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Textarea } from "@/components/ui/textarea.jsx";
import { Button } from "@/components/ui/button.jsx";
import { useStoreConfig } from "@/contexts/StoreConfigurationContext.jsx";
import { Skeleton } from "@/components/ui/skeleton.jsx";
import CollapsibleCard from "@/components/ui/CollapsibleCard.jsx"; // Import CollapsibleCard

const PaymentMethodsSection = () => {
  const { config, isLoading, updateNested, save, isUpdating } = useStoreConfig();

  if (isLoading || !config) {
    return (
      <CollapsibleCard title="Integrate Payment Methods">
        <div className="space-y-4">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-20 w-full" />
          <div className="flex justify-end">
            <Skeleton className="h-10 w-40" />
          </div>
        </div>
      </CollapsibleCard>
    );
  }

  return (
    <CollapsibleCard title="Integrate Payment Methods">
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="zatiqSecurePurchase"
            checked={config.payment_settings?.zatiq_enabled || false}
            onCheckedChange={(checked) => updateNested('payment_settings.zatiq_enabled', checked)}
          />
          <Label htmlFor="zatiqSecurePurchase">Zatiq Secure Purchase</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="cashOnDelivery"
            checked={config.payment_settings?.cod_enabled || false}
            onCheckedChange={(checked) => updateNested('payment_settings.cod_enabled', checked)}
          />
          <Label htmlFor="cashOnDelivery">Cash On Delivery</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="aamarPay"
            checked={config.payment_settings?.aamarpay_enabled || false}
            onCheckedChange={(checked) => updateNested('payment_settings.aamarpay_enabled', checked)}
          />
          <Label htmlFor="aamarPay">AamarPay</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="bKash"
            checked={config.payment_settings?.bkash_enabled || false}
            onCheckedChange={(checked) => updateNested('payment_settings.bkash_enabled', checked)}
          />
          <Label htmlFor="bKash">bKash</Label>
        </div>
      </div>

      <div className="mb-6">
        <Label htmlFor="paymentProcessMessage">Payment process message note</Label>
        <Textarea
          id="paymentProcessMessage"
          rows={3}
          value={config.payment_settings?.note || ''}
          onChange={(e) => updateNested('payment_settings.note', e.target.value)}
        />
      </div>

      <div className="flex justify-end">
        <Button onClick={save} disabled={isUpdating}>
          {isUpdating ? 'Saving...' : 'Update Payment Info'}
        </Button>
      </div>
    </CollapsibleCard>
  );
};

export default PaymentMethodsSection;