"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Expand } from "lucide-react";
import ProductImageSliderModal from "./ProductImageSliderModal";
import ImageZoom from "./ImageZoom"; // Import the new ImageZoom component

const ProductImageGallery = ({ images }) => {
  const [mainImage, setMainImage] = useState(images[0] || "");
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

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image with Zoom */}
      <div className="group relative w-full aspect-square rounded-lg overflow-hidden">
        <ImageZoom src={mainImage} alt="Main product image" />
        
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
                mainImage === image ? "border-dynamic-primary-color" : "border-transparent hover:border-border"
              )}
              onClick={() => setMainImage(image)}
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
        initialImage={mainImage}
        isOpen={isSliderModalOpen}
        onClose={() => setIsSliderModalOpen(false)}
      />
    </div>
  );
};

export default ProductImageGallery;