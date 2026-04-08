"use client";

import React from "react";
import { useStore } from "@/context/StoreContext.jsx";
import DefaultFooter from "./DefaultTheme/DefaultFooter";
import PremiumFooter from "./PremiumTheme/PremiumFooter";
import { useTranslation } from "react-i18next"; // Import useTranslation

export const Footer = ({
  layout,
  copyrightText,
  socialLinks,
  logoUrl,
  storeName,
}) => {
  const { t } = useTranslation(); // Initialize useTranslation
  const { storeConfig } = useStore();
  const currentThemeId = storeConfig?.storeConfiguration?.themeId;

  // The provided JSON for 'premium' theme uses 'detailed-info' layout.
  // Assuming 'diamond' theme might also use 'detailed-info' or 'multi-column'/'contact-and-links'.
  // For simplicity, if it's 'premium' or if the layout style is 'detailed-info', use PremiumFooter.
  // Otherwise, use DefaultFooter.
  const layoutStyle = layout?.layoutStyle;

  // Dynamically generate copyright text if not provided, using translation
  const resolvedCopyrightText =
    copyrightText ||
    t("copyright", { year: new Date().getFullYear(), storeName: storeName });

  if (
    currentThemeId === "premium" ||
    currentThemeId === "diamond" ||
    layoutStyle === "detailed-info"
  ) {
    return (
      <PremiumFooter
        layout={layout}
        copyrightText={resolvedCopyrightText}
        socialLinks={socialLinks}
        logoUrl={logoUrl}
        storeName={storeName}
      />
    );
  } else {
    return (
      <DefaultFooter
        layout={layout}
        copyrightText={resolvedCopyrightText}
        socialLinks={socialLinks}
        logoUrl={logoUrl}
        storeName={storeName}
      />
    );
  }
};
