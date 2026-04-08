"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils.js";

const CategorySidebar = ({ data, className }) => {
  const { title, categories } = data;

  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <aside className={cn("py-8 md:py-12 bg-background", className)}>
      <div className="container mx-auto px-4 sm:px-6">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-xl font-bold" style={{ fontFamily: `var(--dynamic-heading-font)` }}>
              {title || "Categories (Dummy)"}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <nav>
              <ul className="space-y-1">
                {categories.map((category, index) => (
                  <li key={index}>
                    <Link
                      to={category.link}
                      className="flex items-center justify-between p-3 hover:bg-muted transition-colors text-foreground hover:text-dynamic-primary-color"
                    >
                      <span className="text-base">{category.name}</span>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </CardContent>
        </Card>
        <p className="text-center text-muted-foreground mt-4 text-sm">
          This is a dummy category sidebar. Actual categories would be listed here.
        </p>
      </div>
    </aside>
  );
};

export default CategorySidebar;