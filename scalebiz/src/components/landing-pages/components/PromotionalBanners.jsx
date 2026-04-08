"use client";

import React from "react";
import { Link } from "react-router-dom";
import ThemedButton from "./ThemedButton.jsx";
import { cn } from "@/lib/utils.js";

const colSpanClasses = {
  1: "col-span-1",
  2: "col-span-2",
  3: "col-span-3",
  4: "col-span-4",
  5: "col-span-5",
  6: "col-span-6",
  7: "col-span-7",
  8: "col-span-8",
  9: "col-span-9",
  10: "col-span-10",
  11: "col-span-11",
  12: "col-span-12",
};

const PromotionalBanners = ({ data, className }) => {
  const { banners } = data;

  if (!banners || banners.length === 0) {
    return null;
  }

  return (
    <section className={cn("py-8 md:py-12 bg-background", className)}>
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-12 gap-6">
          {" "}
          {/* Use a 12-column grid */}
          {banners.map((banner, index) => (
            <div
              key={index}
              className={cn(
                "relative bg-cover bg-center flex items-center p-8 col-span-12 md:h-96 overflow-hidden group transition-transform duration-300",
                banner.size === "large" ? "h-80 md:h-96" : "h-64",
                `${
                  banner?.sm_span
                    ? colSpanClasses[banner?.sm_span]
                    : "col-span-6"
                }`,
                banner.position === "left"
                  ? "justify-start text-left"
                  : "justify-end text-right"
              )}
              style={{ backgroundImage: `url(${banner.imageUrl})` }}
            >
              <div className="absolute inset-0 bg-black/20"></div>{" "}
              {/* Overlay for text readability */}
              <div
                className={cn(
                  "relative z-10 text-white",
                  banner.position === "left" ? "pr-1/3" : "pl-1/3"
                )}
              >
                {banner.pretitle && (
                  <p className="text-sm font-medium uppercase tracking-widest mb-1 text-gray-200">
                    {banner.pretitle}
                  </p>
                )}
                <h3
                  className="text-2xl md:text-3xl font-bold mb-2 leading-tight"
                  style={{ fontFamily: `var(--dynamic-heading-font)` }}
                >
                  {banner.title}
                </h3>
                {banner.subtitle && (
                  <p className="text-sm md:text-base mb-4">{banner.subtitle}</p>
                )}
                {banner.ctaButton &&
                  banner.ctaButton.link &&
                  banner.ctaButton.text && (
                    <Link to={banner.ctaButton.link}>
                      <ThemedButton
                        variant="secondary"
                        className="bg-white text-dynamic-primary-color hover:bg-gray-100"
                      >
                        {banner.ctaButton.text}
                      </ThemedButton>
                    </Link>
                  )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PromotionalBanners;
