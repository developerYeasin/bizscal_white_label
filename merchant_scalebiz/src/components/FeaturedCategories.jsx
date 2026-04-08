import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { useStorePath } from "@/hooks/use-store-path";

const FeaturedCategories = ({ data }) => {
  const { title, categories } = data;
  const getPath = useStorePath();

  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <section className="py-8 md:py-12 px-4 sm:px-6 bg-muted">
      <div className="container px-0 sm:px-4 mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8" style={{ color: `var(--dynamic-primary-color)`, fontFamily: `var(--dynamic-heading-font)` }}>
          {title}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category, index) => (
            <Link to={getPath(category.link)} key={index}>
              <Card className="rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                <img
                  src={category.imageUrl}
                  alt={category.name}
                  className="w-full h-32 sm:h-48 object-cover"
                />
                <CardContent className="p-3 sm:p-4 text-center">
                  <h3 className="text-md md:text-lg font-semibold text-foreground" style={{ fontFamily: `var(--dynamic-heading-font)` }}>
                    {category.name}
                  </h3>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCategories;