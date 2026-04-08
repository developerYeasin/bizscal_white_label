"use client";

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar.jsx";
import { User, LogOut, Settings, Moon, Sun } from "lucide-react";
import { showSuccess } from "@/utils/toast.js";
import { useStoreConfig } from "@/contexts/StoreConfigurationContext.jsx";
import { cn } from "@/lib/utils.js";
import { useIsMobile } from "@/hooks/use-mobile.js";
import { useTheme } from "next-themes";
import { useAuth } from "@/contexts/AuthContext.jsx"; // New import

const DashboardAdminHeader = ({ isSidebarCollapsed }) => {
  const navigate = useNavigate();
  const { config, isLoading: storeConfigLoading } = useStoreConfig();
  const isMobile = useIsMobile();
  const { theme, setTheme } = useTheme();
  const { user, logout, loading: authLoading } = useAuth(); // Use useAuth hook

  const handleLogout = async () => {
    await logout(); // Use logout from AuthContext
    navigate("/login");
  };

  const shopName = config?.store_name || "Admin Dashboard";
  const userName = user?.name || "Guest";
  const userEmail = user?.email || "";
  const userAvatar = user?.avatar_url || "https://github.com/shadcn.png";

  const headerLeftClass = isMobile ? "left-0" : (isSidebarCollapsed ? "left-16" : "left-64");

  if (authLoading || storeConfigLoading) {
    return (
      <header className={cn(
        "fixed top-0 right-0 z-[99] flex h-16 items-center gap-4 border-b bg-background px-4 transition-all duration-200",
        headerLeftClass
      )}>
        <div className="flex-1">
          <div className="h-6 w-48 bg-gray-200 rounded"></div>
        </div>
        <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
        <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
      </header>
    );
  }

  return (
    <header className={cn(
      "fixed top-0 right-0 z-[99] flex h-16 items-center gap-4 border-b bg-background px-4 transition-all duration-200",
      headerLeftClass
    )}>
      <div className="flex-1">
        <h1 className="text-lg font-semibold text-foreground">{shopName}</h1>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="mr-2"
      >
        {theme === "dark" ? (
          <Sun className="h-5 w-5" />
        ) : (
          <Moon className="h-5 w-5" />
        )}
        <span className="sr-only">Toggle theme</span>
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="icon" className="rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src={userAvatar} alt={userName} />
              <AvatarFallback>
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <span className="sr-only">Toggle user menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>
            {userName}
            <p className="text-xs text-muted-foreground">{userEmail}</p>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link to="/profile" className="flex items-center">
              <User className="mr-2 h-4 w-4" /> Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/settings" className="flex items-center">
              <Settings className="mr-2 h-4 w-4" /> Settings
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout} className="flex items-center text-destructive">
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
};

export default DashboardAdminHeader;