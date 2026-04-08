"use client";

import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useStorePath } from "@/hooks/use-store-path";
import { useTranslation } from "react-i18next"; // Import useTranslation

const NirvanaWhyWeAreBest = ({ data }) => { // Accept data prop
  const { t } = useTranslation(); // Initialize useTranslation
  const getPath = useStorePath();
  const { title, description } = data; // Destructure from data prop

  return (
    <section className="py-16 md:py-24 bg-black text-white">
      <div className="container mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="text-center md:text-left">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2" style={{ fontFamily: `var(--dynamic-heading-font)` }}>
            {title || t("why_we_are_best")} {/* This uses data.title, or the default if data.title is empty */}
          </h2>
          <p className="text-base sm:text-lg text-gray-300 max-w-lg mx-auto md:mx-0" style={{ fontFamily: `var(--dynamic-body-font)` }}>
            {description || t("fragrances_health_risks")} {/* This uses data.description, or the default if data.description is empty */}
          </p>
        </div>
        <Link to={getPath("/about")} className="flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-blue-500 hover:bg-blue-600 rounded-full transition-colors flex-shrink-0">
          <ArrowRight className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
        </Link>
      </div>
    </section>
  );
};

export default NirvanaWhyWeAreBest;