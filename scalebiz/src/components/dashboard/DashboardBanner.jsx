"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card.jsx";

const DashboardBanner = () => {
  return (
    <Card className="mb-6 overflow-hidden">
      <CardContent className="p-0">
        <img
          src="https://picsum.photos/seed/dashboard-banner/1200/300"
          alt="Scalebiz Banner"
          className="w-full h-auto object-cover"
        />
      </CardContent>
    </Card>
  );
};

export default DashboardBanner;