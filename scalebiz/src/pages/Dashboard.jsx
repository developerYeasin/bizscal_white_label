"use client";

import React from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader.jsx";
import DashboardBanner from "@/components/dashboard/DashboardBanner.jsx";
import DashboardSummaryCards from "@/components/dashboard/DashboardSummaryCards.jsx";
import DashboardSalesChart from "@/components/dashboard/DashboardSalesChart.jsx";
import DashboardLowStockProducts from "@/components/dashboard/DashboardLowStockProducts.jsx";
import DashboardMostSoldItems from "@/components/dashboard/DashboardMostSoldItems.jsx";
import GettingStartedSection from "@/components/dashboard/GettingStartedSection.jsx"; // New import

const Dashboard = () => {
  return (
    <div className="p-4 md:p-6">
      <DashboardHeader />
      <GettingStartedSection /> {/* Added the new section here */}
      <DashboardBanner />
      <DashboardSummaryCards />
      <DashboardSalesChart />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardLowStockProducts />
        <DashboardMostSoldItems />
      </div>
    </div>
  );
};

export default Dashboard;