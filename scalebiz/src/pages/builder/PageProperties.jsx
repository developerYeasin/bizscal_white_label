"use client";

import React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.jsx";

const PageProperties = ({
  mode,
  selectedPageId,
  formData,
  handleMetaChange,
  handleSave,
  isSaving,
  canvasState,
  setActiveLeftPanel,
  setLeftPanelOpen,
}) => {
  const handleClose = () => {
    const hadSelection = !!canvasState.selectedId;
    canvasState.selectItem(null);
    // If we were viewing Page Settings (no block selected), go to Pages list
    // Otherwise if we were viewing block properties, go to Blocks list
    if (
      !hadSelection &&
      (mode === "page" || mode === "product")
    ) {
      setActiveLeftPanel("pages");
    } else {
      setActiveLeftPanel("blocks");
    }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-sm text-gray-800">
          Properties
        </h2>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={handleClose}
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
      <div className="overflow-y-auto">
        <div className="space-y-4">
          {/* Page-level settings (shown when no block is selected in page/product mode) */}
          {(mode === "page" || mode === "product") &&
            !canvasState.selectedId && (
              <div className="border-b pb-4">
                <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">
                  {mode === "page" && !selectedPageId
                    ? "Create New Page"
                    : "Page Settings"}
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-gray-600">
                      Title
                    </label>
                    <Input
                      value={formData.title || formData.page_title || ""}
                      onChange={(e) => {
                        const newTitle = e.target.value;
                        handleMetaChange("title", newTitle);
                        if (!selectedPageId) {
                          const newSlug = newTitle
                            .toLowerCase()
                            .replace(/[^a-z0-9-]/g, "-")
                            .replace(/-+/g, "-");
                          handleMetaChange("slug", newSlug);
                        }
                      }}
                      className="h-8 text-sm mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600">
                      URL Slug
                    </label>
                    <Input
                      value={formData.slug}
                      onChange={(e) => {
                        const newSlugValue = e.target.value
                          .toLowerCase()
                          .replace(/[^a-z0-9-]/g, "-")
                          .replace(/-+/g, "-");
                        handleMetaChange("slug", newSlugValue);
                      }}
                      className="h-8 text-sm mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600">
                      Status
                    </label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) =>
                        handleMetaChange("status", value)
                      }
                    >
                      <SelectTrigger className="h-8 text-sm mt-1">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">
                          Published
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="pt-4 space-y-2">
                    <Button
                      className="w-full"
                      onClick={handleSave}
                      disabled={isSaving}
                    >
                      {isSaving
                        ? "Saving..."
                        : selectedPageId
                          ? "Update Page Settings"
                          : "Create Page"}
                    </Button>
                    {!selectedPageId && (
                      <p className="text-[10px] text-center text-gray-400">
                        Configure your page title and slug, then click
                        Create Page to start building.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
        </div>
      </div>
    </>
  );
};

export default PageProperties;
