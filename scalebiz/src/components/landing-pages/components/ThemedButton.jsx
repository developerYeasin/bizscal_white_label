"use client";

import React from "react";
import { Button } from "@/components/ui/button.jsx";
import { cn } from "@/lib/utils.js";

const ThemedButton = ({ children, variant = "default", className, ...props }) => {
  const baseClasses = "transition-colors duration-200";
  const defaultClasses = "bg-dynamic-primary-color text-dynamic-secondary-color hover:brightness-110";
  const secondaryClasses = "bg-dynamic-secondary-color text-dynamic-primary-color hover:brightness-90";

  const getVariantClasses = () => {
    switch (variant) {
      case "secondary":
        return secondaryClasses;
      default:
        return defaultClasses;
    }
  };

  return (
    <Button className={cn(baseClasses, getVariantClasses(), className)} {...props}>
      {children}
    </Button>
  );
};

export default ThemedButton;