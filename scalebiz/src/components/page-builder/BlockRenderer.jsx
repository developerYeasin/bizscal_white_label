"use client";

import React, { useCallback, useEffect } from "react";
import { ChevronUp, ChevronDown, Copy, Trash2, Layers, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import { componentMap } from "@/components/landing-pages/ComponentResolver.jsx";
import { useThemeConfig } from "@/contexts/ThemeSettingsContext.jsx";
import { useStoreConfig } from "@/contexts/StoreConfigurationContext.jsx";
import { useSortable } from "@dnd-kit/sortable";

/**
 * BlockRenderer now supports nested children and works with the new nested canvas.
 *
 * Visual enhancements:
 * - Depth indicator (indentation/left border)
 * - Container-specific styling
 * - Block count badge for containers
 */
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
}) => {
  // Draggable setup
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

  // Find node helper
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

  // Determine if this is a container block (layout blocks only)
  const containerTypes = ["section", "row", "column", "grid", "container"];
  const isContainer = containerTypes.includes(item.type);
  const childCount = item.children?.length || 0;

  const ComponentToRender = componentMap[item.type];
  if (!ComponentToRender) {
    return (
      <div
        className="p-4 text-destructive bg-destructive/20 rounded border border-destructive"
        style={{ marginLeft: depth * 16 }}
      >
        Unknown block type: {item.type}
      </div>
    );
  }

  // Visual depth styling
  const depthStyle = {
    marginLeft: depth * 12,
    borderLeft: depth > 0 ? "2px solid hsl(var(--primary))" : undefined,
    paddingLeft: depth > 0 ? 12 : 0,
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      className={`
        relative group border-2 rounded-lg overflow-hidden transition-all duration-200 block-renderer
        ${isSelected ? "selected border-primary ring-2 ring-primary/20 bg-accent/30" : "border-transparent hover:border-primary/40"}
        ${isContainer ? "bg-card/40" : "bg-background"}
      `}
      onClick={handleClick}
      data-block-id={item.id}
      data-block-type={item.type}
      data-depth={depth}
      style={{
        ...depthStyle,
        transform,
        transition,
        opacity: isDragging ? 0.5 : 1,
      }}
      tabIndex={0}
      role="button"
      aria-selected={isSelected}
    >
      {/* Block Header Bar */}
      <div
        className={`
          absolute top-0 left-0 right-0 h-6 flex items-center justify-between px-2 z-20
          ${isSelected ? "bg-primary text-primary-foreground" : "bg-muted/80 hover:bg-muted"}
          transition-colors opacity-0 group-hover:opacity-100
        `}
      >
        <div className="flex items-center gap-2">
          <span {...listeners} className="cursor-grab text-muted-foreground hover:text-foreground">
            <GripVertical className="h-3 w-3" />
          </span>
          {isContainer && (
            <Layers className="h-3 w-3" />
          )}
          <span className="text-xs font-medium truncate max-w-[120px]">
            {item.type}
          </span>
          {isContainer && childCount > 0 && (
            <span className="text-[10px] bg-background/20 px-1 rounded">
              {childCount}
            </span>
          )}
        </div>

        {isSelected && (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5 text-current hover:bg-background/20"
              onClick={handleMoveUp}
              title="Move Up"
              disabled={isFirst}
            >
              <ChevronUp className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5 text-current hover:bg-background/20"
              onClick={handleMoveDown}
              title="Move Down"
              disabled={isLast}
            >
              <ChevronDown className="h-3 w-3" />
            </Button>
            <div className="w-px h-4 mx-1 bg-current/30" />
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5 text-current hover:bg-background/20"
              onClick={handleDuplicate}
              title="Duplicate"
            >
              <Copy className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5 text-destructive hover:bg-background/20"
              onClick={handleDelete}
              title="Delete"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>

      {/* Block Content */}
      <div className="pt-7 pb-2 px-2">
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

      {/* Selection indicator & depth line */}
      {isSelected && (
        <>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary" />
          {/* Depth indicator lines */}
          {depth > 0 && (
            <div
              className="absolute top-7 bottom-0 left-0 w-0.5 bg-primary/30"
              style={{ left: depth * 12 - 4 }}
            />
          )}
        </>
      )}

      {/* Empty container placeholder */}
      {isContainer && childCount === 0 && (
        <div className="border-2 border-dashed border-muted-foreground/30 rounded p-4 mt-2 text-center">
          <p className="text-xs text-muted-foreground">
            Drop components here
          </p>
        </div>
      )}
    </div>
  );
};

export default BlockRenderer;
