"use client";

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button.jsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import { Plus, Pencil, Trash2, LayoutTemplate, Eye } from "lucide-react";
import { useAllProductLandingPages } from "@/hooks/use-product-landing-page.js";
import { Skeleton } from "@/components/ui/skeleton.jsx";
import DeleteConfirmationDialog from "@/components/ui/DeleteConfirmationDialog.jsx";
import { useProductLandingPage } from "@/hooks/use-product-landing-page.js"; // To use delete mutation

const SingleProductPages = () => {
  const navigate = useNavigate();
  const { data: productLandingPages, isLoading, error } = useAllProductLandingPages();
  const { deleteProductLandingPage, isDeleting } = useProductLandingPage(); // Use the delete mutation

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [pageToDelete, setPageToDelete] = React.useState(null);

  const handleViewPage = (productId) => {
    // Navigate to the new dedicated view page
    navigate(`/single-product-pages/view/${productId}`);
  };

  const handleEditPage = (pageId, productId) => {
    navigate(`/single-product-pages/edit/${productId}`);
  };

  const handleDeleteClick = (page) => {
    setPageToDelete(page);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (pageToDelete) {
      deleteProductLandingPage(pageToDelete.id, {
        onSuccess: () => {
          setIsDeleteDialogOpen(false);
          setPageToDelete(null);
        },
        onError: () => {
          setIsDeleteDialogOpen(false);
          setPageToDelete(null);
        },
      });
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 md:p-6">
        <h1 className="text-2xl font-bold mb-6">Single Product Pages</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 md:p-6 text-destructive">
        Error loading product landing pages: {error.message}
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Single Product Pages</h1>
        <Button asChild>
          <Link to="/products">
            <Plus className="h-4 w-4 mr-2" />
            Create New
          </Link>
        </Button>
      </div>

      {productLandingPages && productLandingPages.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {productLandingPages.map((page) => (
            <Card key={page.id} className="relative">
              <CardHeader>
                <CardTitle className="text-lg">{page.product?.name || "Untitled Product"}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Template: {page.template?.name || "N/A"}
                </p>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {page.page_description || "No description available."}
                </p>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="icon" onClick={() => handleViewPage(page.product_id)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => handleEditPage(page.id, page.product_id)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="destructive" size="icon" onClick={() => handleDeleteClick(page)} disabled={isDeleting}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <LayoutTemplate className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-lg text-muted-foreground mb-4">No product landing pages found.</p>
          <p className="text-sm text-muted-foreground">
            Go to a product's details page and click "Landing Page" to create one.
          </p>
        </div>
      )}

      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Are you absolutely sure?"
        description={`This action cannot be undone. This will permanently delete the landing page for "${pageToDelete?.product?.name || "this product"}" from the servers.`}
      />
    </div>
  );
};

export default SingleProductPages;