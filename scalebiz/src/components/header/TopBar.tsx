"use client";

import React from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area.jsx";
import { cn } from "@/lib/utils.js";

interface TopBarProps {
  messages: string[];
  enabled: boolean;
}

const TopBar: React.FC<TopBarProps> = ({ messages, enabled }) => {
  if (!enabled || messages.length === 0) return null;

  return (
    <div className="bg-gray-800 text-white text-xs py-2 overflow-hidden">
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex items-center justify-center space-x-8 px-4">
          {messages.map((message, index) => (
            <span key={index} className="flex-shrink-0">
              {message}
            </span>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};

export default TopBar;