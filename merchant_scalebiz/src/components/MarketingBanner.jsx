import React from "react";
import { cn } from "@/lib/utils";

const MarketingBanner = ({
  text,
  className,
}) => {
  if (!text) return null;

  return (
    <div
      className={cn("py-2 text-center text-sm font-medium text-white marketing-banner-gradient", className)}
    >
      <div className="container mx-auto px-4">
        {text}
      </div>
    </div>
  );
};

export default MarketingBanner;