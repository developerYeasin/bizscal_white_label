"use client";

import React from "react";
import BuilderHeader from "../Header";

/**
 * SystemHeaderSettings - Adapter for Page Builder Properties Panel
 *
 * This component uses the BuilderHeader component which saves settings to the block data.
 */
const SystemHeaderSettings = ({ component, updateNested, isUpdating }) => {
  console.log("SystemHeaderSettings component data:", component?.data);
  return (
    <BuilderHeader
      data={component?.data || {}}
      updateNested={updateNested}
    />
  );
};

export default SystemHeaderSettings;
