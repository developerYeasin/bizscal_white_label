"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Switch } from "@/components/ui/switch.jsx";
import { Check, Sparkles, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils.js";
import { useThemeConfig } from "@/contexts/ThemeSettingsContext.jsx";
import { useStoreConfig } from "@/contexts/StoreConfigurationContext.jsx"; // Import useStoreConfig
import { Skeleton } from "@/components/ui/skeleton.jsx";
import ColorPicker from "@/components/ui/ColorPicker.jsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.jsx";
import { Textarea } from "@/components/ui/textarea.jsx";
import CollapsibleCard from "@/components/ui/CollapsibleCard.jsx";
import ProductPageSettings from "@/components/customize-theme/ProductPageSettings.jsx";
import CustomCodeEditor from "@/components/customize-theme/CustomCodeEditor.jsx";

// DND imports
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
  sortableKeyboardCoordinates,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import SortableComponentItem from "@/components/landing-pages/SortableComponentItem.jsx";
import AddComponentDialog from "@/components/product-landing-pages/AddComponentDialog.jsx";

// Import settings components for dynamic rendering
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

// Static settings components (now also treated as dynamic)
import GeneralSettings from "@/components/landing-pages/GeneralSettings.jsx";
import PageSeoSettings from "@/components/landing-pages/PageSeoSettings.jsx";
import ScrollingBannerText from "@/components/landing-pages/ScrollingBannerText.jsx";
import TopBannerSection from "@/components/landing-pages/TopBannerText.jsx"; // Corrected import path
import FeaturedSection from "@/components/landing-pages/FeaturedSection.jsx";
import FeaturedVideoSection from "@/components/landing-pages/FeaturedVideoSection.jsx";
import ShowcasedBannerSection from "@/components/landing-pages/ShowcasedBannerSection.jsx";
import StaticBannerSection from "@/components/landing-pages/StaticBannerSection.jsx";
import ProductImagesSection from "@/components/landing-pages/ProductImagesSection.jsx";
import { showSuccess, showError } from "@/utils/toast.js";


const fontOptions = [
  { value: "Roboto", label: "Roboto" },
  { value: "Open Sans", label: "Open Sans" },
  { value: "Lato", label: "Lato" },
  { value: "Montserrat", label: "Montserrat" },
  { value: "Poppins", label: "Poppins" },
  { value: "Arial", label: "Arial" },
  { value: "Times New Roman", label: "Times New Roman" },
];

const buttonShapeOptions = [
  { value: "rounded", label: "Rounded" },
  { value: "square", label: "Square" },
  { value: "pill", label: "Pill" },
];

const buttonSizeOptions = [
  { value: "small", label: "Small" },
  { value: "medium", label: "Medium" },
  { value: "large", label: "Large" },
];

const productCardStyleOptions = [
  { value: "default", label: "Default Card" },
  { value: "minimal", label: "Minimal Card" },
  { value: "overlay", label: "Overlay Card" },
  { value: "themeOne", label: "Theme One Card" },
  { value: "multiView", label: "Multi-View Card" },
  { value: "shophify", label: "Sophify Card" }, // Corrected typo
];

const componentSettingsMap = {
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
  // Static sections now treated as dynamic components
  generalSettings: GeneralSettings,
  pageSeoSettings: PageSeoSettings,
  scrollingBannerText: ScrollingBannerText,
  topBannerSection: TopBannerSection,
  featuredSection: FeaturedSection,
  featuredVideoSection: FeaturedVideoSection,
  showcasedBannerSection: ShowcasedBannerSection,
  staticBannerSection: StaticBannerSection,
  productImagesSection: ProductImagesSection,
};

const ThemeControls = () => {
  const { config, isLoading, updateNested, isUpdating } = useThemeConfig();
  const { config: fullStoreConfig, updateNested: updateStoreConfigNested, isUpdating: isUpdatingStoreConfig } = useStoreConfig(); // Get full store config

  // DND sensors
  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

  const handleAddComponent = (componentType) => {
    const newComponent = {
      id: Date.now(), // Unique ID for the component
      type: componentType,
      data: {},
    };

    // Initialize data based on component type
    switch (componentType) {
      case "heroBanner":
        newComponent.data = {
          imageUrl: "https://picsum.photos/seed/hero-banner-default/1200/500",
          title: "Your New Hero Banner",
          subtitle: "Catchy subtitle goes here.",
          ctaButton: { link: "/shop", text: "Shop Now" },
        };
        break;
      case "productCarousel":
        newComponent.data = {
          title: "New Product Carousel",
          query: { collectionId: "featured" },
          displayStyle: "carousel",
          productsPerView: 4,
          cardType: "default",
        };
        break;
      case "featuredCategories":
        newComponent.data = {
          title: "New Featured Categories",
          categories: [
            { id: Date.now() + 1, name: "Category 1", link: "#", imageUrl: "https://picsum.photos/seed/cat1/100/100" },
            { id: Date.now() + 2, name: "Category 2", link: "#", imageUrl: "https://picsum.photos/seed/cat2/100/100" },
          ],
        };
        break;
      case "heroBannerSlider":
        newComponent.data = {
          banners: [
            {
              id: Date.now() + 1,
              title: "New Slider Banner",
              imageUrl: "https://picsum.photos/seed/slider-default/1200/500",
              subtitle: "Discover amazing products",
              ctaButton: { link: "/products", text: "Explore" },
            },
          ],
        };
        break;
      case "marketingBanner":
        newComponent.data = {
          imageUrl: "https://picsum.photos/seed/marketing-banner-default/1200/400",
          title: "Limited Time Offer!",
          subtitle: "Get 20% off on all items.",
          ctaButton: { link: "/sale", text: "Shop Sale" },
        };
        break;
      case "featureBlocks":
        newComponent.data = {
          features: [
            { id: Date.now() + 1, icon: "truck", title: "Fast Delivery", description: "Express shipping worldwide." },
            { id: Date.now() + 2, icon: "refresh", title: "Easy Returns", description: "Hassle-free returns policy." },
            { id: Date.now() + 3, icon: "shield", title: "Secure Payments", description: "100% secure online transactions." },
          ],
        };
        break;
      case "productSection":
        newComponent.data = {
          title: "New Product Section",
          query: { collectionId: "new-arrivals" },
          displayStyle: "grid",
          gridCols: 4,
          tabs: [],
          cardType: "default",
        };
        break;
      case "brandShowcase":
        newComponent.data = {
          title: "Our Top Brands",
          brands: [
            { id: Date.now() + 1, name: "Brand A", link: "#", imageUrl: "https://picsum.photos/seed/brandA/100/50" },
            { id: Date.now() + 2, name: "Brand B", link: "#", imageUrl: "https://picsum.photos/seed/brandB/100/50" },
          ],
        };
        break;
      case "latestNews":
        newComponent.data = {
          title: "Latest News & Updates",
          posts: [
            { id: Date.now() + 1, title: "New Season Collection", description: "Check out our latest fashion.", imageUrl: "https://picsum.photos/seed/news1/400/250", link: "#", date: "2025-07-15" },
          ],
        };
        break;
      case "categorySidebar":
        newComponent.data = {
          title: "Shop by Category",
          categories: [
            { id: Date.now() + 1, name: "Electronics", link: "#" },
            { id: Date.now() + 2, name: "Clothing", link: "#" },
          ],
        };
        break;
      case "promotionalBanners":
        newComponent.data = {
          banners: [
            { id: Date.now() + 1, imageUrl: "https://picsum.photos/seed/promo1/600/300", pretitle: "Summer Sale", title: "Up to 50% Off", subtitle: "Shop now and save big!", ctaButton: { link: "/sale", text: "Shop Now" }, size: "medium", position: "left" },
          ],
        };
        break;
      case "midPageCallToAction":
        newComponent.data = {
          imageUrl: "https://picsum.photos/seed/midpage-cta-default/1200/400",
          pretitle: "Exclusive Offer",
          title: "Don't Miss Out!",
          subtitle: "Limited stock available. Grab yours today.",
          ctaButton: { link: "/deals", text: "View Deals" },
        };
        break;
      case "newsletterSubscription":
        newComponent.data = {
          imageUrl: "https://picsum.photos/seed/newsletter-default/1200/400",
          title: "Subscribe to Our Newsletter",
          subtitle: "Get the latest updates and exclusive offers.",
          placeholder: "Your email address",
          buttonText: "Subscribe",
        };
        break;
      case "blogPostsSection":
        newComponent.data = {
          title: "From Our Blog",
          posts: [
            { id: Date.now() + 1, title: "Fashion Trends 2025", description: "Stay ahead with the latest styles.", imageUrl: "https://picsum.photos/seed/blog1/400/250", link: "#", date: "2025-07-20" },
          ],
        };
        break;
      case "generalSettings":
        newComponent.data = {
          primary_color: "#6B46C1",
          secondary_color: "#000000",
          show_product_details: true,
        };
        break;
      case "pageSeoSettings":
        newComponent.data = {
          page_title: "Landing Page",
          page_description: "Discover our amazing products!",
        };
        break;
      case "scrollingBannerText":
        newComponent.data = {
          scrolling_banner_text: "Limited Time Offer! Shop Now!",
        };
        break;
      case "topBannerSection":
        newComponent.data = {
          top_banner_image_url: "https://picsum.photos/seed/top-banner-default/1300/300",
        };
        break;
      case "featuredSection":
        newComponent.data = {
          featured_section_images: [
            "https://picsum.photos/seed/featured-item1/400/200",
            "https://picsum.photos/seed/featured-item2/400/200",
          ],
        };
        break;
      case "featuredVideoSection":
        newComponent.data = {
          featured_video_title: "Watch Our Product Video",
          featured_video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        };
        break;
      case "showcasedBannerSection":
        newComponent.data = {
          showcased_banner_images: [
            "https://picsum.photos/seed/showcase1/400/200",
            "https://picsum.photos/seed/showcase2/400/200",
          ],
        };
        break;
      case "staticBannerSection":
        newComponent.data = {
          static_banner_image_url: "https://picsum.photos/seed/static-banner-default/1300/300",
        };
        break;
      case "productImagesSection":
        newComponent.data = {
          product_images_section_title: "More Product Views",
          product_images_section_images: [
            "https://picsum.photos/seed/prod-img1/200/200",
            "https://picsum.photos/seed/prod-img2/200/200",
          ],
        };
        break;
      default:
        break;
    }

    // Use updateStoreConfigNested for page_settings.landingPage.components
    updateStoreConfigNested('page_settings.landingPage.components', [...(fullStoreConfig.page_settings.landingPage.components || []), newComponent]);
    showSuccess(`${componentType} added to local configuration!`);
  };

  const handleDeleteComponent = (componentIdToDelete) => {
    // Use updateStoreConfigNested for page_settings.landingPage.components
    updateStoreConfigNested('page_settings.landingPage.components', (fullStoreConfig.page_settings.landingPage.components || []).filter(
      (comp) => comp.id !== componentIdToDelete
    ));
    showError("Component removed from local configuration.");
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const currentComponents = fullStoreConfig.page_settings.landingPage.components || [];
    const oldIndex = currentComponents.findIndex((comp) => comp.id === active.id);
    const newIndex = currentComponents.findIndex((comp) => comp.id === over.id);

    const newOrder = arrayMove(currentComponents, oldIndex, newIndex);
    // Use updateStoreConfigNested for page_settings.landingPage.components
    updateStoreConfigNested('page_settings.landingPage.components', newOrder);
  };

  if (isLoading || !config || !fullStoreConfig) { // Ensure fullStoreConfig is loaded
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Theme Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <div className="flex justify-end">
            <Skeleton className="h-10 w-32" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const landingPageComponents = fullStoreConfig.page_settings?.landingPage?.components || [];
  const componentIds = landingPageComponents.map((comp) => comp.id);
  const dynamicComponentCount = landingPageComponents.length;

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Theme Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center mb-6">
          {/* Primary Color */}
          <div>
            <Label htmlFor="theme-primary-color" className="block text-sm font-medium text-foreground mb-2">
              Shop Theme Primary Color
            </Label>
            <div className="flex items-center gap-2">
              <ColorPicker
                color={config.primary_color}
                onChange={(color) => updateNested('primary_color', color)}
                className="w-16 h-10 p-0 border-none cursor-pointer"
                disabled={isUpdating}
              />
              <Input
                value={config.primary_color}
                onChange={(e) => updateNested('primary_color', e.target.value)}
                className="flex-1"
                disabled={isUpdating}
              />
            </div>
          </div>

          {/* Secondary Color */}
          <div>
            <Label htmlFor="secondary-color" className="block text-sm font-medium text-foreground mb-2">
              Shop Theme Secondary Color
            </Label>
            <div className="flex items-center gap-2">
              <ColorPicker
                color={config.secondary_color}
                onChange={(color) => updateNested('secondary_color', color)}
                className="w-16 h-10 p-0 border-none cursor-pointer"
                disabled={isUpdating}
              />
              <Input
                value={config.secondary_color}
                onChange={(e) => updateNested('secondary_color', e.target.value)}
                className="flex-1"
                disabled={isUpdating}
              />
            </div>
          </div>

          {/* Accent Color */}
          <div>
            <Label htmlFor="accent-color" className="block text-sm font-medium text-foreground mb-2">
              Shop Theme Accent Color
            </Label>
            <div className="flex items-center gap-2">
              <ColorPicker
                color={config.accent_color}
                onChange={(color) => updateNested('accent_color', color)}
                className="w-16 h-10 p-0 border-none cursor-pointer"
                disabled={isUpdating}
              />
              <Input
                value={config.accent_color}
                onChange={(e) => updateNested('accent_color', e.target.value)}
                className="flex-1"
                disabled={isUpdating}
              />
            </div>
          </div>

          {/* Text Color */}
          <div>
            <Label htmlFor="text-color" className="block text-sm font-medium text-foreground mb-2">
              Shop Theme Text Color
            </Label>
            <div className="flex items-center gap-2">
              <ColorPicker
                color={config.text_color}
                onChange={(color) => updateNested('text_color', color)}
                className="w-16 h-10 p-0 border-none cursor-pointer"
                disabled={isUpdating}
              />
              <Input
                value={config.text_color}
                onChange={(e) => updateNested('text_color', e.target.value)}
                className="flex-1"
                disabled={isUpdating}
              />
            </div>
          </div>

          {/* Heading Font */}
          <div>
            <Label htmlFor="heading-font" className="block text-sm font-medium text-foreground mb-2">
              Heading Font
            </Label>
            <Select
              value={config.typography?.headingFont || 'Roboto'}
              onValueChange={(value) => updateNested('typography.headingFont', value)}
              disabled={isUpdating}
            >
              <SelectTrigger id="heading-font">
                <SelectValue placeholder="Select Heading Font" />
              </SelectTrigger>
              <SelectContent>
                {fontOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Body Font */}
          <div>
            <Label htmlFor="body-font" className="block text-sm font-medium text-foreground mb-2">
              Body Font
            </Label>
            <Select
              value={config.typography?.bodyFont || 'Open Sans'}
              onValueChange={(value) => updateNested('typography.bodyFont', value)}
              disabled={isUpdating}
            >
              <SelectTrigger id="body-font">
                <SelectValue placeholder="Select Body Font" />
              </SelectTrigger>
              <SelectContent>
                {fontOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Button Shape */}
          <div>
            <Label htmlFor="button-shape" className="block text-sm font-medium text-foreground mb-2">
              Button Shape
            </Label>
            <Select
              value={config.button_style?.shape || 'rounded'}
              onValueChange={(value) => updateNested('button_style.shape', value)}
              disabled={isUpdating}
            >
              <SelectTrigger id="button-shape">
                <SelectValue placeholder="Select Button Shape" />
              </SelectTrigger>
              <SelectContent>
                {buttonShapeOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Button Size */}
          <div>
            <Label htmlFor="button-size" className="block text-sm font-medium text-foreground mb-2">
              Button Size
            </Label>
            <Select
              value={config.button_style?.size || 'medium'}
              onValueChange={(value) => updateNested('button_style.size', value)}
              disabled={isUpdating}
            >
              <SelectTrigger id="button-size">
                <SelectValue placeholder="Select Button Size" />
              </SelectTrigger>
              <SelectContent>
                {buttonSizeOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Product Card Style */}
          <div>
            <Label htmlFor="product-card-style" className="block text-sm font-medium text-foreground mb-2">
              Product Card Style
            </Label>
            <Select
              value={config.product_card_style || 'default'}
              onValueChange={(value) => updateNested('product_card_style', value)}
              disabled={isUpdating}
            >
              <SelectTrigger id="product-card-style">
                <SelectValue placeholder="Select Card Style" />
              </SelectTrigger>
              <SelectContent>
                {productCardStyleOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Announcement Bar Settings */}
        <div className="border-t pt-6 mt-6">
          <h3 className="text-lg font-semibold mb-4">Announcement Bar</h3>
          <div className="flex items-center justify-between mb-4">
            <Label htmlFor="announcement-bar-enabled" className="text-base">
              Enable Announcement Bar
            </Label>
            <Switch
              id="announcement-bar-enabled"
              checked={config.announcement_bar?.enabled || false}
              onCheckedChange={(checked) => updateNested('announcement_bar.enabled', checked)}
              disabled={isUpdating}
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="announcement-bar-text">Announcement Text</Label>
            <Textarea
              id="announcement-bar-text"
              value={config.announcement_bar?.text || ''}
              onChange={(e) => updateNested('announcement_bar.text', e.target.value)}
              placeholder="Enter announcement message"
              rows={2}
              disabled={isUpdating}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="announcement-bar-bg-color" className="block text-sm font-medium text-foreground mb-2">
                Background Color
              </Label>
              <div className="flex items-center gap-2">
                <ColorPicker
                  color={config.announcement_bar?.background_color || '#6B46C1'}
                  onChange={(color) => updateNested('announcement_bar.background_color', color)}
                  className="w-16 h-10 p-0 border-none cursor-pointer"
                  disabled={isUpdating}
                />
                <Input
                  value={config.announcement_bar?.background_color || '#6B46C1'}
                  onChange={(e) => updateNested('announcement_bar.background_color', e.target.value)}
                  className="flex-1"
                  disabled={isUpdating}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="announcement-bar-text-color" className="block text-sm font-medium text-foreground mb-2">
                Text Color
              </Label>
              <div className="flex items-center gap-2">
                <ColorPicker
                  color={config.announcement_bar?.text_color || '#FFFFFF'}
                  onChange={(color) => updateNested('announcement_bar.text_color', color)}
                  className="w-16 h-10 p-0 border-none cursor-pointer"
                  disabled={isUpdating}
                />
                <Input
                  value={config.announcement_bar?.text_color || '#FFFFFF'}
                  onChange={(e) => updateNested('announcement_bar.text_color', e.target.value)}
                  className="flex-1"
                  disabled={isUpdating}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Buy Now Button Enabled */}
        <div className="border-t pt-6 mt-6">
          <Label className="block text-sm font-medium text-foreground mb-2">
            Enable Buy Now Button
          </Label>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className={cn(
                "flex-1",
                config.buy_now_button_enabled && "bg-primary text-primary-foreground hover:bg-primary/90"
              )}
              onClick={() => updateNested('buy_now_button_enabled', 1)}
              disabled={isUpdating}
            >
              Yes {config.buy_now_button_enabled === 1 && <Check className="h-4 w-4 ml-2" />}
            </Button>
            <Button
              variant="outline"
              className={cn(
                "flex-1",
                config.buy_now_button_enabled === 0 && "bg-primary text-primary-foreground hover:bg-primary/90"
              )}
              onClick={() => updateNested('buy_now_button_enabled', 0)}
              disabled={isUpdating}
            >
              No {config.buy_now_button_enabled === 0 && <Check className="h-4 w-4 ml-2" />}
            </Button>
          </div>
        </div>

        {/* Product Page Customization */}
        <div className="border-t pt-6 mt-6">
          <ProductPageSettings />
        </div>

        {/* Dynamic Components Section */}
        <div className="border-t pt-6 mt-6">
          <h2 className="text-xl font-semibold mb-4">
            Dynamic Components ({dynamicComponentCount})
          </h2>
          <div className="space-y-6 mb-6">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={componentIds}
                strategy={verticalListSortingStrategy}
              >
                {landingPageComponents && landingPageComponents.length > 0 ? (
                  landingPageComponents.map((component, index) => {
                    const SettingsComponent = componentSettingsMap[component.type];
                    if (SettingsComponent) {
                      return (
                        <SortableComponentItem
                          key={component.id}
                          id={component.id}
                          onDelete={handleDeleteComponent}
                        >
                          <div className="px-5 mt-4">
                            <SettingsComponent
                              component={component}
                              index={index}
                              updateNested={(path, value) => updateStoreConfigNested(`page_settings.landingPage.components.${index}.${path}`, value)}
                              isUpdating={isUpdatingStoreConfig}
                            />
                          </div>
                        </SortableComponentItem>
                      );
                    }
                    return (
                      <div key={component.id} className="border p-4 rounded-md text-destructive">
                        Unknown component type: {component.type}
                      </div>
                    );
                  })
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    No dynamic components added yet.
                  </p>
                )}
              </SortableContext>
            </DndContext>
          </div>
          <AddComponentDialog onAddComponent={handleAddComponent} isUpdating={isUpdatingStoreConfig} />
        </div>

        {/* Custom Code Editor */}
        <div className="border-t pt-6 mt-6">
          <CustomCodeEditor />
        </div>
      </CardContent>
    </Card>
  );
};

export default ThemeControls;