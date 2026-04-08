"use client";

import React from "react";
import { CardContent } from "@/components/ui/card.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Switch } from "@/components/ui/switch.jsx";
import { useStoreConfig } from "@/contexts/StoreConfigurationContext.jsx";
import { Skeleton } from "@/components/ui/skeleton.jsx";
import CollapsibleCard from "@/components/ui/CollapsibleCard.jsx"; // Import CollapsibleCard

const ShopSettingsSection = () => {
  const { config, isLoading, updateNested, save, isUpdating } = useStoreConfig();

  if (isLoading || !config) {
    return (
      <CollapsibleCard title="Shop Settings">
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <div className="flex justify-end">
            <Skeleton className="h-10 w-40" />
          </div>
        </div>
      </CollapsibleCard>
    );
  }

  return (
    <CollapsibleCard title="Shop Settings">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <Label htmlFor="defaultLanguage">Default language</Label>
          <Select
            value={config.localization_settings?.default_language || 'English'}
            onValueChange={(value) => updateNested('localization_settings.default_language', value)}
          >
            <SelectTrigger id="defaultLanguage" className="mt-1">
              <SelectValue placeholder="Select Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="English">English</SelectItem>
              <SelectItem value="Bangla">Bangla</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center justify-between col-span-full md:col-span-1">
          <Label htmlFor="maintainStockQuantity" className="text-sm">
            Maintain Stock Quantity
            <p className="text-xs text-muted-foreground mt-1">
              Enabling this option ensures that products with zero stock will be marked as "Out of Stock" on the website.
            </p>
          </Label>
          <Switch
            id="maintainStockQuantity"
            checked={config.integrations?.shop_rules?.maintain_stock || false}
            onCheckedChange={(checked) => updateNested('integrations.shop_rules.maintain_stock', checked)}
          />
        </div>
        <div className="flex items-center justify-between col-span-full md:col-span-1">
          <Label htmlFor="showProductSoldCount" className="text-sm">
            Show Product Sold Count
          </Label>
          <Switch
            id="showProductSoldCount"
            checked={config.integrations?.shop_rules?.show_sold_count || false}
            onCheckedChange={(checked) => updateNested('integrations.shop_rules.show_sold_count', checked)}
          />
        </div>
        <div>
          <Label htmlFor="vatTaxPercentage">VAT / Tax Percentage</Label>
          <Input
            id="vatTaxPercentage"
            type="number"
            value={config.payment_settings?.vat_tax_percentage || '0'}
            onChange={(e) => updateNested('payment_settings.vat_tax_percentage', e.target.value)}
            className="mt-1"
          />
        </div>
      </div>
      <div className="flex justify-end mt-4">
        <Button onClick={save} disabled={isUpdating}>
          {isUpdating ? 'Saving...' : 'Update Shop Settings'}
        </Button>
      </div>
    </CollapsibleCard>
  );
};

export default ShopSettingsSection;