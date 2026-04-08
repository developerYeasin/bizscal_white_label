"use client";

import React from "react";
import { CardContent } from "@/components/ui/card.jsx";
import { Textarea } from "@/components/ui/textarea.jsx";
import CollapsibleCard from "@/components/ui/CollapsibleCard.jsx"; // Import CollapsibleCard

const OrderAddNoteSection = ({ note, setNote }) => {
  return (
    <CollapsibleCard title="Add Note">
      <Textarea placeholder="Order Note" rows={5} value={note} onChange={(e) => setNote(e.target.value)} />
    </CollapsibleCard>
  );
};

export default OrderAddNoteSection;