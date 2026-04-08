"use client";

import React from "react";
import { HexColorPicker } from "react-colorful";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Button } from "@/components/ui/button.jsx";
import { cn } from "@/lib/utils.js";

const ColorPicker = ({ color, onChange, className }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn("w-full justify-start text-left font-normal", className)}
          style={{ backgroundColor: color }}
        >
          <div
            className="w-4 h-4 rounded-full border mr-2"
            style={{ backgroundColor: color }}
          />
          {color.toUpperCase()}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <HexColorPicker color={color} onChange={onChange} />
        <div className="p-2">
          <Input
            value={color}
            onChange={(e) => onChange(e.target.value)}
            className="w-full"
          />
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ColorPicker;