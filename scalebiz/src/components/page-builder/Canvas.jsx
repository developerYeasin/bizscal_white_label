"use client";

import React, { useCallback, useMemo } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  arrayMove,
  verticalListSortingStrategy,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useThemeConfig } from "@/contexts/ThemeSettingsContext.jsx";
import { useStoreConfig } from "@/contexts/StoreConfigurationContext.jsx";
import BlockRenderer from "./BlockRenderer.jsx";
import { cn } from "@/lib/utils.js";

// Viewport width presets
const VIEWPORT_WIDTHS = {
  desktop: "100%",
  tablet: "768px",
  mobile: "375px",
};

// Check if a block type is a container (can have children)
const CONTAINER_TYPES = ["section", "row", "column", "grid", "container", "Header", "Footer", "cardLayout"];

const isContainer = (type) => CONTAINER_TYPES.includes(type);

/**
 * Recursively renders blocks with nested sortable contexts
 */
const NestedBlockList = ({
  items,
  selectedId,
  onSelectItem,
  onUpdateItems,
  parentId = null,
  depth = 0,
  themeConfig,
  storeConfig,
  product,
  onBuyNowClick,
  nextProductId,
  prevProductId,
  direction = "vertical",
  viewMode = "blocks",
}) => {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div
      className={`nested-blocks-container ${direction === "horizontal" ? "flex flex-row" : "flex flex-col"}`}
      data-parent-id={parentId || "root"}
      data-depth={depth}
    >
      {items.map((item, index) => {
        const container = isContainer(item.type);
        const children = item.children || [];

        return (
          <React.Fragment key={item.id}>
            <BlockRenderer
              item={item}
              index={index}
              isSelected={selectedId === item.id}
              isFirst={index === 0}
              isLast={index === items.length - 1}
              onSelect={onSelectItem}
              onUpdate={onUpdateItems}
              onDelete={(id) => onUpdateItems((draft) => {
                const parentArray = parentId === null ? draft : findNodeInTree(draft, parentId).children;
                const idx = parentArray.findIndex(i => i.id === id);
                if (idx !== -1) parentArray.splice(idx, 1);
              })}
              onDuplicate={(id) => {
                const original = items.find(i => i.id === id);
                if (original && onUpdateItems) {
                  onUpdateItems((draft) => {
                    const parentArray = parentId === null ? draft : findNodeInTree(draft, parentId).children;
                    const idx = parentArray.findIndex(i => i.id === id);
                    if (idx !== -1) {
                      const duplicated = {
                        ...parentArray[idx],
                        id: Date.now() + Math.random(),
                      };
                      parentArray.splice(idx + 1, 0, duplicated);
                    }
                  });
                  onSelectItem(original.id + 10000);
                }
              }}
              themeConfig={themeConfig}
              storeConfig={storeConfig}
              product={product}
              onBuyNowClick={onBuyNowClick}
              nextProductId={nextProductId}
              prevProductId={prevProductId}
              parentId={parentId}
              depth={depth}
              viewMode={viewMode}
            >
              {container && children.length > 0 && (
                <SortableContext
                  items={children.map((c) => c.id)}
                  strategy={item.type === "row" ? horizontalListSortingStrategy : verticalListSortingStrategy}
                  id={`${parentId}-${item.id}`}
                >
                  <NestedBlockList
                    items={children}
                    selectedId={selectedId}
                    onSelectItem={onSelectItem}
                    onUpdateItems={onUpdateItems}
                    parentId={item.id}
                    depth={depth + 1}
                    themeConfig={themeConfig}
                    storeConfig={storeConfig}
                    product={product}
                    onBuyNowClick={onBuyNowClick}
                    nextProductId={nextProductId}
                    prevProductId={prevProductId}
                    direction={item.type === "row" ? "horizontal" : "vertical"}
                    viewMode={viewMode}
                  />
                </SortableContext>
              )}
            </BlockRenderer>
          </React.Fragment>
        );
      })}
    </div>
  );
};

// Helper function to find node in tree
const findNodeInTree = (nodes, id) => {
  if (!id) return null;
  const targetId = String(id);
  for (const node of nodes) {
    if (String(node.id) === targetId) return node;
    if (node.children) {
      const found = findNodeInTree(node.children, targetId);
      if (found) return found;
    }
  }
  return null;
};

/**
 * Main canvas area for visual editing
 *
 * Renders all items recursively, handles nested drag-drop
 */
