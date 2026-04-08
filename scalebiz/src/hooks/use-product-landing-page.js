"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/utils/api.js";
import { showSuccess, showError } from "@/utils/toast.js";
import { useAvailableLandingPageTemplates } from "./use-available-landing-page-templates.js"; // To get template configs

// Fetch a single product's landing page settings
const fetchProductLandingPage = async (productId) => {
  const response = await api.get(`/owner/product-landing-pages/${productId}`);
  const landingPageData = response.data.data;

  // Ensure settings_json is an object and components is an array
  if (landingPageData) {
    if (landingPageData.settings_json === null) {
      landingPageData.settings_json = { components: [] };
    } else {
      landingPageData.settings_json.components = landingPageData.settings_json.components || [];
    }
  }

  return landingPageData;
};

// Create a new product landing page
const createProductLandingPage = async (payload) => {
  const response = await api.post("/owner/product-landing-pages", payload);
  return response.data.data;
};

// Update an existing product landing page
const updateProductLandingPage = async (payload) => {
  const { id, ...data } = payload;
  const response = await api.put(`/owner/product-landing-pages/${id}`, data);
  return response.data.data;
};

// Delete a product landing page
const deleteProductLandingPage = async (id) => {
  await api.delete(`/owner/product-landing-pages/${id}`);
  return id;
};

export const useProductLandingPage = (productId) => {
  const queryClient = useQueryClient();

  // Only fetch templates if productId is provided (we're in product mode)
  const { data: availableTemplates } = useAvailableLandingPageTemplates(!!productId);

  const { data: landingPage, isLoading, error } = useQuery({
    queryKey: ["productLandingPage", productId],
    queryFn: () => fetchProductLandingPage(productId),
    enabled: !!productId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const createMutation = useMutation({
    mutationFn: createProductLandingPage,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["productLandingPage", productId] });
      queryClient.invalidateQueries({ queryKey: ["productLandingPages"] }); // Invalidate list if needed
      showSuccess("Product landing page created successfully!");
    },
    onError: (err) => {
      showError(err.response?.data?.message || "Failed to create product landing page.");
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateProductLandingPage,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["productLandingPage", productId] });
      showSuccess("Product landing page updated successfully!");
    },
    onError: (err) => {
      showError(err.response?.data?.message || "Failed to update product landing page.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProductLandingPage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productLandingPage", productId] });
      queryClient.invalidateQueries({ queryKey: ["productLandingPages"] }); // Invalidate list if needed
      showSuccess("Product landing page deleted successfully!");
    },
    onError: (err) => {
      showError(err.response?.data?.message || "Failed to delete product landing page.");
    },
  });

  // Function to initialize settings_json from a template
  const initializeFromTemplate = (templateId) => {
    const template = availableTemplates?.find(t => t.id === templateId);
    
    // Define a base default settings_json structure
    let settingsJson = {
      general_settings: {
        primary_color: "#6B46C1",
        secondary_color: "#000000",
        accent_color: "#FFD700",
        text_color: "#333333",
        heading_font: "Roboto",
        body_font: "Open Sans",
        button_style: { shape: "rounded", size: "medium" },
        product_card_style: "default",
        theme_mode: "Light",
        buy_now_button_enabled: true
      },
      seo_settings: {
        page_title: "",
        page_description: "",
        meta_keywords: ""
      },
      components: [] // Always ensure components is an array
    };

    // If a template is found and has a template_config, merge it
    if (template && template.template_config) {
      settingsJson = {
        ...settingsJson, // Start with our robust defaults
        ...template.template_config, // Overlay with template's config
        components: template.template_config.components || [] // Ensure components is an array, even if template's config is missing it
      };
    }
    // If template_config is null or template is not found, settingsJson remains the default empty structure.

    return {
      product_id: productId, // IMPORTANT: Set the product_id here
      template_id: template ? template.id : null, // Use template.id if found, else null
      settings_json: settingsJson,
      is_active: true, // Default for new landing pages
    };
  };

  return {
    landingPage,
    isLoading,
    error,
    createProductLandingPage: createMutation.mutate,
    isCreating: createMutation.isPending,
    updateProductLandingPage: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    deleteProductLandingPage: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
    initializeFromTemplate,
  };
};

// Fetch all product landing pages (for a list view, if needed)
const fetchAllProductLandingPages = async () => {
  const response = await api.get("/owner/product-landing-pages");
  return response.data.data;
};

export const useAllProductLandingPages = () => {
  return useQuery({
    queryKey: ["productLandingPages"],
    queryFn: fetchAllProductLandingPages,
    staleTime: 1000 * 60 * 5,
  });
};