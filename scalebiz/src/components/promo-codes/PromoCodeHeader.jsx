"use client";

import React from "react";
import { Button } from "@/components/ui/button.jsx";
import { Plus } from "lucide-react";

const PromoCodeHeader = ({ onNewPromoCodeClick }) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-2xl font-bold">Promo Codes</h1>
      <Button onClick={onNewPromoCodeClick} className="bg-purple-600 hover:bg-purple-700 text-white">
        <Plus className="h-4 w-4 mr-2" />
        New Promo Code
      </Button>
    </div>
  );
};

export default PromoCodeHeader;