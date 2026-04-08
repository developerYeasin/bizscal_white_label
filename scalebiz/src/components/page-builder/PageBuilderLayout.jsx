"use client";

import React, { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Menu, PanelLeftClose, PanelLeft, X } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import { cn } from "@/lib/utils.js";

/**
 * PageBuilderLayout - Dedicated full-screen layout for the page builder
 *
 * Features:
 * - Minimal chrome, maximum canvas space
 * - Collapsible side panels (component palette, properties)
 * - Toolbar at top
 * - Full-screen editor experience
 */
const PageBuilderLayout = () => {
  const [leftPanelOpen, setLeftPanelOpen] = useState(true);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleLeftPanel = () => setLeftPanelOpen(!leftPanelOpen);
  const toggleRightPanel = () => setRightPanelOpen(!rightPanelOpen);

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-background flex flex-col">
      {/* Top Toolbar */}
      <header className="h-14 border-b bg-background flex items-center justify-between px-4 flex-shrink-0 z-20">
        {/* Left side: Navigation & Title */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={handleBack} className="h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
          <div className="h-6 w-px bg-border" />
          <h1 className="text-lg font-semibold truncate max-w-md">
            Page Builder
          </h1>
        </div>

        {/* Right side: Panel toggles (desktop) */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleLeftPanel}
            className="hidden md:flex h-8"
          >
            {leftPanelOpen ? (
              <PanelLeftClose className="h-4 w-4 mr-2" />
            ) : (
              <PanelLeft className="h-4 w-4 mr-2" />
            )}
            Components
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={toggleRightPanel}
            className="hidden md:flex h-8"
          >
            {rightPanelOpen ? (
              <PanelLeftClose className="h-4 w-4 mr-2" />
            ) : (
              <PanelLeft className="h-4 w-4 mr-2" />
            )}
            Properties
          </Button>
          {/* Mobile menu toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden h-8 w-8"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Panel - Component Palette */}
        <aside
          className={cn(
            "border-r bg-card flex flex-col transition-all duration-300 z-10",
            leftPanelOpen
              ? "w-80 translate-x-0"
              : "w-0 -translate-x-full opacity-0",
            "md:relative absolute inset-y-0 left-0 overflow-hidden"
          )}
        >
          <div className="flex-1 overflow-auto">
            <Outlet />
          </div>
        </aside>

        {/* Center - Canvas Area */}
        <main className="flex-1 relative overflow-auto bg-muted/30">
          <Outlet />
        </main>

        {/* Right Panel - Properties */}
        <aside
          className={cn(
            "border-l bg-card flex flex-col transition-all duration-300 z-10",
            rightPanelOpen
              ? "w-80 translate-x-0"
              : "w-0 translate-x-full opacity-0",
            "md:relative absolute inset-y-0 right-0 overflow-hidden"
          )}
        >
          <div className="flex-1 overflow-auto">
            <Outlet />
          </div>
        </aside>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-background/80 backdrop-blur z-30" />
      )}
    </div>
  );
};

export default PageBuilderLayout;
