"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Truck, DollarSign, Users } from "lucide-react"; // Updated icons

const iconMap = {
  Star: Star,
  Truck: Truck,
  DollarSign: DollarSign,
  Users: Users,
  // Add more mappings as needed
};

const ProductFeatureBlocksOne = ({ data }) => { // Accept data prop
  const { features } = data; // Destructure features from data prop

  if (!features || features.length === 0) {
    return null;
  }

  return (
    <section className="py-12 md:py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8"> {/* Adjusted grid for 4 items */}
          {features.map((feature, index) => {
            const IconComponent = iconMap[feature.icon] || Star; // Default icon
            return (
              <Card key={index} className="text-center p-6 shadow-none border-none bg-transparent">
                <CardContent className="flex flex-col items-center justify-center p-0">
                  <div className="mb-4 p-3 rounded-full bg-gray-100 text-dynamic-primary-color">
                    <IconComponent className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2" style={{ fontFamily: `var(--dynamic-heading-font)` }}>
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
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

export default ProductFeatureBlocksOne;