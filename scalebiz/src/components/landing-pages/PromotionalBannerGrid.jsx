import React from "react";
import { Button } from "@/components/ui/button.jsx";
import { Badge } from "@/components/ui/badge.jsx";

/**
 * Akira Theme - Promotional Banner Grid Component
 * Displays a 2x2 grid of promotional banners
 */
const PromotionalBannerGrid = ({ data }) => {
  const banners = data?.banners || [
    {
      imageUrl: "https://via.placeholder.com/400x300",
      title: "Fashion Month",
      subtitle: "Ready in Capital Shop",
      ctaButton: { text: "View All", link: "#" },
    },
    {
      imageUrl: "https://via.placeholder.com/400x300",
      title: "Catch the Sun",
      subtitle: "Summer Break Styles From $5.99",
      ctaButton: { text: "View All", link: "#" },
    },
    {
      imageUrl: "https://via.placeholder.com/400x300",
      title: "OFF SHOULDER RED DRESS",
      subtitle: "-20%",
      ctaButton: { text: "$99 | Shop Now", link: "#" },
    },
    {
      imageUrl: "https://via.placeholder.com/400x300",
      title: "Super Summer Sale",
      subtitle: "Limited Time Offer",
      ctaButton: { text: "View All", link: "#" },
    },
  ];

  return (
    <section className="py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {banners.map((banner, index) => (
          <div
            key={index}
            className="relative overflow-hidden rounded-lg group"
          >
            <img
              src={banner.imageUrl}
              alt={banner.title}
              className="w-full h-64 md:h-80 object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent">
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-white text-xl md:text-2xl font-bold mb-2">
                  {banner.title}
                </h3>
                <p className="text-gray-200 text-sm mb-4">{banner.subtitle}</p>
                <Button
                  variant="secondary"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {banner.ctaButton.text}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PromotionalBannerGrid;
