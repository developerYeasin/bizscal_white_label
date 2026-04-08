"use client";

import React from "react";
import TopBar from "./header/TopBar.tsx";
import UtilityBar from "./header/UtilityBar.tsx";
import MainNav from "./header/MainNav.tsx";
import { useStoreConfig } from "@/contexts/StoreConfigurationContext.jsx";
import { Skeleton } from "@/components/ui/skeleton.jsx";

const Header: React.FC = () => {
  const { config, isLoading, error } = useStoreConfig();

  if (isLoading) {
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
        showGridIcon={headerSettings?.mainNav?.showGridIcon || false}
        showCartIcon={headerSettings?.mainNav?.showCartIcon || false}
        showWishlistIcon={headerSettings?.mainNav?.showWishlistIcon || false}
        showCompareIcon={headerSettings?.mainNav?.showCompareIcon || false}
        showSearchIcon={headerSettings?.mainNav?.showSearchIcon || false}
        enabled={headerSettings?.mainNav?.enabled || false}
      />
    </header>
  );
};

export default Header;