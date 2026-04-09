"use client";

import React, { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import api from "@/utils/api.js";
import { showSuccess, showError } from "@/utils/toast.js";
import { Button } from "@/components/ui/button.jsx";
import { Skeleton } from "@/components/ui/skeleton.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { Switch } from "@/components/ui/switch.jsx";
import { Plus, PanelTop, PanelBottom, Loader2, MoreHorizontal } from "lucide-react";

// Page-Builder shared components
import { useCanvasState, Canvas, ComponentPalette, PropertiesPanel, Toolbar, SystemHeader, SystemFooter } from "@/components/page-builder/index.js";
import "@/components/page-builder/PageBuilder.css";

// UI components
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu.jsx";

// Block components and settings
import ComponentResolver from "@/components/landing-pages/ComponentResolver.jsx";
import { useAvailableThemes } from "@/hooks/use-available-themes.js";
import { useThemeConfig } from "@/contexts/ThemeSettingsContext.jsx";
import { useStoreConfig } from "@/contexts/StoreConfigurationContext.jsx";
import { useLivePreview } from "@/hooks/use-live-preview.js";

// Import all settings components (they work via adapter)
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
// System block settings
import SystemHeaderSettings from "@/components/page-builder/settings/SystemHeaderSettings.jsx";
import SystemFooterSettings from "@/components/page-builder/settings/SystemFooterSettings.jsx";
// Layout block settings
import SectionBlockSettings from "@/components/page-builder/settings/SectionBlockSettings.jsx";
import RowBlockSettings from "@/components/page-builder/settings/RowBlockSettings.jsx";
import ColumnBlockSettings from "@/components/page-builder/settings/ColumnBlockSettings.jsx";
import GridBlockSettings from "@/components/page-builder/settings/GridBlockSettings.jsx";
// Advanced block settings
import TabsBlockSettings from "@/components/page-builder/settings/TabsBlockSettings.jsx";
import TestimonialsBlockSettings from "@/components/page-builder/settings/TestimonialsBlockSettings.jsx";
import CountdownBlockSettings from "@/components/page-builder/settings/CountdownBlockSettings.jsx";
import VideoBlockSettings from "@/components/page-builder/settings/VideoBlockSettings.jsx";
import ContactBlockSettings from "@/components/page-builder/settings/ContactBlockSettings.jsx";
import MapBlockSettings from "@/components/page-builder/settings/MapBlockSettings.jsx";

const PageBuilderV2 = () => {
  console.log('PageBuilderV2: Component starting...');
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  console.log('PageBuilderV2: Hooks loaded, isAuthenticated:', isAuthenticated);

  // Get theme and store config
  const { config: themeConfig } = useThemeConfig();
  const { config: storeConfig } = useStoreConfig();
  const { data: availableThemes } = useAvailableThemes();

  // Determine current theme blocks
  const currentTheme = useMemo(() => {
    if (!storeConfig || !availableThemes) return null;
    return availableThemes.find(t => t.id === storeConfig.theme_id) || availableThemes[0];
  }, [storeConfig, availableThemes]);

  const themeBlocks = useMemo(() => {
    if (!currentTheme?.theme_blocks) return [];
    return [...currentTheme.theme_blocks].sort((a, b) => a.sort_order - b.sort_order);
  }, [currentTheme]);

  // Transform themeBlocks into palette items
  const paletteItems = useMemo(() => {
    return themeBlocks.map(block => ({
      id: block.id,
      block_type: block.block_type,
      name: block.name || block.block_type,
      description: block.description || "",
      category: block.category || "Components",
      defaultConfig: block.default_config || {},
    }));
  }, [themeBlocks]);

  // Fetch pages list
  const { data: pagesData, isLoading: pagesLoading, refetch } = useQuery({
    queryKey: ["customPages"],
    queryFn: async () => {
      const response = await api.get("/owner/custom-pages");
      return response.data.data.pages;
    },
    enabled: isAuthenticated,
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (data) => {
      const response = await api.post("/owner/custom-pages", data);
      return response.data;
    },
    onSuccess: () => {
      showSuccess("Page created successfully!");
      canvasState.markSaved();
      refetch();
      queryClient.invalidateQueries({ queryKey: ["customPages"] });
    },
    onError: (err) => {
      showError(err.response?.data?.message || "Failed to create page.");
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await api.put(`/owner/custom-pages/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      showSuccess("Page updated successfully!");
      canvasState.markSaved();
      refetch();
      queryClient.invalidateQueries({ queryKey: ["customPages"] });
    },
    onError: (err) => {
      showError(err.response?.data?.message || "Failed to update page.");
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (pageId) => {
      const response = await api.delete(`/owner/custom-pages/${pageId}`);
      return response.data;
    },
    onSuccess: () => {
      showSuccess("Page deleted successfully!");
      refetch();
      queryClient.invalidateQueries({ queryKey: ["customPages"] });
      // Clear selection if deleted page was selected
      setSelectedRowIds(prev => {
        const next = new Set(prev);
        // We'll clear after - handled in onSettled
        return next;
      });
    },
    onError: (err) => {
      showError(err.response?.data?.message || "Failed to delete page.");
    },
  });

  // Local state for editing mode
  const [mode, setMode] = useState("list"); // 'list' | 'create' | 'edit'
  const [currentPage, setCurrentPage] = useState(null); // page being edited
  const [viewport, setViewport] = useState("desktop");

  // Single page selection state for page list
  const [selectedPageId, setSelectedPageId] = useState(null);
  const [selectedPageData, setSelectedPageData] = useState(null);

  // System blocks visibility (page-level settings)
  const [showHeader, setShowHeader] = useState(true);
  const [showFooter, setShowFooter] = useState(true);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Only active when in editor mode
      if (mode !== "create" && mode !== "edit") return;

      // Modifier key detection
      const isMod = e.ctrlKey || e.metaKey;
      const canvas = canvasStateRef.current;

      if (isMod && e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          canvas.redo();
        } else {
          canvas.undo();
        }
      } else if (isMod && e.key === 'y') {
        e.preventDefault();
        canvas.redo();
      } else if (isMod && e.key === 'd') {
        e.preventDefault();
        canvas.duplicateItem(canvas.selectedId);
      } else if (isMod && e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        if (canvas.selectedId && window.confirm("Remove selected block?")) {
          canvas.deleteItem(canvas.selectedId);
        }
      } else if (e.key === 'Escape') {
        canvas.clearSelection();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mode]);

  // Canvas state hook
  const canvasState = useCanvasState([]);
  const canvasStateRef = useRef(canvasState);

  // Keep ref updated with latest canvasState
  useEffect(() => {
    canvasStateRef.current = canvasState;
  }, [canvasState]);

  // Form data (meta fields)
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    meta_title: "",
    meta_description: "",
    status: "draft",
  });

  // Settings components map (for PropertiesPanel adapter)
  const settingsComponentMap = useMemo(() => ({
    // Layout blocks
    section: SectionBlockSettings,
    row: RowBlockSettings,
    column: ColumnBlockSettings,
    grid: GridBlockSettings,
    // System blocks
    systemHeader: SystemHeaderSettings,
    systemFooter: SystemFooterSettings,
    // Core block types
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
    // Advanced blocks
    tabs: TabsBlockSettings,
    testimonials: TestimonialsBlockSettings,
    countdown: CountdownBlockSettings,
    video: VideoBlockSettings,
    contact: ContactBlockSettings,
    map: MapBlockSettings,
    // Add more as needed
  }), []);

  // Reset form and canvas
  const resetForm = useCallback(() => {
    setFormData({
      title: "",
      slug: "",
      meta_title: "",
      meta_description: "",
      status: "draft",
    });
    canvasState.reset([]);
    setCurrentPage(null);
    setShowHeader(true);
    setShowFooter(true);
    setMode("list");
  }, [canvasState]);

  // Start creating new page
  const handleCreateNew = useCallback(() => {
    console.log('PageBuilderV2: Create new page clicked');
    resetForm();
    setMode("create");
  }, [resetForm]);

  // Edit existing page
  const handleEditPage = useCallback((pageId) => {
    // Navigate to page builder with selected page
    navigate(`/custom-pages-v2/${pageId}`);
  }, [navigate]);

  // Save page
  const handleSave = useCallback(() => {
    if (!formData.title || !formData.slug) {
      showError("Title and slug are required.");
      return;
    }

    const payload = {
      title: formData.title,
      slug: formData.slug,
      meta_title: formData.meta_title,
      meta_description: formData.meta_description,
      status: formData.status,
      content: {
        blocks: canvasState.items,
        showHeader,
        showFooter,
      },
    };

    if (mode === "edit" && currentPage) {
      updateMutation.mutate({ id: currentPage.id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  }, [formData, canvasState.items, showHeader, showFooter, mode, currentPage, updateMutation, createMutation]);

  // Load page data
  const loadPageData = useCallback(async (pageId) => {
    try {
      const response = await api.get(`/pages/${pageId}`);
      const page = response.data.data.page;

      setSelectedPageId(page.id);
      setSelectedPageData(page);

      // Update page settings
      setFormData({
        title: page.title,
        slug: page.slug,
        meta_title: page.meta_title || "",
        meta_description: page.meta_description || "",
        status: page.status || "draft",
      });

      const pageBlocks = page.content?.blocks || [];
      canvasState.reset(Array.isArray(pageBlocks) ? pageBlocks : []);

      // Load page-level system block visibility
      setShowHeader(page.content?.showHeader !== false);
      setShowFooter(page.content?.showFooter !== false);

      console.log('Page loaded successfully', page);
    } catch (error) {
      console.error('Failed to load page', error);
      showError('Failed to load page data.');
    }
  }, [canvasState]);

  // Toggle row selection
  const toggleRowSelection = useCallback((pageId) => {
    setSelectedPageId(pageId === selectedPageId ? null : pageId);
    if (pageId === selectedPageId) {
      // Deselect page
      setSelectedPageData(null);
      setFormData({
        title: "",
        slug: "",
        meta_title: "",
        meta_description: "",
        status: "draft",
      });
      canvasState.reset([]);
      setShowHeader(true);
      setShowFooter(true);
    } else {
      // Load selected page data
      loadPageData(pageId);
    }
  }, [loadPageData, canvasState]);

  // Go back to list
  const handleBack = useCallback(() => {
    resetForm();
    setMode("list");
  }, [resetForm]);

  // Add block from palette
  const handleAddBlock = useCallback((blockType, defaultConfig = {}) => {
    const newBlock = {
      id: Date.now() + Math.random(),
      type: blockType,
      data: defaultConfig,
    };
    canvasState.addItem(newBlock);
  }, [canvasState]);

  // Handle drag start from palette
  const handlePaletteDragStart = useCallback((blockType, item, e) => {
    e.dataTransfer.setData("application/json", JSON.stringify({
      type: "new-component",
      componentType: blockType,
      defaultConfig: item.defaultConfig || {}
    }));
    e.dataTransfer.effectAllowed = "copy";
  }, []);

  // Update block data
  const handleUpdateBlockData = useCallback((blockId, key, value) => {
    canvasState.updateItemData(blockId, key, value);
  }, [canvasState]);

  // Duplicate selected block
  const handleDuplicateBlock = useCallback(() => {
    if (canvasState.selectedId) {
      canvasState.duplicateItem(canvasState.selectedId);
    }
  }, [canvasState]);

  // Delete selected block (no-op for system blocks)
  const handleDeleteBlock = useCallback((id) => {
    if (id && window.confirm("Remove this block?")) {
      canvasState.deleteItem(id);
    }
  }, [canvasState]);

  // Toggle header/footer visibility
  const handleToggleHeader = useCallback(() => {
    setShowHeader(prev => !prev);
  }, []);

  const handleToggleFooter = useCallback(() => {
    setShowFooter(prev => !prev);
  }, []);

  // Select header/footer
  const handleSelectHeader = useCallback(() => {
    canvasState.selectItem('systemHeader');
  }, [canvasState]);

  const handleSelectFooter = useCallback(() => {
    canvasState.selectItem('systemFooter');
  }, [canvasState]);

  // Generate slug
  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  // Auth guard
  if (!isAuthenticated) {
    console.log('PageBuilderV2: Not authenticated, showing login message');
    return <div className="p-6">Please login to access the page builder.</div>;
  }
  console.log('PageBuilderV2: Authenticated, rendering builder');

  // List View
  if (mode === "list") {
    console.log('PageBuilderV2: Rendering list view, mode:', mode);
    return (
      <div className="h-[calc(100vh-4rem)] flex flex-col p-4 md:p-6 overflow-hidden">
        <Toolbar
          title="Page Builder"
          onBack={() => navigate(-1)}
          canUndo={false}
          canRedo={false}
          isDirty={false}
          onUndo={() => {}}
          onRedo={() => {}}
          onSave={() => {}}
          onPublish={() => {}}
          viewport={viewport}
          onViewportChange={setViewport}
          showPublish={false}
        />
        <div className="flex-1 overflow-auto mt-4">
          {pagesLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : pagesData?.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-lg text-muted-foreground mb-4">No pages created yet.</p>
              <Button onClick={handleCreateNew}>Create Your First Page</Button>
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-border">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Title</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Slug</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Blocks</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Updated</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {pagesData?.map((page) => (
                    <tr
                      key={page.id}
                      className={`hover:bg-muted/50 cursor-pointer ${selectedPageId === page.id ? "bg-muted/70" : ""}`}
                      onClick={() => toggleRowSelection(page.id)}
                    >
                      <td className="px-4 py-3 text-sm font-medium">{page.title}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">/pages/{page.slug}</td>
                      <td className="px-4 py-3 text-sm">
                        <Badge variant={page.status === "published" ? "default" : "secondary"}>
                          {page.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {page.content?.blocks?.length || 0} blocks
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {new Date(page.updated_at).toLocaleDateString()}
                      </td>
                      <td
                        className="px-4 py-3 text-sm text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="sm" variant="ghost">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditPage(page.id)}>
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleDeletePage(page.id)}
                              className="text-destructive focus:text-destructive"
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <div className="p-4 flex justify-center flex-shrink-0">
          <Button onClick={handleCreateNew} size="lg">
            <Plus className="h-5 w-5 mr-2" /> Create New Page
          </Button>
        </div>
      </div>
    );
  }

  // Editor View (Create or Edit)
  if (mode === "create" || mode === "edit") {
    console.log('PageBuilderV2: Rendering editor view, mode:', mode, 'showHeader:', showHeader, 'showFooter:', showFooter);
    return (
      <div className="h-full flex flex-col overflow-hidden">
        <Toolbar
          title={mode === "edit" ? `Edit: ${currentPage?.title}` : "Create New Page"}
          onBack={handleBack}
          canUndo={canvasState.canUndo}
          canRedo={canvasState.canRedo}
          isDirty={canvasState.isDirty}
          isSaving={createMutation.isPending || updateMutation.isPending}
          onUndo={canvasState.undo}
          onRedo={canvasState.redo}
          onSave={handleSave}
          onPublish={() => {
            setFormData(prev => ({ ...prev, status: "published" }));
            handleSave();
          }}
          viewport={viewport}
          onViewportChange={setViewport}
          showPublish={true}
        />

        <div className="flex-1 flex gap-4 overflow-hidden p-4">
          {/* Left Sidebar - Component Palette & Page Settings */}
          <div className="w-80 flex flex-col gap-3 flex-shrink-0 overflow-y-auto bg-card border rounded-lg p-3">
            {/* Page Settings */}
            <div className="space-y-3 border-b pb-3">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary" />
                Page Settings
              </h3>
              <div className="space-y-2">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Title</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value, slug: generateSlug(e.target.value) }))}
                    placeholder="Page title"
                    className="h-8 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">URL Slug</label>
                  <div className="flex items-center">
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-l border border-r-0">/pages/</span>
                    <Input
                      value={formData.slug}
                      onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') }))}
                      placeholder="page-url"
                      className="h-8 text-sm rounded-l-none"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                      className="h-8 w-full text-sm border rounded-md px-2"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* System Toggle Panel */}
            <div className="space-y-3 border-b pb-3">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary" />
                Layout
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 rounded bg-muted/50">
                  <span className="text-sm flex items-center gap-2">
                    <PanelTop className="h-4 w-4" /> Header
                  </span>
                  <Switch checked={showHeader} onCheckedChange={handleToggleHeader} />
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-muted/50">
                  <span className="text-sm flex items-center gap-2">
                    <PanelBottom className="h-4 w-4" /> Footer
                  </span>
                  <Switch checked={showFooter} onCheckedChange={handleToggleFooter} />
                </div>
              </div>
            </div>

            {/* Component Palette */}
            <div className="flex-[2] min-h-0 overflow-hidden border-b pb-3">
              <ComponentPalette
                title="Components"
                items={paletteItems}
                onAdd={handleAddBlock}
                searchable={true}
                collapsible={false}
              />
            </div>

            {/* Properties Panel */}
            <div className="flex-[3] min-h-0 overflow-hidden">
              <PropertiesPanel
                selectedItem={
                  canvasState.selectedId === 'systemHeader'
                    ? { id: 'systemHeader', type: 'systemHeader', name: 'Header' }
                    : canvasState.selectedId === 'systemFooter'
                    ? { id: 'systemFooter', type: 'systemFooter', name: 'Footer' }
                    : canvasState.selectedItem
                }
                itemType={
                  canvasState.selectedId === 'systemHeader'
                    ? 'systemHeader'
                    : canvasState.selectedId === 'systemFooter'
                    ? 'systemFooter'
                    : undefined
                }
                onChange={canvasState.updateItem}
                onDataChange={canvasState.updateItemData}
                onDelete={
                  canvasState.selectedId === 'systemHeader' || canvasState.selectedId === 'systemFooter'
                    ? null
                    : canvasState.deleteItem
                }
                onDuplicate={
                  canvasState.selectedId === 'systemHeader' || canvasState.selectedId === 'systemFooter'
                    ? null
                    : canvasState.duplicateItem
                }
                isUpdating={false}
                settingsComponents={settingsComponentMap}
                metaFields={["title", "slug", "meta_title", "meta_description", "status"]}
                metaData={formData}
                onMetaChange={(field, value) => setFormData(prev => ({ ...prev, [field]: value }))}
              />
            </div>
          </div>

          {/* Center: Canvas */}
          <div className="flex-1 flex flex-col overflow-hidden bg-background rounded-lg border">
            <Canvas
              items={canvasState.items}
              selectedId={canvasState.selectedId}
              onSelectItem={canvasState.selectItem}
              onUpdateItems={canvasState.updateItems}
              themeConfig={themeConfig}
              storeConfig={storeConfig}
              viewport={viewport}
              showHeader={showHeader}
              showFooter={showFooter}
              onSelectHeader={handleSelectHeader}
              onSelectFooter={handleSelectFooter}
              className="h-full"
            />
            {canvasState.items.length === 0 && (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <div className="text-4xl mb-4">📦</div>
                  <p className="text-lg font-medium">Your page is empty</p>
                  <p className="text-sm">Add components from the sidebar to start building</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default PageBuilderV2;
