"use client";

import React from "react";
import { Monitor, Smartphone } from "lucide-react";

const VIEWPORTS = {
  desktop: { label: "Desktop", icon: Monitor },
  tablet: { label: "Tablet", icon: Monitor },
  mobile: { label: "Mobile", icon: Smartphone },
};

const BuilderViewport = ({ viewport, setViewport }) => {
  return (
    <div className="h-12 flex justify-center items-center shrink-0 w-full border-b bg-gray-50">
      <div className="flex items-center bg-white p-0.5 rounded-md border border-gray-200 gap-1">
        {Object.entries(VIEWPORTS).map(
          ([key, { label: vLabel, icon: Icon }]) => (
            <button
              key={key}
              className={`p-1.5 ${
                viewport === key
                  ? "text-gray-800 bg-gray-100 rounded shadow-sm"
                  : "text-gray-400 hover:text-gray-700"
              }`}
              onClick={() => setViewport(key)}
              title={vLabel}
            >
              <Icon className="w-4 h-4" />
            </button>
          ),
        )}
      </div>
    </div>
  );
};

export default BuilderViewport;
