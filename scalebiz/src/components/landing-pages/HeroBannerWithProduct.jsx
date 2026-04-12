import React from "react";
import { Button } from "@/components/ui/button.jsx";
import { Badge } from "@/components/ui/badge.jsx";

/**
 * Ghorer Bazar Theme - Hero Banner with Product Component
 * Large hero banner with product image
 */
const HeroBannerWithProduct = ({ data }) => {
  const {
    title = "আফ্রিকার ওয়াইল্ড অর্গানিক খাবার",
    subtitle = "এখন বাংলাদেশে",
    imageUrl = "https://via.placeholder.com/1200x500",
    phone = "09642922922",
    backgroundColor = "#FF9F1C",
    textColor = "#FFFFFF",
  } = data || {};

  return (
    <section
      className="py-8"
      style={{ backgroundColor }}
    >
      <div className="relative overflow-hidden rounded-lg">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-64 md:h-96 object-cover"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
          <h2 className="text-white text-3xl md:text-5xl font-bold mb-4" style={{ color: textColor }}>
            {title}
          </h2>
          <p className="text-white text-xl md:text-2xl font-semibold mb-4" style={{ color: textColor }}>
            {subtitle}
          </p>
          <div className="bg-white text-gray-800 px-6 py-3 rounded-lg font-bold text-lg">
            📞 {phone}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBannerWithProduct;
