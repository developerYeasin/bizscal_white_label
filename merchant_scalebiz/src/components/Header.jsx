"use client";

import React, { useCallback, useEffect } from "react";
import { useStore } from "@/context/StoreContext.jsx";
import LegacyDefaultHeader from "./DefaultTheme/LegacyDefaultHeader";
import PremiumHeader from "./PremiumTheme/PremiumHeader";
import DiamondHeader from "./DiamondTheme/DiamondHeader";
import PrimaryHeader from "./PrimaryTheme/PrimaryHeader";
import { useOutletContext } from "react-router-dom";

export const Header = ({ layout, storeName, logoUrl, themeId }) => {
  const { storeConfig } = useStore();
  const currentThemeId = storeConfig?.storeConfiguration?.themeId || themeId;
  const { onOpenCartSidebar } = useOutletContext();

  // Get announcements from storeConfig, defaulting to an empty array if not present
  const announcements = storeConfig?.layout?.announcements || [];

  // Sticky header logic (moved from previous Header.jsx)
  const [isVisible, setIsVisible] = React.useState(false);
  const toggleVisibility = useCallback(() => {
    if (window.scrollY > 200) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, [toggleVisibility]);

  // Render the appropriate header based on themeId
  if (currentThemeId === "premium") {
    return <PremiumHeader layout={layout} storeName={storeName} logoUrl={logoUrl} themeId={currentThemeId} onOpenCartSidebar={onOpenCartSidebar} announcements={announcements} />;
  } else if (currentThemeId === "diamond") {
    return <DiamondHeader layout={layout} storeName={storeName} logoUrl={logoUrl} themeId={currentThemeId} onOpenCartSidebar={onOpenCartSidebar} announcements={announcements} />;
  } else if (currentThemeId === "primary") {
    return <PrimaryHeader layout={layout} storeName={storeName} logoUrl={logoUrl} themeId={currentThemeId} onOpenCartSidebar={onOpenCartSidebar} announcements={announcements} />;
  } else {
    return <LegacyDefaultHeader layout={layout} storeName={storeName} logoUrl={logoUrl} themeId={currentThemeId} onOpenCartSidebar={onOpenCartSidebar} announcements={announcements} />;
  }
};