import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/utils/api.js";
import { showSuccess, showError } from "@/utils/toast.js";

const fetchCategories = async () => {
  const response = await api.get("/owner/categories");
  return response.data.data.categories;
};

// New function to fetch a simplified list of categories for select dropdowns
const fetchCategoriesForSelect = async () => {
  const response = await api.get("/owner/categories", { params: { limit: 9999 } }); // Fetch all or a large number
  return response.data.data.categories.map(c => ({ id: c.id, name: c.name }));
};

const fetchCategoryById = async (id) => {
  const response = await api.get(`/owner/categories/${id}`);
  return response.data.data.category;
};

const createCategory = async (newCategory) => {
  const response = await api.post("/owner/categories", newCategory);
  return response.data.data.category;
};

const updateCategory = async (updatedCategory) => {
  const { id, ...payload } = updatedCategory;
  const response = await api.put(`/owner/categories/${id}`, payload);
  return response.data.data.category;
};

const deleteCategory = async (id) => {
  await api.delete(`/owner/categories/${id}`);
  return id;
};

const duplicateCategory = async (categoryId) => {
  const response = await api.post(`/owner/categories/${categoryId}/duplicate`);
  return response.data.data.category;
};

export const useCategories = () => {
  const queryClient = useQueryClient();

  const { data: categories, isLoading, error } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const createCategoryMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      showSuccess("Category created successfully!");
    },
    onError: (err) => {
      showError(err.message || "Failed to create category.");
    },
  });

  const updateCategoryMutation = useMutation({
    mutationFn: updateCategory,
    onSuccess: (updatedCategoryData, variables) => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.setQueryData(["category", variables.id], updatedCategoryData);
      showSuccess("Category updated successfully!");
    },
    onError: (err) => {
      showError(err.message || "Failed to update category.");
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: (deletedCategoryId) => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.removeQueries({ queryKey: ["category", deletedCategoryId] });
      showSuccess("Category deleted successfully!");
    },
    onError: (err) => {
      showError(err.message || "Failed to delete category.");
    },
  });

  const duplicateCategoryMutation = useMutation({
    mutationFn: duplicateCategory,
    onSuccess: (newCategory) => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      showSuccess("Category duplicated as draft successfully!");
      // Dialog opening is handled by the component calling this mutation
    },
    onError: (err) => {
      showError(err.response?.data?.message || "Failed to duplicate category.");
    },
  });

  return {
    categories,
    isLoading,
    error,
    createCategory: createCategoryMutation.mutate,
    updateCategory: updateCategoryMutation.mutate,
    deleteCategory: deleteCategoryMutation.mutate,
    duplicateCategory: duplicateCategoryMutation.mutate,
    isDuplicatingCategory: duplicateCategoryMutation.isPending,
  };
};

export const useCategoryById = (id) => {
  return useQuery({
    queryKey: ["category", id],
    queryFn: () => fetchCategoryById(id),
    enabled: !!id,
  });
};

export const useCategoriesForSelect = () => {
  return useQuery({
    queryKey: ["categoriesForSelect"],
    queryFn: fetchCategoriesForSelect,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};