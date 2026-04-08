"use client";

import React from "react";
import { Button } from "@/components/ui/button.jsx";
import { Globe, Copy } from "lucide-react";
import { showSuccess, showInfo } from "@/utils/toast.js";

const DashboardHeader = () => {
  const handleApplyInvestment = () => {
    showSuccess("Investment application initiated!");
  };

  const handleWebsiteClick = () => {
    window.open("https://scalebiz.com", "_blank"); // Open actual website link
    showSuccess("Opening Scalebiz website!");
  };

  const handleCopyClick = () => {
    navigator.clipboard.writeText("https://scalebiz.com");
    showSuccess("Website link copied to clipboard!");
  };

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
      <h1 className="text-2xl font-bold">Hello, Scalebiz ! 👋</h1>
      <div className="flex gap-2">
        {/* <Button className="bg-purple-600 hover:bg-purple-700 text-white" onClick={handleApplyInvestment}>
          Apply for Investment
        </Button> */}
        <Button variant="outline" onClick={handleWebsiteClick}>
          <Globe className="h-4 w-4 mr-2" />
          Website
        </Button>
        <Button variant="outline" onClick={handleCopyClick}>
          <Copy className="h-4 w-4 mr-2" />
          Copy
        </Button>
      </div>
    </div>
  );
};

export default DashboardHeader;
