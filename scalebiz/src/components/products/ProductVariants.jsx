"use client";

import React from "react";
import { CardContent } from "@/components/ui/card.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Switch } from "@/components/ui/switch.jsx";
import { Plus, X } from "lucide-react";
import CollapsibleCard from "@/components/ui/CollapsibleCard.jsx"; // Import CollapsibleCard

const ProductVariants = ({ variants, setVariants }) => {
  const addVariant = () => {
    const newVariant = {
      id: Date.now(),
      title: "",
      mandatory: false,
      options: [{ id: Date.now(), attribute: "", extraPrice: "" }],
    };
    setVariants([...variants, newVariant]);
  };

  const removeVariant = (variantId) => {
    setVariants(variants.filter((v) => v.id !== variantId));
  };

  const updateVariant = (variantId, field, value) => {
    setVariants(
      variants.map((v) => (v.id === variantId ? { ...v, [field]: value } : v))
    );
  };

  const addOption = (variantId) => {
    setVariants(
      variants.map((v) =>
        v.id === variantId
          ? {
              ...v,
              options: [
                ...v.options,
                { id: Date.now(), attribute: "", extraPrice: "" },
              ],
            }
          : v
      )
    );
  };

  const removeOption = (variantId, optionId) => {
    setVariants(
      variants.map((v) =>
        v.id === variantId
          ? { ...v, options: v.options.filter((o) => o.id !== optionId) }
          : v
      )
    );
  };

  const updateOption = (variantId, optionId, field, value) => {
    setVariants(
      variants.map((v) =>
        v.id === variantId
          ? {
              ...v,
              options: v.options.map((o) =>
                o.id === optionId ? { ...o, [field]: value } : o
              ),
            }
          : v
      )
    );
  };

  return (
    <CollapsibleCard title="Product Variants">
      <p className="text-sm text-muted-foreground mb-4">
        You can add multiple variant for a single product here. Like Size, Color, and Weight etc.
      </p>
      
      <div className="space-y-4">
        {variants.map((variant) => (
          <div key={variant.id} className="border border-purple-300 rounded-lg p-4 relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 text-destructive hover:text-destructive"
              onClick={() => removeVariant(variant.id)}
            >
              <X className="h-4 w-4" />
            </Button>
            <div className="flex items-center justify-between mb-4">
              <div>
                <Label htmlFor={`mandatory-${variant.id}`} className="font-semibold">Make this variant mandatory</Label>
                <p className="text-xs text-muted-foreground">Toggle this on if you want your customer to select at least one of the variant options</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">[{variant.mandatory ? "YES" : "NO"}]</span>
                <Switch
                  id={`mandatory-${variant.id}`}
                  checked={variant.mandatory}
                  onCheckedChange={(checked) => updateVariant(variant.id, "mandatory", checked)}
                />
              </div>
            </div>

            <div className="mb-4">
              <Label htmlFor={`title-${variant.id}`}>Title</Label>
              <Input
                id={`title-${variant.id}`}
                placeholder="Enter the name of the variant (e.g., Color, Size, Material)"
                className="mt-1"
                value={variant.title}
                onChange={(e) => updateVariant(variant.id, "title", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              {variant.options.map((option, optionIndex) => (
                <div key={option.id} className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-6">
                    {optionIndex === 0 && <Label>Attribute</Label>}
                    <Input
                      placeholder="Enter variant option (e.g., Red, La)"
                      value={option.attribute}
                      onChange={(e) => updateOption(variant.id, option.id, "attribute", e.target.value)}
                    />
                  </div>
                  <div className="col-span-5">
                    {optionIndex === 0 && <Label>Extra Price</Label>}
                    <Input
                      type="number"
                      placeholder="Enter extra price for this option"
                      value={option.extraPrice}
                      onChange={(e) => updateOption(variant.id, option.id, "extraPrice", e.target.value)}
                    />
                  </div>
                  <div className="col-span-1 flex items-end h-full">
                    {variant.options.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => removeOption(variant.id, option.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <Button
              variant="outline"
              className="mt-4"
              onClick={() => addOption(variant.id)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add More Option
            </Button>
          </div>
        ))}
      </div>

      <Button
        variant="outline"
        className="mt-4 text-primary"
        onClick={addVariant}
      >
        <Plus className="h-4 w-4 mr-2" />
        Add a new variant
      </Button>
    </CollapsibleCard>
  );
};

export default ProductVariants;