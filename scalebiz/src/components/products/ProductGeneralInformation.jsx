"use client";

import React from "react";
import { CardContent } from "@/components/ui/card.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Textarea } from "@/components/ui/textarea.jsx";
import RichTextEditor from '@/components/ui/RichTextEditor.jsx';
import CollapsibleCard from "@/components/ui/CollapsibleCard.jsx"; // Import CollapsibleCard

const ProductGeneralInformation = ({
  itemName,
  setItemName,
  shortDescription,
  setShortDescription,
  productDescription,
  setProductDescription,
}) => {
  return (
    <CollapsibleCard title="General Information">
      <div className="grid gap-4">
        <div>
          <Label htmlFor="itemName">Item Name <span className="text-destructive">*</span></Label>
          <Input
            id="itemName"
            placeholder="Item Name"
            className="mt-1"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="shortDescription">Short Description (SEO & Data Feed)</Label>
          <Textarea
            id="shortDescription"
            placeholder="Short Description"
            className="mt-1"
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="productDescription">Product Description</Label>
          <RichTextEditor
            content={productDescription}
            onChange={setProductDescription}
          />
        </div>
      </div>
    </CollapsibleCard>
  );
};

export default ProductGeneralInformation;