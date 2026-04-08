"use client";

import { useRef, useCallback, useEffect } from 'react';
import { useStoreConfig } from '@/contexts/StoreConfigurationContext.jsx';
import { useThemeConfig } from '@/contexts/ThemeSettingsContext.jsx';

// Storefront URL where preview should be displayed
// In production, this would be your storefront domain
const STOREFRONT_URL = process.env.VITE_STOREFRONT_URL || 'http://localhost:8080';

/**
 * Hook to manage live preview functionality
 * Sends store configuration updates to an opened preview window
 */
export const useLivePreview = (previewOverrides = {}) => {
  const previewWindowRef = useRef(null);
  const { config: storeConfig } = useStoreConfig();
  const { config: themeConfig } = useThemeConfig();

  /**
   * Open a new window for live preview and send initial config
   */
  const openPreviewWindow = useCallback((path = '/') => {
    // Close any existing preview window
    if (previewWindowRef.current && !previewWindowRef.current.closed) {
      previewWindowRef.current.close();
    }

    // Open new window with the storefront
    const previewUrl = `${STOREFRONT_URL}${path}`;
    const newWindow = window.open(previewUrl, '_blank', 'width=1200,height=800,menubar=no,toolbar=no,location=no,status=no');
    previewWindowRef.current = newWindow;

    // Wait for window to load then send initial config
    if (newWindow) {
      newWindow.addEventListener('load', () => {
        sendConfigToPreview();
      });
    }

    return newWindow;
  }, []);

  /**
   * Send current store configuration to the preview window
   * Merges previewOverrides (e.g., unsaved page editor changes) with the saved config
   */
  const sendConfigToPreview = useCallback(() => {
    const previewWindow = previewWindowRef.current;
    if (!previewWindow || previewWindow.closed) {
      return;
    }

    if (!storeConfig || !themeConfig) {
      return;
    }

    // Build the base preview config payload from store and theme configs
    let previewPayload = {
      store_id: storeConfig.store_id,
      store_name: storeConfig.store_name,
      logo_url: storeConfig.logo_url,
      hostname: storeConfig.hostname,
      layout_settings: storeConfig.layout_settings,
      page_settings: storeConfig.page_settings,
      delivery_settings: storeConfig.delivery_settings,
      payment_settings: storeConfig.payment_settings,
      integrations: storeConfig.integrations,
      theme_settings: themeConfig,
    };

    // Apply overrides if provided (e.g., for unsaved page builder changes)
    if (previewOverrides) {
      previewPayload = {
        ...previewPayload,
        ...previewOverrides,
        // Ensure nested page_settings.landingPage.components can be overridden
        page_settings: {
          ...previewPayload.page_settings,
          ...previewOverrides.page_settings,
          landingPage: {
            ...previewPayload.page_settings?.landingPage,
            ...previewOverrides.page_settings?.landingPage,
            components: previewOverrides.page_settings?.landingPage?.components ||
                       previewPayload.page_settings?.landingPage?.components || [],
          }
        }
      };
    }

    // Send to preview window
    previewWindow.postMessage({
      type: 'LIVE_PREVIEW_UPDATE',
      payload: { config: previewPayload }
    }, '*');
  }, [storeConfig, themeConfig, previewOverrides]);

  /**
   * Close the preview window
   */
  const closePreviewWindow = useCallback(() => {
    if (previewWindowRef.current && !previewWindowRef.current.closed) {
      previewWindowRef.current.close();
      previewWindowRef.current = null;
    }
  }, []);

  // Auto-send updates when config changes (if preview window is open)
  useEffect(() => {
    if (storeConfig && themeConfig) {
      sendConfigToPreview();
    }
  }, [storeConfig, themeConfig, sendConfigToPreview, previewOverrides]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (previewWindowRef.current && !previewWindowRef.current.closed) {
        previewWindowRef.current.close();
      }
    };
  }, []);

  return {
    openPreviewWindow,
    sendConfigToPreview,
    closePreviewWindow,
    isPreviewWindowOpen: previewWindowRef.current && !previewWindowRef.current.closed,
  };
};

