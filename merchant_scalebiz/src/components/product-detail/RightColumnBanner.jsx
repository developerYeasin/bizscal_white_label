"use client";

import React from "react";
import { cn } from "@/lib/utils";

const PLACEHOLDER_IMAGE_URL =
  "https://akira-elementor.axonvip.com/modules/nrtpopupnewsletter/img/background_image3.jpg";

const RightColumnBanner = ({ bannerData, className }) => {
  // console.log("RightColumnBanner: bannerData:", bannerData);

  if (!bannerData || !bannerData.image) {
    // Fallback to a default banner if no data is provided
    return (
      <div
        className={cn(
          "w-full h-64 bg-cover bg-center rounded-lg flex items-center justify-center text-white text-center p-4",
          className
        )}
        style={{ backgroundImage: `url('${PLACEHOLDER_IMAGE_URL}')` }}
      >
        <div>
          <h3 className="text-2xl font-bold mb-2">NEW STYLE</h3>
          <p className="text-lg">UP TO 50% OFF</p>
        </div>
      </div>
    );
  }

  const { image, title, description } = bannerData;

  return (
    <div
      className={cn(
        "w-full h-72 bg-cover bg-center rounded-lg relative overflow-hidden flex items-center justify-center text-white text-center p-4",
        className
      )}
      style={{ backgroundImage: `url('${image}')` }}
    >
      <div className=" absolute top-0 left-0 right-0 bottom-0 bg-black opacity-20 "></div>

      <div className="absolute top-0 left-0 right-0 bottom-0 flex-col flex items-center justify-center">
        {title && <h3 className="text-2xl font-bold mb-2 bg-[#000] bg-opacity-50 p-2 px-4">{title}</h3>}
        {description && <p className="text-lg bg-[#000] bg-opacity-50 p-2 px-4">{description}</p>}
      </div>
    </div>
  );
};

export default RightColumnBanner;
