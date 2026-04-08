"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible.jsx"; // Import Collapsible components
import { ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils.js";

const CollapsibleCard = ({ title, children, defaultCollapsed = false, className, headerClassName, contentClassName, titleClassName, iconClassName }) => {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);

  return (
    <Collapsible open={!isCollapsed} onOpenChange={() => setIsCollapsed(!isCollapsed)} className={cn("mb-6", className)}>
      <Card>
        <CollapsibleTrigger asChild>
          <CardHeader
            className={cn("flex flex-row items-center justify-between cursor-pointer", headerClassName)}
          >
            <CardTitle className={cn("text-lg font-semibold", titleClassName)}>{title}</CardTitle>
            <ChevronUp
              className={cn(
                "h-5 w-5 text-muted-foreground transition-transform duration-200",
                isCollapsed ? "rotate-180" : "rotate-0",
                iconClassName
              )}
            />
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent asChild>
          <CardContent className={cn("pt-0", contentClassName)}>
            {children}
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};

export default CollapsibleCard;