"use client";

import React from "react";
import { cn } from "@/lib/utils.js";

/**
 * ReadyMadeSection - A pre-built section component with common layouts
 * Supports: Hero, Features, Testimonials, Pricing, FAQ, Team, Contact, CTA
 */
const ReadyMadeSection = ({ data = {}, children = [], className = "" }) => {
  const {
    sectionType = "hero",
    title = "Section Title",
    subtitle = "",
    backgroundColor = "#ffffff",
    textColor = "#1f2937",
    padding = "large",
    gap = "medium",
  } = data;

  // Padding sizes
  const paddingSizes = {
    small: "py-8 px-4",
    medium: "py-12 px-6",
    large: "py-16 px-8",
    xlarge: "py-20 px-10",
  };

  // Gap sizes
  const gapSizes = {
    small: "gap-4",
    medium: "gap-6",
    large: "gap-8",
    xlarge: "gap-10",
  };

  // Render different section types
  const renderSection = () => {
    switch (sectionType) {
      case "hero":
        return (
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
        );

      case "features":
        return (
          <div>
            {(title || subtitle) && (
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: textColor }}>
                  {title}
                </h2>
                {subtitle && (
                  <p className="text-lg text-muted-foreground" style={{ color: textColor }}>
                    {subtitle}
                  </p>
                )}
              </div>
            )}
            <div className={cn("grid", gapSizes[gap] || gapSizes.medium)}>
              {children}
            </div>
          </div>
        );

      case "testimonials":
        return (
          <div>
            {(title || subtitle) && (
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: textColor }}>
                  {title}
                </h2>
                {subtitle && (
                  <p className="text-lg text-muted-foreground" style={{ color: textColor }}>
                    {subtitle}
                  </p>
                )}
              </div>
            )}
            <div className={cn("grid", gapSizes[gap] || gapSizes.medium)}>
              {children}
            </div>
          </div>
        );

      case "pricing":
        return (
          <div>
            {(title || subtitle) && (
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: textColor }}>
                  {title}
                </h2>
                {subtitle && (
                  <p className="text-lg text-muted-foreground" style={{ color: textColor }}>
                    {subtitle}
                  </p>
                )}
              </div>
            )}
            <div className={cn("grid", gapSizes[gap] || gapSizes.medium)}>
              {children}
            </div>
          </div>
        );

      case "faq":
        return (
          <div>
            {(title || subtitle) && (
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: textColor }}>
                  {title}
                </h2>
                {subtitle && (
                  <p className="text-lg text-muted-foreground" style={{ color: textColor }}>
                    {subtitle}
                  </p>
                )}
              </div>
            )}
            <div className="max-w-3xl mx-auto">
              {children}
            </div>
          </div>
        );

      case "team":
        return (
          <div>
            {(title || subtitle) && (
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: textColor }}>
                  {title}
                </h2>
                {subtitle && (
                  <p className="text-lg text-muted-foreground" style={{ color: textColor }}>
                    {subtitle}
                  </p>
                )}
              </div>
            )}
            <div className={cn("grid", gapSizes[gap] || gapSizes.medium)}>
              {children}
            </div>
          </div>
        );

      case "contact":
        return (
          <div>
            {(title || subtitle) && (
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: textColor }}>
                  {title}
                </h2>
                {subtitle && (
                  <p className="text-lg text-muted-foreground" style={{ color: textColor }}>
                    {subtitle}
                  </p>
                )}
              </div>
            )}
            <div className="max-w-2xl mx-auto">
              {children}
            </div>
          </div>
        );

      case "cta":
        return (
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: textColor }}>
              {title}
            </h2>
            {subtitle && (
              <p className="text-lg mb-8" style={{ color: textColor }}>
                {subtitle}
              </p>
            )}
            {children}
          </div>
        );

      default:
        return (
          <div>
            {(title || subtitle) && (
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: textColor }}>
                  {title}
                </h2>
                {subtitle && (
                  <p className="text-lg text-muted-foreground" style={{ color: textColor }}>
                    {subtitle}
                  </p>
                )}
              </div>
            )}
            <div className={cn("grid", gapSizes[gap] || gapSizes.medium)}>
              {children}
            </div>
          </div>
        );
    }
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
      {renderSection()}
    </section>
  );
};

export default ReadyMadeSection;
