"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ChevronUp } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import FacebookMsg from "@/components/FacebookMsg.jsx"; // Import FacebookMsg
import { cn } from "@/lib/utils";
import { useStore } from "../context/StoreContext";
import FacebookMsg2 from "./FacebookMsg2";

const RightBottomCornerButtons = ({ rbcButtonsConfig }) => {
  const [isVisible, setIsVisible] = useState(false);
  const {
    storeConfig,
    isLoading: isStoreLoading,
    currentCurrency,
    currencyConversionRate,
  } = useStore();

  const { whatsapp, messenger, back_to_top } = storeConfig?.rbcButtons || {};

  const toggleVisibility = useCallback(() => {
    if (window.scrollY > 300) {
      // Show button after scrolling 300px down
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, [toggleVisibility]);

  return (
    <div className="fixed bottom-4 right-4 flex flex-col items-center space-y-3 z-50">
      {whatsapp?.enabled && whatsapp?.number && (
        <a
          href={`https://wa.me/${whatsapp.number}`}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "p-2 rounded-full shadow-lg transition-opacity duration-300 bg-green-500 text-white",
          )}
          aria-label="WhatsApp"
        >
          <FaWhatsapp className="h-6 w-6" />
        </a>
      )}
      {/* Facebook Messenger Chat Plugin */}
      {/* {messenger?.enabled && messenger?.page_id && (
        <FacebookMsg pageId={messenger.page_id} enabled={messenger.enabled} />
      )} */}
      {messenger?.enabled && messenger?.page_id && (
        <FacebookMsg2 
        pageId={messenger.page_id}
        appId={messenger.app_id}
         enabled={messenger.enabled} />
      )}
      {back_to_top?.enabled && isVisible && (
        <Button
          onClick={scrollToTop}
          className={cn(
            "p-2 rounded-full shadow-lg transition-opacity duration-300 bg-gray-800 text-white",
          )}
          size="icon"
          aria-label="Scroll to top"
        >
          <ChevronUp className="h-6 w-6" />
        </Button>
      )}
    </div>
  );
};

export default RightBottomCornerButtons;
