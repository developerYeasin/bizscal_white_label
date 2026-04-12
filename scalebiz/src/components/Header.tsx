"use client";

import React, { useEffect, useState } from "react";
import TopBar from "./header/TopBar.tsx";
import UtilityBar from "./header/UtilityBar.tsx";
import MainNav from "./header/MainNav.tsx";
import { useStoreConfig } from "@/contexts/StoreConfigurationContext.jsx";
import { Skeleton } from "@/components/ui/skeleton.jsx";
import { useQuery } from "@tanstack/react-query";
import { fetchCategories } from "@/lib/api.js";

interface CategoryItem {
  id: number;
  name: string;
  path: string;
  imageUrl?: string;
  subCategories?: { path: string; title: string }[];
}

const Header: React.FC = () => {
  const { config, isLoading: configLoading, error } = useStoreConfig();
  
  // Fetch categories for the category sidebar dropdown
  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    enabled: !!config,
  });

  if (configLoading || categoriesLoading) {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 bg-background shadow-sm">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-16 w-full" />
      </header>
    );
  }

  if (error || !config) {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 bg-destructive text-destructive-foreground p-2 text-center">
        Error loading header configuration.
      </header>
    );
  }

  const headerSettings = config.layout_settings?.header;
  
  // Get category sidebar settings
  const showCategorySidebar = headerSettings?.showCategorySidebar !== false;
  const categorySidebarPosition = headerSettings?.categorySidebarPosition || "left";
  
  // Convert categories to the format expected by MainNav
  interface CategoryData {
    id: number;
    name: string;
    path?: string;
    image_url?: string;
    subCategories?: { name: string; path: string }[];
  }
  
  const categoryItems: CategoryItem[] = ((categories || []) as CategoryData[]).map((cat) => ({
    id: cat.id,
    name: cat.name,
    path: cat.path || `/collections/${cat.name.toLowerCase().replace(/\s+/g, '-')}`,
    imageUrl: cat.image_url,
    subCategories: cat.subCategories?.map((sub) => ({
      path: sub.path || `/collections/${sub.name.toLowerCase().replace(/\s+/g, '-')}`,
      title: sub.name
    }))
  }));
  
  // Debug logging
  console.log("Header props:", {
    showCategorySidebar,
    categorySidebarPosition,
    categoriesCount: categoryItems.length,
    headerSettings,
  });

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background shadow-sm">
      <TopBar
        messages={headerSettings?.topBar?.messages || []}
        enabled={headerSettings?.topBar?.enabled || false}
      />
      <UtilityBar
        announcementText={headerSettings?.utilityBar?.announcementText || ""}
        showLanguageSelector={headerSettings?.utilityBar?.showLanguageSelector || false}
        showCurrencySelector={headerSettings?.utilityBar?.showCurrencySelector || false}
        showAuthLinks={headerSettings?.utilityBar?.showAuthLinks || false}
        enabled={headerSettings?.utilityBar?.enabled || false}
      />
      <MainNav
        logoUrl={headerSettings?.mainNav?.logoUrl || ""}
        navItems={headerSettings?.navItems || []} // Now uses header.navItems
        categories={categoryItems}
        showGridIcon={headerSettings?.mainNav?.showGridIcon || false}
        showCartIcon={headerSettings?.mainNav?.showCartIcon || false}
        showWishlistIcon={headerSettings?.mainNav?.showWishlistIcon || false}
        showCompareIcon={headerSettings?.mainNav?.showCompareIcon || false}
        showSearchIcon={headerSettings?.mainNav?.showSearchIcon || false}
        showCategorySidebar={showCategorySidebar}
        categorySidebarPosition={categorySidebarPosition}
        enabled={headerSettings?.mainNav?.enabled || false}
      />
    </header>
  );
};

export default Header;