"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const LanguageSwitcher = ({ className }) => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const languageOptions = [
    { value: "en", label: "English" },
    { value: "bn", label: "বাংলা" },
  ];

  const mobileLanguageOptions = [
    { value: "en", label: "EN" },
    { value: "bn", label: "বাং" },
  ];

  const currentLanguageLabel = languageOptions.find(
    (option) => option.value === i18n.language
  )?.label || "EN";
  
  const currentMobileLanguageLabel = mobileLanguageOptions.find(
    (option) => option.value === i18n.language
  )?.label || "EN";

  return (
    <>
      {/* Desktop Version */}
      <div className="hidden md:block">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                "flex h-8 w-[100px] items-center justify-between rounded-md bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 hover:bg-transparent hover:text-foreground", // Removed border and focus ring, added hover styles
                className
              )}
            >
              <span>{currentLanguageLabel}</span>
              <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[100px] p-1">
            {languageOptions.map((option) => (
              <Button
                key={option.value}
                variant="ghost"
                className="w-full justify-start text-sm"
                onClick={() => changeLanguage(option.value)}
              >
                {option.label}
              </Button>
            ))}
          </PopoverContent>
        </Popover>
      </div>

      {/* Mobile Version - only visible when explicitly passed className="!block md:!hidden" */}
      <div className={cn("md:!hidden", className)}>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                "w-auto h-8 text-sm p-0 border-none focus:ring-0 focus:ring-offset-0 hover:bg-transparent hover:text-foreground",
                className
              )}
            >
              <span>{currentMobileLanguageLabel}</span>
              <ChevronDown className="ml-1 h-3 w-3 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[80px] p-1">
            {mobileLanguageOptions.map((option) => (
              <Button
                key={option.value}
                variant="ghost"
                className="w-full justify-start text-sm"
                onClick={() => changeLanguage(option.value)}
              >
                {option.label}
              </Button>
            ))}
          </PopoverContent>
        </Popover>
      </div>
    </>
  );
};

export default LanguageSwitcher;