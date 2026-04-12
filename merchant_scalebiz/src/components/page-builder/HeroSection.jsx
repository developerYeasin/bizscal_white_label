"use client";

import React from "react";
import { cn } from "@/lib/utils.js";

/**
 * HeroSection - A hero section component
 */
const HeroSection = ({ data = {}, children = [], className = "" }) => {
  const {
    title = "Hero Section",
    subtitle = "",
    backgroundColor = "#ffffff",
    textColor = "#1f2937",
    padding = "large",
  } = data;

  // Padding sizes
  const paddingSizes = {
    small: "py-8 px-4",
    medium: "py-12 px-6",
    large: "py-16 px-8",
    xlarge: "py-20 px-10",
  };

  return (
    <section
      className={cn(
        "w-full",
        paddingSizes[padding] || paddingSizes.large,
        className
      )}
      style={{
        backgroundColor: backgroundColor,
      }}
    >
      <div className="text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: textColor }}>
          {title}
        </h2>
        {subtitle && (
          <p className="text-xl md:text-2xl mb-8" style={{ color: textColor }}>
            {subtitle}
          </p>
        )}
        {children}
      </div>
    </section>
  );
};

export default HeroSection;
