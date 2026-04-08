import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import HeroBanner from "./HeroBanner";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const HeroSlider = ({ data }) => {
  const { banners } = data;

  if (!banners || banners.length === 0) {
    return null;
  }

  return (
    <section className="relative w-full">
      <Swiper
        effect={"slide"}
        speed={800} // Slowing down the transition for a smoother feel
        spaceBetween={0}
        autoplay={{
          delay: 5000,
          disableOnInteraction: true, // Stops autoplay when user interacts
          pauseOnMouseEnter: true,    // Pauses autoplay when the user hovers over the slider
        }}
        pagination={{
          clickable: true,
          // Removed horizontalClass as it caused an error with multiple class names.
          // Swiper automatically applies 'swiper-pagination-horizontal' and 'swiper-pagination-bullets'.
        }}
        navigation={true}
        loop={true}
        grabCursor={true}
        modules={[Autoplay, Pagination, Navigation]}
        // className="mySwiper h-[300px] sm:h-[400px] md:h-[600px]"
        className="mySwiper"
      >
        {banners.map((banner, index) => (
          <SwiperSlide key={index}>
            <HeroBanner data={banner} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default HeroSlider;