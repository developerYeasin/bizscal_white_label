"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { Plus, X, Search } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area.jsx";
import { cn } from "@/lib/utils.js";
import { useProducts } from "@/hooks/use-products.js";
import { Input } from "@/components/ui/input.jsx";
import { showSuccess } from "@/utils/toast.js";
import { useDebounce } from "@/hooks/use-debounce.js";

const AssignProductsDialog = ({ isOpen, onClose, selectedProductIds, onSelectProducts }) => {
  const { products, isLoading, error } = useProducts();
  const [tempSelectedProductIds, setTempSelectedProductIds] = React.useState([]);
  const [searchTerm, setSearchTerm] = React.useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  React.useEffect(() => {
    if (isOpen) {
      setTempSelectedProductIds(selectedProductIds);
    }
  }, [isOpen, selectedProductIds]);

  const filteredProducts = React.useMemo(() => {
    if (!products) return [];
    return products.filter(product =>
      product.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      (product.sku && product.sku.toLowerCase().includes(debouncedSearchTerm.toLowerCase()))
    );
  }, [products, debouncedSearchTerm]);

  const handleProductToggle = (productId) => {
    setTempSelectedProductIds(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleRemoveSelectedProduct = (productId) => {
    setTempSelectedProductIds(prev => prev.filter(id => id !== productId));
  };

  const handleDone = () => {
    onSelectProducts(tempSelectedProductIds);
    onClose();
  };

  const availableProducts = products || [];

  const isAllFilteredSelected = filteredProducts.every(product =>
    tempSelectedProductIds.includes(String(product.id))
  );

  const handleSelectAllToggle = () => {
    if (isAllFilteredSelected) {
      // Deselect all filtered products
      const newSelection = tempSelectedProductIds.filter(id =>
        !filteredProducts.some(product => String(product.id) === id)
      );
      setTempSelectedProductIds(newSelection);
    } else {
      // Select all filtered products that are not already selected
      const newSelection = [
        ...tempSelectedProductIds,
        ...filteredProducts.map(product => String(product.id)).filter(id => !tempSelectedProductIds.includes(id))
      ];
      setTempSelectedProductIds(newSelection);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] h-[90vh] max-h-[90vh] flex flex-col">
        <DialogHeader className="p-4 pb-0">
          <div className="flex items-center justify-between">
            <DialogTitle>Assign Products</DialogTitle>
          </div>
        </DialogHeader>
        <div className="relative mb-4 px-4">
          <Input
            type="text"
            placeholder="Search products..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-6 top-2.5 h-4 w-4 text-muted-foreground" />
        </div>
        <ScrollArea className="flex-1 h-0 px-4">
          <div className="py-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">Selected Products</h3>
              {filteredProducts.length > 0 && (
                <Button variant="outline" size="sm" onClick={handleSelectAllToggle}>
                  {isAllFilteredSelected ? "Deselect All" : "Select All"}
                </Button>
              )}
            </div>
            <div className="flex flex-wrap gap-2 mb-6 min-h-[40px] border rounded-md p-2">
              {tempSelectedProductIds.length === 0 ? (
                <p className="text-sm text-muted-foreground">No products selected.</p>
              ) : (
                tempSelectedProductIds.map(id => {
                  const product = availableProducts.find(prod => String(prod.id) === id);
                  return product ? (
                    <Badge
                      key={id}
                      variant="secondary"
                      className="bg-purple-100 text-purple-700 hover:bg-purple-200 cursor-pointer flex items-center gap-1"
                      onClick={() => handleRemoveSelectedProduct(id)}
                    >
                      {product.name}
                      <X className="h-3 w-3 ml-1" />
                    </Badge>
                  ) : null;
                })
              )}
            </div>

            <h3 className="text-lg font-semibold mb-2">All Products</h3>
            {isLoading ? (
              <p className="text-center text-muted-foreground">Loading products...</p>
            ) : error ? (
              <p className="text-center text-destructive">Error loading products: {error.message}</p>
            ) : filteredProducts.length === 0 ? (
              <p className="text-center text-muted-foreground">No products found matching your search.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {filteredProducts.map(product => (
                  <Badge
                    key={product.id}
                    variant={tempSelectedProductIds.includes(String(product.id)) ? "default" : "outline"}
                    className={cn(
                      "cursor-pointer",
                      tempSelectedProductIds.includes(String(product.id))
                        ? "bg-purple-600 text-white hover:bg-purple-700"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    )}
                    onClick={() => handleProductToggle(String(product.id))}
                  >
                    {product.name}
                  </Badge>
                ))}
              </div>
            )}
          </div>
          <ScrollBar orientation="vertical" />
        </ScrollArea>
        <div className="flex justify-end gap-2 mt-4 p-4 border-t">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button className="bg-purple-600 hover:bg-purple-700 text-white" onClick={handleDone}>Done</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AssignProductsDialog;