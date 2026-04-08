"use client";

import React from "react";
import { Button } from "@/components/ui/button.jsx";
import { X, Save, Copy } from "lucide-react"; // Import Copy icon
import { showInfo } from "@/utils/toast.js";
import { useProducts } from "@/hooks/use-products.js"; // Import useProducts hook
import { useNavigate } from "react-router-dom"; // Import useNavigate

const ProductFormHeader = ({ onDiscard, onSave, isSaving, productId, isEditMode }) => { // Add productId, isEditMode
  const navigate = useNavigate();
  const { duplicateProduct, isDuplicatingProduct } = useProducts();

  const handleDuplicateAsDraft = () => {
    if (productId) { // Only duplicate if it's an existing product
      duplicateProduct(productId, {
        onSuccess: (newProduct) => {
          navigate(`/products/${newProduct.id}/edit`); // Navigate to edit page of new draft
        }
      });
    } else {
      showInfo("Cannot duplicate a product that hasn't been saved yet.");
    }
  };

  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-2xl font-bold">{isEditMode ? "Edit Product" : "Add Product"}</h1> {/* Dynamic title */}
      <div className="flex gap-2">
        {isEditMode && ( // Only show "Copy as Draft" on edit page
          <Button
            variant="outline"
            onClick={handleDuplicateAsDraft}
            disabled={isSaving || isDuplicatingProduct}
          >
            <Copy className="h-4 w-4 mr-2" />
            {isDuplicatingProduct ? "Copying..." : "Copy as Draft"}
          </Button>
        )}
        <Button variant="outline" className="text-destructive hover:text-destructive" onClick={onDiscard} disabled={isSaving}>
          <X className="h-4 w-4 mr-2" />
          Discard
        </Button>
        <Button onClick={onSave} disabled={isSaving}>
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? "Saving..." : "Save"}
        </Button>
      </div>
    </div>
  );
};

export default ProductFormHeader;