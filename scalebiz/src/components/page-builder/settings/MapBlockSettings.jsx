"use client";

import React, { useCallback } from "react";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Plus, Trash2 } from "lucide-react";

/**
 * Map Block Settings
 *
 * Configure map provider, location, markers, and appearance.
 */
const MapBlockSettings = ({ component, updateNested, isUpdating }) => {
  const { data } = component;

  const handleChange = useCallback((field, value) => {
    updateNested(`data.${field}`, value);
  }, [updateNested]);

  const handleCenterChange = useCallback((field, value) => {
    const center = { ...data.center, [field]: parseFloat(value) || 0 };
    updateNested("data.center", center);
  }, [data.center, updateNested]);

  const handleMarkerChange = useCallback((index, field, value) => {
    const markers = [...(data.markers || [])];
    markers[index] = { ...markers[index], [field]: value };
    updateNested("data.markers", markers);
  }, [data.markers, updateNested]);

  const addMarker = () => {
    const newMarker = {
      lat: data.center?.lat || 0,
      lng: data.center?.lng || 0,
      label: "Location",
      info: "",
    };
    updateNested("data.markers", [...(data.markers || []), newMarker]);
  };

  const removeMarker = (index) => {
    const markers = data.markers?.filter((_, i) => i !== index) || [];
    updateNested("data.markers", markers);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-xs">Map Provider</Label>
        <Select
          value={data.provider || "openstreetmap"}
          onValueChange={(val) => handleChange("provider", val)}
          disabled={isUpdating}
        >
          <SelectTrigger className="h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="openstreetmap">OpenStreetMap</SelectItem>
            <SelectItem value="google">Google Maps</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {data.provider === "google" && (
        <div className="space-y-2">
          <Label className="text-xs">Google API Key</Label>
          <Input
            type="password"
            value={data.apiKey || ""}
            onChange={(e) => handleChange("apiKey", e.target.value)}
            placeholder="AIza..."
            className="h-8"
            disabled={isUpdating}
          />
        </div>
      )}

      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <Label className="text-xs">Latitude</Label>
          <Input
            type="number"
            step="any"
            value={data.center?.lat || ""}
            onChange={(e) => handleCenterChange("lat", e.target.value)}
            className="h-8"
            disabled={isUpdating}
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Longitude</Label>
          <Input
            type="number"
            step="any"
            value={data.center?.lng || ""}
            onChange={(e) => handleCenterChange("lng", e.target.value)}
            className="h-8"
            disabled={isUpdating}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-xs">Zoom Level</Label>
        <Input
          type="number"
          min="1"
          max="20"
          value={data.zoom || 14}
          onChange={(e) => handleChange("zoom", parseInt(e.target.value))}
          className="h-8"
          disabled={isUpdating}
        />
      </div>

      <div className="space-y-2">
        <Label className="text-xs">Map Height</Label>
        <Input
          value={data.height || "400px"}
          onChange={(e) => handleChange("height", e.target.value)}
          placeholder="400px"
          className="h-8"
          disabled={isUpdating}
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs">Markers</Label>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 text-xs"
            onClick={addMarker}
            disabled={isUpdating}
          >
            <Plus className="h-3 w-3 mr-1" /> Add
          </Button>
        </div>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {(data.markers || []).map((marker, index) => (
            <div key={index} className="p-2 border rounded bg-muted/30 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">Marker {index + 1}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => removeMarker(index)}
                  disabled={isUpdating}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-1">
                <Input
                  type="number"
                  step="any"
                  value={marker.lat || ""}
                  onChange={(e) => handleMarkerChange(index, "lat", e.target.value)}
                  className="h-7 text-xs"
                  placeholder="Lat"
                  disabled={isUpdating}
                />
                <Input
                  type="number"
                  step="any"
                  value={marker.lng || ""}
                  onChange={(e) => handleMarkerChange(index, "lng", e.target.value)}
                  className="h-7 text-xs"
                  placeholder="Lng"
                  disabled={isUpdating}
                />
              </div>
              <Input
                value={marker.label || ""}
                onChange={(e) => handleMarkerChange(index, "label", e.target.value)}
                className="h-7 text-xs"
                placeholder="Label"
                disabled={isUpdating}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MapBlockSettings;
