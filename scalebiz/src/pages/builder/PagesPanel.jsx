"use client";

import React, { useCallback } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { GripVertical, MoreHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu.jsx";
import { Skeleton } from "@/components/ui/skeleton.jsx";
import { showSuccess, showError } from "@/utils/toast.js";
import api from "@/utils/api.js";

// Sortable page item component
const SortablePageItem = ({
  page,
  selectedPageId,
  setSelectedPageId,
  setMode,
  navigate,
  canvasState,
  setActiveLeftPanel,
  setLeftPanelOpen,
  selectedRowIds,
  toggleRowSelection,
  onDelete,
}) => {
  const { attributes, listeners, setNodeRef, isDragging } = useSortable({
    id: page.id,
  });

  const isSelected = selectedRowIds.has(page.id);
  const isEditing = selectedPageId === String(page.id);

  const handleEdit = (e) => {
    e && e.stopPropagation();
    e.stopPropagation();
    setSelectedPageId(page.id);
    setMode("page");
    canvasState.clearSelection();
    setActiveLeftPanel("properties");
    setLeftPanelOpen(true);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm("Delete this page? This action cannot be undone.")) {
      onDelete(page.id);
    }
  };

  return (
    <div
      ref={setNodeRef}
      className={`flex items-center gap-2 h-8 px-2 text-sm rounded-md transition-colors cursor-pointer group ${
        isSelected ? "bg-muted/70" : "hover:bg-muted/50"
      }`}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      onClick={async (e) => {
        e.stopPropagation();
        toggleRowSelection(page.id);
        setActiveLeftPanel("pages");
        setLeftPanelOpen(true);
      }}
    >
      {/* Drag handle */}
      <span
        {...attributes}
        {...listeners}
        className="cursor-grab flex-shrink-0"
      >
        <GripVertical className="h-4 w-4 text-gray-400" />
      </span>

      {/* Page title */}
      <span className="truncate flex-1">{page.title || page.slug}</span>

      {/* 3-dot dropdown menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 focus:opacity-100"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleEdit}>Edit</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleDelete}
            className="text-destructive focus:text-destructive"
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

const PagesPanel = ({
  orderedPages,
  setOrderedPages,
  selectedPageId,
  setSelectedPageId,
  setMode,
  navigate,
  canvasState,
  setActiveLeftPanel,
  setLeftPanelOpen,
  queryClient,
  showLoading,
  selectedRowIds,
  toggleRowSelection,
  deleteMutation,
  onCreateNewPage,
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handlePagesDragEnd = useCallback(
    (event) => {
      const { active, over } = event;
      if (over && active.id !== over.id && orderedPages.length > 0) {
        setOrderedPages((items) => {
          const oldIndex = items.findIndex((p) => p.id === active.id);
          const newIndex = items.findIndex((p) => p.id === over.id);
          if (oldIndex === -1 || newIndex === -1) return items;
          const newItems = arrayMove(items, oldIndex, newIndex);

          // Prepare orders for API
          const orders = newItems.map((page, idx) => ({
            id: page.id,
            sort_order: idx,
          }));

          // Send to server
          api
            .put("/owner/custom-pages/reorder", { orders })
            .then(() => {
              showSuccess("Page order updated");
              queryClient.invalidateQueries({ queryKey: ["customPages"] });
            })
            .catch((err) => {
              showError(
                err.response?.data?.message || "Failed to update page order",
              );
              queryClient.invalidateQueries({ queryKey: ["customPages"] });
            });

          return newItems;
        });
      }
    },
    [orderedPages, queryClient],
  );

  if (showLoading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-8 w-full" />
        ))}
      </div>
    );
  }

  if (!orderedPages || orderedPages.length === 0) {
    return (
      <p className="text-sm text-gray-500 text-center py-4">No pages yet</p>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      onDragEnd={handlePagesDragEnd}
      collisionDetection={closestCenter}
    >
      <SortableContext
        items={orderedPages.map((p) => p.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-1">
          {orderedPages.map((page) => (
            <SortablePageItem
              key={page.id}
              page={page}
              selectedPageId={selectedPageId}
              setSelectedPageId={setSelectedPageId}
              setMode={setMode}
              navigate={navigate}
              canvasState={canvasState}
              setActiveLeftPanel={setActiveLeftPanel}
              setLeftPanelOpen={setLeftPanelOpen}
              selectedRowIds={selectedRowIds}
              toggleRowSelection={toggleRowSelection}
              onDelete={(id) => deleteMutation.mutate(id)}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};

export default PagesPanel;
