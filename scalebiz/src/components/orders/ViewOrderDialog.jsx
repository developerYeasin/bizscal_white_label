"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog.jsx";
import { useOrderById } from "@/hooks/use-orders.js";
import { Badge } from "@/components/ui/badge.jsx";
import { ScrollArea } from "@/components/ui/scroll-area.jsx";
import { Separator } from "@/components/ui/separator.jsx";

const ViewOrderDialog = ({ isOpen, onClose, orderId }) => {
  const { data: order, isLoading, error } = useOrderById(orderId);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl h-[90vh] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Order Details</DialogTitle>
          <DialogDescription>
            {isLoading ? "Loading..." : `Details for order #${order?.order_number}`}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="flex-1 h-0 pr-4">
          {isLoading && <p className="text-center">Loading order details...</p>}
          {error && <p className="text-center text-destructive">Error: {error.message}</p>}
          {order && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Customer Details</h3>
                  <p className="text-sm"><strong>Email:</strong> {order.customer_email}</p>
                  <p className="text-sm"><strong>Phone:</strong> {order.customer_phone}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Order Summary</h3>
                  <p className="text-sm"><strong>Status:</strong> <Badge className="capitalize">{order.status}</Badge></p>
                  <p className="text-sm"><strong>Payment Status:</strong> <Badge variant="secondary" className="capitalize">{order.payment_status}</Badge></p>
                  <p className="text-sm"><strong>Total:</strong> ৳{parseFloat(order.total_amount).toFixed(2)}</p>
                  <p className="text-sm"><strong>Date:</strong> {new Date(order.created_at).toLocaleString()}</p>
                </div>
              </div>
              <Separator />
              <div>
                <h3 className="font-semibold mb-2">Shipping Address</h3>
                <p className="text-sm">{order.shipping_address.street}, {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zip}, {order.shipping_address.country}</p>
              </div>
              <Separator />
              <div>
                <h3 className="font-semibold mb-2">Order Items ({order.items.length})</h3>
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <img src={item.image_url} alt={item.name} className="w-16 h-16 rounded-md object-cover" />
                      <div className="flex-1">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">SKU: {item.sku || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm">{item.quantity} x ৳{parseFloat(item.price_at_purchase).toFixed(2)}</p>
                        <p className="text-sm font-semibold text-right">৳{parseFloat(item.line_item_total).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ViewOrderDialog;