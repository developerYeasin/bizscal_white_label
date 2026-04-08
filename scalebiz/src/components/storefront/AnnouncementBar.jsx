"use client";

import React from "react";
import { useStoreConfig } from "@/contexts/StoreConfigurationContext.jsx";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import { cn } from "@/lib/utils.js";

const AnnouncementBar = () => {
  const { config: storeConfig } = useStoreConfig();
  const announcement = storeConfig.theme_settings?.announcement_bar || {};

  const [dismissed, setDismissed] = React.useState(false);

  if (dismissed || !announcement.enabled || !announcement.text) {
    return null;
  }

  const backgroundColor = announcement.background_color || "#6B46C1";
  const textColor = announcement.text_color || "#FFFFFF";

  return (
    <div
      className="relative py-2 text-center text-sm"
      style={{ backgroundColor, color: textColor }}
    >
      <p className="container mx-auto px-4">{announcement.text}</p>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 h-6 w-6 hover:bg-white/20"
        onClick={() => setDismissed(true)}
        style={{ color: textColor }}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default AnnouncementBar;
