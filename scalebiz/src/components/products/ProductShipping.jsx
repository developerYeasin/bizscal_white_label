"use client";

import React from "react";
import { CardContent } from "@/components/ui/card.jsx";
import { Switch } from "@/components/ui/switch.jsx";
import { Label } from "@/components/ui/label.jsx";
import CollapsibleCard from "@/components/ui/CollapsibleCard.jsx"; // Import CollapsibleCard

const ProductShipping = ({
  applyDefaultDeliveryCharges,
  setApplyDefaultDeliveryCharges,
}) => {
  return (
    <CollapsibleCard title="Shipping">
      <h3 className="text-lg font-semibold mb-2">Delivery Charge</h3>
      <p className="text-sm text-muted-foreground mb-4">
        You can add specific delivery charge for this product or use the default charges
      </p>
      <div className="flex items-center justify-between">
        <Label htmlFor="delivery-charge-toggle" className="text-base">
          Apply default delivery charges
        </Label>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            [{applyDefaultDeliveryCharges ? "Applied" : "Not Applied"}]
          </span>
          <Switch
            id="delivery-charge-toggle"
            checked={applyDefaultDeliveryCharges}
            onCheckedChange={setApplyDefaultDeliveryCharges}
          />
        </div>
      </div>
    </CollapsibleCard>
  );
};

export default ProductShipping;