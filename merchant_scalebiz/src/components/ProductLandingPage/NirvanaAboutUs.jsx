"use client";

import React from "react";
import { Link } from "react-router-dom";
import ThemedButton from "@/components/ThemedButton";
import { Award, Leaf } from "lucide-react"; // Icons for feature cards
import { cn } from "@/lib/utils";
import { useStorePath } from "@/hooks/use-store-path";
import { useTranslation } from "react-i18next"; // Import useTranslation

const NirvanaAboutUs = ({ data }) => { // Accept data prop
  const { t } = useTranslation(); // Initialize useTranslation
  const getPath = useStorePath();
  const { title, description } = data; // Destructure from data prop

  return (
    <section className="py-16 md:py-24 bg-black text-white">
      <div className="container mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
        {/* Left Content */}
        <div className="space-y-4 sm:space-y-6 text-center lg:text-left">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 sm:mb-4" style={{ fontFamily: `var(--dynamic-heading-font)` }}>
            {title || t("about_us")}
          </h2>
          <p className="text-base sm:text-lg text-gray-300 max-w-md mx-auto lg:mx-0" style={{ fontFamily: `var(--dynamic-body-font)` }}>
            {description || t("perfume_enhances_mood")}
          </p>
          <div className="flex justify-center lg:justify-start">
            <Link to={getPath("/about")}>
              <ThemedButton className="px-8 py-3 text-lg bg-blue-500 hover:bg-blue-600 text-white">
                {t('explore_more')}
              </ThemedButton>
            </Link>
          </div>
        </div>

        {/* Right Feature Cards */}
        <div className="space-y-4 sm:space-y-6">
          <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg flex items-center space-x-4">
            <Leaf className="h-6 w-6 sm:h-8 sm:w-8 text-green-400" />
            <div>
              <h3 className="text-lg sm:text-xl font-semibold mb-1" style={{ fontFamily: `var(--dynamic-heading-font)` }}>{t('organic_product')}</h3>
              <p className="text-sm text-gray-400">{t('mask_of_perfection')}</p>
            </div>
          </div>
          <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg flex items-center space-x-4">
            <Award className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-400" />
            <div>
              <h3 className="text-lg sm:text-xl font-semibold mb-1" style={{ fontFamily: `var(--dynamic-heading-font)` }}>{t('best_brand_2021')}</h3>
              <p className="text-sm text-gray-400">{t('reflects_your_mood')}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NirvanaAboutUs;