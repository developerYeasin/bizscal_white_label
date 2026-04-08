"use client";

import React from "react";
import { Button } from "@/components/ui/button.jsx";
import { cn } from "@/lib/utils.js";
import { Skeleton } from "@/components/ui/skeleton.jsx";

const ThemeSetupControls = ({ isUpdating }) => { // Accept isUpdating as prop
  const [activePreview, setActivePreview] = React.useState("Demo preview"); // This state is local to the component

  // No longer need isLoading from a hook, rely on parent's isUpdating

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-4">Theme Setup</h2>
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          className={cn(
            "flex-1",
            activePreview === "Demo preview"
              ? "bg-primary text-primary-foreground hover:bg-primary/90"
              : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          )}
          onClick={() => setActivePreview("Demo preview")}
          disabled={isUpdating}
        >
          Demo preview
        </Button>
        <Button
          variant="outline"
          className={cn(
            "flex-1",
            activePreview === "Section indicator"
              ? "bg-primary text-primary-foreground hover:bg-primary/90"
              : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          )}
          onClick={() => setActivePreview("Section indicator")}
          disabled={isUpdating}
        >
          Section indicator
        </Button>
        <Button
          variant="outline"
          className={cn(
            "flex-1",
            activePreview === "Live preview"
              ? "bg-primary text-primary-foreground hover:bg-primary/90"
              : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          )}
          onClick={() => setActivePreview("Live preview")}
          disabled={isUpdating}
        >
          Live preview
        </Button>
      </div>
    </div>
  );
};

export default ThemeSetupControls;