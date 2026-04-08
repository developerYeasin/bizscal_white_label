"use client";

import React from "react";
import { useStoreConfig } from "@/contexts/StoreConfigurationContext.jsx";
import FooterSettingsSection from "@/components/shop-settings/FooterSettingsSection.jsx";

/**
 * SystemFooterSettings - Adapter for Page Builder Properties Panel
 *
 * Wraps the existing FooterSettingsSection to work with the PropertiesPanel adapter pattern.
 * This component directly updates the global store configuration.
 */
const SystemFooterSettings = ({ component, updateNested, isUpdating }) => {
  // The component prop contains the block data (with potential overrides)
  // But for footer, we edit the global config directly, so we don't need component data

  // We need to expose the same interface as FooterSettingsSection expects
  // FooterSettingsSection uses useStoreConfig internally and doesn't accept props
  // So we can just render it directly

  return <FooterSettingsSection />;
};

export default SystemFooterSettings;
