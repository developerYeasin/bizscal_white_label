"use client";

import React from "react";
import { CardContent } from "@/components/ui/card.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.jsx";
import { Button } from "@/components/ui/button.jsx"; // Import Button
import { Badge } from "@/components/ui/badge.jsx"; // Import Badge
import AssignCategoriesDialog from "./AssignCategoriesDialog.jsx"; // Import new dialog
import CollapsibleCard from "@/components/ui/CollapsibleCard.jsx"; // Import CollapsibleCard

const ProductSidebar = ({
  selectedCategoryIds,
  setSelectedCategoryIds,
  brandName,
  setBrandName,
  condition,
  setCondition,
  productStatus,
  setProductStatus,
  allCategories,
  categoriesLoading,
}) => {
  const [isAssignCategoriesDialogOpen, setIsAssignCategoriesDialogOpen] = React.useState(false);

  const getCategoryNameById = (id) => {
    return allCategories?.find(cat => String(cat.id) === id)?.name || `Unknown Category (${id})`;
  };

  return (
    <div className="space-y-6">
      <CollapsibleCard title="Category">
        <p className="text-sm text-muted-foreground mb-4">
          Select categories for this product.
        </p>
        <div className="min-h-[40px] border rounded-md p-2 flex flex-wrap gap-2 mb-4">
          {selectedCategoryIds.length === 0 ? (
            <p className="text-sm text-muted-foreground">No assigned category found</p>
          ) : (
            selectedCategoryIds.map(id => (
              <Badge key={id} variant="secondary" className="bg-purple-100 text-purple-700">
                {getCategoryNameById(id)}
              </Badge>
            ))
          )}
        </div>
        <Button
          className="w-full bg-purple-600 hover:bg-purple-700 text-white"
          onClick={() => setIsAssignCategoriesDialogOpen(true)}
        >
          Assign category
        </Button>
      </CollapsibleCard>

      <CollapsibleCard title="Brand (SEO & Data Feed)">
        <Input
          placeholder="Brand Name"
          value={brandName}
          onChange={(e) => setBrandName(e.target.value)}
        />
      </CollapsibleCard>

      <CollapsibleCard title="Condition (SEO & Data Feed)">
        <Select value={condition} onValueChange={setCondition}>
          <SelectTrigger>
            <SelectValue placeholder="Select Condition" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="used">Used</SelectItem>
            <SelectItem value="refurbished">Refurbished</SelectItem>
          </SelectContent>
        </Select>
      </CollapsibleCard>

      <CollapsibleCard title="Product Status">
        <Select value={productStatus} onValueChange={setProductStatus}>
          <SelectTrigger>
            <SelectValue placeholder="Select Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
      </CollapsibleCard>

      <AssignCategoriesDialog
        isOpen={isAssignCategoriesDialogOpen}
        onClose={() => setIsAssignCategoriesDialogOpen(false)}
        selectedCategoryIds={selectedCategoryIds}
        onSelectCategories={setSelectedCategoryIds}
      />
    </div>
  );
};

export default ProductSidebar;