"use client";

import React from "react";
import CollapsibleCard from "@/components/ui/CollapsibleCard.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.jsx";
import { X } from "lucide-react";

const cardTypeOptions = [
  { value: "default", label: "Default Card" },
  { value: "minimal", label: "Minimal Card" },
  { value: "overlay", label: "Overlay Card" },
  { value: "themeOne", label: "Theme One Card" },
  { value: "multiView", label: "Multi-View Card" },
  { value: "shophify", label: "Sophify Card" },
];

const ProductCarouselSettings = ({ component, index, updateNested, isUpdating }) => { // Accept updateNested, isUpdating as props

  // Updated handleUpdateField to directly construct the path for nested properties
  const handleUpdateField = (propertyPath, value) => {
    updateNested(`data.${propertyPath}`, value); // Path relative to component.data
  };

  return (
    <CollapsibleCard
      title={`Product Carousel (ID: ${component.id})`}
    >
      <div className="grid gap-4">
        <div>
          <Label htmlFor={`product-carousel-title-${component.id}`}>Title</Label>
          <Input
            id={`product-carousel-title-${component.id}`}
            value={component.data.title || ''}
            onChange={(e) => handleUpdateField('title', e.target.value)}
            placeholder="Section Title"
            disabled={isUpdating}
          />
        </div>
        <div>
          <Label htmlFor={`product-carousel-query-${component.id}`}>Product Query</Label>
          <Select
            value={component.data.query?.collectionId || 'featured'}
            onValueChange={(value) => handleUpdateField('query.collectionId', value)}
            disabled={isUpdating}
          >
            <SelectTrigger id={`product-carousel-query-${component.id}`}>
              <SelectValue placeholder="Select Product Collection" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Featured Products</SelectItem>
              <SelectItem value="best-sellers">Best Sellers</SelectItem>
              <SelectItem value="new-arrivals">New Arrivals</SelectItem>
              <SelectItem value="sale">Sale Products</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor={`product-carousel-display-${component.id}`}>Display Style</Label>
          <Select
            value={component.data.displayStyle || 'carousel'}
            onValueChange={(value) => handleUpdateField('displayStyle', value)}
            disabled={isUpdating}
          >
            <SelectTrigger id={`product-carousel-display-${component.id}`}>
              <SelectValue placeholder="Select Display Style" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="carousel">Carousel</SelectItem>
              <SelectItem value="grid">Grid</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {component.data.displayStyle === 'grid' && (
          <div>
            <Label htmlFor={`product-carousel-grid-cols-${component.id}`}>Grid Columns (1-6)</Label>
            <Input
              id={`product-carousel-grid-cols-${component.id}`}
              type="number"
              min="1"
              max="6"
              value={component.data.gridCols || 4}
              onChange={(e) => handleUpdateField('gridCols', parseInt(e.target.value))}
              placeholder="Number of columns for grid"
              disabled={isUpdating}
            />
          </div>
        )}
        <div>
          <Label htmlFor={`product-carousel-card-type-${component.id}`}>Card Type</Label>
          <Select
            value={component.data.cardType || 'default'}
            onValueChange={(value) => handleUpdateField('cardType', value)}
            disabled={isUpdating}
          >
            <SelectTrigger id={`product-carousel-card-type-${component.id}`}>
              <SelectValue placeholder="Select Card Type" />
            </SelectTrigger>
            <SelectContent>
              {cardTypeOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </CollapsibleCard>
  );
};

export default ProductCarouselSettings;