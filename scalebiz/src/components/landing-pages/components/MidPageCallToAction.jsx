"use client";

import React from "react";
import { Link } from "react-router-dom";
import ThemedButton from "./ThemedButton.jsx";
import { cn } from "@/lib/utils.js";

const MidPageCallToAction = ({ data, className }) => {
  const { imageUrl, pretitle, title, subtitle, ctaButton } = data;

  if (!imageUrl && !title) {
    return null;
  }

  return (
    <section
      className={cn(
        "relative w-full h-[300px] md:h-[400px] bg-cover bg-center flex items-center justify-center text-center py-12",
        className
      )}
      style={{ backgroundImage: `url(${imageUrl})` }}
    >
      <div className="absolute inset-0 bg-black/40"></div> {/* Dark overlay */}
      <div className="relative z-10 text-white px-4 max-w-3xl">
        {pretitle && (
          <p className="text-sm md:text-base font-medium uppercase tracking-widest mb-2 text-gray-200">
            {pretitle}
          </p>
        )}
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight" style={{ fontFamily: `var(--dynamic-heading-font)` }}>
          {title}
        </h2>
        {subtitle && (
          <p className="text-md sm:text-lg mb-8">
            {subtitle}
          </p>
        )}
        {ctaButton && ctaButton.link && ctaButton.text && (
          <Link to={ctaButton.link}>
            <ThemedButton className="px-8 py-3 text-lg">
              {ctaButton.text}
            </ThemedButton>
          </Link>
        )}
      </div>
    </section>
  );
};

export default MidPageCallToAction;