const Canvas = ({
  items,
  selectedId,
  onSelectItem,
  onUpdateItems,
  themeConfig,
  storeConfig,
  viewport = "desktop",
  viewMode = "blocks",
  product,
  onBuyNowClick,
  nextProductId,
  prevProductId,
  onDropBlock, // New: handle dropping new block from palette
  className = "",
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Handle drag start
  const handleDragStart = useCallback((event) => {
    const { active } = event;
    // Store block data in the event for drag and drop from palette
    if (active.data?.current?.dataset) {
      const blockType = active.data.current.dataset.blockType;
      const defaultConfig = active.data.current.dataset.defaultConfig;
      event.dataTransfer.setData(
        "application/json",
        JSON.stringify({
          blockType,
          defaultConfig,
        })
      );
    }
  }, []);

  // Handle drag over - supports moving between containers
  const handleDragOver = useCallback((event) => {
    const { active, over } = event;
    if (!over) return;

    const overId = over.id;
    const activeId = active.id;

    if (activeId === overId) return;

    // Find parent arrays for both active and over items
    const findParent = (nodes, targetId) => {
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];

        if (node.id === targetId) {
          return { parentArray: nodes, index: i };
        }

        if (node.children) {
          const found = findParent(node.children, targetId);
          if (found) return found;
        }
      }
      return null;
    };

    const activeInfo = findParent(items, activeId);
    const overInfo = findParent(items, overId);

    if (!activeInfo || !overInfo) return;

    // Get the target parent array (where over item lives)
    const targetArray = overInfo.parentArray;
    const targetIndex = overInfo.index;

    // Remove active item from its current position
    const sourceArray = activeInfo.parentArray;
    const sourceIndex = activeInfo.index;
    const [movedItem] = sourceArray.splice(sourceIndex, 1);

    // Insert at new position
    // Adjust index if moving to a position after the original position
    const insertIndex = targetIndex > sourceIndex ? targetIndex - 1 : targetIndex;
    targetArray.splice(insertIndex, 0, movedItem);

    onUpdateItems((draft) => draft);
  }, [items, onUpdateItems]);

  // Handle drag end
  const handleDragEnd = useCallback((event) => {
    const { active, over } = event;
    if (!over) return;

    const overId = over.id;
    const activeId = active.id;

    if (activeId === overId) return;

    // Check if this is a drag from the palette (new block)
    // Get data from dataTransfer
    const blockType = event.dataTransfer.getData("blockType");
    const defaultConfigStr = event.dataTransfer.getData("defaultConfig");
    
    if (blockType) {
      // This is a new block being dragged from the palette
      const defaultConfig = defaultConfigStr ? JSON.parse(defaultConfigStr) : {};

      // Find the drop target
      const findDropTarget = (nodes, targetId) => {
        for (let i = 0; i < nodes.length; i++) {
          const node = nodes[i];

          if (node.id === targetId) {
            return { parentArray: nodes, index: i };
          }

          if (node.children) {
            const found = findDropTarget(node.children, targetId);
            if (found) return found;
          }
        }
        return null;
      };

      const overInfo = findDropTarget(items, overId);
      if (overInfo) {
        // Add the new block at the drop position
        const newIndex = overInfo.index;
        const newBlock = {
          id: Date.now() + Math.random(),
          type: blockType,
          data: defaultConfig,
        };
        overInfo.parentArray.splice(newIndex, 0, newBlock);
        onUpdateItems((draft) => draft);
      }
      return;
    }

    // Find parent arrays for both active and over items
    const findParent = (nodes, targetId) => {
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];

        if (node.id === targetId) {
          return { parentArray: nodes, index: i };
        }

        if (node.children) {
          const found = findParent(node.children, targetId);
          if (found) return found;
        }
      }
      return null;
    };

    const activeInfo = findParent(items, activeId);
    const overInfo = findParent(items, overId);

    if (!activeInfo || !overInfo) return;

    // Get the target parent array (where over item lives)
    const targetArray = overInfo.parentArray;
    const targetIndex = overInfo.index;

    // Remove active item from its current position
    const sourceArray = activeInfo.parentArray;
    const sourceIndex = activeInfo.index;
    const [movedItem] = sourceArray.splice(sourceIndex, 1);

    // Insert at new position
    // Adjust index if moving to a position after the original position
    const insertIndex = targetIndex > sourceIndex ? targetIndex - 1 : targetIndex;
    targetArray.splice(insertIndex, 0, movedItem);

    onUpdateItems((draft) => draft);
  }, [items, onUpdateItems]);

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      collisionDetection={closestCenter}
    >
      <div
        className={cn("canvas-container", className)}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const blockType = e.dataTransfer.getData("blockType");
          const defaultConfigStr = e.dataTransfer.getData("defaultConfig");
          
          if (blockType) {
            const defaultConfig = defaultConfigStr ? JSON.parse(defaultConfigStr) : {};
            const newBlock = {
              id: Date.now() + Math.random(),
              type: blockType,
              data: defaultConfig,
            };
            
            // Add the new block at the end of the items array
            onUpdateItems((draft) => {
              draft.push(newBlock);
            });
          }
        }}
      >
        <NestedBlockList
          items={items}
          selectedId={selectedId}
          onSelectItem={onSelectItem}
          onUpdateItems={onUpdateItems}
          themeConfig={themeConfig}
          storeConfig={storeConfig}
          product={product}
          onBuyNowClick={onBuyNowClick}
          nextProductId={nextProductId}
          prevProductId={prevProductId}
          viewMode={viewMode}
        />
      </div>
      <DragOverlay>
        {/* Could add custom drag overlay component here */}
      </DragOverlay>
    </DndContext>
  );
};

export default Canvas;
