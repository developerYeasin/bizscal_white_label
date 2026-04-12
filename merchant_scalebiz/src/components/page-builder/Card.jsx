"use client";

import React from "react";
import { cn } from "@/lib/utils.js";

/**
 * Card - A beautiful card component with image and button
 */
const Card = ({ data = {}, children = "", className = "" }) => {
  const {
    title = "Card Title",
    description = "Card description text goes here...",
    imageUrl = "",
    buttonText = "Learn More",
    buttonLink = "#",
    buttonStyle = "primary",
    imagePosition = "top",
    padding = "medium",
    borderRadius = "medium",
    shadow = "medium",
  } = data;

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
  };

  // Shadow sizes
  const shadowSizes = {
    none: "shadow-none",
    small: "shadow-sm",
    medium: "shadow-md",
    large: "shadow-lg",
    xlarge: "shadow-xl",
  };

  // Button styles
  const buttonStyles = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
    outline: "border-2 border-blue-600 text-blue-600 hover:bg-blue-50",
    ghost: "text-blue-600 hover:bg-blue-50",
  };

  return (
    <div
      className={cn(
        "bg-white rounded-lg overflow-hidden flex flex-col",
        radiusSizes[borderRadius] || radiusSizes.medium,
        shadowSizes[shadow] || shadowSizes.medium,
        className
      )}
    >
      {/* Image */}
      {imageUrl && imagePosition === "top" && (
        <div className="w-full h-48 bg-gray-100 overflow-hidden">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Content */}
      <div className={cn("flex flex-col flex-1", paddingSizes[padding] || paddingSizes.medium)}>
        {/* Title */}
        {title && (
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {title}
          </h3>
        )}

        {/* Description */}
        {description && (
          <p className="text-sm text-gray-600 mb-4 flex-1">
            {description}
          </p>
        )}

        {/* Button */}
        {buttonText && (
          <a
            href={buttonLink}
            className={cn(
              "inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md transition-colors",
              buttonStyles[buttonStyle] || buttonStyles.primary
            )}
          >
            {buttonText}
          </a>
        )}

        {/* Children (for custom content) */}
        {children && !imageUrl && imagePosition === "bottom" && (
          <div className="mt-4">
            {children}
          </div>
        )}
      </div>

      {/* Image at bottom */}
      {imageUrl && imagePosition === "bottom" && (
        <div className="w-full h-48 bg-gray-100 overflow-hidden">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
    </div>
  );
};

export default Card;
