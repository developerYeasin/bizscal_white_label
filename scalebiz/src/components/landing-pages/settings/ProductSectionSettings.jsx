"use client";

import React from "react";
import CollapsibleCard from "@/components/ui/CollapsibleCard.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.jsx";
import { Plus, X } from "lucide-react";
import { showError } from "@/utils/toast.js";

const cardTypeOptions = [
  { value: "default", label: "Default Card" },
  { value: "minimal", label: "Minimal Card" },
  { value: "overlay", label: "Overlay Card" },
  { value: "themeOne", label: "Theme One Card" },
  { value: "multiView", label: "Multi-View Card" },
  { value: "shophify", label: "Sophify Card" },
];

const ProductSectionSettings = ({ component, index, updateNested, isUpdating }) => { // Accept updateNested, isUpdating as props

  // This function updates a field directly within the component.data object
  const handleUpdateComponentDataField = (field, value, subfield = null) => {
    if (subfield) {
      updateNested(`data.${field}.${subfield}`, value); // Path relative to component.data
    } else {
      updateNested(`data.${field}`, value); // Path relative to component.data
    }
  };

  const handleAddTab = () => {
    const newTab = { id: Date.now(), label: "New Tab", query: { collectionId: "new-arrivals" } };
    const updatedTabs = [...(component.data.tabs || []), newTab];
    handleUpdateComponentDataField('tabs', updatedTabs);
  };

  const handleRemoveTab = (tabIdToRemove) => {
    const updatedTabs = (component.data.tabs || []).filter((tab) => tab.id !== tabIdToRemove);
    handleUpdateComponentDataField('tabs', updatedTabs);
    showError("Tab removed from local configuration.");
  };

  // NEW: Function to update a specific property within a tab by its full path
  const handleUpdateTabProperty = (tabId, propertyPath, value) => {
    const tabIndex = (component.data.tabs || []).findIndex(tab => tab.id === tabId);
    if (tabIndex === -1) return;

    updateNested(`data.tabs.${tabIndex}.${propertyPath}`, value); // Path relative to component.data
  };

  return (
    <CollapsibleCard
      title={`Product Section (ID: ${component.id})`}
    >
      <div className="grid gap-4">
        <div>
          <Label htmlFor={`product-section-title-${component.id}`}>Section Title</Label>
          <Input
            id={`product-section-title-${component.id}`}
            value={component.data.title || ''}
            onChange={(e) => handleUpdateComponentDataField('title', e.target.value)}
            placeholder="e.g., Featured Products"
            disabled={isUpdating}
          />
        </div>
        <div>
          <Label htmlFor={`product-section-display-${component.id}`}>Display Style</Label>
          <Select
            value={component.data.displayStyle || 'carousel'}
            onValueChange={(value) => handleUpdateComponentDataField('displayStyle', value)}
            disabled={isUpdating}
          >
            <SelectTrigger id={`product-section-display-${component.id}`}>
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
            <Label htmlFor={`product-section-grid-cols-${component.id}`}>Grid Columns (1-6)</Label>
            <Input
              id={`product-section-grid-cols-${component.id}`}
              type="number"
              min="1"
              max="6"
              value={component.data.gridCols || 4}
              onChange={(e) => handleUpdateComponentDataField('gridCols', parseInt(e.target.value))}
              placeholder="Number of columns for grid"
              disabled={isUpdating}
            />
          </div>
        )}
        <div>
          <Label htmlFor={`product-section-card-type-${component.id}`}>Card Type</Label>
          <Select
            value={component.data.cardType || 'default'}
            onValueChange={(value) => handleUpdateComponentDataField('cardType', value)}
            disabled={isUpdating}
          >
            <SelectTrigger id={`product-section-card-type-${component.id}`}>
              <SelectValue placeholder="Select Card Type" />
            </SelectTrigger>
            <SelectContent>
              {cardTypeOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <h3 className="text-lg font-semibold mt-4">Tabs (Optional)</h3>
        <p className="text-sm text-muted-foreground mb-2">
          If tabs are added, the "Product Query" below will be ignored.
        </p>
        <div className="space-y-4">
          {(component.data.tabs || []).map((tab) => (
            <div key={tab.id} className="border p-3 rounded-md relative">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 text-destructive hover:text-destructive"
                onClick={() => handleRemoveTab(tab.id)}
                disabled={isUpdating}
              >
                <X className="h-4 w-4" />
              </Button>
              <div>
                <Label htmlFor={`tab-label-${component.id}-${tab.id}`}>Tab Label</Label>
                <Input
                  id={`tab-label-${component.id}-${tab.id}`}
                  value={tab.label || ''}
                  onChange={(e) => handleUpdateTabProperty(tab.id, 'label', e.target.value)}
                  placeholder="e.g., New Arrivals"
                  disabled={isUpdating}
                />
              </div>
              <div className="mt-2">
                <Label htmlFor={`tab-query-${component.id}-${tab.id}`}>Tab Product Query</Label>
                <Select
                  value={tab.query?.collectionId || 'featured'}
                  onValueChange={(value) => handleUpdateTabProperty(tab.id, 'query.collectionId', value)}
                  disabled={isUpdating}
                >
                  <SelectTrigger id={`tab-query-${component.id}-${tab.id}`}>
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
            </div>
          ))}
        </div>
        <Button variant="outline" onClick={handleAddTab} disabled={isUpdating}>
          <Plus className="h-4 w-4 mr-2" />
          Add Tab
        </Button>

        {(component.data.tabs?.length === 0 || !component.data.tabs) && (
          <div className="mt-4">
            <Label htmlFor={`product-section-query-${component.id}`}>Product Query (if no tabs)</Label>
            <Select
              value={component.data.query?.collectionId || 'featured'}
              onValueChange={(value) => handleUpdateComponentDataField('query', value, 'collectionId')}
              disabled={isUpdating}
            >
              <SelectTrigger id={`product-section-query-${component.id}`}>
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
        )}
      </div>
    </CollapsibleCard>
  );
};

export default ProductSectionSettings;