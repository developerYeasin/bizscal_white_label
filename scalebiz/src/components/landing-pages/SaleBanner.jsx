import React from "react";
import { Button } from "@/components/ui/button.jsx";
import { Badge } from "@/components/ui/badge.jsx";

/**
 * Akira Theme - Sale Banner Component
 * Large promotional banner with discount percentage
 */
const SaleBanner = ({ data }) => {
  const {
    title = "New Season Sale",
    subtitle = "40% OFF",
    ctaButton = { text: "SHOP NOW", link: "#" },
    imageUrl = "https://via.placeholder.com/1200x400",
    backgroundColor = "#1a1a1a",
  } = data || {};

  return (
    <section className="py-8">
      <div
        className="relative overflow-hidden rounded-lg group"
        style={{ backgroundColor }}
      >
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-64 md:h-80 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent">
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
            <h2 className="text-white text-2xl md:text-3xl font-bold mb-2">
              {title}
            </h2>
            <p className="text-white text-4xl md:text-5xl font-bold mb-4">
              {subtitle}
            </p>
            <Button
              variant="secondary"
              className="bg-white hover:bg-gray-100 text-gray-900"
            >
              {ctaButton.text}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SaleBanner;
