"use client";

import React from "react";
import { Link } from "react-router-dom";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel.jsx";
import Autoplay from "embla-carousel-autoplay";
import ThemedButton from "./ThemedButton.jsx";
import { cn } from "@/lib/utils.js";

const HeroBannerSlider = ({ data, themeConfig, className }) => {
  const { banners } = data;

  if (!banners || banners.length === 0) {
    return null;
  }

  const autoplayPlugin = React.useRef(
    Autoplay({
      delay: 4000, // Adjust delay as needed
      stopOnInteraction: false,
      stopOnMouseEnter: true,
    })
  );

  return (
    <section className={cn("relative w-full overflow-hidden", className)}>
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        plugins={[autoplayPlugin.current]}
        className="w-full"
      >
        <CarouselContent>
          {banners.map((banner, index) => (
            <CarouselItem key={banner.id || index}>
              <div
                className="relative w-full h-[400px] md:h-[500px] bg-cover bg-center flex items-center text-left"
                style={{ backgroundImage: `url(${banner.imageUrl})` }}
              >
                <div className="absolute inset-0 bg-black/30"></div> {/* Overlay for text readability */}
                <div className="relative z-10 text-white p-4 pl-10 md:pl-20 max-w-2xl">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4" style={{ fontFamily: `var(--dynamic-heading-font)` }}>
                    {banner.title}
                  </h1>
                  <p className="text-md sm:text-lg md:text-xl mb-8" style={{ fontFamily: `var(--dynamic-body-font)` }}>
                    {banner.subtitle}
                  </p>
                  {banner.ctaButton && banner.ctaButton.link && banner.ctaButton.text && (
                    <Link to={banner.ctaButton.link}>
                      <ThemedButton>
                        {banner.ctaButton.text}
                      </ThemedButton>
                    </Link>
                  )}
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-10" />
        <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-10" />
      </Carousel>
    </section>
  );
};

export default HeroBannerSlider;