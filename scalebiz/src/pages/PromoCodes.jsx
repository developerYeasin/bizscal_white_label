"use client";

import React from "react";
import PromoCodeHeader from "@/components/promo-codes/PromoCodeHeader.jsx";
import CreatePromoCodeDialog from "@/components/promo-codes/CreatePromoCodeDialog.jsx";
import PromoCodeListTable from "@/components/promo-codes/PromoCodeListTable.jsx";
import PromoCodePagination from "@/components/promo-codes/PromoCodePagination.jsx";
import { useCoupons } from "@/hooks/use-coupons.js";
import { showError } from "@/utils/toast.js";
import DeleteConfirmationDialog from "@/components/ui/DeleteConfirmationDialog.jsx"; // New import

const PromoCodes = () => {
  const [isCreatePromoCodeDialogOpen, setIsCreatePromoCodeDialogOpen] = React.useState(false);
  const [editingCoupon, setEditingCoupon] = React.useState(null);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [itemsPerPage, setItemsPerPage] = React.useState(10);

  // State for delete confirmation modal
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [couponToDelete, setCouponToDelete] = React.useState(null);

  const { couponsData, isLoading, error, deleteCoupon } = useCoupons(currentPage, itemsPerPage);

  const coupons = couponsData?.data || [];
  const totalCoupons = couponsData?.pagination?.total || 0;
  const totalPages = couponsData?.pagination?.last_page || 1;

  const handleNewPromoCodeClick = () => {
    setEditingCoupon(null);
    setIsCreatePromoCodeDialogOpen(true);
  };

  const handleEditPromoCodeClick = (coupon) => {
    setEditingCoupon(coupon);
    setIsCreatePromoCodeDialogOpen(true);
  };

  // Function to open the delete confirmation dialog
  const handleDeletePromoCode = (couponId) => {
    setCouponToDelete(couponId);
    setIsDeleteDialogOpen(true);
  };

  // Function to confirm and proceed with deletion
  const handleConfirmDelete = () => {
    if (couponToDelete) {
      deleteCoupon(couponToDelete, {
        onSuccess: () => {
          setIsDeleteDialogOpen(false);
          setCouponToDelete(null);
        },
        onError: () => {
          setIsDeleteDialogOpen(false);
          setCouponToDelete(null);
        }
      });
    }
  };

  const handleCloseCreatePromoCodeDialog = () => {
    setIsCreatePromoCodeDialogOpen(false);
    setEditingCoupon(null);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1); // Reset to first page when items per page changes
  };

  if (error) {
    return <div className="p-4 md:p-6 text-center text-destructive">Error loading promo codes: {error.message}</div>;
  }

  return (
    <div className="p-4 md:p-6">
      <PromoCodeHeader onNewPromoCodeClick={handleNewPromoCodeClick} />
      {isLoading ? (
        <div className="text-center p-10">Loading promo codes...</div>
      ) : (
        <PromoCodeListTable
          coupons={coupons}
          onEditClick={handleEditPromoCodeClick}
          onDeleteClick={handleDeletePromoCode}
        />
      )}
      <PromoCodePagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={handleItemsPerPageChange}
        totalItems={totalCoupons}
      />
      <CreatePromoCodeDialog
        isOpen={isCreatePromoCodeDialogOpen}
        onClose={handleCloseCreatePromoCodeDialog}
        initialData={editingCoupon}
      />
      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Are you absolutely sure?"
        description={`This action cannot be undone. This will permanently delete the promo code "${coupons.find(c => c.id === couponToDelete)?.code || ""}" from the servers.`}
      />
    </div>
  );
};

export default PromoCodes;