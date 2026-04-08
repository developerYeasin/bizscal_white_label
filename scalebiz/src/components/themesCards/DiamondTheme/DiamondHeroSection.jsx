import React from "react";
import { Link } from "react-router-dom";
import ThemedButton from "@/components/ThemedButton";
import { cn } from "@/lib/utils";

const DiamondHeroSection = ({ data, className }) => {
  const { imageUrl, pretitle, title, subtitle, ctaButton } = data;

  return (
    <section
      className={cn(
        "relative w-full h-[500px] md:h-[650px] bg-cover bg-center flex items-center text-left",
        className
      )}
      style={{ backgroundImage: `url(${imageUrl})` }}
    >
      <div className="absolute inset-0 bg-black/10"></div> {/* Subtle overlay */}
      <div className="relative z-10 text-white p-4 pl-8 md:pl-20 max-w-2xl">
        {pretitle && (
          <p className="text-sm md:text-base font-medium uppercase tracking-widest mb-2 text-gray-200">
            {pretitle}
          </p>
        )}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 leading-tight" style={{ fontFamily: `var(--dynamic-heading-font)` }}>
          {title}
        </h1>
        {subtitle && (
          <p className="text-md sm:text-lg md:text-xl mb-8 max-w-md" style={{ fontFamily: `var(--dynamic-body-font)` }}>
            {subtitle}
          </p>
        )}
        {ctaButton && (
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

export default DiamondHeroSection;