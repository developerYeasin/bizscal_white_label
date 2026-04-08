"use client";

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, X } from "lucide-react"; // Import X icon
import { Button } from "@/components/ui/button.jsx";
import { cn } from "@/lib/utils.js";

const SortableComponentItem = ({ id, children, onDelete }) => {
  // Remove isDragging from props
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging, // Get isDragging directly from useSortable
  } = useSortable({ id: id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 100 : "auto", // Bring dragged item to front
    opacity: isDragging ? 0.7 : 1, // Visual feedback for dragging
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "relative rounded-lg border bg-card text-card-foreground shadow-sm",
        isDragging && "ring-2 ring-purple-500"
      )}
    >
      <div className="absolute top-2 left-2 z-10">
        <Button
          variant="ghost"
          size="icon"
          className="cursor-grab text-muted-foreground hover:bg-muted"
          {...listeners}
          {...attributes}
        >
          <GripVertical className="h-5 w-5" />
        </Button>
      </div>
      {/* Delete button moved here */}
      <div className="absolute top-2 right-2 z-10">
        <Button
          variant="destructive"
          size="icon"
          className="h-8 w-8" // Adjust size for better click target
          onClick={(e) => {
            e.stopPropagation(); // Prevent triggering collapsible card toggle
            onDelete(id); // Pass the component ID to the onDelete handler
          }}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="pt-12">
        {" "}
        {/* Add padding-top to prevent content overlap with drag/delete buttons */}
        {children}
      </div>
    </div>
  );
};

export default SortableComponentItem;
