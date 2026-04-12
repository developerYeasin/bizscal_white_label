"use client";

import React from "react";
import { cn } from "@/lib/utils.js";

/**
 * CardLayout - A beautiful card-based layout component
 * Supports multiple columns with customizable content
 */
const CardLayout = ({ data = {}, children = [], className = "" }) => {
  const {
    title = "Card Layout",
    subtitle = "",
    columns = 3,
    gap = "medium",
    backgroundColor = "#ffffff",
    padding = "large",
    borderRadius = "medium",
    shadow = "medium",
    border = false,
    borderColor = "#e5e7eb",
  } = data;

  // Gap sizes
  const gapSizes = {
    small: "gap-2",
    medium: "gap-4",
    large: "gap-6",
    xlarge: "gap-8",
  };

  // Padding sizes
  const paddingSizes = {
    small: "p-4",
    medium: "p-6",
    large: "p-8",
    xlarge: "p-10",
  };

  // Border radius sizes
  const radiusSizes = {
    none: "rounded-none",
    small: "rounded-sm",
    medium: "rounded-lg",
    large: "rounded-xl",
    xlarge: "rounded-2xl",
    full: "rounded-full",
  };

  // Shadow sizes
  const shadowSizes = {
    none: "shadow-none",
    small: "shadow-sm",
    medium: "shadow-md",
    large: "shadow-lg",
    xlarge: "shadow-xl",
  };

  return (
    <div
      className={cn(
        "w-full",
        className
      )}
      style={{
        backgroundColor: backgroundColor,
      }}
    >
      {(title || subtitle) && (
        <div className="mb-6 text-center">
          {title && (
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
          )}
          {subtitle && (
            <p className="text-gray-600">{subtitle}</p>
          )}
        </div>
      )}

      <div
        className={cn(
          "grid",
          gapSizes[gap] || gapSizes.medium,
          paddingSizes[padding] || paddingSizes.large,
          radiusSizes[borderRadius] || radiusSizes.medium,
          shadowSizes[shadow] || shadowSizes.medium,
          border && `border-2 ${borderColor ? `border-[${borderColor}]` : "border-gray-200"}`,
          columns === 1 && "grid-cols-1",
          columns === 2 && "grid-cols-1 sm:grid-cols-2",
          columns === 3 && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
          columns === 4 && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
          columns === 5 && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-5",
          columns === 6 && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6"
        )}
      >
        {children}
      </div>
    </div>
  );
};

export default CardLayout;
