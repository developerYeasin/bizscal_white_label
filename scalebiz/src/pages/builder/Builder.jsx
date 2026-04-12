"use client";

import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext.jsx";
import { useThemeConfig } from "@/contexts/ThemeSettingsContext.jsx";
import { useStoreConfig } from "@/contexts/StoreConfigurationContext.jsx";
import { useAvailableThemes } from "@/hooks/use-available-themes.js";
import { useProductLandingPage } from "@/hooks/use-product-landing-page.js";
import api from "@/utils/api.js";
import { showSuccess, showError } from "@/utils/toast.js";

// Page Builder components
import { Canvas } from "@/components/page-builder/index.js";
import useCanvasState from "@/components/page-builder/useCanvasState.js";
import PropertySidebar from "@/components/page-builder/PropertySidebar.jsx";

// Refactored components
import BlockPalette from "./BlockPalette.jsx";
import PagesPanel from "./PagesPanel.jsx";
import ThemeSettings from "./ThemeSettings.jsx";
import AppSettings from "./AppSettings.jsx";
import PageProperties from "./PageProperties.jsx";
import BlockProperties from "./BlockProperties.jsx";
import BuilderHeader from "./BuilderHeader.jsx";
import BuilderViewport from "./BuilderViewport.jsx";
import BuilderToolRail from "./BuilderToolRail.jsx";

// Block settings components
import HeroBannerSettings from "@/components/landing-pages/settings/HeroBannerSettings.jsx";
import ProductCarouselSettings from "@/components/landing-pages/settings/ProductCarouselSettings.jsx";
import FeaturedCategoriesSettings from "@/components/landing-pages/settings/FeaturedCategoriesSettings.jsx";
import HeroBannerSliderSection from "@/components/landing-pages/HeroBannerSliderSection.jsx";
import MarketingBannerSettings from "@/components/landing-pages/settings/MarketingBannerSettings.jsx";
import FeatureBlocksSettings from "@/components/landing-pages/settings/FeatureBlocksSettings.jsx";
import ProductBlockSettings from "@/components/page-builder/settings/ProductBlockSettings.jsx";
import BrandShowcaseSettings from "@/components/landing-pages/settings/BrandShowcaseSettings.jsx";
import LatestNewsSettings from "@/components/landing-pages/settings/LatestNewsSettings.jsx";
import CategorySidebarSettings from "@/components/landing-pages/settings/CategorySidebarSettings.jsx";
import PromotionalBannersSettings from "@/components/landing-pages/settings/PromotionalBannersSettings.jsx";
import MidPageCallToActionSettings from "@/components/landing-pages/settings/MidPageCallToActionSettings.jsx";
import NewsletterSubscriptionSettings from "@/components/landing-pages/settings/NewsletterSubscriptionSettings.jsx";
import BlogPostsSectionSettings from "@/components/landing-pages/settings/BlogPostsSectionSettings.jsx";
import ContactFormSettings from "@/components/page-builder/settings/ContactFormSettings.jsx";
import PolicyPageSettings from "@/components/page-builder/settings/PolicyPageSettings.jsx";
import CartSettings from "@/components/page-builder/settings/CartSettings.jsx";
import CheckoutSettings from "@/components/page-builder/settings/CheckoutSettings.jsx";
import SystemHeaderSettings from "@/components/page-builder/settings/SystemHeaderSettings.jsx";
import SystemFooterSettings from "@/components/page-builder/settings/SystemFooterSettings.jsx";
import SectionBlockSettings from "@/components/page-builder/settings/SectionBlockSettings.jsx";
import RowBlockSettings from "@/components/page-builder/settings/RowBlockSettings.jsx";
import ColumnBlockSettings from "@/components/page-builder/settings/ColumnBlockSettings.jsx";
import GridBlockSettings from "@/components/page-builder/settings/GridBlockSettings.jsx";
import CardLayoutSettings from "@/components/page-builder/settings/CardLayoutSettings.jsx";
import CardSettings from "@/components/page-builder/settings/CardSettings.jsx";
import HeroSectionSettings from "@/components/page-builder/settings/HeroSectionSettings.jsx";
import ThemeSectionSettings from "@/components/page-builder/settings/ThemeSectionSettings.jsx";
import MegaMenuHeaderSettings from "@/components/page-builder/settings/MegaMenuHeaderSettings.jsx";
import TitleBlockSettings from "@/components/page-builder/settings/TitleBlockSettings.jsx";
import DescriptionBlockSettings from "@/components/page-builder/settings/DescriptionBlockSettings.jsx";
import TextBlockSettings from "@/components/page-builder/settings/TextBlockSettings.jsx";
import ButtonBlockSettings from "@/components/page-builder/settings/ButtonBlockSettings.jsx";
import ImageBlockSettings from "@/components/page-builder/settings/ImageBlockSettings.jsx";
import NewsletterCouponBannerSettings from "@/components/page-builder/settings/NewsletterCouponBannerSettings.jsx";
import AnnouncementBarSettings from "@/components/page-builder/settings/AnnouncementBarSettings.jsx";
import PromotionalBannerGridSettings from "@/components/page-builder/settings/PromotionalBannerGridSettings.jsx";
import SaleBannerSettings from "@/components/page-builder/settings/SaleBannerSettings.jsx";
import FeaturesTrustBadgesSettings from "@/components/page-builder/settings/FeaturesTrustBadgesSettings.jsx";
import ContactInfoBarSettings from "@/components/page-builder/settings/ContactInfoBarSettings.jsx";
import CategoryNavigationSettings from "@/components/page-builder/settings/CategoryNavigationSettings.jsx";
import HeroBannerWithProductSettings from "@/components/page-builder/settings/HeroBannerWithProductSettings.jsx";
import MegaMenuWithCategoriesSettings from "@/components/page-builder/settings/MegaMenuWithCategoriesSettings.jsx";

