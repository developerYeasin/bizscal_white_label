"use client";

import React from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";

/**
 * Dedicated layout for Page Builder
 *
 * Provides a clean, full-screen editing environment
 * without the regular admin sidebar/header.
 */
const PageBuilderLayout = ({ children }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-background">
      {/* Subtle top bar with back button */}
      <div className="h-10 border-b flex items-center px-4 flex-shrink-0 bg-background">
        <Button variant="ghost" size="sm" onClick={handleBack} className="h-8">
          <X className="h-4 w-4 mr-2" />
          Exit Builder
        </Button>
        <div className="ml-4 text-sm text-muted-foreground">
          Press <kbd className="px-2 py-0.5 bg-muted border rounded text-xs">Esc</kbd> to exit
        </div>
      </div>

      {/* Full-height children */}
      <div className="flex-1 overflow-hidden">
        {children}
      </div>
    </div>
  );
};

export default PageBuilderLayout;
