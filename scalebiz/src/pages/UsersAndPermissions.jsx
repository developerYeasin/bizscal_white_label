"use client";

import React from "react";
import UsersHeader from "@/components/users/UsersHeader.jsx";
import UserCard from "@/components/users/UserCard.jsx";
import AddUserDialog from "@/components/users/AddUserDialog.jsx";
import EditUserDialog from "@/components/users/EditUserDialog.jsx"; // New import
import DeleteUserDialog from "@/components/users/DeleteUserDialog.jsx"; // New import
import { useUsers } from "@/hooks/use-users.js"; // New import
import { useAuth } from "@/contexts/AuthContext.jsx"; // New import
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination.jsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.jsx";
import { Skeleton } from "@/components/ui/skeleton.jsx";

const UsersAndPermissions = () => {
  const { user: currentUser } = useAuth(); // Get current authenticated user
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = React.useState(false);
  const [editingUser, setEditingUser] = React.useState(null); // State for user being edited
  const [deletingUser, setDeletingUser] = React.useState(null); // State for user being deleted

  const [currentPage, setCurrentPage] = React.useState(1);
  const [itemsPerPage, setItemsPerPage] = React.useState(10);

  const { usersData, isLoading, error, deleteUser, isDeleting } = useUsers(currentPage, itemsPerPage);

  const users = usersData?.data || [];
  const totalUsers = usersData?.total || 0;
  const totalPages = usersData?.totalPages || 1;

  const handleAddUserClick = () => {
    setIsAddUserDialogOpen(true);
  };

  const handleCloseAddUserDialog = () => {
    setIsAddUserDialogOpen(false);
  };

  const handleEditUserClick = (user) => {
    setEditingUser(user);
  };

  const handleCloseEditUserDialog = () => {
    setEditingUser(null);
  };

  const handleDeleteUserClick = (userId, userName) => {
    setDeletingUser({ id: userId, name: userName });
  };

  const handleCloseDeleteUserDialog = () => {
    setDeletingUser(null);
  };

  const handleConfirmDelete = () => {
    if (deletingUser) {
      deleteUser(deletingUser.id, {
        onSuccess: () => {
          handleCloseDeleteUserDialog();
        },
      });
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1);
  };

  if (isLoading) {
    return (
      <div className="p-4 md:p-6">
        <UsersHeader onAddUserClick={handleAddUserClick} />
        <div className="space-y-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="p-4 md:p-6 text-center text-destructive">Error loading users: {error.message}</div>;
  }

  return (
    <div className="p-4 md:p-6">
      <UsersHeader onAddUserClick={handleAddUserClick} />
      <div className="space-y-4">
        {users.length === 0 ? (
          <p className="text-center text-muted-foreground">No users found.</p>
        ) : (
          users.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              isYou={currentUser && currentUser.id === user.id}
              onEditClick={handleEditUserClick}
              onDeleteClick={handleDeleteUserClick}
            />
          ))
        )}
      </div>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Users Per Page</span>
          <Select value={String(itemsPerPage)} onValueChange={handleItemsPerPageChange}>
            <SelectTrigger className="w-[80px]">
              <SelectValue placeholder="10" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <span className="text-sm text-muted-foreground">Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, totalUsers)} from {totalUsers}</span>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" onClick={() => handlePageChange(Math.max(1, currentPage - 1))} />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <PaginationItem key={page}>
                <PaginationLink href="#" isActive={currentPage === page} onClick={() => handlePageChange(page)}>
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext href="#" onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      <AddUserDialog
        isOpen={isAddUserDialogOpen}
        onClose={handleCloseAddUserDialog}
      />
      {editingUser && (
        <EditUserDialog
          isOpen={!!editingUser}
          onClose={handleCloseEditUserDialog}
          userId={editingUser.id}
        />
      )}
      {deletingUser && (
        <DeleteUserDialog
          isOpen={!!deletingUser}
          onClose={handleCloseDeleteUserDialog}
          onConfirm={handleConfirmDelete}
          userName={deletingUser.name}
        />
      )}
    </div>
  );
};

export default UsersAndPermissions;