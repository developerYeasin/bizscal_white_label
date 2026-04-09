"use client";

import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext.jsx";
import { useThemeConfig } from "@/contexts/ThemeSettingsContext.jsx";
import { useStoreConfig } from "@/contexts/StoreConfigurationContext.jsx";
import { useAvailableThemes } from "@/hooks/use-available-themes.js";
import { useProductLandingPage } from "@/hooks/use-product-landing-page.js";
import api from "@/utils/api.js";
import { showSuccess, showError } from "@/utils/toast.js";

// Fetch all theme blocks
const fetchThemeBlocks = async () => {
  try {
    const response = await api.get("/owner/theme-blocks");
    return response.data.data.theme_blocks || [];
  } catch (error) {
    console.error("Failed to fetch theme blocks:", error);
    return [];
  }
};

// Page Builder components
import { Canvas, useCanvasState } from "@/components/page-builder/index.js";

// DnD Kit imports for page reordering
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";

// Block settings components
import HeroBannerSettings from "@/components/landing-pages/settings/HeroBannerSettings.jsx";
import ProductCarouselSettings from "@/components/landing-pages/settings/ProductCarouselSettings.jsx";
import FeaturedCategoriesSettings from "@/components/landing-pages/settings/FeaturedCategoriesSettings.jsx";
import HeroBannerSliderSection from "@/components/landing-pages/HeroBannerSliderSection.jsx";
import MarketingBannerSettings from "@/components/landing-pages/settings/MarketingBannerSettings.jsx";
import FeatureBlocksSettings from "@/components/landing-pages/settings/FeatureBlocksSettings.jsx";
import ProductSectionSettings from "@/components/landing-pages/settings/ProductSectionSettings.jsx";
import BrandShowcaseSettings from "@/components/landing-pages/settings/BrandShowcaseSettings.jsx";
import LatestNewsSettings from "@/components/landing-pages/settings/LatestNewsSettings.jsx";
import CategorySidebarSettings from "@/components/landing-pages/settings/CategorySidebarSettings.jsx";
import PromotionalBannersSettings from "@/components/landing-pages/settings/PromotionalBannersSettings.jsx";
import MidPageCallToActionSettings from "@/components/landing-pages/settings/MidPageCallToActionSettings.jsx";
import NewsletterSubscriptionSettings from "@/components/landing-pages/settings/NewsletterSubscriptionSettings.jsx";
import BlogPostsSectionSettings from "@/components/landing-pages/settings/BlogPostsSectionSettings.jsx";

// System blocks settings
import SystemHeaderSettings from "@/components/page-builder/settings/SystemHeaderSettings.jsx";
import SystemFooterSettings from "@/components/page-builder/settings/SystemFooterSettings.jsx";
// Layout block settings
import SectionBlockSettings from "@/components/page-builder/settings/SectionBlockSettings.jsx";
import RowBlockSettings from "@/components/page-builder/settings/RowBlockSettings.jsx";
import ColumnBlockSettings from "@/components/page-builder/settings/ColumnBlockSettings.jsx";
import GridBlockSettings from "@/components/page-builder/settings/GridBlockSettings.jsx";

// Theme customization components
import ThemeSelection from "@/components/customize-theme/ThemeSelection.jsx";
import ThemeControls from "@/components/customize-theme/ThemeControls.jsx";
import ThemePreviewPanel from "@/components/customize-theme/ThemePreviewPanel.jsx";

// UI Components
import { Skeleton } from "@/components/ui/skeleton.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Textarea } from "@/components/ui/textarea.jsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.jsx";
import { Button } from "@/components/ui/button.jsx";
import { ScrollArea } from "@/components/ui/scroll-area.jsx";

// Icons
import {
  Home, Eye, Monitor, Tablet, Smartphone, Plus,
  FileText, Palette, Settings, ChevronDown, X,
  PanelTop, PanelBottom, Globe, Search, CreditCard, Truck, Share2,
  Layout, LayoutPanelTop, List, Table, Image, FileInput, Sliders, GripVertical, MoreHorizontal
} from "lucide-react";

// UI Components
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu.jsx";

// Viewport definitions
const VIEWPORTS = {
  desktop: { label: "Desktop", icon: Monitor },
  tablet: { label: "Tablet", icon: Tablet },
  mobile: { label: "Mobile", icon: Smartphone },
};

// Helper to update nested data object given a dot path
const updateNestedData = (obj, path, value) => {
  if (!obj) obj = {};
  const keys = path.split('.');
  const result = { ...obj };
  let current = result;
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!(key in current) || typeof current[key] !== 'object') {
      current[key] = {};
    }
    current[key] = { ...current[key] };
    current = current[key];
  }
  current[keys[keys.length - 1]] = value;
  return result;
};

