"use client";

import React from "react";
import { Button } from "@/components/ui/button.jsx";
import { Sparkles } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton.jsx";

const ApplyThemeButton = ({ onSave, isUpdating }) => { // Accept onSave and isUpdating as props
  return (
    <div className="flex justify-end mt-6">
      <Button className="bg-purple-600 hover:bg-purple-700 text-white" onClick={onSave} disabled={isUpdating}>
        <Sparkles className="h-4 w-4 mr-2" />
        {isUpdating ? 'Applying...' : 'Apply Theme'}
      </Button>
    </div>
  );
};

export default ApplyThemeButton;