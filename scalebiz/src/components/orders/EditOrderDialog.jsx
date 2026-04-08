"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog.jsx";
import { useOrderById, useOrders } from "@/hooks/use-orders.js";
import { Button } from "@/components/ui/button.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.jsx";

const EditOrderDialog = ({ isOpen, onClose, orderId }) => {
  const { data: order, isLoading, error } = useOrderById(orderId);
  const { updateOrder, isUpdating } = useOrders();
  const [status, setStatus] = React.useState("");

  React.useEffect(() => {
    if (order) {
      setStatus(order.status);
    }
  }, [order]);

  const handleSave = () => {
    updateOrder({ id: orderId, status: status }, {
      onSuccess: () => onClose()
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Order</DialogTitle>
          <DialogDescription>
            Update the status for order #{order?.order_number}.
          </DialogDescription>
        </DialogHeader>
        {isLoading && <p className="text-center py-4">Loading...</p>}
        {error && <p className="text-center py-4 text-destructive">Error: {error.message}</p>}
        {order && (
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select value={status} onValueChange={setStatus} className="col-span-3">
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={isUpdating || isLoading}>
            {isUpdating ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditOrderDialog;