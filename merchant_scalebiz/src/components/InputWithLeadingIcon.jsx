"use client";

import React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

const InputWithLeadingIcon = React.forwardRef(
  ({ className, icon: Icon, ...props }, ref) => {
    return (
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-0 top-0 bottom-0 flex items-center justify-center w-12 bg-muted rounded-l-md border border-r-0 border-input text-muted-foreground">
            <Icon className="h-5 w-5" />
          </div>
        )}
        <Input
          className={cn(
            "pl-14", // Adjust padding to make space for the icon
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);
InputWithLeadingIcon.displayName = "InputWithLeadingIcon";

export default InputWithLeadingIcon;