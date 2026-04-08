"use client";

import React from "react";
// This file is intentionally left minimal as the actual Sidebar logic is in src/components/Sidebar.jsx
// This file might be a placeholder or intended for re-exporting.
// If you intended to have a different Sidebar component here, please provide its content.

const Sidebar = ({ children }) => {
  return (
    <div className="h-full w-full bg-sidebar text-sidebar-foreground">
      {children}
    </div>
  );
};

export default Sidebar;