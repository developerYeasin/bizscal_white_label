"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { format } from "date-fns";

const OrderReportGridList = ({ orders }) => {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold mb-4">Orders ({orders.length})</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {orders.length === 0 ? (
          <div className="col-span-full text-center text-muted-foreground h-24 flex items-center justify-center">
            No orders found for this period.
          </div>
        ) : (
          orders.map((order) => (
            <Card key={order.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-lg">#{order.id}</span>
                  <span className="text-sm text-muted-foreground">
                    {order.created_at ? format(new Date(order.created_at), "dd/MM/yyyy | hh:mm a") : "N/A"}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-muted-foreground">Items: {order.items}</span>
                  <span className="text-sm text-muted-foreground">Price: ৳{parseFloat(order.total_amount).toFixed(2)}</span>
                </div>
                <div className="flex gap-2">
                  {/* Assuming 'Online' as a default type, adjust if API provides it */}
                  <Badge variant="secondary" className="bg-purple-100 text-purple-700 hover:bg-purple-100">
                    Online
                  </Badge>
                  <Badge variant={order.status === "cancelled" ? "destructive" : "default"} className="capitalize">
                    {order.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default OrderReportGridList;