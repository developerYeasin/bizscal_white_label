"use client";

import React from "react";
import { Button } from "@/components/ui/button.jsx";
import { ArrowLeft, X, Check } from "lucide-react";
import { Link } from "react-router-dom";

const CreateOrderHeader = ({ onCreateOrder }) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/orders">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Create Order</h1>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" className="text-destructive hover:text-destructive" asChild>
          <Link to="/orders">
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Link>
        </Button>
        <Button onClick={onCreateOrder}>
          <Check className="h-4 w-4 mr-2" />
          Create
        </Button>
      </div>
    </div>
  );
};

export default CreateOrderHeader;