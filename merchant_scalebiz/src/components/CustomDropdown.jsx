"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button"; // Using shadcn Button for consistency
import { useTranslation } from "react-i18next"; // Import useTranslation

const CustomDropdown = ({
  options,
  value,
  onChange,
  placeholder,
  className,
}) => {
  const { i18n } = useTranslation(); // Get i18n instance
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const handleOptionClick = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  // Determine the label based on current language
  const getOptionLabel = (option) => {
    if (!option) return null;
    return i18n.language === "bn" ? option.bn_name : option.name;
  };

  const selectedOption = options.find(
    (option) => option.name === value || option.bn_name === value
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={cn("relative w-full", className)} ref={dropdownRef}>
      <Button
        type="button"
        variant="outline"
        className="w-full justify-between pr-3"
        onClick={handleToggle}
      >
        <span>{getOptionLabel(selectedOption) || placeholder}</span>
        <ChevronDown
          className={cn(
            "ml-2 h-4 w-4 shrink-0 opacity-50 transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </Button>
      {isOpen && (
        <div className="absolute z-[99999] mt-1 w-full rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95">
          <ul className="max-h-60 overflow-y-auto">
            {options.map((option) => (
              <li
                key={option.id}
                className="relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                onClick={() => handleOptionClick(option.name)}
              >
                {getOptionLabel(option)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
