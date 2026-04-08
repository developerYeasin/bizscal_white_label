import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/utils/api.js";
import { showSuccess, showError } from "@/utils/toast.js";

const fetchProducts = async () => {
  const response = await api.get("/owner/products");
  return response.data.data.products;
};

// New function to fetch a simplified list of products for select dropdowns
const fetchProductsForSelect = async () => {
  const response = await api.get("/owner/products", { params: { limit: 9999 } }); // Fetch all or a large number
  return response.data.data.products.map(p => ({ id: p.id, name: p.name }));
};

const fetchProductById = async (id) => {
  const response = await api.get(`/owner/products/${id}`);
  return response.data.data.product;
};

const createProduct = async (newProduct) => {
  const response = await api.post("/owner/products", newProduct);
  return response.data.data.product;
};

const updateProduct = async (updatedProduct) => {
  const { id, ...payload } = updatedProduct;
  const response = await api.put(`/owner/products/${id}`, payload);
  return response.data;
};

const deleteProduct = async (id) => {
  await api.delete(`/owner/products/${id}`);
  return id; // Return the id to use it in onSuccess
};

const duplicateProduct = async (productId) => {
  const response = await api.post(`/owner/products/${productId}/duplicate`);
  return response.data.data.product;
};

export const useProducts = () => {
  const queryClient = useQueryClient();

  const { data: products, isLoading, error } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  const createProductMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      showSuccess("Product created successfully!");
    },
    onError: (err) => {
      showError(err.response?.data?.message || "Failed to create product.");
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: updateProduct,
    onSuccess: (data, variables) => {
      // Invalidate queries to refetch fresh data from the server.
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product", variables.id] });

      // Show the success message from the API response.
      showSuccess(data.message || "Product updated successfully!");
    },
    onError: (err) => {
      showError(err.response?.data?.message || "Failed to update product.");
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: (deletedProductId) => {
      // Invalidate the main products list to ensure it's fresh.
      queryClient.invalidateQueries({ queryKey: ["products"] });

      // Remove the specific product's query from the cache.
      queryClient.removeQueries({ queryKey: ["product", deletedProductId] });

      showSuccess("Product deleted successfully!");
    },
    onError: (err) => {
      showError(err.response?.data?.message || "Failed to delete product.");
    },
  });

  const duplicateProductMutation = useMutation({
    mutationFn: duplicateProduct,
    onSuccess: (newProduct) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      showSuccess("Product duplicated as draft successfully!");
      // Navigation to edit page is handled by the component calling this mutation
    },
    onError: (err) => {
      showError(err.response?.data?.message || "Failed to duplicate product.");
    },
  });

  return {
    products,
    isLoading,
    error,
    createProduct: createProductMutation.mutate,
    isCreating: createProductMutation.isPending,
    updateProduct: updateProductMutation.mutate,
    isUpdating: updateProductMutation.isPending,
    deleteProduct: deleteProductMutation.mutate,
    duplicateProduct: duplicateProductMutation.mutate,
    isDuplicatingProduct: duplicateProductMutation.isPending,
  };
};

export const useProductById = (id) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => fetchProductById(id),
    enabled: !!id,
  });
};

export const useProductsForSelect = () => {
  return useQuery({
    queryKey: ["productsForSelect"],
    queryFn: fetchProductsForSelect,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};