"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Expand } from "lucide-react";
import ProductImageSliderModal from "./ProductImageSliderModal";
import ImageZoom from "./ImageZoom"; // Import the new ImageZoom component

const PLACEHOLDER_IMAGE_URL =
  "https://via.placeholder.com/500x500?text=No+Image+Available";

const ProductImageGallery = ({ images, mainImage, setMainImage, enableZoom = true }) => { // Accept mainImage, setMainImage, and enableZoom
  // Remove internal state for mainImage, it's now controlled by parent
  // const [mainImage, setMainImage] = useState(images[0] || PLACEHOLDER_IMAGE_URL);
  const [isSliderModalOpen, setIsSliderModalOpen] = useState(false);

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-96 bg-muted flex items-center justify-center rounded-lg">
        <span className="text-muted-foreground">No Image Available</span>
      </div>
    );
  }

  const handleExpandClick = () => {
    setIsSliderModalOpen(true);
  };

  // When a thumbnail is clicked, call the passed setMainImage
  const handleThumbnailClick = (image) => {
    setMainImage(image);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image with optional Zoom */}
      <div className="group relative w-full aspect-square rounded-lg overflow-hidden">
        {enableZoom ? (
          <ImageZoom
            src={mainImage} // Use prop here
            largeSrc={mainImage} // Use prop here
            alt={"Main product image"}
          />
        ) : (
          <img
            src={mainImage}
            alt="Main product image"
            className="w-full h-full object-cover"
          />
        )}
        {/* Expand button */}
        <button
          className="absolute bottom-4 right-4 p-2 bg-background/80 rounded-full shadow-md hover:bg-background transition-colors z-10"
          onClick={handleExpandClick}
          aria-label="Expand image"
        >
          <Expand className="h-5 w-5 text-foreground" />
        </button>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              className={cn(
                "flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-colors",
                mainImage === image // Compare with prop
                  ? "border-dynamic-primary-color"
                  : "border-transparent hover:border-border"
              )}
              onClick={() => handleThumbnailClick(image)} // Use new handler
            >
              <img
                src={image}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Product Image Slider Modal */}
      <ProductImageSliderModal
        images={images}
        initialImage={mainImage} // Pass prop here
        isOpen={isSliderModalOpen}
        onClose={() => setIsSliderModalOpen(false)}
      />
    </div>
  );
};

export default ProductImageGallery;