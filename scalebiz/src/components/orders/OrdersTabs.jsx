"use client";

import React from "react";
import { Button } from "@/components/ui/button.jsx";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area.jsx";
import { cn } from "@/lib/utils.js";

const orderStatuses = [
  "All Orders",
  "Order Placed",
  "Order Confirmed",
  "Order Shipped",
  "Order Delivered",
  "Order Completed",
  "Order Cancelled",
  "Order Returned",
  "Payment C", // This seems like a typo, keeping as is for now.
];

const OrdersTabs = ({ activeTab, setActiveTab }) => {
  return (
    <div className="mb-6">
      <ScrollArea className="w-full whitespace-nowrap rounded-md border">
        <div className="flex w-max space-x-4 p-4">
          {orderStatuses.map((status) => (
            <Button
              key={status}
              variant="ghost"
              className={cn(
                "px-4 py-2 rounded-md text-sm",
                activeTab === status
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
              onClick={() => setActiveTab(status)}
            >
              {status}
            </Button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};

export default OrdersTabs;