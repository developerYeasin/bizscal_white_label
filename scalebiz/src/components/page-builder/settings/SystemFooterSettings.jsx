"use client";

import React from "react";
import BuilderFooter from "../Footer";

/**
 * SystemFooterSettings - Adapter for Page Builder Properties Panel
 *
 * This component uses the BuilderFooter component which saves settings to the block data.
 */
const SystemFooterSettings = ({ component, updateNested, isUpdating }) => {
  return (
    <BuilderFooter
      data={component?.data || {}}
      updateNested={updateNested}
    />
  );
};

export default SystemFooterSettings;
