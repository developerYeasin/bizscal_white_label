"use client";

import React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";

// Helper to deep merge / update nested data object given a dot path
const updateNestedData = (obj, path, value) => {
  if (!obj) obj = {};
  const keys = path.split(".");
  const result = JSON.parse(JSON.stringify(obj)); // Deep copy to avoid mutations
  let current = result;
  
  // Navigate/create nested structure
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!(key in current) || typeof current[key] !== "object" || current[key] === null) {
      current[key] = {};
    }
    current = current[key];
  }
  
  // Handle complex nested objects - if value is an object, merge it
  const lastKey = keys[keys.length - 1];
  if (typeof value === "object" && value !== null && typeof current[lastKey] === "object" && current[lastKey] !== null) {
    current[lastKey] = { ...current[lastKey], ...value };
  } else {
    current[lastKey] = value;
  }
  
  return result;
};

const BlockProperties = ({
  canvasState,
  settingsComponentMap,
  setActiveLeftPanel,
  setLeftPanelOpen,
}) => {
  const handleClose = () => {
    const hadSelection = !!canvasState.selectedId;
    canvasState.selectItem(null);
    if (!hadSelection) {
      setActiveLeftPanel("pages");
    } else {
      setActiveLeftPanel("blocks");
    }
  };

  const handleDeleteBlock = () => {
    if (window.confirm("Remove this block?")) {
      canvasState.deleteItem(canvasState.selectedId);
      setActiveLeftPanel("blocks");
      setLeftPanelOpen(true);
    }
  };

  const handleUpdateBlock = (path, value) => {
    try {
      if (!canvasState.selectedId) {
        console.warn("No block selected for update");
        return;
      }

      if (path.startsWith("data.")) {
        const dataPath = path.substring(5);
        const currentData = canvasState.selectedItem?.data || {};
        const newData = updateNestedData(currentData, dataPath, value);
        canvasState.updateItem(canvasState.selectedId, {
          data: newData,
        });
      } else {
        canvasState.updateItem(canvasState.selectedId, {
          [path]: value,
        });
      }
    } catch (error) {
      console.error("Error updating block:", error);
    }
  };

  const SettingsComp = canvasState.selectedItem
    ? settingsComponentMap[canvasState.selectedItem.type]
    : null;

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
        <div className="space-y-4 pt-4">
          {/* Block-specific settings using settingsComponentMap */}
          {canvasState.selectedItem && SettingsComp ? (
            <SettingsComp
              component={canvasState.selectedItem}
              index={0}
              updateNested={handleUpdateBlock}
              isUpdating={false}
            />
          ) : canvasState.selectedItem ? (
            <p className="text-sm text-gray-500">
              No settings available for this block type.
            </p>
          ) : (
            <p className="text-sm text-gray-500 text-center py-8">
              Select a block to edit its properties.
            </p>
          )}

          {/* Delete button for non-system blocks */}
          {canvasState.selectedId &&
            canvasState.selectedItem.type !== "Header" &&
            canvasState.selectedItem.type !== "systemHeader" &&
            canvasState.selectedItem.type !== "Footer" &&
            canvasState.selectedItem.type !== "systemFooter" && (
              <div className="pt-4 border-t">
                <Button
                  variant="destructive"
                  size="sm"
                  className="w-full"
                  onClick={handleDeleteBlock}
                >
                  Delete Block
                </Button>
              </div>
            )}
        </div>
      </div>
    </>
  );
};

export default BlockProperties;
