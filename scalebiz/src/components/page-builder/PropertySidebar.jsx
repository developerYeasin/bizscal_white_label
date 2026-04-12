"use client";

import React, { useState, useCallback, useEffect } from "react";
import { X, Sliders } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs.jsx";
import { ScrollArea } from "@/components/ui/scroll-area.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.jsx";

const PropertySidebar = ({
  canvasState,
  mode,
  selectedPageId,
  formData,
  handleMetaChange,
  handleSave,
  isSaving,
  settingsComponentMap,
  storeConfig,
  onClose,
  width,
  setWidth,
}) => {
  const [isResizing, setIsResizing] = useState(false);

  const startResizing = useCallback((e) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  const stopResizing = useCallback(() => {
    setIsResizing(false);
  }, []);

  const resize = useCallback(
    (e) => {
      if (isResizing) {
        const newWidth = window.innerWidth - e.clientX;
        if (newWidth >= 250 && newWidth <= 600) {
          setWidth(newWidth);
        }
      }
    },
    [isResizing, setWidth]
  );

  useEffect(() => {
    if (isResizing) {
      window.addEventListener("mousemove", resize);
      window.addEventListener("mouseup", stopResizing);
    } else {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
    }
    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
    };
  }, [isResizing, resize, stopResizing]);

  const selectedItem = canvasState.selectedItem;
  const selectedId = canvasState.selectedId;

  // Helper to deep merge / update nested data
  const updateNestedData = (obj, path, value) => {
    if (!obj) obj = {};
    const keys = path.split(".");
    const result = JSON.parse(JSON.stringify(obj)); // Deep copy
    let current = result;
    
    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (!(key in current) || typeof current[key] !== "object" || current[key] === null) {
        current[key] = {};
      }
      current = current[key];
    }
    
    const lastKey = keys[keys.length - 1];
    if (typeof value === "object" && value !== null && typeof current[lastKey] === "object" && current[lastKey] !== null) {
      current[lastKey] = { ...current[lastKey], ...value };
    } else {
      current[lastKey] = value;
    }
    
    return result;
  };

  const handleUpdate = (path, value) => {
    try {
      if (!selectedId) {
        console.warn("No item selected for update");
        return;
      }

      if (path.startsWith("data.")) {
        const dataPath = path.substring(5);
        const currentData = selectedItem?.data || {};
        const newData = updateNestedData(currentData, dataPath, value);
        canvasState.updateItem(selectedId, {
          data: newData,
        });
      } else {
        canvasState.updateItem(selectedId, {
          [path]: value,
        });
      }
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  const renderBlockSettings = () => {
    if (!selectedItem && (mode === "page" || mode === "product") && !selectedId) {
      return (
        <div className="space-y-4 px-4 py-3">
          <div className="border-b border-gray-200 pb-3">
            <h3 className="text-sm font-semibold text-gray-800 mb-3">
              {mode === "page" && !selectedPageId ? "Create New Page" : "Page Settings"}
            </h3>
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-gray-600">Title</Label>
                <Input
                  value={formData.title || formData.page_title || ""}
                  onChange={(e) => {
                    const newTitle = e.target.value;
                    handleMetaChange("title", newTitle);
                  }}
                  className="h-8 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-gray-600">URL Slug</Label>
                <Input
                  value={formData.slug}
                  onChange={(e) => {
                    const newSlugValue = e.target.value
                      .toLowerCase()
                      .replace(/[^a-z0-9-]/g, "-")
                      .replace(/-+/g, "-");
                    handleMetaChange("slug", newSlugValue);
                  }}
                  className="h-8 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-gray-600">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleMetaChange("status", value)}
                >
                  <SelectTrigger className="h-8 text-sm">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Button className="w-full h-8 text-sm" onClick={handleSave} disabled={isSaving}>
                  {isSaving ? "Saving..." : selectedPageId ? "Update Page Settings" : "Create Page"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (!selectedItem) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-gray-400 p-6 text-center">
          <Sliders className="w-10 h-10 mb-3 opacity-20" />
          <p className="text-xs">Select a block to edit its properties.</p>
        </div>
      );
    }

    const SettingsComp = settingsComponentMap[selectedItem.type];

    return (
      <Tabs defaultValue="content" className="w-full h-full flex flex-col">
        <div className="px-4 border-b bg-gray-50/30">
          <TabsList className="w-full justify-start bg-transparent border-none h-10 gap-4">
            <TabsTrigger
              value="content"
              className="bg-transparent border-none shadow-none data-[state=active]:bg-transparent data-[state=active]:shadow-none px-2 h-full rounded-none text-xs"
            >
              Content
            </TabsTrigger>
            <TabsTrigger
              value="actions"
              className="bg-transparent border-none shadow-none data-[state=active]:bg-transparent data-[state=active]:shadow-none px-2 h-full rounded-none text-xs"
            >
              Actions
            </TabsTrigger>
            <TabsTrigger
              value="styles"
              className="bg-transparent border-none shadow-none data-[state=active]:bg-transparent data-[state=active]:shadow-none px-2 h-full rounded-none text-xs"
            >
              Styles
            </TabsTrigger>
          </TabsList>
        </div>

        <ScrollArea className="flex-1">
          <div className="px-4 py-3">
            <TabsContent value="content" className="mt-0">
              {SettingsComp ? (
                <SettingsComp
                  component={selectedItem}
                  index={0}
                  updateNested={handleUpdate}
                  isUpdating={false}
                  activeTab="content"
                />
              ) : (
                <p className="text-xs text-gray-500">No content settings available.</p>
              )}
            </TabsContent>
            <TabsContent value="actions" className="mt-0">
              {SettingsComp ? (
                <SettingsComp
                  component={selectedItem}
                  index={0}
                  updateNested={handleUpdate}
                  isUpdating={false}
                  activeTab="actions"
                />
              ) : (
                <p className="text-xs text-gray-500 py-2">No action settings available for this block.</p>
              )}
            </TabsContent>
            <TabsContent value="styles" className="mt-0">
              {SettingsComp ? (
                <SettingsComp
                  component={selectedItem}
                  index={0}
                  updateNested={handleUpdate}
                  isUpdating={false}
                  activeTab="styles"
                />
              ) : (
                <p className="text-xs text-gray-500 py-2">No style settings available for this block.</p>
              )}
            </TabsContent>
          </div>
        </ScrollArea>

        {selectedId && selectedId !== "systemHeader" && selectedId !== "systemFooter" && (
          <div className="px-4 py-3 border-t bg-gray-50/30">
            <Button
              variant="destructive"
              size="sm"
              className="w-full h-8 text-sm"
              onClick={() => {
                if (window.confirm("Remove this block?")) {
                  canvasState.deleteItem(selectedId);
                  onClose();
                }
              }}
            >
              Delete Block
            </Button>
          </div>
        )}
      </Tabs>
    );
  };

  return (
    <aside
      style={{ width: `${width}px` }}
      className="bg-white border-l border-gray-200 flex flex-col shrink-0 z-50 relative h-full shadow-xl"
    >
      {/* Resize handle */}
      <div
        className={`absolute top-0 left-[-3px] w-[6px] h-full cursor-col-resize hover:bg-blue-500/30 transition-colors z-50 ${
          isResizing ? "bg-blue-500/50" : ""
        }`}
        onMouseDown={startResizing}
      />

      {/* Panel Header */}
      <div className="h-12 border-b border-gray-100 flex items-center justify-between px-4 shrink-0 bg-white">
        <div className="flex items-center gap-2">
          <Sliders className="w-3.5 h-3.5 text-gray-500" />
          <h2 className="font-semibold text-xs text-gray-800">Properties</h2>
        </div>
        <button
          className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-50 transition-colors"
          onClick={onClose}
          title="Close panel"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Panel Content */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {renderBlockSettings()}
      </div>
    </aside>
  );
};

export default PropertySidebar;
