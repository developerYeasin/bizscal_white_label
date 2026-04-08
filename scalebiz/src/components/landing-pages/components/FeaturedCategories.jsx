"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils.js";

const FeaturedCategories = ({ data, className, themeConfig }) => {
  const { title, categories } = data;

  if (!categories || categories.length === 0) {
    return null;
  }

  const primaryColor = themeConfig?.primary_color || 'var(--dynamic-primary-color)';

  return (
    <section className={cn("py-8 md:py-12 bg-background", className)}>
      <div className="container mx-auto px-4 sm:px-6">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8" style={{ color: primaryColor, fontFamily: `var(--dynamic-heading-font)` }}>
          {title || "Featured Categories"}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {categories.map((category, index) => (
            <Link to={category.link} key={index} className="block">
              <Card className="h-full flex flex-col items-center text-center p-4 shadow-md hover:shadow-lg transition-shadow duration-300">
                <img
                  src={category.imageUrl || "https://picsum.photos/seed/category-placeholder/100/100"}
                  alt={category.name}
                  className="w-24 h-24 object-cover rounded-full mb-4"
                />
                <CardTitle className="text-lg font-semibold" style={{ fontFamily: `var(--dynamic-heading-font)` }}>
                  {category.name}
                </CardTitle>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCategories;