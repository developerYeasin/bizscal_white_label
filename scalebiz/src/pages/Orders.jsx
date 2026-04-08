"use client";

import React from "react";
import OrdersHeader from "@/components/orders/OrdersHeader.jsx";
import OrdersSummaryCards from "@/components/orders/OrdersSummaryCards.jsx";
import OrdersTabs from "@/components/orders/OrdersTabs.jsx";
import OrdersTable from "@/components/orders/OrdersTable.jsx";
import OrdersPagination from "@/components/orders/OrdersPagination.jsx";
import { useOrders } from "@/hooks/use-orders.js";
import ViewOrderDialog from "@/components/orders/ViewOrderDialog.jsx";
import EditOrderDialog from "@/components/orders/EditOrderDialog.jsx";
import DeleteOrderDialog from "@/components/orders/DeleteOrderDialog.jsx";
import { useDebounce } from "@/hooks/use-debounce.js";

const Orders = () => {
  const [activeTab, setActiveTab] = React.useState("All Orders");
  const [searchTerm, setSearchTerm] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [itemsPerPage, setItemsPerPage] = React.useState(10);

  const [viewingOrderId, setViewingOrderId] = React.useState(null);
  const [editingOrderId, setEditingOrderId] = React.useState(null);
  const [deletingOrderId, setDeletingOrderId] = React.useState(null);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const { ordersData, isLoading, error, deleteOrder } = useOrders(currentPage, itemsPerPage, activeTab, debouncedSearchTerm);

  const orders = ordersData?.data?.orders || [];

  // Reset to page 1 when search term changes
  React.useEffect(() => {
    if (debouncedSearchTerm) {
      setCurrentPage(1);
    }
  }, [debouncedSearchTerm]);

  const handleDeleteConfirm = () => {
    if (deletingOrderId) {
      deleteOrder(deletingOrderId, {
        onSuccess: () => setDeletingOrderId(null),
      });
    }
  };

  if (error) {
    return <div className="p-6 text-center text-destructive">Error loading orders: {error.message}</div>;
  }

  return (
    <div className="p-4 md:p-6">
      <OrdersHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        totalOrders={ordersData?.total_count || 0}
      />
      <OrdersSummaryCards />
      <OrdersTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      {isLoading ? (
        <div className="text-center p-10">Loading orders...</div>
      ) : (
        <OrdersTable
          orders={orders}
          onViewClick={setViewingOrderId}
          onEditClick={setEditingOrderId}
          onDeleteClick={setDeletingOrderId}
        />
      )}
      <OrdersPagination
        currentPage={currentPage}
        totalPages={Math.ceil((ordersData?.total_count || 0) / itemsPerPage)}
        onPageChange={setCurrentPage}
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={(value) => {
          setItemsPerPage(Number(value));
          setCurrentPage(1);
        }}
        totalItems={ordersData?.total_count || 0}
      />

      <ViewOrderDialog
        isOpen={!!viewingOrderId}
        onClose={() => setViewingOrderId(null)}
        orderId={viewingOrderId}
      />
      <EditOrderDialog
        isOpen={!!editingOrderId}
        onClose={() => setEditingOrderId(null)}
        orderId={editingOrderId}
      />
      <DeleteOrderDialog
        isOpen={!!deletingOrderId}
        onClose={() => setDeletingOrderId(null)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

export default Orders;