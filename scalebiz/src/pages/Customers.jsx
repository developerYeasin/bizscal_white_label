"use client";

import React from "react";
import CustomerListHeader from "@/components/customers/CustomerListHeader.jsx";
import CustomerListTable from "@/components/customers/CustomerListTable.jsx";
import CustomerListPagination from "@/components/customers/CustomerListPagination.jsx";
import { useDebounce } from "@/hooks/use-debounce.js";
import { useCustomers } from "@/hooks/use-customers.js";

const Customers = () => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [itemsPerPage, setItemsPerPage] = React.useState(10);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const { data: customersData, isLoading, error } = useCustomers(currentPage, itemsPerPage, debouncedSearchTerm);

  const customers = customersData?.data?.customers || [];
  const totalCustomers = customersData?.total_count || 0;
  const totalPages = Math.ceil(totalCustomers / itemsPerPage);

  // Reset to page 1 when search term changes
  React.useEffect(() => {
    if (debouncedSearchTerm) {
      setCurrentPage(1);
    }
  }, [debouncedSearchTerm]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1);
  };

  if (error) {
    return <div className="p-6 text-center text-destructive">Error loading customers: {error.message}</div>;
  }

  return (
    <div className="p-4 md:p-6">
      <CustomerListHeader searchTerm={searchTerm} onSearchChange={setSearchTerm} />
      {isLoading ? (
        <div className="text-center p-10">Loading customers...</div>
      ) : (
        <CustomerListTable customers={customers} />
      )}
      <CustomerListPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={handleItemsPerPageChange}
        totalItems={totalCustomers}
      />
    </div>
  );
};

export default Customers;