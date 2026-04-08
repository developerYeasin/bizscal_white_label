"use client";

import React, { useState, useMemo } from "react";
import { Search, Plus, Boxes, Palette, Layout } from "lucide-react";
import { Input } from "@/components/ui/input.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Card, CardContent } from "@/components/ui/card.jsx";
import { ScrollArea } from "@/components/ui/scroll-area.jsx";

/**
 * Component palette sidebar panel
 *
 * For Page Builder: Shows theme_blocks as draggable/clickable items
 * For Theme Customizer: Shows field groups (colors, typography, etc.)
 * For Product Landing: Shows section types from template
 */
const ComponentPalette = ({
  title = "Components",
  items = [], // Array of { block_type, name, description, category?, icon? }
  onAdd,
  onDragStart,
  categories = null, // Array of category names, or null to infer from items
  searchable = true,
  collapsible = true,
  defaultCollapsed = false,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  // Filter items based on search
  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return items;

    const query = searchQuery.toLowerCase();
    return items.filter(
      (item) =>
        (item.name || item.block_type || "").toLowerCase().includes(query) ||
        (item.description || "").toLowerCase().includes(query) ||
        (item.block_type || "").toLowerCase().includes(query)
    );
  }, [items, searchQuery]);

  // Group items by category if categories are provided or inferred
  const groupedItems = useMemo(() => {
    if (!categories) {
      return { "All Components": filteredItems };
    }

    const groups = {};
    categories.forEach((cat) => (groups[cat] = []));

    filteredItems.forEach((item) => {
      const category = item.category || categories[0] || "Other";
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(item);
    });

    // Remove empty categories
    Object.keys(groups).forEach((key) => {
      if (groups[key].length === 0) {
        delete groups[key];
      }
    });

    return groups;
  }, [filteredItems, categories]);

  // Get category icon
  const getCategoryIcon = (category) => {
    const icons = {
      "All Components": <Boxes className="h-4 w-4" />,
      Layout: <Layout className="h-4 w-4" />,
      Content: <Boxes className="h-4 w-4" />,
      Ecommerce: <Boxes className="h-4 w-4" />,
      Theme: <Palette className="h-4 w-4" />,
      SEO: <Search className="h-4 w-4" />,
    };
    return icons[category] || <Boxes className="h-4 w-4" />;
  };

  if (isCollapsed) {
    return (
      <div className="border rounded-lg p-2">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start"
          onClick={() => setIsCollapsed(false)}
        >
          <Plus className="h-4 w-4 mr-2" />
          {title}
        </Button>
      </div>
    );
  }

  return (
    <div className="border rounded-lg flex flex-col h-full">
      {/* Header */}
      <div className="p-3 border-b flex items-center justify-between flex-shrink-0">
        <h3 className="font-semibold text-sm">{title}</h3>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={() => setIsCollapsed(true)}
        >
          <Plus className="h-4 w-4 rotate-45" />
        </Button>
      </div>

      {/* Search */}
      {searchable && (
        <div className="p-3 border-b flex-shrink-0">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search components..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 h-8 text-sm"
            />
          </div>
        </div>
      )}

      {/* Items List */}
      <ScrollArea className="flex-1 p-3">
        {Object.keys(groupedItems).length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No items found
          </p>
        ) : (
          <div className="space-y-4">
            {Object.entries(groupedItems).map(([category, categoryItems]) => (
              <div key={category}>
                <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
                  {getCategoryIcon(category)}
                  <span>{category}</span>
                </div>
                <div className="grid gap-2">
                  {categoryItems.map((item) => {
                    const itemType = item.block_type || item.type || item.id;
                    const itemName = item.name || itemType;
                    const itemDesc = item.description || "";

                    return (
                      <Card
                        key={item.id || itemType}
                        className="cursor-pointer hover:bg-accent transition-colors"
                        onClick={() => onAdd && onAdd(itemType, item)}
                        draggable
                        onDragStart={(e) => {
                          if (onDragStart) {
                            e.stopPropagation();
                            onDragStart(itemType, item, e);
                          }
                        }}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">
                                {itemName}
                              </p>
                              {itemDesc && (
                                <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                                  {itemDesc}
                                </p>
                              )}
                            </div>
                            <Plus className="h-4 w-4 ml-2 flex-shrink-0 text-muted-foreground" />
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default ComponentPalette;
