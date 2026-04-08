"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card.jsx";
import { Badge } from "@/components/ui/badge.jsx";

const BillingCard = ({
  shopName,
  amount,
  status,
  paymentType,
  startDate,
  endDate,
  invoiceId,
}) => {
  return (
    <Card className="mb-4 relative">
      <CardContent className="p-4">
        {invoiceId && (
          <Badge variant="secondary" className="absolute top-4 right-4 bg-purple-100 text-purple-700 hover:bg-purple-100">
            {invoiceId}
          </Badge>
        )}
        <h2 className="text-lg font-bold mb-2">{shopName}</h2>
        <p className="text-sm text-muted-foreground mb-1">
          <span className="font-semibold text-foreground">Amount :</span> {amount}
        </p>
        <p className="text-sm text-muted-foreground mb-1">
          <span className="font-semibold text-foreground">Status :</span> {status}
        </p>
        <p className="text-sm text-muted-foreground mb-1">
          <span className="font-semibold text-foreground">Payment type:</span> {paymentType}
        </p>
        <p className="text-sm text-muted-foreground mb-1">
          <span className="font-semibold text-foreground">Date(start):</span> {startDate}
        </p>
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">Date(end):</span> {endDate}
        </p>
      </CardContent>
    </Card>
  );
};

export default BillingCard;