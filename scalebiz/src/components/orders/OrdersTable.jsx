"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.jsx";
import { Checkbox } from "@/components/ui/checkbox.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Eye, Pencil, Trash2 } from "lucide-react";

const OrdersTable = ({ orders, onViewClick, onEditClick, onDeleteClick }) => {
  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px] text-center">
              <Checkbox />
            </TableHead>
            <TableHead>Order Id</TableHead>
            <TableHead>Date & Time</TableHead>
            <TableHead>Customer Name</TableHead>
            <TableHead>Phone No.</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Order Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="h-24 text-center text-muted-foreground">
                No orders found.
              </TableCell>
            </TableRow>
          ) : (
            orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="text-center">
                  <Checkbox />
                </TableCell>
                <TableCell className="font-medium">{order.order_number}</TableCell>
                <TableCell>{new Date(order.created_at).toLocaleString()}</TableCell>
                <TableCell>{order.user_name || 'Guest'}</TableCell>
                <TableCell>{order.customer_phone}</TableCell>
                <TableCell>{order.items.reduce((acc, item) => acc + item.quantity, 0)}</TableCell>
                <TableCell>৳ {parseFloat(order.total_amount).toFixed(2)}</TableCell>
                <TableCell>
                  <Badge variant={order.status === "completed" ? "default" : "secondary"} className="capitalize">
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => onViewClick(order.id)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onEditClick(order.id)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => onDeleteClick(order.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default OrdersTable;