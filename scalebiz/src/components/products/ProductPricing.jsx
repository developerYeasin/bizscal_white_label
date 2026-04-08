"use client";

import React from "react";
import { CardContent } from "@/components/ui/card.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import CollapsibleCard from "@/components/ui/CollapsibleCard.jsx"; // Import CollapsibleCard

const ProductPricing = ({
  sellPrice,
  setSellPrice,
  regularPrice,
  setRegularPrice,
  buyingPrice,
  setBuyingPrice,
}) => {
  return (
    <CollapsibleCard title="Pricing">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="sellPrice">Sell/Current Price <span className="text-destructive">*</span></Label>
          <Input
            id="sellPrice"
            placeholder="Sell/Current Price"
            className="mt-1"
            type="number"
            value={sellPrice}
            onChange={(e) => setSellPrice(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="regularPrice">Regular/Old Price</Label>
          <Input
            id="regularPrice"
            placeholder="Regular/Old Price"
            className="mt-1"
            type="number"
            value={regularPrice}
            onChange={(e) => setRegularPrice(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="buyingPrice">Buying Price (Optional)</Label>
          <Input
            id="buyingPrice"
            placeholder="Buying Price (Optional)"
            className="mt-1"
            type="number"
            value={buyingPrice}
            onChange={(e) => setBuyingPrice(e.target.value)}
          />
        </div>
      </div>
    </CollapsibleCard>
  );
};

export default ProductPricing;