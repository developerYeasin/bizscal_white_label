import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchStoreConfig, mapRawApiConfigToInternal } from "@/lib/api.js";
import { apiClient } from "@/lib/api.js";

const StoreContext = createContext({
  storeConfig: null,
  isLoading: true,
  error: null,
  currentCurrency: "USD", // Default currency
  setCurrentCurrency: () => {},
  currencyConversionRate: 121.99, // 1 USD = 121.99 BDT
});

// Helper to convert HEX to HSL for shadcn compatibility
function hexToHsl(hex) {
  // Ensure hex is a string before proceeding
  if (typeof hex !== "string" || !hex.startsWith("#")) {
    console.warn("Invalid hex color provided to hexToHsl:", hex);
    return "0 0% 0%"; // Fallback to black HSL
  }

  hex = hex.replace(/^#/, "");
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0,
    s = 0,
    l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(
    l * 100
  )}%`;
}

// Helper to get luminance of a hex color to determine if it's light or dark
function getLuminance(hex) {
  // Ensure hex is a string before proceeding
  if (typeof hex !== "string" || !hex.startsWith("#")) {
    console.warn("Invalid hex color provided to getLuminance:", hex);
    return 0; // Fallback to darkest luminance
  }

  hex = hex.replace(/^#/, "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  // Formula to determine color brightness
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

// Define a default theme to use if storeConfig.theme is missing or incomplete
const defaultTheme = {
  primaryColor: "#000000",
  secondaryColor: "#FFFFFF",
  accentColor: "#000000",
  textColor: "#000000",
  typography: { headingFont: "Inter", bodyFont: "Inter" },
  buttonStyle: { cornerRadius: "0.5rem", style: "solid" },
  announcementBar: { backgroundColor: "#000000", textColor: "#FFFFFF" },
  productCardStyle: "default",
  buyNowButtonEnabled: 0, // Default to disabled
};

export const StoreProvider = ({
  children,
  storeIdFromUrl,
  livePreviewConfig,
}) => {
  // Set X-Store-ID header on apiClient whenever storeIdFromUrl changes
  useEffect(() => {
    if (storeIdFromUrl) {
      apiClient.defaults.headers.common["X-Store-ID"] = storeIdFromUrl;
      // console.log(
      //   `[StoreContext] Setting X-Store-ID header: ${storeIdFromUrl}`
      // );
    } else {
      // If no storeId in URL (custom domain), remove the header to let backend infer
      delete apiClient.defaults.headers.common["X-Store-ID"];
      // console.log(
      //   "[StoreContext] Removing X-Store-ID header (custom domain scenario)."
      // );
    }
  }, [storeIdFromUrl]);

  const {
    data: fetchedStoreConfig,
    isLoading: isFetchingConfig,
    error: fetchError,
  } = useQuery({
    queryKey: ["storeConfig"],
    queryFn: fetchStoreConfig,
    enabled: !livePreviewConfig, // Corrected: Query should always run if not in live preview mode
    staleTime: 1000 * 60 * 60, // 1 hour
    retry: 1,
  });

  const [currentCurrency, setCurrentCurrency] = useState("BDT"); // Default to BDT
  const currencyConversionRate = 121.99; // 1 USD = 121.99 BDT

  // Determine the actual config to use: livePreviewConfig takes precedence
  const storeConfigToProcess = useMemo(() => {
    if (livePreviewConfig) {
      // The payload config is the raw API response, so map it
      return mapRawApiConfigToInternal(livePreviewConfig);
    }
    return fetchedStoreConfig;
  }, [livePreviewConfig, fetchedStoreConfig]);

  // Overall loading state: true if fetching or if livePreviewConfig is present but not yet processed
  const isLoadingOverall =
    isFetchingConfig || (livePreviewConfig && !storeConfigToProcess);
  const errorOverall = fetchError; // For simplicity, just use fetchError for now

  // Process the determined storeConfig (either live preview or fetched) to ensure all theme properties have defaults
  const processedStoreConfig = useMemo(() => {
    if (!storeConfigToProcess) return null;

    const theme = storeConfigToProcess.theme || {};
    const layout = storeConfigToProcess.layout || {};
    const pageSettings = storeConfigToProcess.pages || {};

    // Apply defaults to theme properties, explicitly checking for null/undefined
    const mergedTheme = {
      name: theme.name ?? defaultTheme.name,
      primaryColor: theme.primaryColor ?? defaultTheme.primaryColor,
      secondaryColor: theme.secondaryColor ?? defaultTheme.secondaryColor,
      accentColor: theme.accentColor ?? defaultTheme.accentColor,
      textColor: theme.textColor ?? defaultTheme.textColor,
      productCardStyle: theme.productCardStyle ?? defaultTheme.productCardStyle,
      buyNowButtonEnabled:
        theme.buyNowButtonEnabled ?? defaultTheme.buyNowButtonEnabled,
      typography: {
        ...defaultTheme.typography,
        ...theme.typography,
      },
      buttonStyle: {
        ...defaultTheme.buttonStyle,
        ...theme.buttonStyle,
      },
      announcementBar: {
        ...defaultTheme.announcementBar,
        ...theme.announcementBar,
      },
    };

    const mergedLayout = {
      ...layout,
      footer: {
        ...(layout.footer || {}),
        copyrightText:
          layout.footer?.copyrightText ||
          `© ${new Date().getFullYear()} ${
            storeConfigToProcess.storeConfiguration.storeName
          }. All rights reserved.`,
        socialLinks: layout.footer?.socialLinks || [],
        columns: layout.footer?.columns || [],
      },
      announcements: layout.announcements || [],
    };

    return {
      ...storeConfigToProcess,
      theme: mergedTheme,
      layout: mergedLayout,
      pages: pageSettings,
    };
  }, [storeConfigToProcess]);

  useEffect(() => {
    // console.log(
    //   "StoreContext: isLoading =",
    //   isLoadingOverall,
    //   "error =",
    //   errorOverall
    // );
    if (processedStoreConfig) {
      const theme = processedStoreConfig.theme;

      const typography = theme.typography;
      const primaryColor = theme.primaryColor;
      const secondaryColor = theme.secondaryColor;
      const accentColor = theme.accentColor;
      const textColor = theme.textColor;
      const buttonStyle = theme.buttonStyle;
      const announcementBar = theme.announcementBar;

      const headingFont = typography.headingFont?.replace(/\s/g, "+");
      const bodyFont = typography.bodyFont?.replace(/\s/g, "+");
      const fontUrl = `https://fonts.googleapis.com/css2?family=${headingFont}:wght@400;700&family=${bodyFont}:wght@400;700&display=swap`;

      const primaryHsl = hexToHsl(primaryColor);

      const primaryLuminance = getLuminance(primaryColor);

      const idealForegroundColor =
        primaryLuminance > 140 ? textColor : "#FFFFFF";
      const secondaryHsl = hexToHsl(secondaryColor);
      const secondaryHslF = hexToHsl(secondaryColor);

      const styleContent = `
        @import url('${fontUrl}');
        :root {
          --dynamic-heading-font: '${typography.headingFont}';
          --dynamic-body-font: '${typography.bodyFont}';
          
          /* Override shadcn theme variables with contrast-safe colors */
          --primary: ${primaryHsl};
          --primary-foreground: ${secondaryHsl};
          --radius: ${buttonStyle.cornerRadius};
          
          --secondary: ${secondaryHsl};
          --secondary-foreground: ${secondaryHsl};
          
          --textprimary: ${textColor};
          /* Keep original dynamic colors for other components */
          --dynamic-primary-color: ${primaryColor};
          --dynamic-secondary-color: ${secondaryColor};
          --dynamic-accent-color: ${accentColor};
          --dynamic-text-color: ${textColor};
          --dynamic-announcement-bg: ${announcementBar.backgroundColor};
          --dynamic-announcement-text: ${announcementBar.textColor};
        }
      `;

      const styleElementId = "dynamic-theme-styles";
      let styleElement = document.getElementById(styleElementId);
      if (!styleElement) {
        styleElement = document.createElement("style");
        styleElement.id = styleElementId;
        document.head.appendChild(styleElement);
      }
      styleElement.innerHTML = styleContent;

      // Inject custom CSS
      const customCss = processedStoreConfig.page_settings?.custom_css || "";
      let customCssElement = document.getElementById("custom-css-styles");
      if (!customCssElement) {
        customCssElement = document.createElement("style");
        customCssElement.id = "custom-css-styles";
        document.head.appendChild(customCssElement);
      }
      customCssElement.innerHTML = customCss;

      // Inject custom JS (recreate script to execute)
      const customJs = processedStoreConfig.page_settings?.custom_js || "";
      let customJsElement = document.getElementById("custom-js-script");
      if (customJsElement) {
        customJsElement.remove();
      }
      if (customJs && customJs.trim() !== "") {
        customJsElement = document.createElement("script");
        customJsElement.id = "custom-js-script";
        customJsElement.textContent = customJs;
        document.body.appendChild(customJsElement);
      }

      if (processedStoreConfig.storeConfiguration) {
        document.title = processedStoreConfig.storeConfiguration.storeName;
        const favicon =
          document.querySelector("link[rel*='icon']") ||
          document.createElement("link");
        const faviconToUse =
          processedStoreConfig.storeConfiguration.faviconUrl ||
          processedStoreConfig.storeConfiguration.logoUrl;
        console.log("faviconToUse >> ", faviconToUse);
        console.log("favicon.href >> ", favicon?.href);
        console.log("favicon >> ", favicon);
        if (favicon && faviconToUse) {
          favicon.type = "image/x-icon";
          favicon.rel = "icon";
          favicon.href = faviconToUse;

          if (!document.head.contains(favicon)) {
            document.getElementsByTagName("head")[0].appendChild(favicon);
          }
        }
      }
    }
  }, [processedStoreConfig, isLoadingOverall, errorOverall]);

  return (
    <StoreContext.Provider
      value={{
        storeConfig: processedStoreConfig,
        isLoading: isLoadingOverall,
        error: errorOverall,
        currentCurrency,
        setCurrentCurrency,
        currencyConversionRate,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
};
