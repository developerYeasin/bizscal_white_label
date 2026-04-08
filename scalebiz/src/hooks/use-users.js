"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/utils/api.js";
import { showSuccess, showError } from "@/utils/toast.js";

// Fetch paginated users
const fetchUsers = async ({ page = 1, limit = 10 }) => {
  const response = await api.get("/owner/users", { params: { page, limit } });
  return response.data;
};

// Invite a new user
const inviteUser = async (userData) => {
  const response = await api.post("/owner/users/invite", userData);
  return response.data;
};

// Update an existing user
const updateUser = async (updatedUserData) => {
  const { id, ...payload } = updatedUserData;
  const response = await api.put(`/owner/users/${id}`, payload);
  return response.data;
};

// Delete a user
const deleteUser = async (id) => {
  await api.delete(`/owner/users/${id}`);
  return id;
};

export const useUsers = (page, limit) => {
  const queryClient = useQueryClient();

  const { data: usersData, isLoading, error } = useQuery({
    queryKey: ["users", { page, limit }],
    queryFn: () => fetchUsers({ page, limit }),
    keepPreviousData: true,
  });

  const inviteUserMutation = useMutation({
    mutationFn: inviteUser,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      showSuccess(response.message || "User invited successfully!");
    },
    onError: (err) => {
      showError(err.response?.data?.message || "Failed to invite user.");
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: updateUser,
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user", variables.id] });
      showSuccess(response.message || "User updated successfully!");
    },
    onError: (err) => {
      showError(err.response?.data?.message || "Failed to update user.");
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: (deletedUserId) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.removeQueries({ queryKey: ["user", deletedUserId] });
      showSuccess("User deleted successfully!");
    },
    onError: (err) => {
      showError(err.response?.data?.message || "Failed to delete user.");
    },
  });

  return {
    usersData,
    isLoading,
    error,
    inviteUser: inviteUserMutation.mutate,
    isInviting: inviteUserMutation.isPending,
    updateUser: updateUserMutation.mutate,
    isUpdating: updateUserMutation.isPending,
    deleteUser: deleteUserMutation.mutate,
    isDeleting: deleteUserMutation.isPending,
  };
};

// Optional: Fetch a single user by ID if needed for an EditUserDialog
const fetchUserById = async (id) => {
  const response = await api.get(`/owner/users/${id}`);
  return response.data.data; // Assuming data.user or similar
};

export const useUserById = (id) => {
  return useQuery({
    queryKey: ["user", id],
    queryFn: () => fetchUserById(id),
    enabled: !!id,
  });
};