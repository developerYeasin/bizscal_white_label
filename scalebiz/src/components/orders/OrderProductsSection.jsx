"use client";

import React from "react";
import { CardContent } from "@/components/ui/card.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Plus, X } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table.jsx";
import CollapsibleCard from "@/components/ui/CollapsibleCard.jsx"; // Import CollapsibleCard

const OrderProductsSection = ({ orderProducts, onAddProductClick, onRemoveProduct }) => {
  return (
    <CollapsibleCard title="Products">
      {orderProducts.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">No products have been added to the order yet</p>
          <Button variant="outline" onClick={onAddProductClick}>
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>
      ) : (
        <>
          <div className="rounded-md border overflow-x-auto mb-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orderProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.quantity}</TableCell>
                    <TableCell>৳ {product.price.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => onRemoveProduct(product.id)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <Button variant="outline" onClick={onAddProductClick}>
            <Plus className="h-4 w-4 mr-2" />
            Add More Products
          </Button>
        </>
      )}
    </CollapsibleCard>
  );
};

export default OrderProductsSection;