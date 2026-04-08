"use client";

import React from "react";
import { Link } from "react-router-dom";
import ThemedButton from "./ThemedButton.jsx";

const HeroBanner = ({ data }) => {
  const { imageUrl, title, subtitle, ctaButton } = data;

  if (!imageUrl && !title) {
    return null;
  }

  return (
    <section
      className="relative w-full h-[400px] md:h-[500px] bg-cover bg-center flex items-center text-left"
      style={{ backgroundImage: `url(${imageUrl})` }}
    >
      <div className="absolute inset-0 bg-black/30"></div> {/* Overlay for text readability */}
      <div className="relative z-10 text-white p-4 pl-10 md:pl-20 max-w-2xl">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4" style={{ fontFamily: `var(--dynamic-heading-font)` }}>
          {title}
        </h1>
        <p className="text-md sm:text-lg md:text-xl mb-8" style={{ fontFamily: `var(--dynamic-body-font)` }}>
          {subtitle}
        </p>
        {ctaButton && ctaButton.link && ctaButton.text && (
          <Link to={ctaButton.link}>
            <ThemedButton>
              {ctaButton.text}
            </ThemedButton>
          </Link>
        )}
      </div>
    </section>
  );
};

export default HeroBanner;