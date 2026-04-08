"use client";

import React from "react";
import { useStoreConfig } from "@/contexts/StoreConfigurationContext.jsx";
import HeaderSettingsSection from "@/components/shop-settings/HeaderSettingsSection.jsx";

/**
 * SystemHeaderSettings - Adapter for Page Builder Properties Panel
 *
 * Wraps the existing HeaderSettingsSection to work with the PropertiesPanel adapter pattern.
 * This component directly updates the global store configuration.
 */
const SystemHeaderSettings = ({ component, updateNested, isUpdating }) => {
  const { config, updateNested: globalUpdateNested, save, isUpdating: globalIsUpdating } = useStoreConfig();

  // The component prop contains the block data (with potential overrides)
  // But for header, we edit the global config directly, so we don't need component data

  // We need to expose the same interface as HeaderSettingsSection expects
  // HeaderSettingsSection uses useStoreConfig internally and doesn't accept props
  // So we can just render it directly

  return <HeaderSettingsSection />;
};

export default SystemHeaderSettings;
