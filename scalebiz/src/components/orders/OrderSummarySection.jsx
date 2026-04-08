"use client";

import React from "react";
import { CardContent } from "@/components/ui/card.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.jsx";
import CollapsibleCard from "@/components/ui/CollapsibleCard.jsx"; // Import CollapsibleCard

const OrderSummarySection = ({
  discountPercentage,
  setDiscountPercentage,
  vatTaxPercentage,
  setVatTaxPercentage,
  deliveryCharge,
  setDeliveryCharge,
  paidAmount,
  setPaidAmount,
  subtotal,
  discountAmount,
  vatTaxAmount,
  grandTotal,
  dueAmount,
}) => {
  return (
    <CollapsibleCard title="Order Summary">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div>
          <Label htmlFor="discountPercentage">Discount</Label>
          <p className="text-sm text-muted-foreground mb-1">Percentage (%)</p>
          <Input
            id="discountPercentage"
            type="number"
            value={discountPercentage}
            onChange={(e) => setDiscountPercentage(Number(e.target.value))}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="vatTaxPercentage">VAT/TAX</Label>
          <p className="text-sm text-muted-foreground mb-1">Percentage (%)</p>
          <Input
            id="vatTaxPercentage"
            type="number"
            value={vatTaxPercentage}
            onChange={(e) => setVatTaxPercentage(Number(e.target.value))}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="deliveryZone">Delivery</Label>
          <p className="text-sm text-muted-foreground mb-1">Delivery Zone</p>
          <Select value={String(deliveryCharge)} onValueChange={(value) => setDeliveryCharge(Number(value))}>
            <SelectTrigger>
              <SelectValue placeholder="Not Selected" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Not Selected (৳ 0)</SelectItem>
              <SelectItem value="80">Zone A (৳ 80)</SelectItem>
              <SelectItem value="120">Zone B (৳ 120)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="paymentStatus">Payment</Label>
          <p className="text-sm text-muted-foreground mb-1">Status</p>
          <Select defaultValue="Fully Paid">
            <SelectTrigger>
              <SelectValue placeholder="Fully Paid" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Fully Paid">Fully Paid</SelectItem>
              <SelectItem value="Partially Paid">Partially Paid</SelectItem>
              <SelectItem value="Unpaid">Unpaid</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Subtotal</p>
          <Input value={`৳ ${subtotal.toFixed(2)}`} readOnly className="bg-muted" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Discount Amount</p>
          <Input value={`৳ ${discountAmount.toFixed(2)}`} readOnly className="bg-muted" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Delivery Charge</p>
          <Input value={`৳ ${deliveryCharge.toFixed(2)}`} readOnly className="bg-muted" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Paid Amount</p>
          <Input
            type="number"
            value={paidAmount}
            onChange={(e) => setPaidAmount(Number(e.target.value))}
            className="mt-1"
          />
        </div>
      </div>

      <div className="flex justify-between items-center mt-4">
        <p className="text-destructive font-semibold">Due Amount: ৳ {dueAmount.toFixed(2)}</p>
        <p className="text-primary font-semibold">Grand Total: ৳ {grandTotal.toFixed(2)}</p>
      </div>
    </CollapsibleCard>
  );
};

export default OrderSummarySection;