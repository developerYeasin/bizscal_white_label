"use client";

import React, { useState, useRef } from "react";
import { cn } from "@/lib/utils";

const ImageZoom = ({ src, alt, zoomLevel = 2 }) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [backgroundPosition, setBackgroundPosition] = useState("0% 0%");
  const containerRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;

    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = (e.pageX - left) / width;
    const y = (e.pageY - top) / height;

    setBackgroundPosition(`${x * 100}% ${y * 100}%`);
  };

  const handleMouseEnter = () => {
    setIsZoomed(true);
  };

  const handleMouseLeave = () => {
    setIsZoomed(false);
    setBackgroundPosition("0% 0%"); // Reset position when not zoomed
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full h-full overflow-hidden rounded-lg border border-border",
        isZoomed ? "cursor-zoom-in" : "cursor-default" // Custom cursor class
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      <img
        src={src}
        alt={alt}
        className={cn(
          "w-full h-full object-cover transition-opacity duration-300 ease-in-out",
          isZoomed ? "opacity-0" : "opacity-100" // Hide original image when zoomed
        )}
      />
      {isZoomed && (
        <div
          className="absolute inset-0 bg-no-repeat"
          style={{
            backgroundImage: `url(${src})`,
            backgroundSize: `${zoomLevel * 100}%`,
            backgroundPosition: backgroundPosition,
          }}
        />
      )}
    </div>
  );
};

export default ImageZoom;