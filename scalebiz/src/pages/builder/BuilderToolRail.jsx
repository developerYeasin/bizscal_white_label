"use client";

import React from "react";
import {
  Plus,
  FileText,
  Sliders,
  Palette,
  Settings,
} from "lucide-react";

const BuilderToolRail = ({
  activeLeftPanel,
  rightPanelOpen,
  storeConfig,
  openPanel,
  setRightPanelOpen,
}) => {
  return (
    <aside className="w-[68px] bg-white border-r border-gray-200 flex flex-col items-center py-4 shrink-0 z-30">
      {/* Logo */}
      <div className="w-8 h-8 rounded mb-6 shadow-sm overflow-hidden flex items-center justify-center">
        <img
          src="https://res.cloudinary.com/dfsqtffsg/image/upload/v1775561997/sx9jtrmomuabzwi7imuh.png"
          alt="Logo"
          className="w-full h-full object-contain"
        />
      </div>

      {/* Tool Buttons */}
      <nav className="flex flex-col gap-4 w-full items-center flex-1">
        {/* Add Block Button (highlighted) */}
        <button
          className={`flex items-center justify-center w-10 h-10 rounded-lg transition-colors shadow-sm ${
            activeLeftPanel === "blocks"
              ? "bg-[#1C2434] text-white"
              : "bg-white text-gray-400 hover:text-gray-900 border border-gray-200"
          }`}
          onClick={() => openPanel("blocks")}
          title="Add Block"
        >
          <Plus className="w-5 h-5" />
        </button>

        <div className="w-8 h-px bg-gray-200 my-2"></div>

        {/* Pages Button */}
        <button
          className={`flex flex-col items-center justify-center w-12 h-12 rounded-lg transition-colors ${
            activeLeftPanel === "pages"
              ? "bg-gray-100 text-gray-900"
              : "text-gray-400 hover:text-gray-900 hover:bg-gray-50"
          }`}
          onClick={() => openPanel("pages")}
          title="Pages"
        >
          <FileText className="w-5 h-5 mb-1" />
          <span className="text-[9px] font-medium">Pages</span>
        </button>

        {/* Properties Button */}
        <button
          className={`flex flex-col items-center justify-center w-12 h-12 rounded-lg transition-colors ${
            rightPanelOpen
              ? "bg-gray-100 text-gray-900"
              : "text-gray-400 hover:text-gray-900 hover:bg-gray-50"
          }`}
          onClick={() => {
            setRightPanelOpen(!rightPanelOpen);
            if (!rightPanelOpen && activeLeftPanel === "properties") {
              setActiveLeftPanel("blocks");
            }
          }}
          title="Properties"
        >
          <Sliders className="w-5 h-5 mb-1" />
          <span className="text-[9px] font-medium">Edit</span>
        </button>

        {/* Theme Button */}
        <button
          className={`flex flex-col items-center justify-center w-12 h-12 rounded-lg transition-colors ${
            activeLeftPanel === "theme"
              ? "bg-gray-100 text-gray-900"
              : "text-gray-400 hover:text-gray-900 hover:bg-gray-50"
          }`}
          onClick={() => openPanel("theme")}
          title="Theme"
        >
          <Palette className="w-5 h-5 mb-1" />
          <span className="text-[9px] font-medium">Theme</span>
        </button>

        {/* Settings Button */}
        <button
          className={`flex flex-col items-center justify-center w-12 h-12 rounded-lg transition-colors ${
            activeLeftPanel === "settings"
              ? "bg-gray-100 text-gray-900"
              : "text-gray-400 hover:text-gray-900 hover:bg-gray-50"
          }`}
          onClick={() => openPanel("settings")}
          title="Settings"
        >
          <Settings className="w-5 h-5 mb-1" />
          <span className="text-[9px] font-medium">Settings</span>
        </button>
      </nav>

      {/* Store info at bottom */}
      <div className="border-t w-full py-3 px-2 text-center mt-auto">
        <p className="text-[10px] text-gray-400 truncate w-full">
          {storeConfig?.store_name || "Store"}
        </p>
      </div>
    </aside>
  );
};

export default BuilderToolRail;
