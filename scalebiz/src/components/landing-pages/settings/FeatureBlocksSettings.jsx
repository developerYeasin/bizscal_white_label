"use client";

import React from "react";
import CollapsibleCard from "@/components/ui/CollapsibleCard.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Textarea } from "@/components/ui/textarea.jsx";
import { Plus, X, Truck, RefreshCcw, ShieldCheck, Star, Gift, Headset } from "lucide-react";
import { showError } from "@/utils/toast.js";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.jsx";

const iconOptions = [
  { value: 'truck', label: 'Truck (Delivery)' },
  { value: 'refresh', label: 'Refresh (Returns)' },
  { value: 'shield', label: 'Shield (Security)' },
  { value: 'star', label: 'Star (Quality)' },
  { value: 'gift', label: 'Gift (Offers)' },
  { value: 'headset', label: 'Headset (Support)' },
];

const FeatureBlocksSettings = ({ component, index, updateNested, isUpdating }) => { // Accept updateNested, isUpdating as props

  const handleUpdateField = (field, value) => {
    console.log(`FeatureBlocksSettings: Updating field: ${field}, value: ${value}`);
    updateNested(`data.${field}`, value); // Path relative to component.data
  };

  const handleAddFeature = () => {
    const newFeature = { id: Date.now(), icon: "truck", title: "New Feature", description: "Description of new feature." }; // Assign unique ID
    const updatedFeatures = [...(component.data.features || []), newFeature];
    handleUpdateField('features', updatedFeatures);
  };

  const handleRemoveFeature = (featIdToRemove) => {
    const updatedFeatures = (component.data.features || []).filter((feature) => feature.id !== featIdToRemove);
    handleUpdateField('features', updatedFeatures);
    showError("Feature removed from local configuration.");
  };

  const handleUpdateFeatureField = (featId, field, value) => {
    console.log(`FeatureBlocksSettings: Updating feature ${featId} field: ${field}, value: ${value}`);
    const updatedFeatures = [...(component.data.features || [])].map((feature) =>
      feature.id === featId ? { ...feature, [field]: value } : feature
    );
    handleUpdateField('features', updatedFeatures);
  };

  return (
    <CollapsibleCard
      title={`Feature Blocks (ID: ${component.id})`}
    >
      <div className="grid gap-4">
        <h3 className="text-lg font-semibold mt-4">Features</h3>
        <div className="space-y-4">
          {(component.data.features || []).map((feature) => (
            <div key={feature.id} className="border p-3 rounded-md relative"> {/* Use unique ID for key */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 text-destructive hover:text-destructive"
                onClick={() => handleRemoveFeature(feature.id)}
                disabled={isUpdating}
              >
                <X className="h-4 w-4" />
              </Button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`feature-icon-${component.id}-${feature.id}`}>Icon</Label>
                  <Select
                    value={feature.icon || 'truck'}
                    onValueChange={(value) => handleUpdateFeatureField(feature.id, 'icon', value)}
                    disabled={isUpdating}
                  >
                    <SelectTrigger id={`feature-icon-${component.id}-${feature.id}`}>
                      <SelectValue placeholder="Select Icon" />
                    </SelectTrigger>
                    <SelectContent>
                      {iconOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor={`feature-title-${component.id}-${feature.id}`}>Title</Label>
                  <Input
                    id={`feature-title-${component.id}-${feature.id}`}
                    value={feature.title || ''}
                    onChange={(e) => handleUpdateFeatureField(feature.id, 'title', e.target.value)}
                    placeholder="Feature Title"
                    disabled={isUpdating}
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor={`feature-description-${component.id}-${feature.id}`}>Description</Label>
                  <Textarea
                    id={`feature-description-${component.id}-${feature.id}`}
                    value={feature.description || ''}
                    onChange={(e) => handleUpdateFeatureField(feature.id, 'description', e.target.value)}
                    placeholder="Feature Description"
                    disabled={isUpdating}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        <Button variant="outline" onClick={handleAddFeature} disabled={isUpdating}>
          <Plus className="h-4 w-4 mr-2" />
          Add Feature
        </Button>
      </div>
    </CollapsibleCard>
  );
};

export default FeatureBlocksSettings;