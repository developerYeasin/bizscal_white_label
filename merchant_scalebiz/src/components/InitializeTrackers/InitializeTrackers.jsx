import React, { useState } from "react";
import TagManager from "react-gtm-module";
import ReactPixel from "react-facebook-pixel";
// Removed import for react-tiktok-pixel as it's now manually integrated
import { useEffect } from "react";
import { apiClient } from "../../lib/api";

const InitializeTrackers = () => {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeTrackers = async () => {
      try {
        const getIntegrations = await apiClient.get(
          "/store_configuration/integrations"
        );
        const { seo } = getIntegrations?.data?.integrations;
        if (!seo) return;

        if (seo?.gtm_id) {
          TagManager.initialize({ gtmId: seo?.gtm_id.trim() });
        }

        if (seo?.fb_pixel_id || seo?.pixel_test_event_id) {
          const options = {
            autoConfig: true,
            debug: false,
          };
          ReactPixel.init(
            seo.pixel_test_event_id ? seo?.pixel_test_event_id.trim() : seo?.fb_pixel_id.trim(),
            null,
            options
          );
          ReactPixel.pageView();
        }

        // NEW: Initialize TikTok Pixel manually
        if (seo?.tiktok_pixel_id && window.ttq) {
          window.ttq.load(seo.tiktok_pixel_id.trim());
          window.ttq.page(); // Initial page view
        }

        setIsInitialized(true);
      } catch (error) {
        console.error("Failed to initialize tracking scripts:", error);
      }
    };

    initializeTrackers();
  }, []);

  // console.log(" is isInitialized >> ", isInitialized);

  return <div></div>;
};

export default InitializeTrackers;