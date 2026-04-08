"use client";

import React from "react";
import { CardContent } from "@/components/ui/card.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Plus, X } from "lucide-react";
import CollapsibleCard from "@/components/ui/CollapsibleCard.jsx"; // Import CollapsibleCard

const ProductDetails = ({ details, setDetails }) => {
  const addDetailField = () => {
    setDetails([...details, { id: Date.now(), type: "", description: "" }]);
  };

  const removeDetailField = (id) => {
    setDetails(details.filter((detail) => detail.id !== id));
  };

  const updateDetailField = (id, field, value) => {
    setDetails(
      details.map((detail) =>
        detail.id === id ? { ...detail, [field]: value } : detail
      )
    );
  };

  return (
    <CollapsibleCard title="Product Details">
      <p className="text-sm text-muted-foreground mb-4">
        You can add multiple product details for a single product here. Like Brand, Model, Serial Number, Fabric Type, and EMI etc.
      </p>
      
      <div className="space-y-4 mb-4">
        {details.map((detail, index) => (
          <div key={detail.id} className="grid grid-cols-12 gap-4 items-center">
            <div className="col-span-5">
              {index === 0 && <Label>Detail Type</Label>}
              <Input
                placeholder="e.g., Brand, Material, Features"
                value={detail.type}
                onChange={(e) => updateDetailField(detail.id, "type", e.target.value)}
              />
            </div>
            <div className="col-span-6">
              {index === 0 && <Label>Detail Description</Label>}
              <Input
                placeholder="e.g., Samsung, 100% Cotton, Waterproof"
                value={detail.description}
                onChange={(e) => updateDetailField(detail.id, "description", e.target.value)}
              />
            </div>
            <div className="col-span-1 flex items-end h-full">
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive hover:text-destructive"
                onClick={() => removeDetailField(detail.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Button variant="outline" className="text-primary" onClick={addDetailField}>
        <Plus className="h-4 w-4 mr-2" />
        Add a new field
      </Button>
    </CollapsibleCard>
  );
};

export default ProductDetails;