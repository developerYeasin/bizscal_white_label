"use client";

import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { apiClient } from "@/lib/api.js"; // Import apiClient
import { useStore } from "@/context/StoreContext.jsx"; // Import useStore

const AnalyticsTracker = () => {
  const location = useLocation();
  const { storeConfig, isLoading: isStoreConfigLoading } = useStore(); // Get storeConfig to access storeId

  useEffect(() => {
    // // console.log(
    //   "AnalyticsTracker: Sending page view tracking data:",
    //   storeConfig
    // );
    const trackPageView = async () => {
      // Ensure storeConfig is loaded and has a storeId before attempting to track
      if (
        isStoreConfigLoading ||
        !storeConfig ||
        !storeConfig.storeConfiguration ||
        !storeConfig.storeConfiguration.storeId
      ) {
        console.warn(
          "AnalyticsTracker: Store configuration or storeId not available yet. Skipping tracking."
        );
        return;
      }

      const trackingData = {
        path: location.pathname + location.search, // Include search parameters
        referrer: document.referrer,
        screenWidth: window.innerWidth,
      };

      try {
        // Use apiClient to send data. The X-Store-ID header is automatically set by StoreProvider.
        await apiClient.post("/track-visit", trackingData);
        // // console.log(
        //   "AnalyticsTracker: Page view tracked successfully:",
        //   trackingData
        // );
      } catch (error) {
        console.error("AnalyticsTracker: Tracking failed:", error);
      }
    };

    trackPageView();
  }, [location, storeConfig, isStoreConfigLoading]); // Re-run effect when location or storeConfig changes

  return null; // This component doesn't render anything
};

export default AnalyticsTracker;
