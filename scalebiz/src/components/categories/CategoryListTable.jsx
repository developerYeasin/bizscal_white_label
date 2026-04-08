"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.jsx";
import { Image, Eye, Pencil, Trash2, Copy } from "lucide-react"; // Import Copy icon
import { Button } from "@/components/ui/button.jsx";
import { showInfo } from "@/utils/toast.js";

const CategoryListTable = ({ categories, onEditCategoryClick, onDeleteCategory, onDuplicateCategory }) => { // Add onDuplicateCategory
  const handleViewCategory = (categoryId) => {
    showInfo(`Viewing category ${categoryId}`);
  };

  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px] text-center">
              <Image className="h-5 w-5 text-muted-foreground mx-auto" />
            </TableHead>
            <TableHead>Categories</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Total Subcategory</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                No categories found.
              </TableCell>
            </TableRow>
          ) : (
            categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell className="text-center">
                  <div className="w-8 h-8 rounded-md flex items-center justify-center mx-auto overflow-hidden">
                    <img src={category.image_url || "https://via.placeholder.com/40x40?text=No+Image"} alt={category.name} className="w-full h-full object-cover" />
                  </div>
                </TableCell>
                <TableCell className="font-medium">{category.name}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{category.description || "N/A"}</TableCell>
                <TableCell>{category.sub_categories?.length || 0}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => handleViewCategory(category.id)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onEditCategoryClick(category)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDuplicateCategory(category.id)} // Use the passed handler
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => onDeleteCategory(category)}> {/* Pass the full category object */}
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default CategoryListTable;