// Pages Panel with DnD reordering - separate component to comply with Rules of Hooks
const SortablePageItem = ({ page, pageId, navigate, canvasState, setActiveLeftPanel, setLeftPanelOpen, selectedRowIds, toggleRowSelection, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    isDragging,
  } = useSortable({ id: page.id });

  const isSelected = selectedRowIds.has(page.id);
  const isEditing = pageId === String(page.id);

  const handleEdit = (e) => { e && e.stopPropagation();
    e.stopPropagation();
    navigate(`/custom-pages?pageId=${page.id}`);
    canvasState.clearSelection();
    setActiveLeftPanel('properties');
    setLeftPanelOpen(true);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm("Delete this page? This action cannot be undone.")) {
      onDelete(page.id);
    }
  };

  return (
    <div
      ref={setNodeRef}
      className={`flex items-center gap-2 h-8 px-2 text-sm rounded-md transition-colors cursor-pointer group ${isSelected ? "bg-muted/70" : "hover:bg-muted/50"}`}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      onClick={async (e) => {
        e.stopPropagation();
        // Select the row for UI highlight
        toggleRowSelection(page.id);
        // Load page preview without opening settings
        try {
          const resp = await api.get(`/owner/custom-pages/${page.id}`);
          const cp = resp.data.data;
          const rawBlocks = cp.content?.blocks;
          let blocks = Array.isArray(rawBlocks) ? [...rawBlocks] : [];
          const hasHeader = blocks.some(b => b.type === 'systemHeader');
          const hasFooter = blocks.some(b => b.type === 'systemFooter');
          const content = cp.content || {};
          if (!hasHeader && content.showHeader !== false) {
            blocks.unshift({ id: 'systemHeader', type: 'systemHeader', data: {} });
          }
          if (!hasFooter && content.showFooter !== false) {
            blocks.push({ id: 'systemFooter', type: 'systemFooter', data: {} });
          }
          canvasState.reset(blocks);
        } catch (err) {
          console.error('Failed to load preview page:', err);
        }
        // Keep left panel on pages list
        setActiveLeftPanel('pages');
        setLeftPanelOpen(true);
      } }
    >
      {/* Drag handle */}
      <span {...attributes} {...listeners} className="cursor-grab flex-shrink-0">
        <GripVertical className="h-4 w-4 text-gray-400" />
      </span>

      {/* Page title */}
      <span className="truncate flex-1">{page.title || page.slug}</span>

      {/* 3-dot dropdown menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 focus:opacity-100"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleEdit}>Edit</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleDelete}
            className="text-destructive focus:text-destructive"
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

const PagesPanel = ({
  orderedPages,
  setOrderedPages,
  pageId,
  navigate,
  canvasState,
  setActiveLeftPanel,
  setLeftPanelOpen,
  queryClient,
  showLoading,
  selectedRowIds,
  toggleRowSelection,
  deleteMutation
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handlePagesDragEnd = useCallback((event) => {
    const { active, over } = event;
    if (over && active.id !== over.id && orderedPages.length > 0) {
      setOrderedPages((items) => {
        const oldIndex = items.findIndex(p => p.id === active.id);
        const newIndex = items.findIndex(p => p.id === over.id);
        if (oldIndex === -1 || newIndex === -1) return items;
        const newItems = arrayMove(items, oldIndex, newIndex);

        // Prepare orders for API
        const orders = newItems.map((page, idx) => ({ id: page.id, sort_order: idx }));

        // Send to server
        api.put('/owner/custom-pages/reorder', { orders })
          .then(() => {
            showSuccess('Page order updated');
            queryClient.invalidateQueries({ queryKey: ['customPages'] });
          })
          .catch(err => {
            showError(err.response?.data?.message || 'Failed to update page order');
            queryClient.invalidateQueries({ queryKey: ['customPages'] });
          });

        return newItems;
      });
    }
  }, [orderedPages, queryClient]);

  if (showLoading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-8 w-full" />)}
      </div>
    );
  }

  if (!orderedPages || orderedPages.length === 0) {
    return <p className="text-sm text-gray-500 text-center py-4">No pages yet</p>;
  }

  return (
    <DndContext sensors={sensors} onDragEnd={handlePagesDragEnd} collisionDetection={closestCenter}>
      <SortableContext items={orderedPages.map(p => p.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-1">
          {orderedPages.map((page) => (
            <SortablePageItem
              key={page.id}
              page={page}
              pageId={pageId}
              navigate={navigate}
              canvasState={canvasState}
              setActiveLeftPanel={setActiveLeftPanel}
              setLeftPanelOpen={setLeftPanelOpen}
              selectedRowIds={selectedRowIds}
              toggleRowSelection={toggleRowSelection}
              onDelete={(id) => deleteMutation.mutate(id)}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};

const Builder = () => {
  const [isEditMode, setIsEditMode] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();

  // Mode detection
  const mode = searchParams.get("mode") || "page";
  const productId = searchParams.get("productId");
  const pageId = searchParams.get("pageId");

  // Active panel in left sidebar: 'blocks' | 'pages' | 'theme' | 'settings' | null
  const [activeLeftPanel, setActiveLeftPanel] = useState("blocks");
  const [leftPanelOpen, setLeftPanelOpen] = useState(true);
  const [blockSearchQuery, setBlockSearchQuery] = useState("");

  // Viewport state
  const [viewport, setViewport] = useState("desktop");

  // Editor mode state
  const [creating, setCreating] = useState(false);
  const [editingPage, setEditingPage] = useState(null);

  // Pages list ordering state (local) - initialize with pagesData when available
  const [orderedPages, setOrderedPages] = useState([]);

  // Row selection state
  const [selectedRowIds, setSelectedRowIds] = useState(new Set());

  // Canvas state
  const canvasState = useCanvasState([]);
  const canvasStateRef = useRef(canvasState);

  useEffect(() => {
    canvasStateRef.current = canvasState;
  }, [canvasState]);

  // Track manual panel close state for auto-open logic
  const manualCloseRef = useRef(false);

  // Extract stable reset function to avoid unnecessary effect runs
  const { reset: resetCanvas } = canvasState;

  // ESC key to exit builder or close panel
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (leftPanelOpen) {
          setLeftPanelOpen(false);
        } else {
          navigate(-1);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
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
  const { config: themeConfig, isLoading: themeLoading, error: themeError } = useThemeConfig();
  const { config: storeConfig, isLoading: storeLoading } = useStoreConfig();

  // Fetch available themes for palette
  const { data: availableThemes, isLoading: themesLoading } = useAvailableThemes();

  // Fetch all theme blocks
  const { data: themeBlocksData } = useQuery({
    queryKey: ["themeBlocks"],
    queryFn: fetchThemeBlocks,
    enabled: isAuthenticated,
    staleTime: Infinity,
  });

  // Build theme blocks map
  const themeBlocksMap = useMemo(() => {
    if (!themeBlocksData || themeBlocksData.length === 0) return {};
    const map = {};
    themeBlocksData.forEach(block => {
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
    const theme = availableThemes.find(t => t.id === storeConfig.theme_id) || availableThemes[0];
    if (!theme) return null;
    const blocks = themeBlocksMap[theme.id] || [];
    return {
      ...theme,
      theme_blocks: blocks,
    };
  }, [storeConfig, availableThemes, themeBlocksMap]);

  const themeBlocks = useMemo(() => {
    if (!currentTheme?.theme_blocks) return [];
    return [...currentTheme.theme_blocks].sort((a, b) => a.sort_order - b.sort_order);
  }, [currentTheme]);

  // Filtered blocks based on search query
  const filteredThemeBlocks = useMemo(() => {
    if (!blockSearchQuery.trim()) return themeBlocks;
    const q = blockSearchQuery.toLowerCase();
    return themeBlocks.filter(b =>
      (b.name || b.block_type).toLowerCase().includes(q) ||
      (b.description || '').toLowerCase().includes(q)
    );
  }, [themeBlocks, blockSearchQuery]);

  // Settings components map
  const settingsComponentMap = useMemo(() => ({
    heroBanner: HeroBannerSettings,
    productCarousel: ProductCarouselSettings,
    featuredCategories: FeaturedCategoriesSettings,
    heroBannerSlider: HeroBannerSliderSection,
    marketingBanner: MarketingBannerSettings,
    featureBlocks: FeatureBlocksSettings,
    productSection: ProductSectionSettings,
    brandShowcase: BrandShowcaseSettings,
    latestNews: LatestNewsSettings,
    categorySidebar: CategorySidebarSettings,
    promotionalBanners: PromotionalBannersSettings,
    midPageCallToAction: MidPageCallToActionSettings,
    newsletterSubscription: NewsletterSubscriptionSettings,
    blogPostsSection: BlogPostsSectionSettings,
    systemHeader: SystemHeaderSettings,
    systemFooter: SystemFooterSettings,
    // Layout blocks
    section: SectionBlockSettings,
    row: RowBlockSettings,
    column: ColumnBlockSettings,
    columns: ColumnBlockSettings, // Alias for compatibility
    grid: GridBlockSettings,
    container: SectionBlockSettings, // Fallback: use section settings
  }), []);

  // Create page mutation
  const createPageMutation = useMutation({
    mutationFn: async (data) => {
      const response = await api.post("/owner/custom-pages", {
        ...data,
        content: { blocks: data.blocks || [] }
      });
      return response.data;
    },
    onSuccess: (data) => {
      showSuccess("Page created successfully!");
      queryClient.invalidateQueries({ queryKey: ["customPages"] });
      // Navigate to edit the new page
      navigate(`/custom-pages?pageId=${data.data.page_id}`);
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
    queryKey: ["customPage", pageId],
    queryFn: async () => {
      const response = await api.get(`/owner/custom-pages/${pageId}`);
      return response.data.data.page; // Extract the page object from the response
    },
    enabled: mode === "page" && !!pageId,
  });

  const productLandingPageQuery = useProductLandingPage(productId);
  const productLandingPage = productLandingPageQuery?.landingPage || null;
  const isCreatingProduct = productLandingPageQuery?.isCreating || false;
  const isUpdatingProduct = productLandingPageQuery?.isUpdating || false;

  // Initialize canvas when page/product loads
  useEffect(() => {
    if (mode === "page" && customPage) {
      // Activate editor mode for this page
      setEditingPage(customPage);
      setCreating(false);

      // Copy blocks to avoid mutating the query cached data
      // Safely ensure it's an array
      const rawBlocks = customPage.content?.blocks;
      let blocks = Array.isArray(rawBlocks) ? [...rawBlocks] : [];

      const hasHeader = blocks.some(b => b.type === 'systemHeader');
      const hasFooter = blocks.some(b => b.type === 'systemFooter');
      const content = customPage.content || {};

      if (!hasHeader && content.showHeader !== false) {
        blocks.unshift({ id: 'systemHeader', type: 'systemHeader', data: {} });
      }
      if (!hasFooter && content.showFooter !== false) {
        blocks.push({ id: 'systemFooter', type: 'systemFooter', data: {} });
      }

      canvasState.reset(blocks);
      setFormData(prev => ({
        ...prev,
        title: customPage.title || "",
        slug: customPage.slug || "",
        meta_title: customPage.meta_title || "",
        meta_description: customPage.meta_description || "",
        status: customPage.status || "draft",
      }));

      // Ensure properties panel is open and active when editing a page
      setLeftPanelOpen(true);
      setActiveLeftPanel("properties");
    }
  }, [mode, customPage, resetCanvas]);

  useEffect(() => {
    if (mode === "product" && productLandingPage) {
      // Copy blocks to avoid mutating the cached data
      const rawBlocks = productLandingPage.settings_json?.components;
      let blocks = Array.isArray(rawBlocks) ? [...rawBlocks] : [];

      const hasHeader = blocks.some(b => b.type === 'systemHeader');
      const hasFooter = blocks.some(b => b.type === 'systemFooter');
      const settingsJson = productLandingPage.settings_json || {};

      if (!hasHeader && settingsJson.showHeader !== false) {
        blocks.unshift({ id: 'systemHeader', type: 'systemHeader', data: {} });
      }
      if (!hasFooter && settingsJson.showFooter !== false) {
        blocks.push({ id: 'systemFooter', type: 'systemFooter', data: {} });
      }

      canvasState.reset(blocks);

      setFormData(prev => ({
        ...prev,
        page_title: productLandingPage.settings_json?.seo_settings?.page_title || "",
        page_description: productLandingPage.settings_json?.seo_settings?.page_description || "",
        slug: productLandingPage.slug || "",
        status: productLandingPage.status || "draft",
      }));

      // Ensure properties panel is open and active when editing a product landing page
      setLeftPanelOpen(true);
      setActiveLeftPanel("properties");
    }
  }, [mode, productLandingPage]);

  // Handlers
  const handleAddBlock = useCallback((blockType, arg2, arg3) => {
    let defaultConfig = {};
    let index = null;

    // Handle both signatures:
    // - (blockType, defaultConfig) from palette click
    // - (blockType, index, defaultConfig) from drag-drop
    if (typeof arg2 === 'number') {
      index = arg2;
      defaultConfig = arg3 || {};
    } else if (typeof arg2 === 'object' && arg2 !== null) {
      defaultConfig = arg2;
    }

    const newBlock = {
      id: Date.now() + Math.random(),
      type: blockType,
      data: defaultConfig,
    };
    canvasState.addItem(newBlock, null, index);
    // Keep left panel open after adding block
    setActiveLeftPanel("blocks");
  }, [resetCanvas]);

  const handleMetaChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleCreateNewPage = useCallback(() => {
    // Reset form and canvas for a new page
    setFormData({
      title: "",
      slug: "",
      meta_title: "",
      meta_description: "",
      status: "draft",
    });
    canvasState.reset([]);

    // Navigate to custom-pages without pageId to enter create mode
    navigate('/custom-pages', { replace: true });

    // Open left panel and switch to properties to show page form
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
        navigate("/custom-pages");
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
          await productLandingPageQuery.updateProductLandingPage({ id: productLandingPage.id, ...payload });
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
  }, [mode, productId, customPage, productLandingPage, formData, canvasState.items, storeConfig, queryClient, navigate, productLandingPageQuery]);

  const handlePublish = useCallback(() => {
    setFormData(prev => ({ ...prev, status: "published" }));
    handleSave();
  }, [handleSave]);

  const handleBack = useCallback(() => {
    navigate('/dashboard');
  }, [navigate]);

  // Toggle row selection
  const toggleRowSelection = useCallback((pageId) => {
    // Single selection: replace any existing selection with the clicked page
    setSelectedRowIds(new Set([pageId]));
  }, []);

  // Handle panel switching - toggle behavior
  const openPanel = useCallback((panelId) => {
    if (activeLeftPanel === panelId && leftPanelOpen) {
      // If clicking the same open panel, close it (manual close)
      setLeftPanelOpen(false);
      manualCloseRef.current = true;
    } else {
      // Open new panel (manual open)
      setActiveLeftPanel(panelId);
      setLeftPanelOpen(true);
      manualCloseRef.current = false; // User manually opened, allow auto-reopen if needed
    }
  }, [activeLeftPanel, leftPanelOpen]);

  const closePanel = useCallback(() => {
    manualCloseRef.current = true;
    setLeftPanelOpen(false);
  }, []);

  // Sync orderedPages with pagesData when it changes
  useEffect(() => {
    if (pagesData) {
      setOrderedPages(prev => {
        // If lengths differ, definitely different
        if (prev.length !== pagesData.length) return pagesData;
        // Check if any ID differs
        const idsMatch = prev.every((p, idx) => p.id === pagesData[idx]?.id);
        return idsMatch ? prev : pagesData;
      });
    }
  }, [pagesData]);

  // Auto-open properties panel when a block is selected (unless user manually closed)
  useEffect(() => {
    if (canvasState.selectedId && (mode === "page" || mode === "product")) {
      if (!leftPanelOpen && manualCloseRef.current) {
        // User manually closed, don't auto-reopen
        return;
      }
      setActiveLeftPanel("properties");
      setLeftPanelOpen(true);
    }
  }, [canvasState.selectedId, mode, leftPanelOpen]);

  // Auth guard
  if (!isAuthenticated) {
    return <div className="p-6">Please login to access the builder.</div>;
  }

  if (themeLoading || storeLoading) {
    return (
      <div className="h-screen flex items-center center">
        <Skeleton className="h-screen w-full" />
      </div>
    );
  }

  if (themeError) {
    return <div className="p-6 text-destructive">Error loading theme: {themeError.message}</div>;
  }

  // Panel titles and content
  const getPanelContent = () => {
    switch (activeLeftPanel) {
      case "blocks":
        return (
          <>
            <h2 className="font-semibold text-sm text-gray-800 mb-4">Add New Block</h2>
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Search blocks..."
                className="w-full text-sm border border-gray-200 rounded-md px-3 py-2 pl-9 focus:outline-none focus:border-blue-500"
                value={blockSearchQuery}
                onChange={(e) => setBlockSearchQuery(e.target.value)}
              />
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {filteredThemeBlocks.map((block) => (
                <div
                  key={block.id}
                  className="border border-gray-200 bg-white hover:border-blue-500 hover:shadow-sm transition-all p-3 rounded-md cursor-pointer flex flex-col items-center gap-2 text-center"
                  onClick={() => handleAddBlock(block.block_type, block.default_config || {})}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('application/json', JSON.stringify({
                      type: 'new-block',
                      blockType: block.block_type,
                      defaultConfig: block.default_config || {}
                    }));
                    e.dataTransfer.effectAllowed = 'copy';
                  }}
                >
                  <Layout className="w-6 h-6 text-gray-400" />
                  <span className="text-xs font-medium">{block.name || block.block_type}</span>
                </div>
              ))}
              {/* System blocks */}
              <div
                className="border border-gray-200 bg-white hover:border-blue-500 hover:shadow-sm transition-all p-3 rounded-md cursor-pointer flex flex-col items-center gap-2 text-center"
                onClick={() => handleAddBlock('systemHeader', {})}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('application/json', JSON.stringify({
                    type: 'new-block',
                    blockType: 'systemHeader',
                    defaultConfig: {}
                  }));
                  e.dataTransfer.effectAllowed = 'copy';
                }}
              >
                <PanelTop className="w-6 h-6 text-gray-400" />
                <span className="text-xs font-medium">Header</span>
              </div>
              <div
                className="border border-gray-200 bg-white hover:border-blue-500 hover:shadow-sm transition-all p-3 rounded-md cursor-pointer flex flex-col items-center gap-2 text-center"
                onClick={() => handleAddBlock('systemFooter', {})}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('application/json', JSON.stringify({
                    type: 'new-block',
                    blockType: 'systemFooter',
                    defaultConfig: {}
                  }));
                  e.dataTransfer.effectAllowed = 'copy';
                }}
              >
                <PanelBottom className="w-6 h-6 text-gray-400" />
                <span className="text-xs font-medium">Footer</span>
              </div>
            </div>
          </>
        );

      case "pages":
        return (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-sm text-gray-800">Pages</h2>
              <Button size="sm" variant="outline" onClick={handleCreateNewPage}>
                New
              </Button>
            </div>
            <PagesPanel
              orderedPages={orderedPages}
              setOrderedPages={setOrderedPages}
              pageId={pageId}
              navigate={navigate}
              canvasState={canvasState}
              setActiveLeftPanel={setActiveLeftPanel}
              setLeftPanelOpen={setLeftPanelOpen}
              queryClient={queryClient}
              showLoading={pagesLoading}
              selectedRowIds={selectedRowIds}
              toggleRowSelection={toggleRowSelection}
              deleteMutation={deletePageMutation}
            />
          </>
        );

      case "theme":
        return (
          <>
            <h2 className="font-semibold text-sm text-gray-800 mb-4">Theme Settings</h2>
            <ScrollArea className="h-[calc(100vh-200px)]">
              <ThemeSelection />
            </ScrollArea>
          </>
        );

      case "settings":
        return (
          <>
            <h2 className="font-semibold text-sm text-gray-800 mb-4">Settings</h2>
            <div className="space-y-1">
              <Button variant="ghost" className="w-full justify-start h-8 px-2" onClick={() => { navigate('/manage-shop/shop-settings'); }}>
                <Settings className="w-4 h-4 mr-2" /> Shop Settings
              </Button>
              <Button variant="ghost" className="w-full justify-start h-8 px-2" onClick={() => { navigate('/manage-shop/header-settings'); }}>
                <PanelTop className="w-4 h-4 mr-2" /> Header
              </Button>
              <Button variant="ghost" className="w-full justify-start h-8 px-2" onClick={() => { navigate('/manage-shop/footer-settings'); }}>
                <PanelBottom className="w-4 h-4 mr-2" /> Footer
              </Button>
              <Button variant="ghost" className="w-full justify-start h-8 px-2" onClick={() => { navigate('/manage-shop/seo-marketing'); }}>
                <Search className="w-4 h-4 mr-2" /> SEO & Marketing
              </Button>
              <Button variant="ghost" className="w-full justify-start h-8 px-2" onClick={() => { navigate('/manage-shop/shop-domain'); }}>
                <Globe className="w-4 h-4 mr-2" /> Domain
              </Button>
              <Button variant="ghost" className="w-full justify-start h-8 px-2" onClick={() => { navigate('/manage-shop/shop-policy'); }}>
                <FileText className="w-4 h-4 mr-2" /> Shop Policy
              </Button>
              <Button variant="ghost" className="w-full justify-start h-8 px-2" onClick={() => { navigate('/manage-shop/payment-gateway'); }}>
                <CreditCard className="w-4 h-4 mr-2" /> Payment Gateway
              </Button>
              <Button variant="ghost" className="w-full justify-start h-8 px-2" onClick={() => { navigate('/manage-shop/delivery-support'); }}>
                <Truck className="w-4 h-4 mr-2" /> Delivery & Support
              </Button>
              <Button variant="ghost" className="w-full justify-start h-8 px-2" onClick={() => { navigate('/manage-shop/social-links'); }}>
                <Share2 className="w-4 h-4 mr-2" /> Social Links
              </Button>
            </div>
          </>
        );

      case "properties":
        return (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-sm text-gray-800">Properties</h2>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => {
                  const hadSelection = !!canvasState.selectedId;
                  canvasState.selectItem(null);
                  // If we were viewing Page Settings (no block selected), go to Pages list
                  // Otherwise if we were viewing block properties, go to Blocks list
                  if (!hadSelection && (mode === "page" || mode === "product")) {
                    setActiveLeftPanel('pages');
                  } else {
                    setActiveLeftPanel('blocks');
                  }
                }}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="overflow-y-auto">
              <div className="space-y-4">
                {/* Page-level settings (shown when no block is selected in page/product mode) */}
                {(mode === "page" || mode === "product") && !canvasState.selectedId && (
                  <div className="border-b pb-4">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">Page Settings</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-medium text-gray-600">Title</label>
                        <Input
                          value={formData.title || formData.page_title || ''}
                          onChange={(e) => handleMetaChange('title', e.target.value)}
                          className="h-8 text-sm mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-600">URL Slug</label>
                        <Input
                          value={formData.slug}
                          onChange={(e) => handleMetaChange('slug', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
                          className="h-8 text-sm mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-600">Status</label>
                        <Select value={formData.status} onValueChange={(value) => handleMetaChange('status', value)}>
                          <SelectTrigger className="h-8 text-sm mt-1">
                            <SelectValue placeholder="Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="published">Published</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Block-specific settings or empty state */}
                {!canvasState.selectedId || (canvasState.selectedId !== 'systemHeader' && canvasState.selectedId !== 'systemFooter' && !canvasState.selectedItem) ? (
                  !(mode === "page" || mode === "product") ? (
                    <p className="text-sm text-gray-500 text-center py-8">Select a block to edit its properties.</p>
                  ) : null
                ) : (
                  <div className="space-y-4 pt-4">
                    {/* Header/Footer settings */}
                    {canvasState.selectedId === 'systemHeader' && (
                      <SystemHeaderSettings
                        component={{ id: 'systemHeader', type: 'systemHeader', data: {} }}
                        index={0}
                        updateNested={(path, value) => {
                          console.log('Header setting:', path, value);
                        }}
                        isUpdating={false}
                      />
                    )}

                    {canvasState.selectedId === 'systemFooter' && (
                      <SystemFooterSettings
                        component={{ id: 'systemFooter', type: 'systemFooter', data: {} }}
                        index={0}
                        updateNested={(path, value) => {
                          console.log('Footer setting:', path, value);
                        }}
                        isUpdating={false}
                      />
                    )}

                    {/* Regular block settings */}
                    {canvasState.selectedItem && (
                      (() => {
                        const SettingsComp = settingsComponentMap[canvasState.selectedItem.type];
                        if (!SettingsComp) {
                          return <p className="text-sm text-gray-500">No settings available for this block type.</p>;
                        }
                        return (
                          <SettingsComp
                            component={canvasState.selectedItem}
                            index={0}
                            updateNested={(path, value) => {
                              if (path.startsWith('data.')) {
                                const dataPath = path.substring(5);
                                const currentData = canvasState.selectedItem?.data || {};
                                const newData = updateNestedData(currentData, dataPath, value);
                                canvasState.updateItem(canvasState.selectedId, { data: newData });
                              } else {
                                canvasState.updateItem(canvasState.selectedId, { [path]: value });
                              }
                            }}
                            isUpdating={false}
                          />
                        );
                      })()
                    )}

                    {/* Delete button for non-system blocks */}
                    {canvasState.selectedId && canvasState.selectedId !== 'systemHeader' && canvasState.selectedId !== 'systemFooter' && (
                      <div className="pt-4 border-t">
                        <Button
                          variant="destructive"
                          size="sm"
                          className="w-full"
                          onClick={() => {
                            if (window.confirm("Remove this block?")) {
                              canvasState.deleteItem(canvasState.selectedId);
                              // Switch to blocks panel to show component palette
                              setActiveLeftPanel('blocks');
                              setLeftPanelOpen(true);
                            }
                          }}
                        >
                          Delete Block
                        </Button>
                      </div>
                    )}

                  </div>
                )}
              </div>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden flex bg-[#F5F6F8]">

      {/* 1. LEFT TOOL RAIL (68px) */}
      <aside className="w-[68px] bg-white border-r border-gray-200 flex flex-col items-center py-4 shrink-0 z-30">
        {/* Logo */}
        <div className="w-8 h-8 rounded mb-6 shadow-sm overflow-hidden flex items-center justify-center">
          <img
            src="https://res.cloudinary.com/dfsqtffsg/image/upload/v1775561997/sx9jtrmomuabzwi7imuh.png"
            alt="Logo"
            className="w-full h-full object-contain"
          />
        </div>

        {/* Tool Buttons */}
        <nav className="flex flex-col gap-4 w-full items-center flex-1">
          {/* Add Block Button (highlighted) */}
          <button
            className={`flex items-center justify-center w-10 h-10 rounded-lg transition-colors shadow-sm ${activeLeftPanel === 'blocks' ? 'bg-[#1C2434] text-white' : 'bg-white text-gray-400 hover:text-gray-900 border border-gray-200'}`}
            onClick={() => openPanel('blocks')}
            title="Add Block"
          >
            <Plus className="w-5 h-5" />
          </button>

          <div className="w-8 h-px bg-gray-200 my-2"></div>

          {/* Pages Button */}
          <button
            className={`flex flex-col items-center justify-center w-12 h-12 rounded-lg transition-colors ${activeLeftPanel === 'pages' ? 'bg-gray-100 text-gray-900' : 'text-gray-400 hover:text-gray-900 hover:bg-gray-50'}`}
            onClick={() => openPanel('pages')}
            title="Pages"
          >
            <FileText className="w-5 h-5 mb-1" />
            <span className="text-[9px] font-medium">Pages</span>
          </button>

          {/* Properties Button */}
          <button
            className={`flex flex-col items-center justify-center w-12 h-12 rounded-lg transition-colors ${activeLeftPanel === 'properties' ? 'bg-gray-100 text-gray-900' : 'text-gray-400 hover:text-gray-900 hover:bg-gray-50'}`}
            onClick={() => openPanel('properties')}
            title="Properties"
          >
            <Sliders className="w-5 h-5 mb-1" />
            <span className="text-[9px] font-medium">Props</span>
          </button>

          {/* Theme Button */}
          <button
            className={`flex flex-col items-center justify-center w-12 h-12 rounded-lg transition-colors ${activeLeftPanel === 'theme' ? 'bg-gray-100 text-gray-900' : 'text-gray-400 hover:text-gray-900 hover:bg-gray-50'}`}
            onClick={() => openPanel('theme')}
            title="Theme"
          >
            <Palette className="w-5 h-5 mb-1" />
            <span className="text-[9px] font-medium">Theme</span>
          </button>

          {/* Settings Button */}
          <button
            className={`flex flex-col items-center justify-center w-12 h-12 rounded-lg transition-colors ${activeLeftPanel === 'settings' ? 'bg-gray-100 text-gray-900' : 'text-gray-400 hover:text-gray-900 hover:bg-gray-50'}`}
            onClick={() => openPanel('settings')}
            title="Settings"
          >
            <Settings className="w-5 h-5 mb-1" />
            <span className="text-[9px] font-medium">Settings</span>
          </button>
        </nav>

        {/* Store info at bottom */}
        <div className="border-t w-full py-3 px-2 text-center mt-auto">
          <p className="text-[10px] text-gray-400 truncate w-full">
            {storeConfig?.store_name || 'Store'}
          </p>
        </div>
      </aside>

      {/* 2. DYNAMIC LEFT PANEL (280px) */}
      {leftPanelOpen && (
        <aside className="w-[280px] bg-white border-r border-gray-200 flex flex-col shrink-0 z-20 relative">
          {/* Panel Header */}
          <div className="h-14 border-b border-gray-100 flex items-center justify-between px-4 shrink-0">
            <h2 className="font-semibold text-sm text-gray-800">
              {activeLeftPanel === 'blocks' && 'Add New Block'}
              {activeLeftPanel === 'pages' && 'Pages'}
              {activeLeftPanel === 'theme' && 'Theme Settings'}
              {activeLeftPanel === 'settings' && 'App Settings'}
              {activeLeftPanel === 'properties' && 'Properties'}
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
            {getPanelContent()}
          </div>
        </aside>
      )}

      {/* 3. MAIN COLUMN */}
      <div className="flex-1 flex flex-col min-w-0 h-full">

        {/* Header */}
        <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 shrink-0 z-10">
          {/* Left: Home + App name */}
          <div className="flex items-center gap-3 w-1/3">
            <button className="p-1.5 text-gray-500 hover:bg-gray-100 rounded" onClick={handleBack} title="Back">
              <Home className="w-4 h-4" />
            </button>
            <div className="flex flex-col leading-tight">
              <div className="flex items-center gap-1">
                <span className="text-sm font-semibold text-gray-800">
                  {storeConfig?.store_name || 'ScaleBiz'}
                </span>
              </div>
            </div>
          </div>

          {/* Center: Page selector (dropdown for pages) */}
          <div className="flex items-center justify-center h-full w-1/3">
            {mode === "page" ? (
              <div className="relative">
                <button
                  className="flex items-center gap-2 text-sm text-gray-500 font-medium bg-gray-100 px-3 py-1 rounded-md border border-gray-200 hover:bg-gray-50"
                  onClick={() => openPanel('pages')}
                >
                  <FileText className="w-4 h-4" />
                  <span>{customPage?.title || "New Page"}</span>
                  <ChevronDown className="w-3 h-3 text-gray-400" />
                </button>
              </div>
            ) : (
              <span className="text-sm text-gray-500 font-medium">
                {(() => {
                  if (mode === "product") return productLandingPage?.product?.name || "Product Landing Page";
                  return "Page Builder";
                })()}
              </span>
            )}
          </div>

          {/* Right: Actions */}
          <div className="flex items-center justify-end gap-3 w-1/3">
            <button className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-full border border-gray-200" title="Preview">
              <Eye className="w-4 h-4" />
            </button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setFormData(prev => ({ ...prev, status: "draft" }));
                handleSave();
              }}
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
            <button
              className="bg-[#1C2434] text-white px-4 py-1.5 text-sm font-medium rounded-md hover:bg-gray-800 transition-colors flex items-center gap-2"
              onClick={handlePublish}
              disabled={isSaving || (mode === "product" ? isCreatingProduct || isUpdatingProduct : false)}
            >
              {isSaving || (mode === "product" ? isCreatingProduct || isUpdatingProduct : isCreatingProduct) ? 'Saving...' : 'Publish'}
              {!isSaving && (mode !== "product" || !isCreatingProduct && !isUpdatingProduct) && <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>}
            </button>
          </div>
        </header>

        {/* Workspace Area */}
        <main className="flex-1 overflow-auto p-4 md:p-6 flex justify-center bg-[#F5F6F8]">
          {/* Canvas Container */}
          <div className="w-full max-w-[1200px] bg-white rounded-lg shadow-sm border border-gray-200 min-h-[800px] relative flex flex-col">

            {/* Device Viewport Toggles */}
            <div className="h-12 flex justify-center items-center shrink-0 w-full border-b bg-gray-50">
              <div className="flex items-center bg-white p-0.5 rounded-md border border-gray-200 gap-1">
                {Object.entries(VIEWPORTS).map(([key, { label: vLabel, icon: Icon }]) => (
                  <button
                    key={key}
                    className={`p-1.5 ${viewport === key ? 'text-gray-800 bg-gray-100 rounded shadow-sm' : 'text-gray-400 hover:text-gray-700'}`}
                    onClick={() => setViewport(key)}
                    title={vLabel}
                  >
                    <Icon className="w-4 h-4" />
                  </button>
                ))}
              </div>
            </div>

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
                  <p className="text-lg font-medium text-gray-300">Your page is empty</p>
                  <p className="text-sm text-gray-400">Click the + button to add blocks</p>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Builder;
