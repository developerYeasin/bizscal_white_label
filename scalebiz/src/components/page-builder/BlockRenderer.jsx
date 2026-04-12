"use client";

import React, { useCallback, useEffect } from "react";
import { ChevronUp, ChevronDown, Copy, Trash2, GripVertical, Layout, Columns, Box } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import { componentMap } from "@/components/landing-pages/ComponentResolver.jsx";
import { useThemeConfig } from "@/contexts/ThemeSettingsContext.jsx";
import { useStoreConfig } from "@/contexts/StoreConfigurationContext.jsx";
import { useSortable } from "@dnd-kit/sortable";
import { cn } from "@/lib/utils.js";

const BlockRenderer = ({
  item,
  index,
  isSelected,
  isFirst,
  isLast,
  onSelect,
  onUpdate,
  onDelete,
  onDuplicate,
  themeConfig,
  storeConfig,
  product,
  onBuyNowClick,
  nextProductId,
  prevProductId,
  parentId = null,
  depth = 0,
  children,
  viewMode = "blocks",
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: item.id,
    data: { type: 'block' },
  });

  const handleClick = (e) => {
    if (isDragging) {
      e.stopPropagation();
      return;
    }
    e.stopPropagation();
    onSelect(item.id);
  };

  const handleMoveUp = (e) => {
    e.stopPropagation();
    if (onUpdate) {
      onUpdate((draft) => {
        let parentArray;
        if (parentId === null) {
          parentArray = draft;
        } else {
          const parent = findNodeInTree(draft, parentId);
          if (!parent || !parent.children) return;
          parentArray = parent.children;
        }
        const idx = parentArray.findIndex((i) => i.id === item.id);
        if (idx > 0) {
          const [moved] = parentArray.splice(idx, 1);
          parentArray.splice(idx - 1, 0, moved);
        }
      });
    }
  };

  const handleMoveDown = (e) => {
    e.stopPropagation();
    if (onUpdate) {
      onUpdate((draft) => {
        let parentArray;
        if (parentId === null) {
          parentArray = draft;
        } else {
          const parent = findNodeInTree(draft, parentId);
          if (!parent || !parent.children) return;
          parentArray = parent.children;
        }
        const idx = parentArray.findIndex((i) => i.id === item.id);
        if (idx !== -1 && idx < parentArray.length - 1) {
          const [moved] = parentArray.splice(idx, 1);
          parentArray.splice(idx + 1, 0, moved);
        }
      });
    }
  };

  const handleDuplicate = (e) => {
    e.stopPropagation();
    if (onDuplicate) {
      onDuplicate(item.id);
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (onDelete && window.confirm("Remove this block?")) {
      onDelete(item.id);
    }
  };

  const findNodeInTree = (nodes, id) => {
    for (const node of nodes) {
      if (node.id === id) return node;
      if (node.children) {
        const found = findNodeInTree(node.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  const containerTypes = ["section", "row", "column", "grid", "container", "cardLayout"];
  const isContainer = containerTypes.includes(item.type);
  const childCount = item.children?.length || 0;

  const ComponentToRender = componentMap[item.type];
  if (!ComponentToRender) {
    return (
      <div className="p-4 text-destructive bg-destructive/20 rounded border border-destructive">
        Unknown block type: {item.type}
      </div>
    );
  }

  const isPreview = viewMode === "preview";

  // Get icon based on block type
  const getBlockIcon = () => {
    if (item.type === "section") return <Layout className="h-3 w-3" />;
    if (item.type === "row") return <Layout className="h-3 w-3" />;
    if (item.type === "column" || item.type === "columns") return <Columns className="h-3 w-3" />;
    if (item.type === "grid") return <Layout className="h-3 w-3" />;
    if (item.type === "container") return <Box className="h-3 w-3" />;
    if (item.type === "cardLayout") return <Layout className="h-3 w-3" />;
    return <Layout className="h-3 w-3" />;
  };

  // Get block label
  const getBlockLabel = () => {
    if (item.type === "section") return "Section";
    if (item.type === "row") return "Row";
    if (item.type === "column" || item.type === "columns") return "Column";
    if (item.type === "grid") return "Grid";
    if (item.type === "container") return "Container";
    if (item.type === "cardLayout") return "Card Layout";
    if (item.type === "Header" || item.type === "systemHeader") return "Header";
    if (item.type === "Footer" || item.type === "systemFooter") return "Footer";
    return item.type;
  };

  return (
    <div
      ref={setNodeRef}
      {...(isPreview ? {} : attributes)}
      className={cn(
        "relative group transition-all duration-200",
        !isPreview && "mb-0.5",
        !isPreview && isSelected ? "bg-blue-50 border-2 border-blue-500" : "bg-white border border-gray-200",
        !isPreview && !isSelected && "hover:border-gray-300",
        isPreview && "border-none bg-transparent"
      )}
      onClick={isPreview ? undefined : handleClick}
      data-block-id={item.id}
      data-block-type={item.type}
      style={{
        transform,
        transition,
        opacity: isDragging ? 0.5 : 1,
      }}
      tabIndex={isPreview ? -1 : 0}
      role={isPreview ? "presentation" : "button"}
      aria-selected={isSelected}
    >
      {/* Block Header Bar */}
      {!isPreview && (
        <div
          className={`
            flex items-center justify-between px-1.5 py-1 rounded-t
            ${isSelected ? "bg-blue-100 border-b border-blue-200" : "bg-gray-50 border-b border-gray-200"}
            transition-colors
          `}
        >
          <div className="flex items-center gap-1 flex-1">
            <span {...listeners} className="cursor-grab text-gray-400 hover:text-gray-600">
              <GripVertical className="h-3 w-3" />
            </span>
            <span className="text-gray-600">
              {getBlockIcon()}
            </span>
            <span className="text-xs font-medium text-gray-700">
              {getBlockLabel()} {childCount > 0 && `(${childCount})`}
            </span>
          </div>

          {isSelected && (
            <div className="flex items-center gap-0.5">
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 text-gray-500 hover:text-gray-700"
                onClick={handleMoveUp}
                disabled={isFirst}
                title="Move Up"
              >
                <ChevronUp className="h-2.5 w-2.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 text-gray-500 hover:text-gray-700"
                onClick={handleMoveDown}
                disabled={isLast}
                title="Move Down"
              >
                <ChevronDown className="h-2.5 w-2.5" />
              </Button>
              <div className="w-px h-2 bg-gray-300 mx-0.5" />
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 text-gray-500 hover:text-gray-700"
                onClick={handleDuplicate}
                title="Duplicate"
              >
                <Copy className="h-2.5 w-2.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 text-red-500 hover:text-red-700"
                onClick={handleDelete}
                title="Delete"
              >
                <Trash2 className="h-2.5 w-2.5" />
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Block Content */}
      <div className={cn(!isPreview && "p-1", isPreview && "p-0")}>
        <ComponentToRender
          data={item.data}
          themeConfig={themeConfig}
          storeConfig={storeConfig}
          product={product}
          onBuyNowClick={onBuyNowClick}
          nextProductId={nextProductId}
          prevProductId={prevProductId}
        >
          {children}
        </ComponentToRender>
      </div>

      {/* Empty container placeholder */}
      {isContainer && childCount === 0 && !isPreview && (
        <div className="px-1 pb-1">
          <div className="border-2 border-dashed border-gray-300 rounded p-1 bg-gray-50/50">
            <div className="flex items-center justify-center gap-1">
              <Layout className="h-3 w-3 text-gray-400" />
              <span className="text-xs font-medium text-gray-500">
                Drop components here
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlockRenderer;
