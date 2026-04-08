"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Truck, ShieldCheck, Star, Zap } from "lucide-react"; // Example icons
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next"; // Import useTranslation

const iconMap = {
  Truck: Truck,
  ShieldCheck: ShieldCheck,
  Star: Star,
  Zap: Zap,
  // Add more mappings as needed if other icon names are used in the data
};

const NirvanaWhyChooseUs = ({ data }) => {
  const { t } = useTranslation(); // Initialize useTranslation
  const { title, features } = data;

  if (!features || features.length === 0) {
    return null;
  }

  return (
    <section className="py-12 md:py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-8 sm:mb-12" style={{ fontFamily: `var(--dynamic-heading-font)` }}>
          {title || t("why_choose_us")}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {features.map((feature, index) => {
            const IconComponent = iconMap[feature.icon] || Star; // Default to Star if icon not found
            return (
              <Card key={index} className="p-4 sm:p-6 shadow-md hover:shadow-lg transition-shadow duration-300 text-center">
                <CardContent className="flex flex-col items-center justify-center p-0">
                  <div className="mb-3 sm:mb-4 p-2 sm:p-3 rounded-full bg-blue-50 text-blue-600">
                    <IconComponent className="h-6 w-6 sm:h-8 sm:w-8" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2" style={{ fontFamily: `var(--dynamic-heading-font)` }}>
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default NirvanaWhyChooseUs;