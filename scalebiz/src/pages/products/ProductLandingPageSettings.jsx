"use client";

import React, { useCallback, useMemo, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button.jsx";
import { ArrowLeft, Loader2, PanelTop, PanelBottom } from "lucide-react";
import { useProductLandingPage } from "@/hooks/use-product-landing-page.js";
import { useAvailableLandingPageTemplates } from "@/hooks/use-available-landing-page-templates.js";
import { Skeleton } from "@/components/ui/skeleton.jsx";
import { showError, showSuccess } from "@/utils/toast.js";
import { Switch } from "@/components/ui/switch.jsx";

// Page Builder components
import {
  Canvas,
  ComponentPalette,
  PropertiesPanel,
  Toolbar,
  useCanvasState,
} from "@/components/page-builder/index.js";

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

// Template/theme related
import { useThemeConfig } from "@/contexts/ThemeSettingsContext.jsx";
import { useStoreConfig } from "@/contexts/StoreConfigurationContext.jsx";
import { useAvailableThemes } from "@/hooks/use-available-themes.js";

const ProductLandingPageSettings = () => {
  const { productId } = useParams();
  const id = productId ? parseInt(productId) : null;
  const navigate = useNavigate();

  const {
    landingPage,
    isLoading: isLoadingLandingPage,
    error: landingPageError,
    createProductLandingPage,
    updateProductLandingPage,
    deleteProductLandingPage,
    isCreating,
    isUpdating,
    isDeleting,
    initializeFromTemplate,
  } = useProductLandingPage(id);

  const { data: availableTemplates } = useAvailableLandingPageTemplates();
  const { config: themeConfig } = useThemeConfig();
  const { config: storeConfig } = useStoreConfig();
  const { data: availableThemes } = useAvailableThemes();

  // Canvas state for blocks
  const canvasState = useCanvasState([]);

  // System blocks visibility
  const [showHeader, setShowHeader] = React.useState(true);
  const [showFooter, setShowFooter] = React.useState(true);

  // Viewport for canvas
  const [viewport, setViewport] = React.useState("desktop");

  // Form data (SEO/meta)
  const [formData, setFormData] = React.useState({
    page_title: "",
    page_description: "",
    slug: "",
    status: "draft",
  });

  // Determine current theme and blocks for palette
  const currentTheme = useMemo(() => {
    if (!storeConfig || !availableThemes) return null;
    return availableThemes.find(t => t.id === storeConfig.theme_id) || availableThemes[0];
  }, [storeConfig, availableThemes]);

  const themeBlocks = useMemo(() => {
    if (!currentTheme?.theme_blocks) return [];
    return [...currentTheme.theme_blocks].sort((a, b) => a.sort_order - b.sort_order);
  }, [currentTheme]);

  // Transform theme blocks into palette items
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
  }), []);

  // Initialize from landing page data when loaded
  useEffect(() => {
    if (landingPage) {
      const blocks = landingPage.settings_json?.components || [];
      canvasState.reset(Array.isArray(blocks) ? blocks : []);

      setFormData({
        page_title: landingPage.settings_json?.seo_settings?.page_title || "",
        page_description: landingPage.settings_json?.seo_settings?.page_description || "",
        slug: landingPage.slug || "",
        status: landingPage.status || "draft",
      });

      setShowHeader(landingPage.settings_json?.showHeader !== false);
      setShowFooter(landingPage.settings_json?.showFooter !== false);
    }
  }, [landingPage, canvasState]);

  // Handle save
  const handleSave = useCallback(async () => {
    if (!formData.slug) {
      showError("URL Slug is required.");
      return;
    }

    const payload = {
      store_id: landingPage?.store_id || (storeConfig?.store_id),
      product_id: id,
      template_id: landingPage?.template_id || (availableTemplates?.[0]?.id),
      page_title: formData.page_title,
      page_description: formData.page_description,
      slug: formData.slug,
      settings_json: {
        components: canvasState.items,
        showHeader,
        showFooter,
        seo_settings: {
          page_title: formData.page_title,
          page_description: formData.page_description,
        },
      },
      is_active: formData.status === "published",
    };

    try {
      if (landingPage) {
        await updateProductLandingPage({ id: landingPage.id, ...payload });
        showSuccess("Landing page updated successfully!");
      } else {
        await createProductLandingPage(payload);
        showSuccess("Landing page created successfully!");
      }
      canvasState.markSaved();
    } catch (err) {
      showError(err.response?.data?.message || "Failed to save landing page.");
    }
  }, [formData, canvasState.items, showHeader, showFooter, id, landingPage, storeConfig, availableTemplates, updateProductLandingPage, createProductLandingPage]);

  // Handle delete
  const handleDelete = useCallback(() => {
    if (landingPage && window.confirm("Delete this landing page?")) {
      deleteProductLandingPage(landingPage.id, {
        onSuccess: () => {
          showSuccess("Landing page deleted.");
          navigate(`/products/${id}`);
        },
      });
    }
  }, [landingPage, deleteProductLandingPage, navigate, id]);

  // Handle add block from palette
  const handleAddBlock = useCallback((blockType, defaultConfig = {}) => {
    const newBlock = {
      id: Date.now() + Math.random(),
      type: blockType,
      data: defaultConfig,
    };
    canvasState.addItem(newBlock);
  }, [canvasState]);

  // Product loading state
  if (isLoadingLandingPage) {
    return (
      <div className="p-4 md:p-6">
        <Skeleton className="h-10 w-48 mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-[600px]" />
          <Skeleton className="h-[600px]" />
          <Skeleton className="h-[600px]" />
        </div>
      </div>
    );
  }

  if (landingPageError) {
    return (
      <div className="p-4 md:p-6 text-destructive">
        Error loading landing page: {landingPageError.message}
        <Button onClick={() => navigate(-1)} className="ml-4">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col overflow-hidden">
      <Toolbar
        title={`Product Landing Page: ${landingPage?.product?.name || "Loading..."}`}
        onBack={() => navigate(-1)}
        canUndo={canvasState.canUndo}
        canRedo={canvasState.canRedo}
        isDirty={canvasState.isDirty}
        onUndo={canvasState.undo}
        onRedo={canvasState.redo}
        onSave={handleSave}
        onPublish={() => {
          setFormData(prev => ({ ...prev, status: "published" }));
          handleSave();
        }}
        viewport={viewport}
        onViewportChange={setViewport}
        isSaving={isCreating || isUpdating}
        showPublish={true}
        onDelete={landingPage ? handleDelete : null}
      />

      <div className="flex-1 flex gap-4 overflow-hidden p-4">
        {/* Left Sidebar: Component Palette */}
        <div className="w-72 flex flex-col gap-3 flex-shrink-0 overflow-hidden">
          {/* System Toggles */}
          <div className="p-3 border rounded-lg bg-card flex-shrink-0">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium flex items-center gap-2">
                <PanelTop className="h-4 w-4" /> Header
              </span>
              <Switch checked={showHeader} onCheckedChange={setShowHeader} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium flex items-center gap-2">
                <PanelBottom className="h-4 w-4" /> Footer
              </span>
              <Switch checked={showFooter} onCheckedChange={setShowFooter} />
            </div>
          </div>

          {/* Component Palette */}
          <div className="flex-1 min-h-0 overflow-hidden">
            <ComponentPalette
              title="Components"
              items={paletteItems}
              onAdd={handleAddBlock}
              searchable={true}
              collapsible={false}
            />
          </div>
        </div>

        {/* Center: Canvas */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-auto bg-muted/30 rounded-lg border">
            <Canvas
              items={canvasState.items}
              selectedId={canvasState.selectedId}
              onSelectItem={canvasState.selectItem}
              onUpdateItems={canvasState.updateItems}
              onAddItem={handleAddBlock}
              themeConfig={themeConfig}
              storeConfig={storeConfig}
              viewport={viewport}
              showHeader={showHeader}
              showFooter={showFooter}
              onSelectHeader={() => canvasState.selectItem('systemHeader')}
              onSelectFooter={() => canvasState.selectItem('systemFooter')}
              className="h-full"
            />
          </div>
          {canvasState.items.length === 0 && !showHeader && !showFooter && (
            <div className="text-center py-2 text-sm text-muted-foreground">
              Canvas is empty. Add components from the sidebar to start building.
            </div>
          )}
        </div>

        {/* Right Sidebar: Properties */}
        <div className="w-80 flex flex-col gap-3 flex-shrink-0 overflow-hidden">
          <div className="flex-1 min-h-0 overflow-hidden">
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
                  : (id) => {
                      if (window.confirm("Remove this component?")) {
                        canvasState.deleteItem(id);
                      }
                    }
              }
              onDuplicate={
                canvasState.selectedId === 'systemHeader' || canvasState.selectedId === 'systemFooter'
                  ? null
                  : canvasState.duplicateItem
              }
              isUpdating={isUpdating || isCreating}
              settingsComponents={settingsComponentMap}
              metaFields={["page_title", "page_description", "slug", "status"]}
              metaData={formData}
              onMetaChange={(field, value) => setFormData(prev => ({ ...prev, [field]: value }))}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductLandingPageSettings;
