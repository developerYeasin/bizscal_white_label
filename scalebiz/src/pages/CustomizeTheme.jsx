"use client";

import React from "react";
import { useThemeConfig } from "@/contexts/ThemeSettingsContext.jsx";
import { useStoreConfig } from "@/contexts/StoreConfigurationContext.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Skeleton } from "@/components/ui/skeleton.jsx";
import { Save, Undo, Redo } from "lucide-react";
import ThemeSelection from "@/components/customize-theme/ThemeSelection.jsx";
import ThemeControls from "@/components/customize-theme/ThemeControls.jsx";
import CustomCodeEditor from "@/components/customize-theme/CustomCodeEditor.jsx";
import ThemePreviewPanel from "@/components/customize-theme/ThemePreviewPanel.jsx";

const CustomizeTheme = () => {
  const { config: themeConfig, isLoading: themeConfigLoading, error: themeError, save, isUpdating, undo, redo, canUndo, canRedo } = useThemeConfig();
  const { config: storeConfig } = useStoreConfig();

  if (themeConfigLoading) {
    return (
      <div className="p-6">
        <Skeleton className="h-10 w-48 mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-[600px] w-full" />
          <Skeleton className="h-[600px] w-full" />
        </div>
      </div>
    );
  }

  if (themeError) {
    return <div className="p-6 text-destructive">Error loading theme settings: {themeError.message}</div>;
  }

  if (!themeConfig || !storeConfig) {
    return (
      <div className="p-6 text-center">
        <p className="text-lg text-muted-foreground">No theme configuration found.</p>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col p-4 md:p-6 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold">Customize Theme</h1>
          <p className="text-sm text-muted-foreground">
            Customize colors, fonts, and layout. Use Page Builder to edit content.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={undo} disabled={!canUndo}>
            <Undo className="h-4 w-4 mr-1" /> Undo
          </Button>
          <Button variant="outline" size="sm" onClick={redo} disabled={!canRedo}>
            <Redo className="h-4 w-4 mr-1" /> Redo
          </Button>
          <Button size="sm" onClick={save} disabled={isUpdating}>
            {isUpdating ? (
              <>Saving...</>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Main Content: Split View */}
      <div className="flex-1 flex gap-4 overflow-hidden">
        {/* Left Panel: Settings */}
        <div className="flex-1 lg:w-96 flex-shrink-0 flex flex-col gap-4 overflow-y-auto pr-2">
          <div className="space-y-4">
            {/* Theme Selection */}
            <section>
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-2">Theme</h3>
              <ThemeSelection />
            </section>

            {/* Theme Controls */}
            <section>
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-2">Appearance</h3>
              <ThemeControls />
            </section>

            {/* Custom Code */}
            <section>
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-2">Custom Code</h3>
              <CustomCodeEditor />
            </section>
          </div>
        </div>

        {/* Right Panel: Live Preview */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <ThemePreviewPanel />
        </div>
      </div>
    </div>
  );
};

export default CustomizeTheme;
