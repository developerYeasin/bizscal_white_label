"use client";

import React, { useCallback, useEffect } from "react";
import { useStore } from "@/context/StoreContext.jsx";
import LegacyDefaultHeader from "./DefaultTheme/LegacyDefaultHeader"; // Updated import
import PremiumHeader from "./PremiumTheme/PremiumHeader";
import DiamondHeader from "./DiamondTheme/DiamondHeader";
import PrimaryHeader from "./PrimaryTheme/PrimaryHeader"; // New import

export const Header = ({ layout, storeName, logoUrl, themeId }) => {
  const { storeConfig } = useStore();
  const currentThemeId = storeConfig?.storeConfiguration?.themeId || themeId;

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
    return <PremiumHeader layout={layout} storeName={storeName} logoUrl={logoUrl} themeId={currentThemeId} />;
  } else if (currentThemeId === "diamond") {
    return <DiamondHeader layout={layout} storeName={storeName} logoUrl={logoUrl} themeId={currentThemeId} />;
  } else if (currentThemeId === "primary") { // New condition for primary theme
    return <PrimaryHeader layout={layout} storeName={storeName} logoUrl={logoUrl} themeId={currentThemeId} />;
  } else {
    // Fallback to LegacyDefaultHeader if no specific themeId matches
    return <LegacyDefaultHeader layout={layout} storeName={storeName} logoUrl={logoUrl} themeId={currentThemeId} />;
  }
};