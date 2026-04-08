"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "@/lib/api";
import ProductCardFeaturedSidebar from "@/components/product-detail/ProductCardFeaturedSidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

// Helper function to chunk an array into smaller arrays
const chunkArray = (array, chunkSize) => {
  const chunks = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
};

const ProductFeaturedSection = ({ title = "Featured products", collectionId = "featured" }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const productsPerVerticalSlide = 3; // Display 3 products vertically per horizontal slide

  const { data: products, isLoading, error } = useQuery({
    queryKey: ['featuredProducts', collectionId],
    queryFn: () => fetchProducts({ collectionId, limit: 9 }), // Fetch enough products for 3 slides of 3
    staleTime: 1000 * 60 * 5,
  });

  // Chunk products into groups for vertical display within each horizontal slide
  const slides = products ? chunkArray(products, productsPerVerticalSlide) : [];
  const totalSlides = slides.length;

  const handlePrev = () => {
    setCurrentSlideIndex((prevIndex) => Math.max(0, prevIndex - 1));
  };

  const handleNext = () => {
    setCurrentSlideIndex((prevIndex) => Math.min(totalSlides - 1, prevIndex + 1));
  };

  if (isLoading) {
    return (
      <Card className="shadow-sm border-none">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold" style={{ color: `var(--dynamic-primary-color)`, fontFamily: `var(--dynamic-heading-font)` }}>{title}</h3>
            <div className="flex space-x-2">
              <Button variant="outline" size="icon" className="h-8 w-8" disabled>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="h-8 w-8" disabled>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="space-y-4"> {/* Vertical loading skeletons */}
            {Array.from({ length: productsPerVerticalSlide }).map((_, index) => (
              <div key={index} className="flex items-center space-x-3">
                <Skeleton className="h-24 w-24 rounded-md" />
                <div className="flex-grow space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !products || products.length === 0) {
    return null;
  }

  return (
    <Card className="shadow-sm border-none">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold" style={{ color: `var(--dynamic-primary-color)`, fontFamily: `var(--dynamic-heading-font)` }}>{title}</h3>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={handlePrev}
              disabled={currentSlideIndex === 0}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={handleNext}
              disabled={currentSlideIndex >= totalSlides - 1}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="overflow-hidden relative">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentSlideIndex * 100}%)` }}
          >
            {slides.map((slide, slideIndex) => (
              <div key={slideIndex} className="flex-shrink-0 w-full space-y-4"> {/* Each slide takes full width and stacks products vertically */}
                {slide.map((product) => (
                  <ProductCardFeaturedSidebar key={product.id} product={product} />
                ))}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductFeaturedSection;