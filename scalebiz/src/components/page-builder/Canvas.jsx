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
const CONTAINER_TYPES = ["section", "row", "column", "grid", "container", "systemHeader", "systemFooter"];

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
    // Could add visual feedback here
  }, []);

  // Handle drag over - supports moving between containers
  const handleDragOver = useCallback((event) => {
    const { active, over } = event;
    if (!over) return;

    // Could show drop indicator here
  }, []);

  // Handle drag end - reorder or move items between containers
  const handleDragEnd = useCallback(
    (event) => {
      const { active, over } = event;

      if (!over || active.id === over.id) return;

      // Only handle block reordering (new components from palette added via click)
      if (active.data.current?.type !== "block") return;

      const activeId = active.id;
      const overId = over.id;

      // Find active item in the tree
      const activeItem = findNodeInTree(items, activeId);
      if (!activeItem) return;

      // Determine parent of active item
      const activeParentId = findParentId(items, activeId);

      // Handle reordering within same container
      if (activeParentId !== null) {
        // Active is in a nested container
        const activeParent = findNodeInTree(items, activeParentId);
        if (activeParent && activeParent.children) {
          const oldIndex = activeParent.children.findIndex((item) => item.id === activeId);
          const overParentId = findParentId(items, overId);

          if (overParentId === activeParentId) {
            // Reordering within same parent
            const newIndex = activeParent.children.findIndex((item) => item.id === overId);
            const reordered = arrayMove(activeParent.children, oldIndex, newIndex);
            onUpdateItems((draft) => {
              const draftParent = findNodeInTree(draft, activeParentId);
              if (draftParent) {
                draftParent.children = reordered;
              }
            });
          } else {
            // Moving to different parent
            handleMoveToDifferentParent(activeId, overId, activeParentId, overParentId, items, onUpdateItems);
          }
        }
      } else {
        // Active is at root level
        const oldIndex = items.findIndex((item) => item.id === activeId);
        const overParentId = findParentId(items, overId);

        if (overParentId === null) {
          // Reordering at root level
          const newIndex = items.findIndex((item) => item.id === overId);
          const reordered = arrayMove(items, oldIndex, newIndex);
          onUpdateItems(() => reordered);
        } else {
          // Moving from root to nested container
          handleMoveToNestedParent(activeId, overId, overParentId, items, onUpdateItems);
        }
      }
    },
    [items, onUpdateItems]
  );

  const viewportWidth = VIEWPORT_WIDTHS[viewport] || "100%";

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div
        className={cn("flex-1 overflow-auto p-6 flex justify-center canvas-grid-bg", className)}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            onSelectItem(null);
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
        }}
        onDrop={(e) => {
          e.preventDefault();
          const data = e.dataTransfer.getData('application/json');
          if (data && onDropBlock) {
            try {
              const parsed = JSON.parse(data);
              if (parsed.type === 'new-block') {
                // Find the block element under the cursor
                const elements = document.elementsFromPoint(e.clientX, e.clientY);
                
                // Find if we are dropping onto a block
                const blockElement = elements.find(el => el.closest('[data-block-id]'));
                
                let targetParentId = null;
                let insertIndex = items.length;

                if (blockElement) {
                  const targetBlock = blockElement.closest('[data-block-id]');
                  const blockId = targetBlock.getAttribute('data-block-id');
                  const blockType = targetBlock.getAttribute('data-block-type');
                  
                  // If dropping onto a container, we might want to drop INSIDE it
                  if (isContainer(blockType)) {
                    targetParentId = blockId;
                    // For now, just append to the end of container children
                    const containerNode = findNodeInTree(items, blockId);
                    insertIndex = containerNode?.children?.length || 0;
                  } else {
                    // Dropping next to a non-container block
                    // Find parent of this block
                    const parentId = findParentId(items, blockId);
                    targetParentId = parentId === undefined ? null : parentId;
                    
                    const parentNode = targetParentId === null ? { children: items } : findNodeInTree(items, targetParentId);
                    const siblings = parentNode?.children || items;
                    
                    const overIndex = siblings.findIndex(item => item.id.toString() === blockId);
                    if (overIndex !== -1) {
                      const rect = targetBlock.getBoundingClientRect();
                      const midpoint = rect.top + rect.height / 2;
                      insertIndex = e.clientY < midpoint ? overIndex : overIndex + 1;
                    }
                  }
                }

                // Call handleAddBlock with parentId support
                // signature: (blockType, index, defaultConfig, parentId)
                onDropBlock(parsed.blockType, insertIndex, parsed.defaultConfig || {}, targetParentId);
              }
            } catch (err) {
              console.error('Failed to parse drop data', err);
            }
          }
        }}
      >
        {/* Canvas container with constrained width */}
        <div
          className="min-h-[500px] bg-background/80 backdrop-blur-sm border shadow-lg rounded-lg transition-all duration-300"
          style={{ width: viewportWidth, maxWidth: "100%" }}
        >
          {items.length === 0 ? (
            <div className="h-full min-h-[500px] flex items-center justify-center border-2 border-dashed rounded-lg m-4">
              <div className="text-center p-8">
                <div className="text-4xl mb-4">📦</div>
                <h3 className="text-lg font-medium mb-2">Your page is empty</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Add components from the sidebar to start building
                </p>
                <p className="text-xs text-muted-foreground">
                  Drag and drop components here or click to add
                </p>
              </div>
            </div>
          ) : (
            <SortableContext
              items={items.map((i) => i.id)}
              strategy={verticalListSortingStrategy}
              id="root"
            >
              <NestedBlockList
                items={items}
                selectedId={selectedId}
                onSelectItem={onSelectItem}
                onUpdateItems={onUpdateItems}
                parentId={null}
                depth={0}
                themeConfig={themeConfig}
                storeConfig={storeConfig}
                product={product}
                onBuyNowClick={onBuyNowClick}
                nextProductId={nextProductId}
                prevProductId={prevProductId}
                direction="vertical"
              />
            </SortableContext>
          )}
        </div>
      </div>

      <DragOverlay>
        {/* Could show a preview of dragged component */}
      </DragOverlay>
    </DndContext>
  );
};

