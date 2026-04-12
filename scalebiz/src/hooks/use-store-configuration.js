"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import api from "@/utils/api.js";
import { showSuccess, showError } from "@/utils/toast.js";
import { useAuth } from "@/contexts/AuthContext.jsx";
// Removed: import { useLocation } from "react-router-dom"; // No longer needed here

// Fetch store configuration
const fetchStoreConfiguration = async () => {
  const response = await api.get("/owner/store-configuration");
  // Initialize missing nested objects to prevent errors in the UI
  const config = response.data.data.configuration || {};

  // Initialize layout_settings and its children
  config.layout_settings = config.layout_settings || {};
  config.layout_settings.footer = config.layout_settings.footer || {};
  config.layout_settings.footer.columns = config.layout_settings.footer.columns || [];
  config.layout_settings.footer.storeInfo = config.layout_settings.footer.storeInfo || {};
  config.layout_settings.footer.newsletter = config.layout_settings.footer.newsletter || {};
  config.layout_settings.footer.bottomLinks = config.layout_settings.footer.bottomLinks || [];
  config.layout_settings.footer.socialLinks = config.layout_settings.footer.socialLinks || [];
  config.layout_settings.footer.openingHours = config.layout_settings.footer.openingHours || [];
  config.layout_settings.footer.paymentIcons = config.layout_settings.footer.paymentIcons || [];
  config.layout_settings.header = config.layout_settings.header || {};
  config.layout_settings.productCard = config.layout_settings.productCard || {};
  config.layout_settings.announcementBar = config.layout_settings.announcementBar || {};

  // NEW: Initialize header sections
  config.layout_settings.header.topBar = config.layout_settings.header.topBar || {
    enabled: true,
    messages: ["Lifetime Warranty", "Easy Returns", "Free US Shipping on $75+"],
  };
  config.layout_settings.header.utilityBar = config.layout_settings.header.utilityBar || {
    enabled: true,
    announcementText: "Add anything here or just remove it...",
    showLanguageSelector: true,
    showCurrencySelector: true,
    showAuthLinks: true,
  };
  // Initialize mainNav for logo and icon settings (without navItems)
  config.layout_settings.header.mainNav = config.layout_settings.header.mainNav || {
    enabled: true,
    logoUrl: "https://picsum.photos/seed/elessi-logo/100/30", // Placeholder logo
    showGridIcon: true,
    showCartIcon: true,
    showWishlistIcon: true,
    showCompareIcon: true,
    showSearchIcon: true,
  };

  // Initialize config.layout_settings.header.navItems with the structure from user's JSON
  config.layout_settings.header.navItems = config.layout_settings.header.navItems || [
    { path: "/", title: "Home" },
    {
      type: "dropdown",
      title: "SHOP",
      subLinks: [
        { path: "/collections/new", title: "New Arrivals" },
        { path: "/collections/best-sellers", title: "Best Sellers" },
        { path: "/collections/sale", title: "Sale" },
        { path: "/collections/all", title: "All Products" },
      ],
    },
    { path: "/contact", title: "Contact" },
  ];


  // Initialize delivery_settings
  config.delivery_settings = config.delivery_settings || { zones: [], default_charge: "0", charge_not_refundable: false };

  // Initialize page_settings and its children (including landingPage and productPage)
  config.page_settings = config.page_settings || {};
  config.page_settings.policies = config.page_settings.policies || {};
  config.page_settings.landingPage = config.page_settings.landingPage || {};
  config.page_settings.productPage = config.page_settings.productPage || {};
  // FIX: Ensure components array is initialized and is an array
  if (!Array.isArray(config.page_settings.landingPage.components)) {
    // If it's an object with numeric keys, convert it to an array
    if (typeof config.page_settings.landingPage.components === 'object' && config.page_settings.landingPage.components !== null) {
      config.page_settings.landingPage.components = Object.values(config.page_settings.landingPage.components);
    } else {
      config.page_settings.landingPage.components = [];
    }
  }


  // Ensure all dynamic landing page components have an 'id' and their nested banners have 'id's
  if (Array.isArray(config.page_settings.landingPage.components)) {
    config.page_settings.landingPage.components = config.page_settings.landingPage.components.map(comp => {
      // Ensure component itself has a valid ID
      if (typeof comp.id !== 'number' || comp.id <= 0) { // Check if ID is not a positive number
        comp.id = Date.now() + Math.random();
      }
      // Also ensure banners within heroBannerSlider have IDs
      if (comp.type === "heroBannerSlider" && Array.isArray(comp.data?.banners)) {
        comp.data.banners = comp.data.banners.map(banner => {
          // Ensure banner itself has a valid ID
          if (typeof banner.id !== 'number' || banner.id <= 0) { // Check if ID is not a positive number
            return { ...banner, id: Date.now() + Math.random() };
          }
          return banner;
        });
      }
      return comp;
    });
  }


  // Initialize theme_settings
  config.theme_settings = config.theme_settings || {};
  config.theme_settings.primary_color = config.theme_settings.primary_color || "#6B46C1";
  config.theme_settings.secondary_color = config.theme_settings.secondary_color || "#FFFFFF";
  config.theme_settings.accent_color = config.theme_settings.accent_color || "#FFD700"; // Default gold
  config.theme_settings.text_color = config.theme_settings.text_color || "#333333"; // Default dark gray
  config.theme_settings.typography = config.theme_settings.typography || {};
  config.theme_settings.typography.headingFont = config.theme_settings.typography.headingFont || "Roboto";
  config.theme_settings.typography.bodyFont = config.theme_settings.typography.bodyFont || "Open Sans";
  config.theme_settings.button_style = config.theme_settings.button_style || {};
  config.theme_settings.button_style.shape = config.theme_settings.button_style.shape || "rounded";
  config.theme_settings.button_style.size = config.theme_settings.button_style.size || "medium";
  config.theme_settings.announcement_bar = config.theme_settings.announcement_bar || {};
  config.theme_settings.announcement_bar.enabled = config.theme_settings.announcement_bar.enabled !== undefined ? config.theme_settings.announcement_bar.enabled : false;
  config.theme_settings.announcement_bar.text = config.theme_settings.announcement_bar.text || "Limited Time Offer! Free Shipping on all orders.";
  config.theme_settings.announcement_bar.background_color = config.theme_settings.announcement_bar.background_color || "#6B46C1";
  config.theme_settings.announcement_bar.text_color = config.theme_settings.announcement_bar.text_color || "#FFFFFF";
  config.theme_settings.product_card_style = config.theme_settings.product_card_style || "default";
  config.theme_settings.theme_mode = config.theme_settings.theme_mode || "Light";
  config.theme_settings.buy_now_button_enabled = config.theme_settings.buy_now_button_enabled !== undefined ? config.theme_settings.buy_now_button_enabled : 1;


  // Default values for landing page specific settings (now part of page_settings.landingPage)
  config.page_settings.landingPage.landing_page_template_id = config.page_settings.landingPage.landing_page_template_id !== null && config.page_settings.landingPage.landing_page_template_id !== undefined ? config.page_settings.landingPage.landing_page_template_id : 1;
  config.page_settings.landingPage.general_primary_color = config.page_settings.landingPage.general_primary_color || "#6B46C1";
  config.page_settings.landingPage.general_secondary_color = config.page_settings.landingPage.general_secondary_color || "#000000";
  config.page_settings.landingPage.show_product_details = config.page_settings.landingPage.show_product_details !== undefined ? config.page_settings.landingPage.show_product_details : false;
  config.page_settings.landingPage.seo_page_title = config.page_settings.landingPage.seo_page_title || "";
  config.page_settings.landingPage.seo_page_description = config.page_settings.landingPage.seo_page_description || "";
  config.page_settings.landingPage.scrolling_banner_text = config.page_settings.landingPage.scrolling_banner_text || "";
  config.page_settings.landingPage.top_banner_image_url = config.page_settings.landingPage.top_banner_image_url || "";
  config.page_settings.landingPage.featured_section_images = config.page_settings.landingPage.featured_section_images || [];
  config.page_settings.landingPage.featured_video_title = config.page_settings.landingPage.featured_video_title || "";
  config.page_settings.landingPage.featured_video_url = config.page_settings.landingPage.featured_video_url || "";
  config.page_settings.landingPage.showcased_banner_images = config.page_settings.landingPage.showcased_banner_images || [];
  config.page_settings.landingPage.static_banner_image_url = config.page_settings.landingPage.static_banner_image_url || "";
  config.page_settings.landingPage.product_images_section_title = config.page_settings.landingPage.product_images_section_title || "";
  config.page_settings.landingPage.product_images_section_images = config.page_settings.landingPage.product_images_section_images || [];

  // Default values for product page specific settings
  config.page_settings.productPage = config.page_settings.productPage || {};
  config.page_settings.productPage.layout = config.page_settings.productPage.layout || "standard"; // standard, split, full-width
  config.page_settings.productPage.gallery_position = config.page_settings.productPage.gallery_position || "left"; // left, right, top
  config.page_settings.productPage.sections = config.page_settings.productPage.sections || {
    gallery: true,
    info: true,
    description: true,
    specifications: false,
    reviews: true,
    related: true,
    faq: false,
    trustBadges: true
  };
  config.page_settings.productPage.gallery_style = config.page_settings.productPage.gallery_style || "grid"; // grid, carousel, single
  config.page_settings.productPage.thumbnail_position = config.page_settings.productPage.thumbnail_position || "bottom"; // bottom, left
  config.page_settings.productPage.enable_zoom = config.page_settings.productPage.enable_zoom !== undefined ? config.page_settings.productPage.enable_zoom : true;
  config.page_settings.productPage.enable_video = config.page_settings.productPage.enable_video !== undefined ? config.page_settings.productPage.enable_video : true;
  config.page_settings.productPage.sticky_add_to_cart = config.page_settings.productPage.sticky_add_to_cart !== undefined ? config.page_settings.productPage.sticky_add_to_cart : false;
  config.page_settings.productPage.show_sku = config.page_settings.productPage.show_sku !== undefined ? config.page_settings.productPage.show_sku : true;
  config.page_settings.productPage.show_barcode = config.page_settings.productPage.show_barcode !== undefined ? config.page_settings.productPage.show_barcode : false;
  config.page_settings.productPage.show_stock_status = config.page_settings.productPage.show_stock_status !== undefined ? config.page_settings.productPage.show_stock_status : true;
  config.page_settings.productPage.related_products_count = config.page_settings.productPage.related_products_count || 8;
  config.page_settings.productPage.related_products_style = config.page_settings.productPage.related_products_style || "carousel"; // grid, carousel

  // Custom CSS/JS injection
  config.page_settings.custom_css = config.page_settings.custom_css || "";
  config.page_settings.custom_js = config.page_settings.custom_js || "";

  // Initialize integrations.seo and its children
  config.integrations = config.integrations || {};
  config.integrations.seo = config.integrations.seo || {};
  config.integrations.seo.gtm_id = config.integrations.seo.gtm_id || "";
  config.integrations.seo.fb_pixel_id = config.integrations.seo.fb_pixel_id || "";
  config.integrations.seo.fb_pixel_token = config.integrations.seo.fb_pixel_token || "";
  config.integrations.seo.pixel_test_event_id = config.integrations.seo.pixel_test_event_id || ""; // New field

  return config;
};

