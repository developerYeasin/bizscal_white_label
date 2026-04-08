"use client";

import React from "react";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Search, Plus, ShoppingCart, User } from "lucide-react";
import { Badge } from "@/components/ui/badge.jsx";
import { Link } from "react-router-dom";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area.jsx";
import { cn } from "@/lib/utils.js";
import { showInfo } from "@/utils/toast.js";

const ProductListHeader = ({ activeCategory, setActiveCategory, searchTerm, onSearchChange, totalProducts, productCategories }) => {
  return (
    <div className="flex flex-col gap-4 mb-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">All Products</h1>
          <Badge variant="secondary" className="text-sm">{totalProducts}</Badge>
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative w-full max-w-sm">
            <Input
              type="text"
              placeholder="Search products..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          </div>
          <Button asChild>
            <Link to="/products/add">
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Link>
          </Button>
          <Button variant="ghost" size="icon" className="relative" onClick={() => showInfo("Shopping cart clicked")}>
            <ShoppingCart className="h-5 w-5" />
            <Badge className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 text-xs">0</Badge>
          </Button>
          <Button variant="ghost" size="icon" className="relative" onClick={() => showInfo("User profile clicked")}>
            <User className="h-5 w-5" />
            <Badge className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 text-xs">0</Badge>
          </Button>
        </div>
      </div>
      <ScrollArea className="w-full whitespace-nowrap rounded-md border">
        <div className="flex w-max space-x-4 p-4">
          {productCategories.map((category) => (
            <Button
              key={category}
              variant="ghost"
              className={cn(
                "px-4 py-2 rounded-md text-sm",
                activeCategory === category
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};

export default ProductListHeader;