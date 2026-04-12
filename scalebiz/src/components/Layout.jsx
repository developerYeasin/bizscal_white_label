"use client";

import React from "react";
import { MadeWithDyad } from "@/components/made-with-scalebiz.jsx";
import Sidebar from "@/components/Sidebar.jsx";
import { useIsMobile } from "@/hooks/use-mobile.js";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Menu } from "lucide-react";
import { Outlet } from "react-router-dom"; // Removed useNavigate
import { cn } from "@/lib/utils.js";
import DashboardAdminHeader from "./DashboardAdminHeader.jsx";
import { useThemeConfig } from "@/contexts/ThemeSettingsContext.jsx"; // Import useThemeConfig
// import ConfigLoader from "@/components/ConfigLoader.jsx";
// Removed: import { useAuth } from "@/contexts/AuthContext.jsx"; // No longer needed

const Layout = () => {
  const isMobile = useIsMobile();
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false);
  // Removed: const navigate = useNavigate();
  const { config: themeConfig } = useThemeConfig(); // Get theme config
  // Removed: const { isAuthenticated } = useAuth(); // No longer needed here

  const toggleSidebarCollapse = () => {
    setIsSidebarCollapsed((prev) => !prev);
  };

  // Removed: React.useEffect(() => {
  // Removed:   if (!isAuthenticated) {
  // Removed:     navigate("/login");
  // Removed:   }
  // Removed: }, [navigate, isAuthenticated]);

  // Apply dynamic CSS variables
  React.useEffect(() => {
    if (themeConfig) {
      document.documentElement.style.setProperty(
        "--dynamic-primary-color",
        themeConfig.primary_color || "#6B46C1",
      );
      document.documentElement.style.setProperty(
        "--dynamic-secondary-color",
        themeConfig.secondary_color || "#FFFFFF",
      );
      document.documentElement.style.setProperty(
        "--dynamic-heading-font",
        themeConfig.typography?.headingFont
          ? `'${themeConfig.typography.headingFont}', sans-serif`
          : "Roboto, sans-serif",
      );
      document.documentElement.style.setProperty(
        "--dynamic-body-font",
        themeConfig.typography?.bodyFont
          ? `'${themeConfig.typography.bodyFont}', sans-serif`
          : "Open Sans, sans-serif",
      );
    }
  }, [themeConfig]);

  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      {isMobile ? (
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="fixed top-4 left-4 z-50"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            <Sidebar
              onClose={() => setIsSheetOpen(false)}
              isCollapsed={false}
              onToggleCollapse={() => {}}
            />
          </SheetContent>
        </Sheet>
      ) : (
        <aside
          className={cn(
            "hidden md:flex flex-col fixed inset-y-0 z-10 transition-all duration-200",
            isSidebarCollapsed ? "w-16" : "w-64",
          )}
        >
          <Sidebar
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={toggleSidebarCollapse}
          />
        </aside>
      )}

      <DashboardAdminHeader isSidebarCollapsed={isSidebarCollapsed} />

      <main
        className={cn(
          "flex-1 overflow-x-auto pt-16", // pt-16 for header height
          isMobile ? "" : isSidebarCollapsed ? "ml-16" : "ml-64", // ml for sidebar width
        )}
      >
        <div className="p-4 md:p-6 bg-background">
          <Outlet />
        </div>
        <MadeWithDyad />
      </main>
      {/* <ConfigLoader /> */}
    </div>
  );
};

export default Layout;
