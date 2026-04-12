"use client";

import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Input } from "@/components/ui/input.jsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.jsx";
import { Button } from "@/components/ui/button.jsx";
import { showSuccess, showError } from "@/utils/toast.js";
import api from "@/utils/api.js";

const ThemeSettings = ({
  availableThemes,
  storeConfig,
  queryClient,
  createThemePages,
}) => {
  const handleApplyTheme = async (theme) => {
    try {
      // Update store theme_id
      const response = await api.put("/owner/store-configuration", {
        ...storeConfig,
        theme_id: theme.theme_id,
      });

      // Update local state
      const updatedConfig = { ...storeConfig, theme_id: theme.theme_id };

      // Trigger page creation for this theme
      await createThemePages(theme.theme_id);

      showSuccess(`Theme "${theme.name}" applied successfully!`);
      queryClient.invalidateQueries({ queryKey: ["storeConfiguration"] });
      queryClient.invalidateQueries({ queryKey: ["customPages"] });
    } catch (error) {
      showError(error.response?.data?.message || "Failed to apply theme");
    }
  };

  return (
    <>
      <h2 className="font-semibold text-sm text-gray-800 mb-4">
        Theme Settings
      </h2>
      <ScrollArea className="h-[calc(100vh-200px)]">
        <div className="space-y-4">
          {/* Theme Selection */}
          <div className="border-b pb-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">
              Select Theme
            </h3>
            {availableThemes && availableThemes.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {availableThemes.map((theme) => (
                  <div
                    key={theme.id}
                    className={`border rounded-md p-3 transition-all ${
                      storeConfig?.theme_id === theme.theme_id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-blue-300"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {theme.imageSrc && (
                        <img
                          src={theme.imageSrc}
                          alt={theme.name}
                          className="w-16 h-16 rounded object-cover flex-shrink-0"
                        />
                      )}
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">
                          {theme.name}
                        </p>
                        <p className="text-xs text-gray-500 capitalize">
                          {theme.status}
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      className="w-full mt-3"
                      variant={
                        storeConfig?.theme_id === theme.theme_id
                          ? "default"
                          : "outline"
                      }
                      onClick={() => handleApplyTheme(theme)}
                    >
                      {storeConfig?.theme_id === theme.theme_id
                        ? "Applied"
                        : "Apply Theme"}
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">
                No themes available
              </p>
            )}
          </div>

          {/* Theme Colors */}
          <div className="border-b pb-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">
              Theme Colors
            </h3>
            <div className="space-y-2">
              <div className="space-y-1">
                <Label className="text-xs font-medium text-gray-600">
                  Primary Color
                </Label>
                <Input
                  type="color"
                  className="h-8 w-full"
                  defaultValue="#1e40af"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-medium text-gray-600">
                  Secondary Color
                </Label>
                <Input
                  type="color"
                  className="h-8 w-full"
                  defaultValue="#f3f4f6"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-medium text-gray-600">
                  Accent Color
                </Label>
                <Input
                  type="color"
                  className="h-8 w-full"
                  defaultValue="#3b82f6"
                />
              </div>
            </div>
          </div>

          {/* Typography */}
          <div className="border-b pb-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">
              Typography
            </h3>
            <div className="space-y-2">
              <div className="space-y-1">
                <Label className="text-xs font-medium text-gray-600">
                  Heading Font
                </Label>
                <Select>
                  <SelectTrigger className="h-8 text-sm">
                    <SelectValue placeholder="Select font" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inter">Inter</SelectItem>
                    <SelectItem value="roboto">Roboto</SelectItem>
                    <SelectItem value="open-sans">Open Sans</SelectItem>
                    <SelectItem value="montserrat">Montserrat</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-medium text-gray-600">
                  Body Font
                </Label>
                <Select>
                  <SelectTrigger className="h-8 text-sm">
                    <SelectValue placeholder="Select font" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inter">Inter</SelectItem>
                    <SelectItem value="roboto">Roboto</SelectItem>
                    <SelectItem value="open-sans">Open Sans</SelectItem>
                    <SelectItem value="lato">Lato</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Spacing */}
          <div className="border-b pb-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">
              Spacing
            </h3>
            <div className="space-y-2">
              <div className="space-y-1">
                <Label className="text-xs font-medium text-gray-600">
                  Section Padding
                </Label>
                <Select>
                  <SelectTrigger className="h-8 text-sm">
                    <SelectValue placeholder="Select padding" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small (8px)</SelectItem>
                    <SelectItem value="medium">Medium (12px)</SelectItem>
                    <SelectItem value="large">Large (16px)</SelectItem>
                    <SelectItem value="xlarge">Extra Large (20px)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </>
  );
};

export default ThemeSettings;
