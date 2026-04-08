"use client";

import React from "react";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Search, Plus } from "lucide-react";

const CategoryListHeader = ({ onAddCategoryClick, searchTerm, onSearchChange }) => {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
      <h1 className="text-2xl font-bold">Categories</h1>
      <div className="flex items-center gap-2">
        <div className="relative w-full max-w-sm">
          <Input
            type="text"
            placeholder="Search categories..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        </div>
        <Button onClick={onAddCategoryClick}>
          <Plus className="h-4 w-4 mr-2" />
          Add Categories
        </Button>
      </div>
    </div>
  );
};

export default CategoryListHeader;