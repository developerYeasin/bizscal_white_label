"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card.jsx";
import { Check, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils.js";

const ThemeCard = ({
  title,
  imageSrc,
  status,
  isSelected = false,
  myTheme = false,
  onSelect,
  themeId,
}) => {
  const cardClasses = cn(
    "relative overflow-hidden rounded-lg border-2 cursor-pointer transition-all duration-200",
    isSelected
      ? "border-purple-600"
      : "border-border hover:border-muted-foreground/50",
    status === "coming-soon" && "opacity-70 cursor-not-allowed"
  );

  return (
    <Card
      className={cardClasses}
      onClick={status !== "coming-soon" ? onSelect : undefined}
    >
      <CardContent className="p-0">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={title}
            className="w-full h-48 object-cover rounded-t-lg"
          />
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center text-white text-xl font-semibold rounded-t-lg">
            <Sparkles className="h-12 w-12 mr-2" />
            More themes coming
          </div>
        )}
        <div className="p-4 flex flex-col items-start justify-start">
          <h3 className="text-lg font-semibold">{title}</h3>
          {/* {isSelected && status === "active" && (
            <Check className="h-6 w-6 text-purple-600" />
          )} */}
          <div className="flex justify-between mt-2 w-full ">
            {myTheme ? <Check className="h-6 w-6 text-purple-600" /> : <p></p>}
            <span className="text-sm text-muted-foreground w-max capitalize ">
              {themeId}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ThemeCard;