// Update store configuration
const updateStoreConfiguration = async (configuration) => {
  console.log("configuration >. ", configuration)
  const response = await api.put("/owner/store-configuration", configuration);
  return response.data;
};

export const useStoreConfiguration = () => {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();
  // Removed: const location = useLocation(); // No longer needed here

  const fetchConfigurationManually = useCallback(async () => {
    try {
      const config = await fetchStoreConfiguration();
      return config;
    } catch (err) {
      console.error("Error fetching store configuration manually:", err);
      throw err; // Re-throw to be caught by the caller
    }
  }, []);

  const updateMutation = useMutation({
    mutationFn: updateStoreConfiguration,
    onSuccess: (responsePayload) => {
      if (responsePayload.data && responsePayload.data.configuration) {
        queryClient.setQueryData(["storeConfiguration"], responsePayload.data.configuration);
      } else {
        queryClient.invalidateQueries({ queryKey: ["storeConfiguration"] });
      }
      showSuccess(responsePayload.message || "Settings updated successfully!");
    },
    onError: (err) => {
      showError(err.response?.data?.message || "Failed to update settings.");
    },
  });

  const updateConfigurationAsync = useCallback(async (payload) => {
    return updateMutation.mutateAsync(payload);
  }, [updateMutation]);

  // Using useQuery to fetch the configuration, but it will be enabled/disabled via context
  const { data: configuration, isLoading, error } = useQuery({
    queryKey: ["storeConfiguration"],
    queryFn: fetchStoreConfiguration,
    enabled: isAuthenticated, // Keep this for initial load within the context, if used.
  });

  return {
    configuration,
    isLoading,
    error,
    updateConfiguration: updateMutation.mutate,
    updateConfigurationAsync,
    isUpdating: updateMutation.isPending,
    fetchConfigurationManually,
  };
};