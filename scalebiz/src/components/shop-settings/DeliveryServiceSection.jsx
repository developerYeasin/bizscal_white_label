"use client";

import React from "react";
import { CardContent } from "@/components/ui/card.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Switch } from "@/components/ui/switch.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.jsx";
import { Plus, Trash2 } from "lucide-react";
import { useStoreConfig } from "@/contexts/StoreConfigurationContext.jsx";
import { Skeleton } from "@/components/ui/skeleton.jsx";
import CollapsibleCard from "@/components/ui/CollapsibleCard.jsx"; // Import CollapsibleCard

const DeliveryServiceSection = () => {
  const { config, isLoading, updateNested, save, isUpdating } = useStoreConfig();

  if (isLoading || !config) {
    return (
      <CollapsibleCard title="Delivery Service">
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </CollapsibleCard>
    );
  }

  const deliveryZones = config.delivery_settings?.zones || [];

  const addSpecificCharge = () => {
    const newZones = [...deliveryZones, { id: Date.now(), zone_name: "Not Selected", charge: "0" }];
    updateNested('delivery_settings.zones', newZones);
  };

  const removeSpecificCharge = (id) => {
    const newZones = deliveryZones.filter(charge => charge.id !== id);
    updateNested('delivery_settings.zones', newZones);
  };

  const updateZoneField = (id, field, value) => {
    const newZones = deliveryZones.map(zone =>
      zone.id === id ? { ...zone, [field]: value } : zone
    );
    updateNested('delivery_settings.zones', newZones);
  };

  return (
    <CollapsibleCard title="Delivery Service">
      <div className="mb-4">
        <Label htmlFor="deliveryCharge">Delivery Charge (Default)</Label>
        <Input
          id="deliveryCharge"
          type="number"
          value={config.delivery_settings?.default_charge || ''}
          onChange={(e) => updateNested('delivery_settings.default_charge', e.target.value)}
          className="mt-1"
        />
        <p className="text-xs text-muted-foreground mt-1">
          Default delivery charge will be applied to all areas, except for the specific zones listed below.
        </p>
      </div>

      <div className="flex items-center justify-between mb-4">
        <Label htmlFor="deliveryChargeRefundable" className="text-sm">
          Delivery Charge Not refundable?
        </Label>
        <Switch
          id="deliveryChargeRefundable"
          checked={config.delivery_settings?.charge_not_refundable || false}
          onCheckedChange={(checked) => updateNested('delivery_settings.charge_not_refundable', checked)}
        />
      </div>

      <h3 className="text-lg font-semibold mb-2">Specific Delivery Charges</h3>
      {deliveryZones.map((charge, index) => (
        <div key={charge.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end mb-4">
          <div>
            <Label htmlFor={`deliveryZone-${charge.id}`}>Select delivery zone</Label>
            <Input
              id={`deliveryZone-${charge.id}`}
              value={charge.zone_name}
              onChange={(e) => updateZoneField(charge.id, 'zone_name', e.target.value)}
              placeholder="e.g., Dhaka"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor={`chargeAmount-${charge.id}`}>Charge</Label>
            <Input
              id={`chargeAmount-${charge.id}`}
              type="number"
              value={charge.charge}
              onChange={(e) => updateZoneField(charge.id, 'charge', e.target.value)}
              className="mt-1"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" className="text-destructive hover:text-destructive" onClick={() => removeSpecificCharge(charge.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
            {index === deliveryZones.length - 1 && (
              <Button variant="outline" size="icon" onClick={addSpecificCharge}>
                <Plus className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      ))}
      <div className="flex justify-end mt-4">
        <Button onClick={save} disabled={isUpdating}>
          {isUpdating ? 'Saving...' : 'Update Delivery Charges'}
        </Button>
      </div>
    </CollapsibleCard>
  );
};

export default DeliveryServiceSection;