"use client";

import React from "react";
import { cn } from "@/lib/utils.js";

const MarqueeSection = ({ className, messages, backgroundColor, textColor }) => {
  if (!messages || messages.length === 0) {
    return null;
  }

  // The content for a single "cycle" of the marquee, including a trailing gap
  const singleMarqueeCycleContent = (
    <div className="flex items-center flex-shrink-0">
      {messages.map((message, index) => (
        <span key={index} className="inline-flex items-center justify-center mr-16"> {/* Add mr-16 for spacing */}
          {message}
        </span>
      ))}
    </div>
  );

  return (
    <section className={cn("overflow-hidden py-2", className)} style={{ backgroundColor: backgroundColor, color: textColor }}>
      <div className="relative w-full overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {singleMarqueeCycleContent}
          {singleMarqueeCycleContent}
          {singleMarqueeCycleContent}
          {singleMarqueeCycleContent}
          {singleMarqueeCycleContent}
          {singleMarqueeCycleContent}
          {singleMarqueeCycleContent}
          {singleMarqueeCycleContent}
          {singleMarqueeCycleContent}
          {singleMarqueeCycleContent}
          {singleMarqueeCycleContent}
          {singleMarqueeCycleContent}
        </div>
      </div>
    </section>
  );
};

export default MarqueeSection;