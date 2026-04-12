"use client";

import React from "react";
import { Home, Eye, ChevronDown, FileText } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";

const BuilderHeader = ({
  storeConfig,
  mode,
  customPage,
  productLandingPage,
  isSaving,
  isCreatingProduct,
  isUpdatingProduct,
  handleBack,
  handleSave,
  handlePublish,
  openPanel,
}) => {
  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 shrink-0 z-10">
      {/* Left: Home + App name */}
      <div className="flex items-center gap-3 w-1/3">
        <button
          className="p-1.5 text-gray-500 hover:bg-gray-100 rounded"
          onClick={handleBack}
          title="Back"
        >
          <Home className="w-4 h-4" />
        </button>
        <div className="flex flex-col leading-tight">
          <div className="flex items-center gap-1">
            <span className="text-sm font-semibold text-gray-800">
              {storeConfig?.store_name || "ScaleBiz"}
            </span>
          </div>
        </div>
      </div>

      {/* Center: Page selector (dropdown for pages) */}
      <div className="flex items-center justify-center h-full w-1/3">
        {mode === "page" ? (
          <div className="relative">
            <button
              className="flex items-center gap-2 text-sm text-gray-500 font-medium bg-gray-100 px-3 py-1 rounded-md border border-gray-200 hover:bg-gray-50"
              onClick={() => openPanel("pages")}
            >
              <FileText className="w-4 h-4" />
              <span>{customPage?.title || "New Page"}</span>
              <ChevronDown className="w-3 h-3 text-gray-400" />
            </button>
          </div>
        ) : (
          <span className="text-sm text-gray-500 font-medium">
            {(() => {
              if (mode === "product")
                return (
                  productLandingPage?.product?.name ||
                  "Product Landing Page"
                );
              return "Page Builder";
            })()}
          </span>
        )}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center justify-end gap-3 w-1/3">
        <button
          className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-full border border-gray-200"
          title="Preview"
        >
          <Eye className="w-4 h-4" />
        </button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            handleSave();
          }}
          disabled={isSaving}
        >
          {isSaving ? "Saving..." : "Save"}
        </Button>
        <button
          className="bg-[#1C2434] text-white px-4 py-1.5 text-sm font-medium rounded-md hover:bg-gray-800 transition-colors flex items-center gap-2"
          onClick={handlePublish}
          disabled={
            isSaving ||
            (mode === "product"
              ? isCreatingProduct || isUpdatingProduct
              : false)
          }
        >
          {isSaving ||
          (mode === "product"
            ? isCreatingProduct || isUpdatingProduct
            : isCreatingProduct)
            ? "Saving..."
            : "Publish"}
          {!isSaving &&
            (mode !== "product" ||
              (!isCreatingProduct && !isUpdatingProduct)) && (
              <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
            )}
        </button>
      </div>
    </header>
  );
};

export default BuilderHeader;
