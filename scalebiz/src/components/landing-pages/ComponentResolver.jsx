"use client";

import React from "react";
import HeroBanner from "./components/HeroBanner.jsx";
import ProductCarousel from "./components/ProductCarousel.jsx";
import FeaturedCategories from "./components/FeaturedCategories.jsx";
import HeroBannerSlider from "./components/HeroBannerSlider.jsx";
import MarketingBanner from "./components/MarketingBanner.jsx";
import FeatureBlocks from "./components/FeatureBlocks.jsx";
import ProductSection from "./components/ProductSection.jsx";
import BrandShowcase from "./components/BrandShowcase.jsx";
import LatestNews from "./components/LatestNews.jsx";
import CategorySidebar from "./components/CategorySidebar.jsx";
import PromotionalBanners from "./components/PromotionalBanners.jsx";
import MidPageCallToAction from "./components/MidPageCallToAction.jsx";
import NewsletterSubscription from "./components/NewsletterSubscription.jsx";
import BlogPostsSection from "./components/BlogPostsSection.jsx";
import SystemHeader from "@/components/page-builder/blocks/SystemHeader.jsx";
import SystemFooter from "@/components/page-builder/blocks/SystemFooter.jsx";
// Layout blocks
import { SectionBlock, RowBlock, ColumnBlock, GridBlock } from "@/components/page-builder/blocks/layout/index.js";
// Advanced blocks
import TabsBlock from "@/components/page-builder/blocks/TabsBlock.jsx";
import TestimonialsBlock from "@/components/page-builder/blocks/TestimonialsBlock.jsx";
import CountdownBlock from "@/components/page-builder/blocks/CountdownBlock.jsx";
import VideoBlock from "@/components/page-builder/blocks/VideoBlock.jsx";
import ContactBlock from "@/components/page-builder/blocks/ContactBlock.jsx";
import MapBlock from "@/components/page-builder/blocks/MapBlock.jsx";

// Basic blocks
import TitleBlock from "@/components/page-builder/blocks/TitleBlock.jsx";
import DescriptionBlock from "@/components/page-builder/blocks/DescriptionBlock.jsx";
import TextBlock from "@/components/page-builder/blocks/TextBlock.jsx";
import ButtonBlock from "@/components/page-builder/blocks/ButtonBlock.jsx";
import ImageBlock from "@/components/page-builder/blocks/ImageBlock.jsx";

// Map component types to their respective rendering components
const componentMap = {
  heroBanner: HeroBanner,
  productCarousel: ProductCarousel,
  featuredCategories: FeaturedCategories,
  heroBannerSlider: HeroBannerSlider,
  marketingBanner: MarketingBanner,
  featureBlocks: FeatureBlocks,
  productSection: ProductSection,
  brandShowcase: BrandShowcase,
  latestNews: LatestNews,
  categorySidebar: CategorySidebar,
  promotionalBanners: PromotionalBanners,
  midPageCallToAction: MidPageCallToAction,
  newsletterSubscription: NewsletterSubscription,
  blogPostsSection: BlogPostsSection,
  systemHeader: SystemHeader,
  systemFooter: SystemFooter,
  // Layout blocks
  section: SectionBlock,
  row: RowBlock,
  column: ColumnBlock,
  columns: ColumnBlock, // Alias for compatibility
  grid: GridBlock,
  container: SectionBlock, // Fallback: render as section
  // Advanced blocks
  tabs: TabsBlock,
  testimonials: TestimonialsBlock,
  countdown: CountdownBlock,
  video: VideoBlock,
  contact: ContactBlock,
  contactForm: ContactBlock, // Alias
  map: MapBlock,
  // Basic blocks
  title: TitleBlock,
  description: DescriptionBlock,
  text: TextBlock,
  button: ButtonBlock,
  image: ImageBlock,
};

const ComponentResolver = ({ components, themeConfig, storeConfig }) => {
  if (!components || components.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        No dynamic components configured.
      </div>
    );
  }

  return (
    <>
      {components.map((component, index) => {
        const ComponentToRender = componentMap[component.type];
        if (!ComponentToRender) {
          console.warn(`Unknown component type: ${component.type}`);
          return (
            <div key={component.id || index} className="p-4 text-destructive-foreground bg-destructive/20 rounded-md my-2">
              Error: Unknown component type "{component.type}"
            </div>
          );
        }
        return (
          <ComponentToRender
            key={component.id || index}
            data={component.data}
            themeConfig={themeConfig}
            storeConfig={storeConfig}
          />
        );
      })}
    </>
  );
};

export default ComponentResolver;
export { componentMap };
