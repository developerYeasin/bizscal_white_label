"use client";

import React from "react";
import OrderReportHeader from "@/components/analytics/OrderReportHeader.jsx";
import OrderReportSummaryCards from "@/components/analytics/OrderReportSummaryCards.jsx";
import OrderReportGridList from "@/components/analytics/OrderReportGridList.jsx";
import OrderReportPagination from "@/components/analytics/OrderReportPagination.jsx";
import { useOrderReport } from "@/hooks/use-order-report.js"; // New import
import { addDays } from "date-fns"; // For default custom range

const Analytics = () => {
  const [selectedFilter, setSelectedFilter] = React.useState("this_month");
  const [customDateRange, setCustomDateRange] = React.useState({
    from: new Date(),
    to: addDays(new Date(), 20), // Default end date for custom range
  });

  // Fetch data using the new hook
  const { data: reportData, isLoading, error } = useOrderReport(
    selectedFilter,
    customDateRange.from,
    customDateRange.to
  );

  // Client-side pagination for the orders list
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 12; // Display 12 items per page for the grid

  const orders = reportData?.orders || [];
  const totalOrdersInReport = orders.length;
  const totalPages = Math.ceil(totalOrdersInReport / itemsPerPage);
  const paginatedOrders = orders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (error) {
    return <div className="p-4 md:p-6 text-center text-destructive">Error loading analytics: {error.message}</div>;
  }

  return (
    <div className="p-4 md:p-6">
      <OrderReportHeader
        selectedFilter={selectedFilter}
        onFilterChange={setSelectedFilter}
        customDateRange={customDateRange}
        onCustomDateRangeChange={setCustomDateRange}
      />
      <OrderReportSummaryCards summary={reportData} isLoading={isLoading} />
      <OrderReportGridList orders={paginatedOrders} />
      <OrderReportPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default Analytics;