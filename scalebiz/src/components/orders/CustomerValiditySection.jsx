"use client";

import React from "react";
import { CardContent } from "@/components/ui/card.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Switch } from "@/components/ui/switch.jsx";
import { Label } from "@/components/ui/label.jsx";
import { ShieldQuestion } from "lucide-react";
import { showInfo } from "@/utils/toast.js";
import CollapsibleCard from "@/components/ui/CollapsibleCard.jsx"; // Import CollapsibleCard

const CustomerValiditySection = () => {
  const handleCheckValidity = () => {
    showInfo("Checking customer validity...");
  };

  return (
    <CollapsibleCard title={<><ShieldQuestion className="h-5 w-5 text-muted-foreground mr-2" />Customer Validity</>}>
      <Button className="w-full mb-4" onClick={handleCheckValidity}>Let's check</Button>
      <div className="flex items-center justify-between">
        <Label htmlFor="fraud-toggle" className="text-sm">
          Mark this customer as a fraud?
          <p className="text-xs text-muted-foreground mt-1">
            Mark "Yes" depending on that persons behavior towards the order and be safe on future orders
          </p>
        </Label>
        <Switch id="fraud-toggle" />
      </div>
    </CollapsibleCard>
  );
};

export default CustomerValiditySection;