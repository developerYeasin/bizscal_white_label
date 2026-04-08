"use client";

import React from "react";
import CategoryListHeader from "@/components/categories/CategoryListHeader.jsx";
import CategoryListTable from "@/components/categories/CategoryListTable.jsx";
import CategoryListPagination from "@/components/categories/CategoryListPagination.jsx";
import CreateCategoryDialog from "@/components/categories/CreateCategoryDialog.jsx";
import DeleteConfirmationDialog from "@/components/ui/DeleteConfirmationDialog.jsx"; // Updated import
import { useCategories } from "@/hooks/use-categories.js";
import { showInfo, showError } from "@/utils/toast.js";
import { useDebounce } from "@/hooks/use-debounce.js";

const Categories = () => {
  const [isCreateCategoryDialogOpen, setIsCreateCategoryDialogOpen] = React.useState(false);
  const [editingCategory, setEditingCategory] = React.useState(null);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [itemsPerPage, setItemsPerPage] = React.useState(10);

  // State for delete confirmation modal
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [categoryToDelete, setCategoryToDelete] = React.useState(null);

  const { categories, isLoading, error, createCategory, updateCategory, deleteCategory, duplicateCategory, isDuplicatingCategory } = useCategories();
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const filteredCategories = React.useMemo(() => {
    if (!categories) return [];
    return categories.filter(category =>
      category.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      (category.description && category.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase()))
    );
  }, [categories, debouncedSearchTerm]);

  // Reset to page 1 when search term changes
  React.useEffect(() => {
    if (debouncedSearchTerm) {
      setCurrentPage(1);
    }
  }, [debouncedSearchTerm]);

  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
  const paginatedCategories = filteredCategories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleAddCategoryClick = () => {
    setEditingCategory(null);
    setIsCreateCategoryDialogOpen(true);
  };

  const handleEditCategoryClick = (category) => {
    setEditingCategory(category);
    setIsCreateCategoryDialogOpen(true);
  };

  const handleDuplicateCategory = (categoryId) => {
    duplicateCategory(categoryId, {
      onSuccess: (newCategory) => {
        setEditingCategory(newCategory); // Set the new category as the one to edit
        setIsCreateCategoryDialogOpen(true); // Open the dialog
      }
    });
  };

  // Function to open the delete confirmation dialog
  const handleDeleteCategoryClick = (category) => {
    setCategoryToDelete(category);
    setIsDeleteDialogOpen(true);
  };

  // Function to confirm and proceed with deletion
  const handleConfirmDelete = () => {
    if (categoryToDelete) {
      deleteCategory(categoryToDelete.id, {
        onSuccess: () => {
          setIsDeleteDialogOpen(false);
          setCategoryToDelete(null);
        },
        onError: () => {
          setIsDeleteDialogOpen(false);
          setCategoryToDelete(null);
        }
      });
    }
  };

  const handleCloseCreateCategoryDialog = () => {
    setIsCreateCategoryDialogOpen(false);
    setEditingCategory(null);
  };

  const handleSaveCategory = (payload) => {
    if (editingCategory) {
      updateCategory({ ...payload, id: editingCategory.id });
    } else {
      createCategory(payload);
    }
    handleCloseCreateCategoryDialog();
  };

  if (isLoading) {
    return <div className="p-4 md:p-6 text-center">Loading categories...</div>;
  }

  if (error) {
    return <div className="p-4 md:p-6 text-center text-destructive">Error: {error.message}</div>;
  }

  return (
    <div className="p-4 md:p-6">
      <CategoryListHeader
        onAddCategoryClick={handleAddCategoryClick}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />
      <CategoryListTable
        categories={paginatedCategories}
        onEditCategoryClick={handleEditCategoryClick}
        onDeleteCategory={handleDeleteCategoryClick}
        onDuplicateCategory={handleDuplicateCategory}
      />
      <CategoryListPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={setItemsPerPage}
        totalItems={filteredCategories.length}
      />
      <CreateCategoryDialog
        isOpen={isCreateCategoryDialogOpen}
        onClose={handleCloseCreateCategoryDialog}
        onSave={handleSaveCategory}
        initialData={editingCategory}
      />
      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Are you absolutely sure?"
        description={`This action cannot be undone. This will permanently delete the category "${categoryToDelete?.name || ""}" from the servers.`}
      />
    </div>
  );
};

export default Categories;