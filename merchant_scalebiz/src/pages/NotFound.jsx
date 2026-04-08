"use client";

import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import React from "react";
import { Link } from "react-router-dom";
import { useStorePath } from "@/hooks/use-store-path";
import { useTranslation } from "react-i18next";
import NotFoundIllustrationV2 from "@/components/NotFoundIllustrationV2"; // Import the new illustration

const NotFound = () => {
  const location = useLocation();
  const getPath = useStorePath();
  const { t } = useTranslation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="bg-gray-50  h-screen w-screen overflow-auto flex justify-center items-center flex-col ">
      <div className="text-center flex items-center justify-center max-w-[90%] w-[650px] ">
        {/* SVG Illustration and Animation */}
        <NotFoundIllustrationV2 />
      </div>
      <div className="">
        <div class="flex flex-col items-center text-[#031816] text-[16px] md:text-[22px] font-[500] text-center px-3">
          <a target="_blank" href="https://bizscal.com">
            {t('get_ecommerce_website_today')}{" "}
            <span class="underline">bizscal.com</span>.
          </a>
        </div>
      </div>
    </div>
  );
};

export default NotFound;