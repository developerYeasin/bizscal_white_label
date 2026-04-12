"use client";

import React from "react";
import { Search } from "lucide-react";
import { Label } from "@/components/ui/label.jsx";
import { Input } from "@/components/ui/input.jsx";
import {
  Layout,
  List,
  Table,
  Type,
  FileText,
  AlignLeft,
  MousePointer2,
  CreditCard,
  FileInput,
  PanelTop,
  PanelBottom,
  Image as LucideImage,
} from "lucide-react";

// Block definitions organized by category
const BLOCK_CATEGORIES = [
  {
    name: "Layout",
    blocks: [
      { id: "section", type: "section", label: "Section", icon: Layout, defaultConfig: { container: true } },
      { id: "row", type: "row", label: "Row", icon: List, defaultConfig: {} },
      { id: "column", type: "column", label: "Column", icon: Table, defaultConfig: { width: "1/2" } },
      { id: "grid", type: "grid", label: "Grid", icon: Layout, defaultConfig: { columns: 3 } },
      { id: "cardLayout", type: "cardLayout", label: "Card Layout", icon: Table, defaultConfig: { title: "Card Layout", columns: 3 } },
      { id: "card", type: "card", label: "Card", icon: LucideImage, defaultConfig: { title: "Card Title", description: "Card description", imageUrl: "", buttonText: "Learn More" } },
      { id: "megaMenuHeader", type: "megaMenuHeader", label: "Mega Menu Header", icon: Layout, defaultConfig: { backgroundColor: "#f97316", textColor: "#ffffff" } },
      { id: "themeSection", type: "themeSection", label: "Theme Section", icon: Layout, defaultConfig: { sectionType: "hero", title: "Section Title", theme: "axon" } },
      { id: "Header", type: "systemHeader", label: "Header", icon: PanelTop, defaultConfig: {} },
      { id: "Footer", type: "systemFooter", label: "Footer", icon: PanelBottom, defaultConfig: {} },
    ],
  },
  {
    name: "Ready-Made Sections",
    blocks: [
      { id: "readyMadeSection-hero", type: "readyMadeSection", label: "Hero Section", icon: Layout, defaultConfig: { sectionType: "hero", title: "Hero Section" } },
      { id: "readyMadeSection-features", type: "readyMadeSection", label: "Features Section", icon: Layout, defaultConfig: { sectionType: "features", title: "Features" } },
      { id: "readyMadeSection-testimonials", type: "readyMadeSection", label: "Testimonials Section", icon: Layout, defaultConfig: { sectionType: "testimonials", title: "Testimonials" } },
      { id: "readyMadeSection-pricing", type: "readyMadeSection", label: "Pricing Section", icon: Layout, defaultConfig: { sectionType: "pricing", title: "Pricing" } },
      { id: "readyMadeSection-faq", type: "readyMadeSection", label: "FAQ Section", icon: Layout, defaultConfig: { sectionType: "faq", title: "FAQ" } },
      { id: "readyMadeSection-team", type: "readyMadeSection", label: "Team Section", icon: Layout, defaultConfig: { sectionType: "team", title: "Team" } },
      { id: "readyMadeSection-contact", type: "readyMadeSection", label: "Contact Section", icon: Layout, defaultConfig: { sectionType: "contact", title: "Contact" } },
      { id: "readyMadeSection-cta", type: "readyMadeSection", label: "CTA Section", icon: Layout, defaultConfig: { sectionType: "cta", title: "CTA" } },
    ],
  },
  {
    name: "Slider Blocks",
    blocks: [
      { id: "heroBannerSlider", type: "heroBannerSlider", label: "Hero Banner Slider", icon: Layout, defaultConfig: { slides: [] } },
    ],
  },
  {
    name: "Basic",
    blocks: [
      { id: "title", type: "title", label: "Title", icon: Type, defaultConfig: { text: "New Title", tag: "h2" } },
      { id: "description", type: "description", label: "Description", icon: FileText, defaultConfig: { text: "Add your description here..." } },
      { id: "text", type: "text", label: "Text", icon: AlignLeft, defaultConfig: { content: "<p>Add your content here...</p>" } },
      { id: "button", type: "button", label: "Button", icon: MousePointer2, defaultConfig: { text: "Click Me" } },
      { id: "image", type: "image", label: "Image", icon: LucideImage, defaultConfig: {} },
    ],
  },
  {
    name: "Product Page",
    blocks: [
      { id: "productSection", type: "productSection", label: "Product Section", icon: Layout, defaultConfig: { collection: "all", productsPerRow: 4 } },
      { id: "productGallery", type: "productGallery", label: "Product Gallery", icon: LucideImage, defaultConfig: {} },
      { id: "productInfo", type: "productInfo", label: "Product Info", icon: FileText, defaultConfig: {} },
      { id: "productRelatedCarousel", type: "productRelatedCarousel", label: "Related Products", icon: List, defaultConfig: { relatedCount: 4 } },
      { id: "categorySidebar", type: "categorySidebar", label: "Category Sidebar (Mega Menu)", icon: List, defaultConfig: {} },
    ],
  },
  {
    name: "Cart & Checkout",
    blocks: [
      { id: "cart", type: "cart", label: "Cart Page", icon: CreditCard, defaultConfig: {} },
      { id: "checkout", type: "checkout", label: "Checkout Page", icon: CreditCard, defaultConfig: {} },
      { id: "orderConfirmation", type: "orderConfirmation", label: "Order Confirmation", icon: FileText, defaultConfig: {} },
    ],
  },
  {
    name: "Form Blocks",
    blocks: [
      { id: "contactForm", type: "contactForm", label: "Contact Form", icon: FileInput, defaultConfig: { formTitle: "Contact Us" } },
      { id: "policyPage", type: "policyPage", label: "Policy Page", icon: FileText, defaultConfig: { policyType: "privacy" } },
    ],
  },
  {
    name: "Akira Theme Blocks",
    blocks: [
      { id: "promotionalBannerGrid", type: "promotionalBannerGrid", label: "Promo Grid", icon: Layout, defaultConfig: { banners: [] } },
      { id: "saleBanner", type: "saleBanner", label: "Sale Banner", icon: Layout, defaultConfig: { title: "Sale", subtitle: "50% OFF" } },
      { id: "featuresTrustBadges", type: "featuresTrustBadges", label: "Trust Badges", icon: Layout, defaultConfig: { badges: [] } },
    ],
  },
  {
    name: "Axon Theme Blocks",
    blocks: [
      { id: "announcementBar", type: "announcementBar", label: "Announcement Bar", icon: Layout, defaultConfig: { message: "Free shipping on orders over $50" } },
      { id: "megaMenuWithCategories", type: "megaMenuWithCategories", label: "Mega Menu", icon: Layout, defaultConfig: { menuItems: [] } },
      { id: "productTabsFilter", type: "productTabsFilter", label: "Product Tabs", icon: Layout, defaultConfig: { tabs: ["Women", "Men", "Kids"] } },
    ],
  },
  {
    name: "Ghorer Bazar Theme Blocks",
    blocks: [
      { id: "contactInfoBar", type: "contactInfoBar", label: "Contact Bar", icon: Layout, defaultConfig: { phone: "+880123456789", whatsapp: "+880123456789" } },
      { id: "categoryNavigation", type: "categoryNavigation", label: "Category Nav", icon: Layout, defaultConfig: { categories: [] } },
      { id: "heroBannerWithProduct", type: "heroBannerWithProduct", label: "Hero w/ Product", icon: Layout, defaultConfig: { title: "Hero Banner", imageUrl: "" } },
    ],
  }
];