// Helper to find parent ID of a node
const findParentId = (nodes, targetId, parentId = null) => {
  if (!targetId) return undefined;
  const tId = String(targetId);
  for (const node of nodes) {
    if (String(node.id) === tId) {
      return parentId;
    }
    if (node.children) {
      const found = findParentId(node.children, tId, node.id);
      if (found !== undefined) return found;
    }
  }
  return undefined;
};

// Helper to handle moving item to a nested parent
const handleMoveToNestedParent = (
  activeId,
  overId,
  overParentId,
  items,
  onUpdateItems,
) => {
  const { extracted, remaining } = extractSubtree(items, activeId);
  if (!extracted) return;

  const overParent = findNodeInTree(remaining, overParentId);
  if (!overParent || !overParent.children) return;

  // Insert at appropriate index
  const tOverId = String(overId);
  const overIndex = overParent.children.findIndex(
    (item) => String(item.id) === tOverId,
  );
  const newChildren = [...overParent.children];
  const insertIndex = overIndex === -1 ? newChildren.length : overIndex;
  newChildren.splice(insertIndex, 0, {
    ...extracted,
    children: extracted.children || [],
  });

  onUpdateItems((draft) => {
    const draftOverParent = findNodeInTree(draft, overParentId);
    if (draftOverParent) {
      draftOverParent.children = newChildren;
    }
  });
};

// Helper to handle moving item between different parents
const handleMoveToDifferentParent = (
  activeId,
  overId,
  activeParentId,
  overParentId,
  items,
  onUpdateItems,
) => {
  // Extract from current parent
  const { extracted, remaining } = extractSubtree(items, activeId);
  if (!extracted) return;

  // Find over's parent and index
  const overParent = findNodeInTree(remaining, overParentId);
  if (!overParent || !overParent.children) return;

  const tOverId = String(overId);
  const overIndex = overParent.children.findIndex(
    (item) => String(item.id) === tOverId,
  );
  const newChildren = [...overParent.children];
  const insertIndex = overIndex === -1 ? newChildren.length : overIndex;
  newChildren.splice(insertIndex, 0, {
    ...extracted,
    children: extracted.children || [],
  });

  onUpdateItems((draft) => {
    const draftOverParent = findNodeInTree(draft, overParentId);
    if (draftOverParent) {
      draftOverParent.children = newChildren;
    }
  });
};

// Extract subtree helper (same as useCanvasState but standalone)
const extractSubtree = (nodes, id) => {
  if (!id) return { extracted: null, remaining: nodes };
  const targetId = String(id);
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    if (String(node.id) === targetId) {
      const newNodes = [...nodes];
      newNodes.splice(i, 1);
      return { extracted: node, remaining: newNodes };
    }
    if (node.children) {
      const result = extractSubtree(node.children, targetId);
      if (result.extracted) {
        const newNodes = [...nodes];
        newNodes[i] = { ...node, children: result.remaining };
        return { extracted: result.extracted, remaining: newNodes };
      }
    }
  }
  return { extracted: null, remaining: nodes };
};

export default Canvas;
