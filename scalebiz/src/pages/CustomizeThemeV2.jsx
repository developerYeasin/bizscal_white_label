"use client";

import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import api from "@/utils/api.js";
import { showSuccess, showError } from "@/utils/toast.js";
import { Button } from "@/components/ui/button.jsx";
import { Skeleton } from "@/components/ui/skeleton.jsx";
import { ThemeProvider } from "next-themes";
import { useThemeConfig } from "@/contexts/ThemeSettingsContext.jsx";
import { useStoreConfig } from "@/contexts/StoreConfigurationContext.jsx";

// Page Builder components
import { Toolbar } from "@/components/page-builder/index.js";

// Existing theme components (reuse)
import ThemeSelection from "@/components/customize-theme/ThemeSelection.jsx";
import ThemeControls from "@/components/customize-theme/ThemeControls.jsx";
import CustomCodeEditor from "@/components/customize-theme/CustomCodeEditor.jsx";
import ThemePreviewPanel from "@/components/customize-theme/ThemePreviewPanel.jsx";
import { useLivePreview } from "@/hooks/use-live-preview.js";

const CustomizeThemeV2 = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { config: themeConfig, isLoading: themeConfigLoading, error: themeError, save, isUpdating, undo, redo, canUndo, canRedo } = useThemeConfig();
  const { config: storeConfig } = useStoreConfig();
  const { openPreviewWindow, isPreviewWindowOpen } = useLivePreview();

  // State for collapsed sections in right sidebar
  const [expandedSections, setExpandedSections] = useState({
    theme: true,
    appearance: true,
    code: true,
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  if (!isAuthenticated) {
    return <div className="p-6">Please login.</div>;
  }

  if (themeConfigLoading) {
    return (
      <div className="h-[calc(100vh-4rem)] flex flex-col p-6">
        <Skeleton className="h-10 w-48 mb-6" />
        <div className="flex-1 flex gap-6">
          <Skeleton className="flex-1 h-full" />
          <Skeleton className="w-80 h-full" />
        </div>
      </div>
    );
  }

  if (themeError) {
    return <div className="p-6 text-destructive">Error loading theme settings: {themeError.message}</div>;
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col overflow-hidden">
      <Toolbar
        title="Customize Theme"
        onBack={() => navigate(-1)}
        canUndo={canUndo}
        canRedo={canRedo}
        isDirty={false} // Theme auto-saves, no dirty state
        onUndo={undo}
        onRedo={redo}
        onSave={save}
        onPublish={() => {}} // Keep hidden but functional if needed
        onPreview={() => openPreviewWindow('/')}
        showPublish={false}
        showPreview={true}
        showViewportToggle={false}
      />

      <div className="flex-1 flex gap-4 overflow-hidden p-4">
        {/* Left/Main: Live Preview Canvas */}
        <div className="flex-1 overflow-hidden">
          <ThemePreviewPanel />
        </div>

        {/* Right Sidebar: Settings */}
        <div className="w-80 flex-shrink-0 flex flex-col overflow-y-auto gap-4 border rounded-lg p-4">
          {/* Theme Selection Section */}
          <section>
            <div className="flex items-center justify-between mb-2 cursor-pointer" onClick={() => toggleSection('theme')}>
              <h3 className="font-semibold text-sm">Theme</h3>
              <span className="text-xs text-muted-foreground">{expandedSections.theme ? '▼' : '▶'}</span>
            </div>
            {expandedSections.theme && (
              <div className="mt-3">
                <ThemeSelection />
              </div>
            )}
          </section>

          {/* Appearance Section */}
          <section>
            <div className="flex items-center justify-between mb-2 cursor-pointer" onClick={() => toggleSection('appearance')}>
              <h3 className="font-semibold text-sm">Appearance</h3>
              <span className="text-xs text-muted-foreground">{expandedSections.appearance ? '▼' : '▶'}</span>
            </div>
            {expandedSections.appearance && (
              <div className="mt-3">
                <ThemeControls />
              </div>
            )}
          </section>

          {/* Custom Code Section */}
          <section>
            <div className="flex items-center justify-between mb-2 cursor-pointer" onClick={() => toggleSection('code')}>
              <h3 className="font-semibold text-sm">Custom Code</h3>
              <span className="text-xs text-muted-foreground">{expandedSections.code ? '▼' : '▶'}</span>
            </div>
            {expandedSections.code && (
              <div className="mt-3">
                <CustomCodeEditor />
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default CustomizeThemeV2;
