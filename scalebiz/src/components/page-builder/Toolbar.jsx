"use client";

import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Undo2,
  Redo2,
  Save,
  Eye,
  ChevronLeft,
  Monitor,
  Tablet,
  Smartphone,
  Loader2,
  MoreVertical,
  PanelLeft,
  PanelLeftClose,
  PanelRight,
  PanelRightClose,
} from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.jsx";

const VIEWPORTS = {
  desktop: { label: "Desktop", icon: Monitor, width: "100%" },
  tablet: { label: "Tablet", icon: Tablet, width: "768px" },
  mobile: { label: "Mobile", icon: Smartphone, width: "375px" },
};

const Toolbar = ({
  title = "Page Builder",
  onUndo,
  onRedo,
  onSave,
  onPublish,
  onPreview,
  canUndo = false,
  canRedo = false,
  isSaving = false,
  isDirty = false,
  viewport = "desktop",
  onViewportChange,
  showViewportToggle = true,
  showPublish = true,
  showPreview = true,
  backUrl = "/",
  autoSaveIndicator,
  // Panel toggle props
  leftPanelOpen,
  onToggleLeftPanel,
  rightPanelOpen,
  onToggleRightPanel,
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(backUrl);
  };

  const handlePreview = () => {
    if (onPreview) {
      onPreview();
    } else {
      window.open("/pages/preview", "_blank");
    }
  };

  return (
    <div className="flex items-center justify-between px-4 py-3 border-b bg-background">
      {/* Left side: Navigation & Title */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={handleBack}>
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        {/* Left Panel Toggle */}
        {onToggleLeftPanel && (
          <>
            <div className="h-6 w-px mx-1 bg-border" />
            <Button
              variant="outline"
              size="icon"
              onClick={onToggleLeftPanel}
              className="h-8 w-8 hidden sm:flex"
              title={leftPanelOpen ? "Close Pages & Theme panel" : "Open Pages & Theme panel"}
            >
              {leftPanelOpen ? (
                <PanelLeftClose className="h-4 w-4" />
              ) : (
                <PanelLeft className="h-4 w-4" />
              )}
            </Button>
          </>
        )}
        <div className="h-6 w-px mx-2 bg-border" />
        <h1 className="text-lg font-semibold">{title}</h1>
        {isDirty && (
          <span className="text-xs text-amber-600 font-medium ml-2">
            (Unsaved changes)
          </span>
        )}
      </div>

      {/* Right side: Actions */}
      <div className="flex items-center gap-2">
        {/* Auto-save indicator */}
        {autoSaveIndicator && (
          <span className="text-xs text-muted-foreground mr-2">
            {autoSaveIndicator}
          </span>
        )}

        {/* Right Panel Toggle */}
        {onToggleRightPanel && (
          <Button
            variant="outline"
            size="icon"
            onClick={onToggleRightPanel}
            className="h-8 w-8 hidden sm:flex"
            title={rightPanelOpen ? "Close Components panel" : "Open Components panel"}
          >
            {rightPanelOpen ? (
              <PanelRightClose className="h-4 w-4" />
            ) : (
              <PanelRight className="h-4 w-4" />
            )}
          </Button>
        )}

        <div className="h-6 w-px mx-1 bg-border" />

        {/* Viewport Toggle */}
        {showViewportToggle && onViewportChange && (
          <div className="flex items-center border rounded-md mr-2">
            {Object.entries(VIEWPORTS).map(([key, { label: vLabel, icon: Icon }]) => (
              <Button
                key={key}
                variant={viewport === key ? "secondary" : "ghost"}
                size="icon"
                className="h-8 w-8 rounded-none"
                onClick={() => onViewportChange(key)}
                title={`Preview as ${vLabel}`}
              >
                <Icon className="h-4 w-4" />
              </Button>
            ))}
          </div>
        )}

        <div className="h-6 w-px mx-1 bg-border" />

        {/* Undo/Redo */}
        <Button
          variant="outline"
          size="sm"
          onClick={onUndo}
          disabled={!canUndo}
        >
          <Undo2 className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onRedo}
          disabled={!canRedo}
        >
          <Redo2 className="h-4 w-4" />
        </Button>

        <div className="h-6 w-px mx-1 bg-border" />

        {/* Save */}
        <Button onClick={onSave} disabled={isSaving || !isDirty}>
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save
            </>
          )}
        </Button>

        {/* Publish */}
        {showPublish && (
          <Button variant="default" onClick={onPublish} disabled={isSaving}>
            Publish
          </Button>
        )}

        {/* Preview */}
        {showPreview && (
          <Button variant="outline" onClick={handlePreview}>
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
        )}

        {/* More actions dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => {}}>
              Duplicate Page
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => {}}>
              Export JSON
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => {}}>
              Import JSON
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => {}} className="text-destructive">
              Reset to Default
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default Toolbar;
