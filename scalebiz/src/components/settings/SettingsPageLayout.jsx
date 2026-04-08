"use client";

import React from "react";
import { Button } from "@/components/ui/button.jsx";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const SettingsPageLayout = ({ title, children }) => {
  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/manage-shop">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">{title}</h1>
      </div>
      {children}
    </div>
  );
};

export default SettingsPageLayout;