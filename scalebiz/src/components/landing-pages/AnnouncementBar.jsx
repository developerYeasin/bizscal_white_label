import React from "react";
import { Button } from "@/components/ui/button.jsx";
import { Badge } from "@/components/ui/badge.jsx";

/**
 * Axon Theme - Announcement Bar Component
 * Top promotional bar with discount offer
 */
const AnnouncementBar = ({ data }) => {
  const {
    message = "Free shipping on orders over $50!",
    backgroundColor = "#FF6B6B",
    textColor = "#FFFFFF",
  } = data || {};

  return (
    <div
      className="bg-[#FF6B6B] text-white py-2 px-4 text-center text-sm font-medium"
      style={{ backgroundColor, color: textColor }}
    >
      <p className="flex items-center justify-center gap-2">
        <span className="font-bold">🎉</span>
        {message}
        <span className="font-bold">🎉</span>
      </p>
    </div>
  );
};

export default AnnouncementBar;
