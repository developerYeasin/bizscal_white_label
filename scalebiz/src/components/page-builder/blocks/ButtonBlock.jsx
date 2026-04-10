"use client";

import React from "react";
import { Button } from "@/components/ui/button.jsx";

/**
 * Button Block Component
 */
const ButtonBlock = ({ data }) => {
  const {
    text = "Click Me",
    url = "#",
    variant = "default", // default, outline, secondary, ghost, link, destructive
    size = "default", // sm, default, lg, icon
    align = "left", // left, center, right
    width = "auto", // auto, full
    marginTop = 0,
    marginBottom = 16,
    className = "",
  } = data || {};

  const containerStyle = {
    textAlign: align,
    marginTop: `${marginTop}px`,
    marginBottom: `${marginBottom}px`,
  };

  const buttonStyle = {
    width: width === "full" ? "100%" : "auto",
  };

  return (
    <div className={`button-block ${className}`} style={containerStyle}>
      <Button 
        variant={variant} 
        size={size} 
        style={buttonStyle}
        asChild
      >
        <a href={url}>{text}</a>
      </Button>
    </div>
  );
};

export default ButtonBlock;
