"use client";

import React, { useState, useEffect, useRef } from "react";
import CustomModal from "./CustomModal"; // NEW IMPORT
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Zoom } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/zoom"; // Import zoom styles
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ProductImageSliderModal = ({ images, initialImage, isOpen, onClose }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const swiperRef = useRef(null);

  useEffect(() => {
    if (isOpen && swiperRef.current && swiperRef.current.swiper) {
      const initialIndex = images.indexOf(initialImage);
      if (initialIndex !== -1) {
        swiperRef.current.swiper.slideTo(initialIndex, 0); // Go to initial image without animation
        setCurrentSlideIndex(initialIndex);
      }
    }
  }, [isOpen, initialImage, images]);

  const handleSlideChange = (swiper) => {
    setCurrentSlideIndex(swiper.realIndex);
  };

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      fullScreen={true} // Use fullScreen prop
      className="bg-black/30 backdrop-blur-sm flex items-center justify-center border-none rounded-none overflow-hidden" // Keep specific styling, remove size/position
    >
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Close Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 z-50 text-white hover:bg-white/20"
          onClick={onClose}
          aria-label="Close"
        >
          <X className="h-6 w-6" />
          <span className="sr-only">Close</span>
        </Button>

        {/* Current Image Count */}
        <div className="absolute top-4 left-4 z-50 text-white text-lg font-semibold">
          {currentSlideIndex + 1}/{images.length}
        </div>

        <Swiper
          ref={swiperRef}
          modules={[Navigation, Pagination, Zoom]}
          spaceBetween={10}
          slidesPerView={1}
          navigation={{
            prevEl: ".swiper-button-prev-custom",
            nextEl: ".swiper-button-next-custom",
          }}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          zoom={true} // Enable zoom
          loop={true}
          grabCursor={true} // Added grabCursor for drag indication
          onSlideChange={handleSlideChange}
          className="w-full h-full"
        >
          {images.map((image, index) => (
            <SwiperSlide
              key={index}
              className="flex items-center justify-center"
            >
              <div className="swiper-zoom-container">
                {" "}
                {/* Container for zoom */}
                <img
                  src={image}
                  alt={`Product image ${index + 1}`}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Navigation Buttons */}
        <Button
          variant="ghost"
          size="icon"
          className="swiper-button-prev-custom absolute left-4 top-1/2 -translate-y-1/2 z-50 flex"
        >
          <ChevronLeft className="h-8 w-8" />
          <span className="sr-only">Previous</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="swiper-button-next-custom absolute right-4 top-1/2 -translate-y-1/2 z-50 flex"
        >
          <ChevronRight className="h-8 w-8" />
          <span className="sr-only">Next</span>
        </Button>
      </div>
    </CustomModal>
  );
};

export default ProductImageSliderModal;