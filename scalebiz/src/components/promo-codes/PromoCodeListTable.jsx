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
import { Badge } from "@/components/ui/badge.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Pencil, Trash2 } from "lucide-react";
import { format } from "date-fns";

const PromoCodeListTable = ({ coupons, onEditClick, onDeleteClick }) => {
  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Code</TableHead>
            <TableHead>Discount</TableHead>
            <TableHead>Min Spend</TableHead>
            <TableHead>Usage Limit</TableHead>
            <TableHead>Times Used</TableHead>
            <TableHead>Active</TableHead>
            <TableHead>Valid From</TableHead>
            <TableHead>Valid Until</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {coupons.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="h-24 text-center text-muted-foreground">
                No promo codes found.
              </TableCell>
            </TableRow>
          ) : (
            coupons.map((coupon) => (
              <TableRow key={coupon.id}>
                <TableCell className="font-medium">{coupon.code}</TableCell>
                <TableCell>
                  {coupon.discount_value}
                  {coupon.discount_type === "percent" ? "%" : " BDT"}
                </TableCell>
                <TableCell>BDT {parseFloat(coupon.minimum_spend).toFixed(2)}</TableCell>
                <TableCell>
                  {coupon.usage_limit_per_coupon ? `${coupon.usage_limit_per_coupon} (total)` : "N/A"}
                  {coupon.usage_limit_per_customer && ` / ${coupon.usage_limit_per_customer} (per customer)`}
                </TableCell>
                <TableCell>{coupon.times_used}</TableCell>
                <TableCell>
                  <Badge variant={coupon.is_active ? "default" : "secondary"}>
                    {coupon.is_active ? "Yes" : "No"}
                  </Badge>
                </TableCell>
                <TableCell>
                  {coupon.valid_from ? format(new Date(coupon.valid_from), "dd/MM/yyyy") : "N/A"}
                </TableCell>
                <TableCell>
                  {coupon.valid_until ? format(new Date(coupon.valid_until), "dd/MM/yyyy") : "N/A"}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => onEditClick(coupon)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => onDeleteClick(coupon.id)}>
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

export default PromoCodeListTable;