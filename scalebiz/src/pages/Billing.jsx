"use client";

import React from "react";
import BillingCard from "@/components/billing/BillingCard.jsx";
import BillingPagination from "@/components/billing/BillingPagination.jsx";
import { useBillingHistory } from "@/hooks/use-subscriptions.js"; // New import
import { Skeleton } from "@/components/ui/skeleton.jsx";

const Billing = () => {
  const { data: billingRecords, isLoading, error } = useBillingHistory();

  // Client-side pagination for now, assuming API doesn't provide it
  const [currentPage, setCurrentPage] = React.useState(1);
  const [itemsPerPage, setItemsPerPage] = React.useState(10);

  const paginatedRecords = React.useMemo(() => {
    if (!billingRecords) return [];
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return billingRecords.slice(startIndex, endIndex);
  }, [billingRecords, currentPage, itemsPerPage]);

  const totalRecords = billingRecords?.length || 0;
  const totalPages = Math.ceil(totalRecords / itemsPerPage);

  const handlePageChange = (page) => setCurrentPage(page);
  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1);
  };

  if (isLoading) {
    return (
      <div className="p-4 md:p-6">
        <h1 className="text-2xl font-bold mb-6">Billing</h1>
        <div className="space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
        <Skeleton className="h-10 w-full mt-6" />
      </div>
    );
  }

  if (error) {
    return <div className="p-4 md:p-6 text-center text-destructive">Error loading billing history: {error.message}</div>;
  }

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-6">Billing</h1>
      <div className="space-y-4">
        {paginatedRecords.length === 0 ? (
          <p className="text-center text-muted-foreground">No billing records found.</p>
        ) : (
          paginatedRecords.map((record) => (
            <BillingCard
              key={record.invoice_id}
              shopName={record.plan_name} // Using plan_name as shopName for display
              amount={`BDT ${parseFloat(record.amount).toFixed(2)}`}
              status={record.status}
              paymentType={record.payment_method}
              startDate={record.billing_start_date ? new Date(record.billing_start_date).toLocaleString() : "N/A"}
              endDate={record.billing_end_date ? new Date(record.billing_end_date).toLocaleString() : "N/A"}
              invoiceId={`INV-${record.invoice_id}`}
            />
          ))
        )}
      </div>
      <BillingPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={handleItemsPerPageChange}
        totalItems={totalRecords}
      />
    </div>
  );
};

export default Billing;