const BlockPalette = ({
  blockSearchQuery,
  setBlockSearchQuery,
  handleAddBlock,
  filteredThemeBlocks,
}) => {
  const handleDragStart = (e, blockType, defaultConfig) => {
    e.dataTransfer.setData(
      "blockType",
      blockType
    );
    e.dataTransfer.setData(
      "defaultConfig",
      JSON.stringify(defaultConfig || {})
    );
    e.dataTransfer.effectAllowed = "copy";
  };

  return (
    <>
      <h2 className="font-semibold text-sm text-gray-800 mb-4">
        Add New Block
      </h2>
      <div className="relative mb-4">
        <Input
          type="text"
          placeholder="Search blocks..."
          className="w-full text-sm border border-gray-200 rounded-md px-3 py-2 pl-9 focus:outline-none focus:border-blue-500"
          value={blockSearchQuery}
          onChange={(e) => setBlockSearchQuery(e.target.value)}
        />
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
      </div>
      <div className="grid grid-cols-2 gap-3 text-sm">
        {BLOCK_CATEGORIES.map((category) => (
          <React.Fragment key={category.name}>
            <div className="col-span-2 mt-4 mb-2 first:mt-0">
              <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                {category.name}
              </h3>
            </div>
            {category.blocks.map((block) => (
              <div
                key={block.id}
                className="border border-gray-200 bg-white hover:border-blue-500 hover:shadow-sm transition-all p-3 rounded-md cursor-pointer flex flex-col items-center gap-2 text-center"
                onClick={() => handleAddBlock(block.type, block.defaultConfig)}
                draggable
                onDragStart={(e) =>
                  handleDragStart(e, block.type, block.defaultConfig)
                }
              >
                <block.icon className="w-6 h-6 text-gray-400" />
                <span className="text-xs font-medium">{block.label}</span>
              </div>
            ))}
          </React.Fragment>
        ))}
        {/* Theme Blocks */}
        <div className="col-span-2 mt-4 mb-2">
          <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            Theme Blocks
          </h3>
        </div>
        {filteredThemeBlocks.map((block) => (
          <div
            key={block.id}
            className="border border-gray-200 bg-white hover:border-blue-500 hover:shadow-sm transition-all p-3 rounded-md cursor-pointer flex flex-col items-center gap-2 text-center"
            onClick={() => handleAddBlock(block.block_type, block.default_config || {})}
            draggable
            onDragStart={(e) =>
              handleDragStart(e, block.block_type, block.default_config || {})
            }
          >
            <Layout className="w-6 h-6 text-gray-400" />
            <span className="text-xs font-medium">
              {block.name || block.block_type}
            </span>
          </div>
        ))}
      </div>
    </>
  );
};

export default BlockPalette;
