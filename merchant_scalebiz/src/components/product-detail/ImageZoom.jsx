"use client";

import React, { useState, useRef } from "react";
import { cn } from "@/lib/utils";

const PLACEHOLDER_IMAGE_URL =
  "https://via.placeholder.com/500x500?text=No+Image+Available";

const ImageZoom = ({ src, alt }) => {
  const finalSrc = src || PLACEHOLDER_IMAGE_URL;
  const [zoomVisible, setZoomVisible] = useState(false);
  const [backgroundPosition, setBackgroundPosition] = useState("0% 0%");
  const imageContainerRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!imageContainerRef.current) return;

    const { left, top, width, height } =
      imageContainerRef.current.getBoundingClientRect();
    const x = (e.pageX - left) / width;
    const y = (e.pageY - top) / height;

    // Calculate background position for the zoomed image
    // This creates a "magnifying glass" effect where the background image moves opposite to the cursor
    const bgX = x * 100;
    const bgY = y * 100;

    setBackgroundPosition(`${bgX}% ${bgY}%`);
    setZoomVisible(true);
  };

  const handleMouseLeave = () => {
    setZoomVisible(false);
  };

  return (
    <div
      ref={imageContainerRef}
      className="relative w-full aspect-square rounded-lg overflow-hidden cursor-zoom-in"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Main image */}
      {/* <img
        src={finalSrc}
        alt={alt}
        className="w-full h-full object-contain "
      /> */}
      <div
        className="absolute inset-0 bg-no-repeat bg-cover bg-center pointer-events-none z-10"
        style={{
          backgroundImage: `url(${finalSrc})`,
        }}
      />

      {/* Zoomed image overlay */}
      {zoomVisible && (
        <div
          className="absolute inset-0 bg-no-repeat bg-cover pointer-events-none z-10"
          style={{
            backgroundImage: `url(${finalSrc})`,
            backgroundSize: "200%", // Adjust zoom level here (e.g., 200% for 2x zoom)
            backgroundPosition: backgroundPosition,
            transform: "scale(1.01)", // A slight scale to ensure it covers the original image perfectly
            transition: "transform 0.1s ease-out", // Smooth transition for the scale
          }}
        />
      )}
    </div>
  );
};

export default ImageZoom;
