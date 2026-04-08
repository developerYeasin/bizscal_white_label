"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils.js";
import ThemedButton from "./ThemedButton.jsx";

const MarketingBanner = ({ data, className }) => {
  const { imageUrl, title, subtitle, ctaButton } = data;

  if (!imageUrl && !title) {
    return null;
  }

  return (
    <section
      className={cn(
        "relative w-full h-64 md:h-80 bg-cover bg-center flex items-center justify-center text-center py-8",
        className
      )}
      style={{ backgroundImage: `url(${imageUrl || 'https://picsum.photos/seed/marketing-banner/1200/400'})` }}
    >
      <div className="absolute inset-0 bg-black/40"></div> {/* Dark overlay */}
      <div className="relative z-10 text-white px-4 max-w-2xl">
        <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ fontFamily: `var(--dynamic-heading-font)` }}>
          {title || "Marketing Banner (Dummy)"}
        </h2>
        {subtitle && (
          <p className="text-md mb-4">
            {subtitle}
          </p>
        )}
        {ctaButton && ctaButton.link && ctaButton.text && (
          <Link to={ctaButton.link}>
            <ThemedButton className="px-6 py-2">
              {ctaButton.text}
            </ThemedButton>
          </Link>
        )}
      </div>
    </section>
  );
};

export default MarketingBanner;