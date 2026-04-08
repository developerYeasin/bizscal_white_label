import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/utils/api.js";
import { showSuccess, showError } from "@/utils/toast.js";

// Fetch public products (storefront)
const fetchStoreProducts = async ({ page = 1, limit = 20, search, category_id, ids, sort }) => {
  const params = {
    page,
    limit,
  };

  if (search) {
    params.search = search;
  }

  if (category_id) {
    params.category_ids = category_id; // API expects comma-separated, single ID is fine
  }

  if (ids) {
    params.ids = Array.isArray(ids) ? ids.join(",") : ids;
  }

  // Map sort to API's sort_by
  const sortMap = {
    newest: "created_at_desc",
    "price-asc": "price_asc",
    "price-desc": "price_desc",
    "name-asc": "name_asc",
    "name-desc": "name_desc",
  };
  if (sort && sortMap[sort]) {
    params.sort_by = sortMap[sort];
  }

  const response = await api.get("/products", { params });
  return response.data.data;
};

export const useStoreProducts = (options = {}) => {
  const {
    page = 1,
    limit = 20,
    search,
    category_id,
    ids,
    sort,
    enabled = true,
  } = options;

  const { data, isLoading, error } = useQuery({
    queryKey: ["storeProducts", { page, limit, search, category_id, ids, sort }],
    queryFn: () => fetchStoreProducts({ page, limit, search, category_id, ids, sort }),
    enabled,
    keepPreviousData: true, // Keep previous data while fetching new page
  });

  return {
    products: data?.products || [],
    total: data?.total || 0,
    currentPage: data?.currentPage || page,
    totalPages: data?.totalPages || Math.ceil((data?.total || 0) / limit),
    isLoading,
    error,
  };
};

// Fetch single product by ID for storefront
const fetchStoreProduct = async (productId) => {
  const response = await api.get(`/products/${productId}`);
  return response.data.data.product;
};

export const useStoreProduct = (productId) => {
  return useQuery({
    queryKey: ["storeProduct", productId],
    queryFn: () => fetchStoreProduct(productId),
    enabled: !!productId,
  });
};

// Add to cart (storefront)
const addToCart = async ({ productId, quantity = 1, selected_variants = {} }) => {
  const response = await api.post("/cart/items", {
    product_id: productId,
    quantity,
    selected_variants,
  });
  return response.data;
};

export const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addToCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      showSuccess("Item added to cart!");
    },
    onError: (err) => {
      showError(err.response?.data?.message || "Failed to add item to cart.");
    },
  });
};
