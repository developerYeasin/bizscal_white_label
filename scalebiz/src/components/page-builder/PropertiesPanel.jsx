"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Skeleton } from "@/components/ui/skeleton.jsx";
import { Settings, FileText } from "lucide-react";

/**
 * Properties panel for editing selected item
 *
 * Dynamically loads the appropriate settings component
 * based on the item type.
 */
const PropertiesPanel = ({
  selectedItem,
  itemType, // optional: override for non-block items (like 'field', 'section')
  onChange,
  onDataChange,
  onDelete,
  onDuplicate,
  isUpdating = false,
  settingsComponents = {}, // Map: type -> component
  metaFields = null, // Optional: page-level fields
  metaData = {}, // Values for meta fields
  onMetaChange, // (field, value) for meta fields
}) => {
  const [ActiveSettingsComponent, setActiveSettingsComponent] = useState(null);
  const [activeTab, setActiveTab] = useState("properties");

  // Determine the type to look up settings
  const type = itemType || selectedItem?.type;

  // Load settings component when selectedItem or type changes
  useEffect(() => {
    if (!selectedItem || !type) {
      setActiveSettingsComponent(null);
      return;
    }

    const loadSettings = async () => {
      const SettingsComp = settingsComponents[type];
      if (SettingsComp) {
        setActiveSettingsComponent(() => SettingsComp);
      } else {
        // No specific settings for this type
        setActiveSettingsComponent(null);
      }
    };

    loadSettings();
  }, [selectedItem, type, settingsComponents]);

  // Adapter: Convert new standard props to old props pattern
  // Existing components expect: ({ component, index, updateNested, isUpdating })
  const createAdaptedComponent = (SettingsComp) => {
    return function AdaptedSettingsComponent(props) {
      // Use selectedItem from closure (passed via PropertiesPanel)
      const { item, onChange: parentOnChange, onDataChange: parentOnDataChange, onDelete: parentOnDelete, onDuplicate: parentOnDuplicate, isUpdating } = props;

      // Create updateNested that translates to onDataChange
      // Handles paths like "data.title" or "data.ctaButton.text"
      const updateNested = (path, value) => {
        if (!path.startsWith('data.')) {
          // If it's a top-level field, use parentOnChange
          parentOnChange({ [path]: value });
          return;
        }

        const keys = path.split('.');
        if (keys.length === 2) {
          // Simple: data.field
          const field = keys[1];
          parentOnDataChange(field, value);
        } else if (keys.length === 3) {
          // Nested: data.field.subfield
          const field = keys[1];
          const subfield = keys[2];
          // Merge into nested object
          parentOnDataChange(field, { ...item.data[field], [subfield]: value });
        } else {
          // Deeper nesting not expected, but support it
          console.warn('Deep nested updates not fully supported:', path);
        }
      };

      return (
        <SettingsComp
          component={item}
          index={0} // Not used in most settings components
          updateNested={updateNested}
          isUpdating={isUpdating}
        />
      );
    };
  };

  // Memoize adapted component to prevent recreation (must always call useMemo)
  const AdaptedSettingsComponent = useMemo(() => {
    if (!ActiveSettingsComponent) return null;
    return createAdaptedComponent(ActiveSettingsComponent);
  }, [ActiveSettingsComponent]);

  // Meta fields component (always show if metaFields provided)
  const renderMetaFields = () => {
    if (!metaFields || Object.keys(metaFields).length === 0) {
      return (
        <p className="text-sm text-muted-foreground text-center py-4">
          No meta fields configured.
        </p>
      );
    }

    return (
      <div className="space-y-4">
        {metaFields.map((field) => (
          <div key={field}>
            <label className="block text-sm font-medium mb-1 capitalize">
              {field.replace(/_/g, " ")}
            </label>
            <Input
              value={metaData[field] || ""}
              onChange={(e) => onMetaChange && onMetaChange(field, e.target.value)}
              placeholder={`Enter ${field}`}
              disabled={isUpdating}
            />
          </div>
        ))}
      </div>
    );
  };

  // Render no selection state - show page meta fields if available
  if (!selectedItem) {
    return (
      <div className="h-full flex flex-col border rounded-lg overflow-hidden">
        <div className="p-3 border-b flex-shrink-0">
          <h3 className="font-semibold text-sm">Page Properties</h3>
        </div>
        <div className="flex-1 overflow-auto p-4">
          {metaFields && metaFields.length > 0 ? (
            <div className="space-y-4">
              {metaFields.map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium mb-1 capitalize">
                    {field.replace(/_/g, " ")}
                  </label>
                  {field === "status" ? (
                    <select
                      value={metaData[field] || "draft"}
                      onChange={(e) => onMetaChange && onMetaChange(field, e.target.value)}
                      disabled={isUpdating}
                      className="w-full border rounded px-2 py-1.5 text-sm"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                    </select>
                  ) : (
                    <Input
                      value={metaData[field] || ""}
                      onChange={(e) => onMetaChange && onMetaChange(field, e.target.value)}
                      placeholder={`Enter ${field}`}
                      disabled={isUpdating}
                    />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              No properties to edit
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="p-3 border-b flex-shrink-0">
        <h3 className="font-semibold text-sm truncate">
          {selectedItem.name || selectedItem.type || "Properties"}
        </h3>
        {selectedItem.type && (
          <p className="text-xs text-muted-foreground capitalize">
            {selectedItem.type}
          </p>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {metaFields && metaFields.length > 0 ? (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full rounded-none border-b">
              <TabsTrigger value="properties" className="flex-1 text-xs">
                Settings
              </TabsTrigger>
              <TabsTrigger value="seo" className="flex-1 text-xs">
                Page Info
              </TabsTrigger>
            </TabsList>

            <TabsContent value="properties" className="p-4 space-y-4">
              {ActiveSettingsComponent ? (
                <AdaptedSettingsComponent
                  item={selectedItem}
                  onChange={onChange}
                  onDataChange={onDataChange}
                  onDelete={onDelete}
                  onDuplicate={onDuplicate}
                  isUpdating={isUpdating}
                />
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground mb-2">
                    No specific settings for this component type.
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Use the canvas to reposition or delete.
                  </p>
                </div>
              )}

              {/* Quick actions */}
              {onDelete && (
                <div className="pt-4 border-t mt-4">
                  <Button
                    variant="destructive"
                    size="sm"
                    className="w-full"
                    onClick={() => onDelete(selectedItem.id)}
                    disabled={isUpdating}
                  >
                    Delete Block
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="seo" className="p-4 space-y-4">
              {renderMetaFields()}
            </TabsContent>
          </Tabs>
        ) : (
          // No meta fields, just show component settings
          <div className="p-4 space-y-4">
            {ActiveSettingsComponent ? (
              <AdaptedSettingsComponent
                item={selectedItem}
                onChange={onChange}
                onDataChange={onDataChange}
                onDelete={onDelete}
                onDuplicate={onDuplicate}
                isUpdating={isUpdating}
              />
            ) : (
              <div className="text-center py-8">
                <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-20" />
                <p className="text-sm text-muted-foreground">
                  No settings available for this item.
                </p>
              </div>
            )}

            {onDelete && (
              <div className="pt-4 border-t">
                <Button
                  variant="destructive"
                  size="sm"
                  className="w-full"
                  onClick={() => onDelete(selectedItem.id)}
                  disabled={isUpdating}
                >
                  Delete
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertiesPanel;
