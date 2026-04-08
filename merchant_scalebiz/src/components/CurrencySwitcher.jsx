"use client";

import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { cn } from "@/lib/utils";

const CurrencySwitcher = ({ className }) => {
  const { currentCurrency, setCurrentCurrency } = useStore();

  const changeCurrency = (currency) => {
    setCurrentCurrency(currency);
  };

  const currencyOptions = [
    { value: "USD", label: "USD" },
    { value: "BDT", label: "BDT" },
  ];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "flex h-8 w-[80px] items-center justify-between rounded-md bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 hover:bg-transparent hover:text-foreground", // Removed border and focus ring, added hover styles
            className
          )}
        >
          <span>{currentCurrency}</span>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[80px] p-1">
        {currencyOptions.map((option) => (
          <Button
            key={option.value}
            variant="ghost"
            className="w-full justify-start text-sm"
            onClick={() => changeCurrency(option.value)}
          >
            {option.label}
          </Button>
        ))}
      </PopoverContent>
    </Popover>
  );
};

export default CurrencySwitcher;