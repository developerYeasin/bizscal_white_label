import React from "react";
import { Button } from "@/components/ui/button.jsx";
import { Badge } from "@/components/ui/badge.jsx";

/**
 * Akira Theme - Features Trust Badges Component
 * Displays trust badges (free shipping, returns, support)
 */
const FeaturesTrustBadges = ({ data }) => {
  const badges = data?.badges || [
    {
      icon: "🚚",
      title: "Free Shipping",
      subtitle: "orders $50 or more",
    },
    {
      icon: "🔄",
      title: "Free Returns",
      subtitle: "within 30 days",
    },
    {
      icon: "ℹ️",
      title: "Get 20% Off 1 Item",
      subtitle: "when you sign up",
    },
    {
      icon: "💬",
      title: "We Support",
      subtitle: "24/7 amazing services",
    },
  ];

  return (
    <section className="py-6 bg-gray-50">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {badges.map((badge, index) => (
          <div
            key={index}
            className="flex flex-col items-center text-center p-4"
          >
            <span className="text-2xl mb-2">{badge.icon}</span>
            <h4 className="text-sm font-semibold text-gray-800 mb-1">
              {badge.title}
            </h4>
            <p className="text-xs text-gray-500">{badge.subtitle}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturesTrustBadges;
