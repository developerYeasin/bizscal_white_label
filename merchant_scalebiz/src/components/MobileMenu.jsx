"use client";

import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { X, ChevronRight, User, RefreshCw, Heart, Facebook, Instagram, Youtube, X as TwitterIcon, Share2 } from "lucide-react"; // Replaced Pinterest with Share2
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button"; // Import Button for Login/Register
import { showSuccess } from "@/utils/toast"; // Import toast for "coming soon" messages
import { useTranslation } from "react-i18next"; // Import useTranslation
import { useStorePath } from "@/hooks/use-store-path"; // Import useStorePath
import LanguageSwitcher from "./LanguageSwitcher"; // Import LanguageSwitcher
import CurrencySwitcher from "./CurrencySwitcher"; // Import CurrencySwitcher

// A reliable accordion for the manual menu, using native HTML elements.
const ManualNavAccordion = ({ items, onLinkClick, getPath }) => { // Accept getPath
  const { t } = useTranslation(); // Initialize useTranslation
  if (!items || items.length === 0) {
    return null;
  }

  const getSubItems = (item) => {
    if (item.subLinks) return item.subLinks;
    if (item.menuColumns) {
      return item.menuColumns.flatMap(col => [
        { ...col, isHeader: true, path: col.path || '#' },
        ...(col.subCategories || [])
      ]);
    }
    if (item.subCategories) return item.subCategories;
    return [];
  };

  return (
    <ul className="space-y-1">
      {items.map((item, index) => {
        const subItems = getSubItems(item);
        const hasSubItems = subItems.length > 0;

        return (
          <li key={index}>
            {hasSubItems ? (
              <details className="group">
                <summary className="flex items-center justify-between py-3 px-2 text-base font-medium list-none cursor-pointer text-foreground hover:bg-accent hover:text-dynamic-primary-color transition-colors rounded-md">
                  <span className="flex items-center">
                    {item.title}
                    {item.title === "SHOP" && (
                      <span className="ml-2 px-2 py-0.5 text-xs font-bold rounded-full bg-red-500 text-white">HOT</span>
                    )}
                    {item.title === "ELEMENTS" && (
                      <span className="ml-2 px-2 py-0.5 text-xs font-bold rounded-full bg-purple-500 text-white">52+ WIDGETS</span>
                    )}
                  </span>
                  <ChevronRight className="h-4 w-4 transition-transform duration-200 group-open:rotate-90 text-muted-foreground" />
                </summary>
                <div className="pl-4 border-l-2 border-border ml-2 py-1"> {/* Adjusted border color and padding */}
                  <ManualNavAccordion items={subItems} onLinkClick={onLinkClick} getPath={getPath} />
                </div>
              </details>
            ) : (
              <Link
                to={getPath(item.path || '#')}
                onClick={onLinkClick}
                className={cn(
                  "flex items-center justify-between py-3 px-2 text-base font-medium transition-colors rounded-md",
                  item.isHeader
                    ? "font-bold text-dynamic-primary-color hover:bg-transparent" // Header links don't change background on hover
                    : "text-foreground hover:bg-accent hover:text-dynamic-primary-color"
                )}
              >
                <span className="flex items-center">
                  {item.title}
                  {item.title === "SHOP" && (
                    <span className="ml-2 px-2 py-0.5 text-xs font-bold rounded-full bg-red-500 text-white">HOT</span>
                  )}
                  {item.title === "ELEMENTS" && (
                    <span className="ml-2 px-2 py-0.5 text-xs font-bold rounded-full bg-purple-500 text-white">52+ WIDGETS</span>
                  )}
                  {item.title === "Buy" && (
                    <span className="ml-2 px-2 py-0.5 text-xs font-bold rounded-full bg-blue-500 text-white">ONLY $69</span>
                  )}
                </span>
                {/* Only show chevron for items that *could* have sub-items but don't in this specific data structure */}
                {/* For now, assuming if it's not a details element, it doesn't have a chevron */}
              </Link>
            )}
          </li>
        );
      })}
    </ul>
  );
};

export const MobileMenu = ({ navItems, onClose, getPath }) => { // Accept getPath
  const { t } = useTranslation(); // Initialize useTranslation
  const showComingSoon = () => {
    showSuccess(t("feature_coming_soon"));
  };

  return (
    <ScrollArea className="flex-grow h-full py-4">
      <div className="px-4">
        <ManualNavAccordion items={navItems} onLinkClick={onClose} getPath={getPath} />

        <div className="pt-4 mt-4 border-t border-border space-y-2">
          <Link
            to={getPath("/compare")} // Use getPath
            onClick={(e) => { e.preventDefault(); showComingSoon(); onClose(); }}
            className="flex items-center py-3 px-2 text-base font-medium text-foreground hover:bg-accent hover:text-dynamic-primary-color transition-colors rounded-md"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            {t('compare')} (0)
          </Link>
          <Link
            to={getPath("/wishlist")} // Use getPath
            onClick={(e) => { e.preventDefault(); showComingSoon(); onClose(); }}
            className="flex items-center py-3 px-2 text-base font-medium text-foreground hover:bg-accent hover:text-dynamic-primary-color transition-colors rounded-md"
          >
            <Heart className="h-4 w-4 mr-2" />
            {t('my_wishlist')} (0)
          </Link>
          <Link
            to={getPath("/login")} // Use getPath
            onClick={onClose}
            className="flex items-center py-3 px-2 text-base font-medium text-foreground hover:bg-accent hover:text-dynamic-primary-color transition-colors rounded-md"
          >
            <User className="h-4 w-4 mr-2" />
            {t('your_account')}
          </Link>
        </div>

        {/* Language and Currency Switchers for Mobile */}
        <div className="pt-4 mt-4 border-t border-border flex justify-center space-x-4">
          <LanguageSwitcher className="!flex md:!hidden" />
          <CurrencySwitcher className="!flex md:!hidden" />
        </div>

        <div className="pt-4 mt-4 border-t border-border flex space-x-4 justify-center">
          <Button variant="ghost" size="icon" onClick={(e) => { e.preventDefault(); showComingSoon(); onClose(); }}>
            <Facebook className="h-6 w-6 text-muted-foreground hover:text-dynamic-primary-color" />
          </Button>
          <Button variant="ghost" size="icon" onClick={(e) => { e.preventDefault(); showComingSoon(); onClose(); }}>
            <TwitterIcon className="h-6 w-6 text-muted-foreground hover:text-dynamic-primary-color" />
          </Button>
          <Button variant="ghost" size="icon" onClick={(e) => { e.preventDefault(); showComingSoon(); onClose(); }}>
            <Instagram className="h-6 w-6 text-muted-foreground hover:text-dynamic-primary-color" />
          </Button>
          <Button variant="ghost" size="icon" onClick={(e) => { e.preventDefault(); showComingSoon(); onClose(); }}>
            <Youtube className="h-6 w-6 text-muted-foreground hover:text-dynamic-primary-color" />
          </Button>
          <Button variant="ghost" size="icon" onClick={(e) => { e.preventDefault(); showComingSoon(); onClose(); }}>
            <Share2 className="h-6 w-6 text-muted-foreground hover:text-dynamic-primary-color" /> {/* Replaced Pinterest with Share2 */}
          </Button>
        </div>
      </div>
    </ScrollArea>
  );
};