// Helper to update nested data object given a dot path
const updateNestedData = (obj, path, value) => {
  if (!obj) obj = {};
  const keys = path.split(".");
  const result = { ...obj };
  let current = result;
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!(key in current) || typeof current[key] !== "object") {
      current[key] = {};
    }
    current[key] = { ...current[key] };
    current = current[key];
  }
  current[keys[keys.length - 1]] = value;
  return result;
};

// Check if a block type is a container (can have children)
const CONTAINER_TYPES = [
  "section",
  "row",
  "column",
  "grid",
  "container",
];

const Builder = () => {
  const [isEditMode, setIsEditMode] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [mode, setMode] = useState("page");
  const [productId, setProductId] = useState(null);
  const [selectedPageId, setSelectedPageId] = useState(null);

  // Active panel in left sidebar: 'blocks' | 'pages' | 'theme' | 'settings' | null
  const [activeLeftPanel, setActiveLeftPanel] = useState("blocks");
  const [leftPanelOpen, setLeftPanelOpen] = useState(true);
  const [leftPanelWidth, setLeftPanelWidth] = useState(280);
  const [blockSearchQuery, setBlockSearchQuery] = useState("");

  // Viewport state
  const [viewport, setViewport] = useState("desktop");

  // Editor mode state
  const [creating, setCreating] = useState(false);
  const [editingPage, setEditingPage] = useState(null);
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);

  // Pages list ordering state (local) - initialize with pagesData when available
  const [orderedPages, setOrderedPages] = useState([]);

  // Row selection state
  const [selectedRowIds, setSelectedRowIds] = useState(new Set());

  // Canvas state
  const canvasState = useCanvasState([]);
  const canvasStateRef = useRef(canvasState);

  // Right sidebar state
  const [rightPanelOpen, setRightPanelOpen] = useState(false);
  const [rightPanelWidth, setRightPanelWidth] = useState(320);
  const [isLeftResizing, setIsLeftResizing] = useState(false);
  const [isRightResizing, setIsRightResizing] = useState(false);

  useEffect(() => {
    canvasStateRef.current = canvasState;
  }, [canvasState]);

  // Left panel resize handlers
  const startLeftResizing = useCallback((e) => {
    e.preventDefault();
    setIsLeftResizing(true);
  }, []);

  const stopLeftResizing = useCallback(() => {
    setIsLeftResizing(false);
  }, []);

  const leftResize = useCallback(
    (e) => {
      if (isLeftResizing) {
        const newWidth = e.clientX - 68; // 68px is the tool rail width
        if (newWidth >= 200 && newWidth <= 500) {
          setLeftPanelWidth(newWidth);
        }
      }
    },
    [isLeftResizing]
  );

  useEffect(() => {
    if (isLeftResizing) {
      window.addEventListener("mousemove", leftResize);
      window.addEventListener("mouseup", stopLeftResizing);
    } else {
      window.removeEventListener("mousemove", leftResize);
      window.removeEventListener("mouseup", stopLeftResizing);
    }
    return () => {
      window.removeEventListener("mousemove", leftResize);
      window.removeEventListener("mouseup", stopLeftResizing);
    };
  }, [isLeftResizing, leftResize, stopLeftResizing]);

  // Track manual panel close state for auto-open logic
  const manualCloseRef = useRef(false);

  // Extract stable reset function to avoid unnecessary effect runs
  const { reset: resetCanvas } = canvasState;

  // ESC key to exit builder or close panel
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        if (leftPanelOpen) {
          setLeftPanelOpen(false);
        } else {
          navigate(-1);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate, leftPanelOpen]);

  // Fetch custom pages list
  const { data: pagesData, isLoading: pagesLoading } = useQuery({
    queryKey: ["customPages"],
    queryFn: async () => {
      const response = await api.get("/owner/custom-pages");
      return response.data.data.pages;
    },
    enabled: isAuthenticated,
  });

  // Fetch theme and store config
  const {
    config: themeConfig,
    isLoading: themeLoading,
    error: themeError,
  } = useThemeConfig();
  const { config: storeConfig, isLoading: storeLoading } = useStoreConfig();

  // Fetch available themes for palette
  const { data: availableThemes, isLoading: themesLoading } =
    useAvailableThemes();

  // Fetch all theme blocks
  const { data: themeBlocksData } = useQuery({
    queryKey: ["themeBlocks"],
    queryFn: async () => {
      try {
        const response = await api.get("/owner/theme-blocks");
        return response.data.data.theme_blocks || [];
      } catch (error) {
        console.error("Failed to fetch theme blocks:", error);
        return [];
      }
    },
    enabled: isAuthenticated,
    staleTime: Infinity,
  });

  // Build theme blocks map
  const themeBlocksMap = useMemo(() => {
    if (!themeBlocksData || themeBlocksData.length === 0) return {};
    const map = {};
    themeBlocksData.forEach((block) => {
      if (!map[block.theme_id]) {
        map[block.theme_id] = [];
      }
      map[block.theme_id].push(block);
    });
    return map;
  }, [themeBlocksData]);

  // Determine current theme blocks
  const currentTheme = useMemo(() => {
    if (!storeConfig || !availableThemes) return null;
    // Find theme by database ID (storeConfig.theme_id is the database ID)
    const theme =
      availableThemes.find((t) => t.id === storeConfig.theme_id) ||
      availableThemes[0];
    if (!theme) return null;
    const blocks = themeBlocksMap[theme.id] || [];
    return {
      ...theme,
      theme_blocks: blocks,
    };
  }, [storeConfig, availableThemes, themeBlocksMap]);

  const themeBlocks = useMemo(() => {
    if (!currentTheme?.theme_blocks) return [];
    return [...currentTheme.theme_blocks].sort(
      (a, b) => a.sort_order - b.sort_order,
    );
  }, [currentTheme]);

  // Filtered blocks based on search query
  const filteredThemeBlocks = useMemo(() => {
    if (!blockSearchQuery.trim()) return themeBlocks;
    const q = blockSearchQuery.toLowerCase();
    return themeBlocks.filter(
      (b) =>
        (b.name || b.block_type).toLowerCase().includes(q) ||
        (b.description || "").toLowerCase().includes(q),
    );
  }, [themeBlocks, blockSearchQuery]);

  // Settings components map - direct imports
  const settingsComponentMap = useMemo(
    () => ({
      // Hero & Product Blocks
      heroBanner: HeroBannerSettings,
      productCarousel: ProductCarouselSettings,
      featuredCategories: FeaturedCategoriesSettings,
      heroBannerSlider: HeroBannerSliderSection,
      marketingBanner: MarketingBannerSettings,
      featureBlocks: FeatureBlocksSettings,
      productSection: ProductBlockSettings,
      brandShowcase: BrandShowcaseSettings,
      latestNews: LatestNewsSettings,
      categorySidebar: CategorySidebarSettings,
      promotionalBanners: PromotionalBannersSettings,
      midPageCallToAction: MidPageCallToActionSettings,
      newsletterSubscription: NewsletterSubscriptionSettings,
      blogPostsSection: BlogPostsSectionSettings,
      
      // System blocks
      Header: SystemHeaderSettings,
      systemHeader: SystemHeaderSettings,
      Footer: SystemFooterSettings,
      systemFooter: SystemFooterSettings,
      
      // Layout blocks
      section: SectionBlockSettings,
      row: RowBlockSettings,
      column: ColumnBlockSettings,
      columns: ColumnBlockSettings,
      grid: GridBlockSettings,
      container: SectionBlockSettings,
      cardLayout: CardLayoutSettings,
      card: CardSettings,
      heroSection: HeroSectionSettings,
      readyMadeSection: HeroSectionSettings,
      themeSection: ThemeSectionSettings,
      megaMenuHeader: MegaMenuHeaderSettings,
      
      // Basic blocks
      title: TitleBlockSettings,
      description: DescriptionBlockSettings,
      text: TextBlockSettings,
      button: ButtonBlockSettings,
      image: ImageBlockSettings,
      
      // Product page blocks
      productGallery: ProductBlockSettings,
      productInfo: ProductBlockSettings,
      productPolicyBlocks: ProductBlockSettings,
      productDescriptionTabs: ProductBlockSettings,
      productRelatedCarousel: ProductBlockSettings,
      rightColumnBanner: ProductBlockSettings,
      
      // Cart & Checkout blocks
      cart: CartSettings,
      checkout: CheckoutSettings,
      orderConfirmation: CartSettings,
      receiptPage: CartSettings,
      
      // Form blocks
      contactForm: ContactFormSettings,
      policyPage: PolicyPageSettings,
      
      // Template blocks
      nirvanaTemplate: ProductBlockSettings,
      arcadiaTemplate: ProductBlockSettings,
      productHeroSectionOne: ProductBlockSettings,
      productBrandLogos: ProductBlockSettings,
      productShowcaseSection: ProductBlockSettings,
      productFeatureBlocksOne: ProductBlockSettings,
      customerTestimonialsOne: ProductBlockSettings,
      newsletterSectionOne: ProductBlockSettings,
      nirvanaHeroSection: ProductBlockSettings,
      nirvanaWhyChooseUs: ProductBlockSettings,
      nirvanaAboutUs: ProductBlockSettings,
      nirvanaProductShowcase: ProductBlockSettings,
      nirvanaWhyWeAreBest: ProductBlockSettings,
      nirvanaTestimonials: ProductBlockSettings,
      nirvanaNewsletter: ProductBlockSettings,
      
      // All products section
      allProducts: ProductBlockSettings,
      
      // Timer/Countdown
      timerSetting: ProductBlockSettings,
      
      // Simple details theme
      simpleDetailsTheme: ProductBlockSettings,
      
      // Akira Theme Blocks
      promotionalBannerGrid: PromotionalBannerGridSettings,
      saleBanner: SaleBannerSettings,
      featuresTrustBadges: FeaturesTrustBadgesSettings,
      newsletterCouponBanner: NewsletterCouponBannerSettings,
      
      // Axon Theme Blocks
      announcementBar: AnnouncementBarSettings,
      megaMenuWithCategories: MegaMenuWithCategoriesSettings,
      productTabsFilter: ProductBlockSettings,
      
      // Ghorer Bazar Theme Blocks
      contactInfoBar: ContactInfoBarSettings,
      categoryNavigation: CategoryNavigationSettings,
      heroBannerWithProduct: HeroBannerWithProductSettings,
    }),
    [],
  );

  // Create page mutation
  const createPageMutation = useMutation({
    mutationFn: async (data) => {
      const response = await api.post("/owner/custom-pages", {
        ...data,
        content: data.content || { blocks: [] },
      });
      return response.data;
    },
    onSuccess: (data) => {
      showSuccess("Page created successfully!");
      queryClient.invalidateQueries({ queryKey: ["customPages"] });
      setSelectedPageId(data.data.page_id);
    },
    onError: (err) => {
      showError(err.response?.data?.message || "Failed to create page.");
    },
  });

  // Delete page mutation
  const deletePageMutation = useMutation({
    mutationFn: async (pageId) => {
      const response = await api.delete(`/owner/custom-pages/${pageId}`);
      return response.data;
    },
    onSuccess: () => {
      showSuccess("Page deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["customPages"] });
    },
    onError: (err) => {
      showError(err.response?.data?.message || "Failed to delete page.");
    },
  });

  // Form data state
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    meta_title: "",
    meta_description: "",
    status: "draft",
  });

  // Local saving state for Save button
  const [isSaving, setIsSaving] = useState(false);

  // Custom page/product data
  const { data: customPage, isLoading: isLoadingCustomPage } = useQuery({
    queryKey: ["customPage", selectedPageId],
    queryFn: async () => {
      const response = await api.get(`/owner/custom-pages/${selectedPageId}`);
      return response.data.data.page;
    },
    enabled: mode === "page" && !!selectedPageId,
  });

  const productLandingPageQuery = useProductLandingPage(productId);
  const productLandingPage = productLandingPageQuery?.landingPage || null;
  const isCreatingProduct = productLandingPageQuery?.isCreating || false;
  const isUpdatingProduct = productLandingPageQuery?.isUpdating || false;

  // Initialize canvas when page/product loads
  useEffect(() => {
    if (mode === "page") {
      if (customPage) {
        setEditingPage(customPage);
        setCreating(false);

        const rawBlocks = customPage.content?.blocks;
        let blocks = Array.isArray(rawBlocks) ? [...rawBlocks] : [];

        canvasState.reset(blocks);
        setFormData((prev) => ({
          ...prev,
          title: customPage.title || "",
          slug: customPage.slug || "",
          meta_title: customPage.meta_title || "",
          meta_description: customPage.meta_description || "",
          status: customPage.status || "draft",
        }));
        setIsSlugManuallyEdited(false);

        setLeftPanelOpen(true);
      } else if (!selectedPageId) {
        setFormData({
          title: "",
          slug: "",
          meta_title: "",
          meta_description: "",
          status: "draft",
        });
        canvasState.reset([]);
        setIsSlugManuallyEdited(false);
        setLeftPanelOpen(true);
      }
    }
  }, [mode, customPage, resetCanvas, selectedPageId]);

  useEffect(() => {
    if (mode === "product" && productLandingPage) {
      const rawBlocks = productLandingPage.settings_json?.components;
      let blocks = Array.isArray(rawBlocks) ? [...rawBlocks] : [];

      canvasState.reset(blocks);

      setFormData((prev) => ({
        ...prev,
        page_title:
          productLandingPage.settings_json?.seo_settings?.page_title || "",
        page_description:
          productLandingPage.settings_json?.seo_settings?.page_description ||
          "",
        slug: productLandingPage.slug || "",
        status: productLandingPage.status || "draft",
      }));

      setLeftPanelOpen(true);
      setActiveLeftPanel("properties");
    }
  }, [mode, productLandingPage]);

  // Handlers
  const handleAddBlock = useCallback(
    (blockType, arg2, arg3, arg4) => {
      let defaultConfig = {};
      let index = null;
      let parentId = null;

      if (typeof arg2 === "number") {
        index = arg2;
        defaultConfig = arg3 || {};
        parentId = arg4 || null;
      } else if (typeof arg2 === "object" && arg2 !== null) {
        defaultConfig = arg2;
        if (
          canvasState.selectedId &&
          canvasState.selectedItem &&
          CONTAINER_TYPES.includes(canvasState.selectedItem.type)
        ) {
          parentId = canvasState.selectedId;
        }
      }

      const newBlock = {
        id: Date.now() + Math.random(),
        type: blockType,
        data: defaultConfig,
      };
      canvasState.addItem(newBlock, parentId, index);
      setActiveLeftPanel("blocks");
    },
    [canvasState.selectedId, canvasState.selectedItem, canvasState.addItem],
  );

  const handleMetaChange = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (field === "slug") {
      setIsSlugManuallyEdited(true);
    }
  }, []);

  const handleCreateNewPage = useCallback(() => {
    setFormData({
      title: "",
      slug: "",
      meta_title: "",
      meta_description: "",
      status: "draft",
    });
    canvasState.reset([]);
    setSelectedPageId(null);
    setMode("page");
    setLeftPanelOpen(true);
    setActiveLeftPanel("properties");
  }, [canvasState, navigate]);

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    try {
      const isPageMode = mode === "page";
      const isProductMode = mode === "product";

      if (isPageMode) {
        const title = formData.title || formData.page_title;
        const slug = formData.slug;
        if (!title || !slug) {
          showError("Title and Slug are required.");
          setIsSaving(false);
          return;
        }

        const payload = {
          title: formData.title,
          slug: formData.slug,
          meta_title: formData.meta_title,
          meta_description: formData.meta_description,
          status: formData.status,
          content: { blocks: canvasState.items },
        };

        if (customPage) {
          await api.put(`/owner/custom-pages/${customPage.id}`, payload);
        } else {
          await api.post("/owner/custom-pages", payload);
        }
        showSuccess(customPage ? "Page updated!" : "Page created!");
        queryClient.invalidateQueries({ queryKey: ["customPages"] });
      } else if (isProductMode) {
        if (!productId) {
          showError("Product ID missing.");
          setIsSaving(false);
          return;
        }
        if (!formData.page_title || !formData.slug) {
          showError("Page Title and Slug are required.");
          setIsSaving(false);
          return;
        }

        const payload = {
          store_id: storeConfig?.store_id,
          product_id: parseInt(productId),
          template_id: productLandingPage?.template_id || null,
          page_title: formData.page_title,
          page_description: formData.page_description,
          slug: formData.slug,
          settings_json: {
            components: canvasState.items,
            seo_settings: {
              page_title: formData.page_title,
              page_description: formData.page_description,
            },
          },
          is_active: formData.status === "published",
        };

        if (productLandingPage) {
          await productLandingPageQuery.updateProductLandingPage({
            id: productLandingPage.id,
            ...payload,
          });
        } else {
          await productLandingPageQuery.createProductLandingPage(payload);
        }
        showSuccess("Product landing page saved!");
      }

      canvasState.markSaved();
      setIsSaving(false);
    } catch (err) {
      showError(err.response?.data?.message || "Failed to save.");
      setIsSaving(false);
    }
  }, [
    mode,
    productId,
    customPage,
    productLandingPage,
    formData,
    canvasState.items,
    storeConfig,
    queryClient,
    navigate,
    productLandingPageQuery,
  ]);

  const handlePublish = useCallback(() => {
    setFormData((prev) => ({ ...prev, status: "published" }));
    handleSave();
  }, [handleSave]);

  const handleBack = useCallback(() => {
    navigate("/dashboard");
  }, [navigate]);

  // Toggle row selection
  const toggleRowSelection = useCallback((pageId) => {
    console.log("toggleRowSelection", pageId);
    setSelectedPageId(pageId);
    setSelectedRowIds(new Set([pageId]));
  }, []);

  // Handle panel switching - toggle behavior
  const openPanel = useCallback(
    (panelId) => {
      if (activeLeftPanel === panelId && leftPanelOpen) {
        setLeftPanelOpen(false);
        manualCloseRef.current = true;
      } else {
        setActiveLeftPanel(panelId);
        setLeftPanelOpen(true);
        manualCloseRef.current = false;
      }
    },
    [activeLeftPanel, leftPanelOpen],
  );

  const closePanel = useCallback(() => {
    manualCloseRef.current = true;
    setLeftPanelOpen(false);
  }, []);

  // Function to create pages for a theme dynamically
  const createThemePages = async (themeId) => {
    try {
      const response = await api.get(`/owner/theme-blocks?theme_id=${themeId}`);
      const themeBlocks = response.data.data.theme_blocks || [];

      const standardPages = [
        { title: 'Home', slug: 'home' },
        { title: 'About Us', slug: 'about-us' },
        { title: 'Contact Us', slug: 'contact' },
        { title: 'Privacy Policy', slug: 'privacy-policy' },
        { title: 'Terms of Service', slug: 'terms-of-service' },
        { title: 'Shipping & Returns', slug: 'shipping-returns' }
      ];

      const pagesResponse = await api.get("/owner/custom-pages");
      const pages = pagesResponse.data.data.pages || [];
      
      for (const page of pages) {
        await api.delete(`/owner/custom-pages/${page.id}`);
      }

      let blockIdCounter = 0;
      const generateUniqueId = () => `block-${Date.now()}-${blockIdCounter++}`;

      for (const page of standardPages) {
        let blocks = [];

        if (page.slug === 'home') {
          const headerBlock = themeBlocks.find(b => b.block_type === 'Header');
          blocks.push({
            id: generateUniqueId(),
            type: 'Header',
            data: headerBlock ? headerBlock.default_config : {}
          });
          
          const announcementBarBlock = themeBlocks.find(b => b.block_type === 'announcementBar');
          if (announcementBarBlock) {
            blocks.push({
              id: generateUniqueId(),
              type: 'announcementBar',
              data: announcementBarBlock.default_config || {}
            });
          }

          const heroBannerBlock = themeBlocks.find(b => b.block_type === 'heroBanner' || b.block_type === 'heroBannerSlider');
          if (heroBannerBlock) {
            blocks.push({
              id: generateUniqueId(),
              type: heroBannerBlock.block_type,
              data: heroBannerBlock.default_config || {}
            });
          }

          const productCarouselBlock = themeBlocks.find(b => b.block_type === 'productCarousel' || b.block_type === 'productSection');
          if (productCarouselBlock) {
            blocks.push({
              id: generateUniqueId(),
              type: productCarouselBlock.block_type,
              data: productCarouselBlock.default_config || {}
            });
          }

          const featuredCategoriesBlock = themeBlocks.find(b => b.block_type === 'featuredCategories');
          if (featuredCategoriesBlock) {
            blocks.push({
              id: generateUniqueId(),
              type: featuredCategoriesBlock.block_type,
              data: featuredCategoriesBlock.default_config || {}
            });
          }

          themeBlocks.forEach(block => {
            if (['promotionalBannerGrid', 'saleBanner', 'featuresTrustBadges', 'newsletterCouponBanner'].includes(block.block_type)) {
              blocks.push({
                id: generateUniqueId(),
                type: block.block_type,
                data: block.default_config || {}
              });
            }
          });

          themeBlocks.forEach(block => {
            if (['productTabsFilter'].includes(block.block_type)) {
              blocks.push({
                id: generateUniqueId(),
                type: block.block_type,
                data: block.default_config || {}
              });
            }
          });

          const categorySidebarBlock = themeBlocks.find(b => b.block_type === 'categorySidebar');
          if (categorySidebarBlock) {
            blocks.push({
              id: generateUniqueId(),
              type: 'categorySidebar',
              data: categorySidebarBlock.default_config || {}
            });
          }

          themeBlocks.forEach(block => {
            if (['contactInfoBar', 'heroBannerWithProduct'].includes(block.block_type)) {
              blocks.push({
                id: generateUniqueId(),
                type: block.block_type,
                data: block.default_config || {}
              });
            }
          });

          blocks.push({ id: generateUniqueId(), type: 'Footer', data: {} });
        } else if (page.slug === 'about-us') {
          blocks.push({ id: generateUniqueId(), type: 'Header', data: {} });
          
          const heroBannerBlock = themeBlocks.find(b => b.block_type === 'heroBanner');
          if (heroBannerBlock) {
            blocks.push({
              id: generateUniqueId(),
              type: heroBannerBlock.block_type,
              data: {
                ...heroBannerBlock.default_config,
                title: 'About Our Brand',
                subtitle: 'Quality products since 2024'
              }
            });
          }

          const featureBlocksBlock = themeBlocks.find(b => b.block_type === 'featureBlocks');
          if (featureBlocksBlock) {
            blocks.push({
              id: generateUniqueId(),
              type: featureBlocksBlock.block_type,
              data: {
                ...featureBlocksBlock.default_config,
                title: 'Our Story',
                features: [
                  { icon: 'check-circle', title: 'Quality Products', description: 'We offer only the best items' },
                  { icon: 'truck', title: 'Fast Shipping', description: 'Quick delivery worldwide' },
                  { icon: 'heart', title: 'Customer Care', description: '24/7 support for our customers' }
                ]
              }
            });
          }

          blocks.push({ id: generateUniqueId(), type: 'Footer', data: {} });
        } else if (page.slug === 'contact') {
          blocks.push({ id: generateUniqueId(), type: 'Header', data: {} });
          
          blocks.push({
            id: generateUniqueId(),
            type: 'contactForm',
            data: {
              title: 'Contact Us',
              description: 'Have questions? Reach out!',
              emailTo: 'info@store.com',
              fields: [
                { name: 'name', label: 'Your Name', type: 'text', required: true, placeholder: 'Enter your name' },
                { name: 'email', label: 'Your Email', type: 'email', required: true, placeholder: 'Enter your email' },
                { name: 'message', label: 'Your Message', type: 'textarea', required: true, placeholder: 'Enter your message' }
              ],
              submitLabel: 'Send Message'
            }
          });

          blocks.push({ id: generateUniqueId(), type: 'Footer', data: {} });
        } else if (page.slug === 'privacy-policy' || page.slug === 'terms-of-service') {
          blocks.push({ id: generateUniqueId(), type: 'Header', data: {} });
          
          blocks.push({
            id: generateUniqueId(),
            type: 'text',
            data: {
              content: `<h2>${page.title}</h2><p>This is the ${page.title.toLowerCase()} page content. Please customize this content in the page builder.</p>`
            }
          });

          blocks.push({ id: generateUniqueId(), type: 'Footer', data: {} });
        } else if (page.slug === 'shipping-returns') {
          blocks.push({ id: generateUniqueId(), type: 'Header', data: {} });
          
          const featureBlocksBlock = themeBlocks.find(b => b.block_type === 'featureBlocks');
          if (featureBlocksBlock) {
            blocks.push({
              id: generateUniqueId(),
              type: featureBlocksBlock.block_type,
              data: {
                ...featureBlocksBlock.default_config,
                title: 'Shipping Information',
                features: [
                  { icon: 'truck', title: 'Free Shipping', description: 'Free shipping on orders over $50' },
                  { icon: 'clock', title: 'Fast Delivery', description: '3-5 business days' },
                  { icon: 'globe', title: 'International Shipping', description: 'We ship worldwide' }
                ]
              }
            });
          }

          blocks.push({ id: generateUniqueId(), type: 'Footer', data: {} });
        }

        await api.post("/owner/custom-pages", {
          title: page.title,
          slug: page.slug,
          meta_title: page.title,
          meta_description: `Learn more about ${page.title}`,
          status: "published",
          content: { blocks },
        });
      }

      queryClient.invalidateQueries({ queryKey: ["customPages"] });
      showSuccess(`Pages created successfully for theme!`);
    } catch (error) {
      console.error("Error creating theme pages:", error);
      showError(error.response?.data?.message || "Failed to create theme pages");
      throw error;
    }
  };

  // Sync orderedPages with pagesData when it changes
  useEffect(() => {
    if (pagesData) {
      pagesData && pagesData.length > 0 && setSelectedPageId(pagesData[0].id);
      setOrderedPages((prev) => {
        if (prev.length !== pagesData.length) return pagesData;
        const idsMatch = prev.every((p, idx) => p.id === pagesData[idx]?.id);
        return idsMatch ? prev : pagesData;
      });
    }
  }, [pagesData]);

  // Auto-open right sidebar when a block is selected
  useEffect(() => {
    if (canvasState.selectedItem && (mode === "page" || mode === "product")) {
      setRightPanelOpen(true);
    }
  }, [canvasState.selectedId, mode]);

  if (themeError) {
    return (
      <div className="p-6 text-destructive">
        Error loading theme: {themeError.message}
      </div>
    );
  }

  return (
    <div className="h-screen w-screen overflow-hidden flex bg-[#F5F6F8]">
      {/* 1. LEFT TOOL RAIL (68px) */}
      <BuilderToolRail
        activeLeftPanel={activeLeftPanel}
        rightPanelOpen={rightPanelOpen}
        storeConfig={storeConfig}
        openPanel={openPanel}
        setRightPanelOpen={setRightPanelOpen}
      />

      {/* 2. DYNAMIC LEFT PANEL (Resizable) */}
      {leftPanelOpen && (
        <aside
          style={{ width: `${leftPanelWidth}px` }}
          className="bg-white border-r border-gray-200 flex flex-col shrink-0 z-20 relative"
        >
          {/* Left Panel Resize Handle */}
          <div
            className={`absolute top-0 right-[-3px] w-[6px] h-full cursor-col-resize hover:bg-blue-500/30 transition-colors z-30 ${
              isLeftResizing ? "bg-blue-500/50" : ""
            }`}
            onMouseDown={startLeftResizing}
          />
          {/* Panel Header */}
          <div className="h-14 border-b border-gray-100 flex items-center justify-between px-4 shrink-0">
            <h2 className="font-semibold text-sm text-gray-800">
              {activeLeftPanel === "blocks" && "Add New Block"}
              {activeLeftPanel === "pages" && "Pages"}
              {activeLeftPanel === "theme" && "Theme Settings"}
              {activeLeftPanel === "settings" && "App Settings"}
              {activeLeftPanel === "properties" && "Properties"}
            </h2>
            <button
              className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-50"
              onClick={closePanel}
              title="Close panel"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Panel Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {activeLeftPanel === "blocks" && (
              <BlockPalette
                blockSearchQuery={blockSearchQuery}
                setBlockSearchQuery={setBlockSearchQuery}
                handleAddBlock={handleAddBlock}
                filteredThemeBlocks={filteredThemeBlocks}
              />
            )}
            {activeLeftPanel === "pages" && (
              <PagesPanel
                orderedPages={orderedPages}
                setOrderedPages={setOrderedPages}
                selectedPageId={selectedPageId}
                setSelectedPageId={setSelectedPageId}
                setMode={setMode}
                navigate={navigate}
                canvasState={canvasState}
                setActiveLeftPanel={setActiveLeftPanel}
                setLeftPanelOpen={setLeftPanelOpen}
                queryClient={queryClient}
                showLoading={pagesLoading}
                selectedRowIds={selectedRowIds}
                toggleRowSelection={toggleRowSelection}
                deleteMutation={deletePageMutation}
                onCreateNewPage={handleCreateNewPage}
              />
            )}
            {activeLeftPanel === "theme" && (
              <ThemeSettings
                availableThemes={availableThemes}
                storeConfig={storeConfig}
                queryClient={queryClient}
                createThemePages={createThemePages}
              />
            )}
            {activeLeftPanel === "settings" && (
              <AppSettings navigate={navigate} />
            )}
            {activeLeftPanel === "properties" && (
              <>
                {/* Page-level settings (shown when no block is selected in page/product mode) */}
                {(mode === "page" || mode === "product") && !canvasState.selectedId && (
                  <PageProperties
                    mode={mode}
                    selectedPageId={selectedPageId}
                    formData={formData}
                    handleMetaChange={handleMetaChange}
                    handleSave={handleSave}
                    isSaving={isSaving}
                    canvasState={canvasState}
                    setActiveLeftPanel={setActiveLeftPanel}
                    setLeftPanelOpen={setLeftPanelOpen}
                  />
                )}
                
                {/* Block-specific settings - shown when a block is selected */}
                {canvasState.selectedId && (
                  <BlockProperties
                    canvasState={canvasState}
                    settingsComponentMap={settingsComponentMap}
                    setActiveLeftPanel={setActiveLeftPanel}
                    setLeftPanelOpen={setLeftPanelOpen}
                  />
                )}
                
                {/* Empty state when no block is selected and not in page/product mode */}
                {mode !== "page" && mode !== "product" && !canvasState.selectedId && (
                  <p className="text-sm text-gray-500 text-center py-8">
                    Select a block to edit its properties.
                  </p>
                )}
              </>
            )}
          </div>
        </aside>
      )}

      {/* 3. MAIN COLUMN */}
      <div className="flex-1 flex flex-col min-w-0 h-full">
        {/* Header */}
        <BuilderHeader
          storeConfig={storeConfig}
          mode={mode}
          customPage={customPage}
          productLandingPage={productLandingPage}
          isSaving={isSaving}
          isCreatingProduct={isCreatingProduct}
          isUpdatingProduct={isUpdatingProduct}
          handleBack={handleBack}
          handleSave={handleSave}
          handlePublish={handlePublish}
          openPanel={openPanel}
        />

        {/* Workspace Area */}
        <main className="flex-1 overflow-auto p-4 md:p-6 flex justify-center bg-[#F5F6F8]">
          {/* Canvas Container */}
          <div
            className={`bg-white rounded-lg shadow-sm border border-gray-200 min-h-[800px] relative flex flex-col ${
              viewport === "mobile"
                ? "w-[375px]"
                : viewport === "tablet"
                ? "w-[768px]"
                : "w-full max-w-[1200px]"
            }`}
          >
            {/* Device Viewport Toggles */}
            <BuilderViewport
              viewport={viewport}
              setViewport={setViewport}
            />

            {/* Canvas */}
            <div className="flex-1 relative">
              <Canvas
                items={canvasState.items}
                selectedId={canvasState.selectedId}
                onSelectItem={canvasState.selectItem}
                onUpdateItems={canvasState.updateItems}
                themeConfig={themeConfig}
                storeConfig={storeConfig}
                viewport={viewport}
                onDropBlock={handleAddBlock}
                className="h-full"
              />
            </div>

            {/* Empty state when no blocks */}
            {canvasState.items.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-white/80 z-10">
                <div className="text-center">
                  <div className="text-4xl mb-4">📦</div>
                  <p className="text-lg font-medium text-gray-300">
                    Your page is empty
                  </p>
                  <p className="text-sm text-gray-400">
                    Click the + button to add blocks
                  </p>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* 4. RIGHT SIDEBAR (Properties) */}
      {rightPanelOpen && (
        <PropertySidebar
          canvasState={canvasState}
          mode={mode}
          selectedPageId={selectedPageId}
          formData={formData}
          handleMetaChange={handleMetaChange}
          handleSave={handleSave}
          isSaving={isSaving}
          settingsComponentMap={settingsComponentMap}
          storeConfig={storeConfig}
          onClose={() => setRightPanelOpen(false)}
          width={rightPanelWidth}
          setWidth={setRightPanelWidth}
        />
      )}
    </div>
  );
};

export default Builder;
