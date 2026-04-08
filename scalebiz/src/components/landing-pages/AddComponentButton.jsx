"use client";

import React from "react";
import { Button } from "@/components/ui/button.jsx";
import {
  Dialog, // Changed from DropdownMenu
  DialogContent, // Changed from DropdownMenuContent
  DialogHeader,
  DialogTitle,
  DialogTrigger, // Changed from DropdownMenuTrigger
} from "@/components/ui/dialog.jsx"; // Import Dialog components
import { Plus } from "lucide-react";
import { showSuccess } from "@/utils/toast.js";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area.jsx";

const componentOptions = [
  { type: "heroBanner", label: "Hero Banner" },
  { type: "productCarousel", label: "Product Carousel" },
  { type: "featuredCategories", label: "Featured Categories" },
  { type: "heroBannerSlider", label: "Hero Banner Slider" },
  { type: "marketingBanner", label: "Marketing Banner" },
  { type: "featureBlocks", label: "Feature Blocks" },
  { type: "productSection", label: "Product Section" },
  { type: "brandShowcase", label: "Brand Showcase" },
  { type: "latestNews", label: "Latest News" },
  { type: "categorySidebar", label: "Category Sidebar" },
  { type: "promotionalBanners", label: "Promotional Banners" },
  { type: "midPageCallToAction", label: "Mid-Page Call to Action" },
  { type: "newsletterSubscription", label: "Newsletter Subscription" },
  { type: "blogPostsSection", label: "Blog Posts Section" },
  // New static sections added as dynamic components
  { type: "generalSettings", label: "General Settings" },
  { type: "pageSeoSettings", label: "Page SEO Settings" },
  { type: "scrollingBannerText", label: "Scrolling Banner Text" },
  { type: "topBannerSection", label: "Top Banner Section" },
  { type: "featuredSection", label: "Featured Section" },
  { type: "featuredVideoSection", label: "Featured Video Section" },
  { type: "showcasedBannerSection", label: "Showcased Banner Section" },
  { type: "staticBannerSection", label: "Static Banner Section" },
  { type: "productImagesSection", label: "Product Images Section" },
];

const AddComponentButton = ({ onAddComponent, isUpdating }) => { // Accept onAddComponent and isUpdating as props
  const [isDialogOpen, setIsDialogOpen] = React.useState(false); // State to manage dialog open/close

  const handleAddComponentClick = (componentType) => {
    onAddComponent(componentType);
    setIsDialogOpen(false); // Close dialog after adding
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="bg-purple-600 hover:bg-purple-700 text-white w-full" disabled={isUpdating}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Component
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] p-0"> {/* Adjust max-width and remove default padding */}
        <DialogHeader className="p-6 pb-0">
          <DialogTitle>Add New Component</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[400px] w-full p-6"> {/* Apply max-height and padding to ScrollArea */}
          <div className="grid gap-2"> {/* Use a grid for better spacing of items */}
            {componentOptions.map((option) => (
              <Button
                key={option.type}
                variant="ghost"
                className="justify-start"
                onClick={() => handleAddComponentClick(option.type)}
                disabled={isUpdating}
              >
                {option.label}
              </Button>
            ))}
          </div>
          <ScrollBar />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default AddComponentButton;