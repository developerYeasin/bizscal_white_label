"use client";

import React from "react";
import { CardContent } from "@/components/ui/card.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Textarea } from "@/components/ui/textarea.jsx";
import CollapsibleCard from "@/components/ui/CollapsibleCard.jsx"; // Import CollapsibleCard

const CustomerInformationSection = ({ name, setName, email, setEmail, phone, setPhone, address, setAddress }) => {
  return (
    <CollapsibleCard title="Customer Information">
      <div className="grid gap-4">
        <div>
          <Label htmlFor="customerName">Customer Name</Label>
          <Input id="customerName" placeholder="Customer Name" className="mt-1" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="customerEmail">Customer Email</Label>
          <Input id="customerEmail" placeholder="Customer Email" className="mt-1" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="customerPhone">Customer Phone <span className="text-destructive">*</span></Label>
          <Input id="customerPhone" placeholder="Customer Phone" className="mt-1" value={phone} onChange={(e) => setPhone(e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="customerAddress">Customer Address</Label>
          <Textarea id="customerAddress" placeholder="Customer Address" className="mt-1" value={address} onChange={(e) => setAddress(e.target.value)} />
        </div>
      </div>
    </CollapsibleCard>
  );
};

export default CustomerInformationSection;