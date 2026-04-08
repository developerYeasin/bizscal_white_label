"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Search } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area.jsx";
import { showSuccess, showError } from "@/utils/toast.js";
import { useProducts } from "@/hooks/use-products.js";

const AddProductToOrderDialog = ({ isOpen, onClose, onAddProduct }) => {
  const { products, isLoading, error } = useProducts();
  const [searchTerm, setSearchTerm] = React.useState("");
  const [quantities, setQuantities] = React.useState({});

  const filteredProducts = React.useMemo(() => {
    if (!products) return [];
    return products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.sku && product.sku.toLowerCase().includes(searchTerm.toLowerCase())) ||
      String(product.id).includes(searchTerm)
    );
  }, [products, searchTerm]);

  const handleQuantityChange = (productId, value) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.max(0, Number(value))
    }));
  };

  const handleAddSelectedProducts = () => {
    const productsToAdd = filteredProducts.map(product => ({
      ...product,
      quantity: quantities[product.id] || 0
    })).filter(product => product.quantity > 0);

    productsToAdd.forEach(product => onAddProduct(product));
    setQuantities({});
    onClose();
  };

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[700px] h-[90vh] max-h-[90vh] flex flex-col">
          <DialogHeader className="p-4 pb-0">
            <DialogTitle>Add Products to Order</DialogTitle>
          </DialogHeader>
          <div className="flex-1 h-0 px-4 flex items-center justify-center">
            <p className="text-muted-foreground">Loading products...</p>
          </div>
          <div className="flex justify-end gap-2 mt-4 p-4 border-t">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (error) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[700px] h-[90vh] max-h-[90vh] flex flex-col">
          <DialogHeader className="p-4 pb-0">
            <DialogTitle>Add Products to Order</DialogTitle>
          </DialogHeader>
          <div className="flex-1 h-0 px-4 flex items-center justify-center">
            <p className="text-destructive">Error loading products: {error.message}</p>
          </div>
          <div className="flex justify-end gap-2 mt-4 p-4 border-t">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] h-[90vh] max-h-[90vh] flex flex-col">
        <DialogHeader className="p-4 pb-0">
          <DialogTitle>Add Products to Order</DialogTitle>
        </DialogHeader>
        <div className="relative mb-4 px-4">
          <Input
            type="text"
            placeholder="Search products by name or ID..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-6 top-2.5 h-4 w-4 text-muted-foreground" />
        </div>
        <ScrollArea className="flex-1 h-0 px-4">
          <div className="grid gap-4">
            {filteredProducts.length === 0 ? (
              <p className="text-center text-muted-foreground">No products found.</p>
            ) : (
              filteredProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between border p-3 rounded-md">
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-muted-foreground">
                      ID: {product.id} | Price: ৳ {parseFloat(product.price).toFixed(2)} | Stock: {product.stock_quantity}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label htmlFor={`quantity-${product.id}`} className="sr-only">Quantity</Label>
                    <Input
                      id={`quantity-${product.id}`}
                      type="number"
                      min="0"
                      max={product.stock_quantity}
                      value={quantities[product.id] || 0}
                      onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                      className="w-20 text-center"
                    />
                    <Button
                      size="sm"
                      onClick={() => onAddProduct({ ...product, quantity: quantities[product.id] || 0 })}
                      disabled={!quantities[product.id] || quantities[product.id] <= 0 || quantities[product.id] > product.stock_quantity}
                    >
                      Add
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
          <ScrollBar orientation="vertical" />
        </ScrollArea>
        <div className="flex justify-end gap-2 mt-4 p-4 border-t">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleAddSelectedProducts}>Add Selected Products</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddProductToOrderDialog;