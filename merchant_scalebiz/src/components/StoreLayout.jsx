"use client";

import React, { useState, useContext } from "react";
import { Outlet, useParams, useLocation } from "react-router-dom"; // Add useLocation
import { useStore, StoreProvider } from "@/context/StoreContext.jsx";
import RightBottomCornerButtons from "@/components/RightBottomCornerButtons.jsx";
import CartSidebar from "@/components/CartSidebar"; // Import CartSidebar
import InitializeTrackers from "./InitializeTrackers/InitializeTrackers";
import AnalyticsTracker from "./AnalyticsTracker.jsx"; // NEW: Import AnalyticsTracker

// Removed AnnouncementBar and MarqueeSection imports

const StoreLayout = ({ livePreviewConfig }) => {
  // Accept livePreviewConfig prop
  const { storeId } = useParams(); // Get storeId from URL params if available
  const location = useLocation(); // Get location object to read query params
  const [isCartSidebarOpen, setIsCartSidebarOpen] = useState(false); // State for cart sidebar
  // Extract 'config' query parameter from the URL
  const queryParams = new URLSearchParams(location.search);
  const initialConfigJson = queryParams.get("config"); // This will be a JSON string if present

  const handleOpenCartSidebar = () => {
    setIsCartSidebarOpen(true);
  };

  const handleCloseCartSidebar = () => {
    setIsCartSidebarOpen(false);
  };
  return (
    <StoreProvider
      storeIdFromUrl={storeId}
      initialConfigJson={initialConfigJson}
      livePreviewConfig={livePreviewConfig} // Pass livePreviewConfig here
    >
      {" "}
      {/* Pass initialConfigJson */}
      <AnalyticsTracker /> {/* NEW: Add AnalyticsTracker here */}
      {/* Pass onOpenCartSidebar via context */}
      <RightBottomCornerButtons />
      <Outlet context={{ onOpenCartSidebar: handleOpenCartSidebar }} />{" "}
      <CartSidebar
        isOpen={isCartSidebarOpen}
        onClose={handleCloseCartSidebar}
      />
    </StoreProvider>
  );
};

export default StoreLayout;
