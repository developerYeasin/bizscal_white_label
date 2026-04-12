"use client";

import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Switch } from "@/components/ui/switch.jsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.jsx";

/**
 * BuilderHeader - Header component for the page builder
 * This component saves settings to the block data, not the global store config
 */
const BuilderHeader = ({ data, updateNested }) => {
  const [topBarEnabled, setTopBarEnabled] = useState(data.topBar?.enabled || false);
  const [topBarMessages, setTopBarMessages] = useState(data.topBar?.messages || []);
  const [topBarMessage, setTopBarMessage] = useState("");
  
  const [mainNavEnabled, setMainNavEnabled] = useState(data.mainNav?.enabled || true);
  const [mainNavLogoUrl, setMainNavLogoUrl] = useState(data.mainNav?.logoUrl || "");
  const [mainNavShowSearchIcon, setMainNavShowSearchIcon] = useState(data.mainNav?.showSearchIcon || true);
  const [mainNavShowGridIcon, setMainNavShowGridIcon] = useState(data.mainNav?.showGridIcon || false);
  const [mainNavShowWishlistIcon, setMainNavShowWishlistIcon] = useState(data.mainNav?.showWishlistIcon || false);
  const [mainNavShowCompareIcon, setMainNavShowCompareIcon] = useState(data.mainNav?.showCompareIcon || false);
  const [mainNavShowCartIcon, setMainNavShowCartIcon] = useState(data.mainNav?.showCartIcon || true);
  const [mainNavShowAllCategories, setMainNavShowAllCategories] = useState(data.mainNav?.showAllCategories !== false);
  const [mainNavCategorySidebarPosition, setMainNavCategorySidebarPosition] = useState(data.mainNav?.categorySidebarPosition || "left");
  const [navItems, setNavItems] = useState(data.navItems || []);
  const [newNavItem, setNewNavItem] = useState({ title: "", path: "" });

  // Sync state with props when data changes
  useEffect(() => {
    setTopBarEnabled(data.topBar?.enabled || false);
    setTopBarMessages(data.topBar?.messages || []);
    setMainNavEnabled(data.mainNav?.enabled || true);
    setMainNavLogoUrl(data.mainNav?.logoUrl || "");
    setMainNavShowSearchIcon(data.mainNav?.showSearchIcon || true);
    setMainNavShowGridIcon(data.mainNav?.showGridIcon || false);
    setMainNavShowWishlistIcon(data.mainNav?.showWishlistIcon || false);
    setMainNavShowCompareIcon(data.mainNav?.showCompareIcon || false);
    setMainNavShowCartIcon(data.mainNav?.showCartIcon || true);
    setMainNavShowAllCategories(data.mainNav?.showAllCategories !== false);
    setMainNavCategorySidebarPosition(data.mainNav?.categorySidebarPosition || "left");
    setNavItems(data.navItems || []);
  }, [data]);

  // Update block data when top bar settings change
  const handleTopBarEnabledChange = (checked) => {
    setTopBarEnabled(checked);
    if (updateNested) {
      updateNested("data.topBar", { enabled: checked, messages: topBarMessages });
    }
  };

  const handleAddTopBarMessage = () => {
    if (topBarMessage.trim()) {
      const newMessages = [...topBarMessages, topBarMessage.trim()];
      setTopBarMessages(newMessages);
      setTopBarMessage("");
      if (updateNested) {
        updateNested("data.topBar", { enabled: topBarEnabled, messages: newMessages });
      }
    }
  };

  const handleRemoveTopBarMessage = (index) => {
    const newMessages = topBarMessages.filter((_, i) => i !== index);
    setTopBarMessages(newMessages);
    if (updateNested) {
      updateNested("data.topBar", { enabled: topBarEnabled, messages: newMessages });
    }
  };

  // Update block data when main nav settings change
  const handleMainNavEnabledChange = (checked) => {
    setMainNavEnabled(checked);
    if (updateNested) {
      updateNested("data.mainNav", {
        enabled: checked,
        logoUrl: mainNavLogoUrl,
        showSearchIcon: mainNavShowSearchIcon,
        showGridIcon: mainNavShowGridIcon,
        showWishlistIcon: mainNavShowWishlistIcon,
        showCompareIcon: mainNavShowCompareIcon,
        showCartIcon: mainNavShowCartIcon,
        showAllCategories: mainNavShowAllCategories,
        categorySidebarPosition: mainNavCategorySidebarPosition,
        navItems: navItems,
      });
    }
  };

  const handleMainNavLogoUrlChange = (value) => {
    setMainNavLogoUrl(value);
    if (updateNested) {
      updateNested("data.mainNav", {
        enabled: mainNavEnabled,
        logoUrl: value,
        showSearchIcon: mainNavShowSearchIcon,
        showGridIcon: mainNavShowGridIcon,
        showWishlistIcon: mainNavShowWishlistIcon,
        showCompareIcon: mainNavShowCompareIcon,
        showCartIcon: mainNavShowCartIcon,
        showAllCategories: mainNavShowAllCategories,
        categorySidebarPosition: mainNavCategorySidebarPosition,
        navItems: navItems,
      });
    }
  };

  const handleShowSearchIconChange = (checked) => {
    setMainNavShowSearchIcon(checked);
    if (updateNested) {
      updateNested("data.mainNav", {
        enabled: mainNavEnabled,
        logoUrl: mainNavLogoUrl,
        showSearchIcon: checked,
        showGridIcon: mainNavShowGridIcon,
        showWishlistIcon: mainNavShowWishlistIcon,
        showCompareIcon: mainNavShowCompareIcon,
        showCartIcon: mainNavShowCartIcon,
        showAllCategories: mainNavShowAllCategories,
        categorySidebarPosition: mainNavCategorySidebarPosition,
        navItems: navItems,
      });
    }
  };

  const handleShowGridIconChange = (checked) => {
    setMainNavShowGridIcon(checked);
    if (updateNested) {
      updateNested("data.mainNav", {
        enabled: mainNavEnabled,
        logoUrl: mainNavLogoUrl,
        showSearchIcon: mainNavShowSearchIcon,
        showGridIcon: checked,
        showWishlistIcon: mainNavShowWishlistIcon,
        showCompareIcon: mainNavShowCompareIcon,
        showCartIcon: mainNavShowCartIcon,
        showAllCategories: mainNavShowAllCategories,
        categorySidebarPosition: mainNavCategorySidebarPosition,
        navItems: navItems,
      });
    }
  };

  const handleShowWishlistIconChange = (checked) => {
    setMainNavShowWishlistIcon(checked);
    if (updateNested) {
      updateNested("data.mainNav", {
        enabled: mainNavEnabled,
        logoUrl: mainNavLogoUrl,
        showSearchIcon: mainNavShowSearchIcon,
        showGridIcon: mainNavShowGridIcon,
        showWishlistIcon: checked,
        showCompareIcon: mainNavShowCompareIcon,
        showCartIcon: mainNavShowCartIcon,
        showAllCategories: mainNavShowAllCategories,
        categorySidebarPosition: mainNavCategorySidebarPosition,
        navItems: navItems,
      });
    }
  };

  const handleShowCompareIconChange = (checked) => {
    setMainNavShowCompareIcon(checked);
    if (updateNested) {
      updateNested("data.mainNav", {
        enabled: mainNavEnabled,
        logoUrl: mainNavLogoUrl,
        showSearchIcon: mainNavShowSearchIcon,
        showGridIcon: mainNavShowGridIcon,
        showWishlistIcon: mainNavShowWishlistIcon,
        showCompareIcon: checked,
        showCartIcon: mainNavShowCartIcon,
        showAllCategories: mainNavShowAllCategories,
        categorySidebarPosition: mainNavCategorySidebarPosition,
        navItems: navItems,
      });
    }
  };

  const handleShowCartIconChange = (checked) => {
    setMainNavShowCartIcon(checked);
    if (updateNested) {
      updateNested("data.mainNav", {
        enabled: mainNavEnabled,
        logoUrl: mainNavLogoUrl,
        showSearchIcon: mainNavShowSearchIcon,
        showGridIcon: mainNavShowGridIcon,
        showWishlistIcon: mainNavShowWishlistIcon,
        showCompareIcon: mainNavShowCompareIcon,
        showCartIcon: checked,
        showAllCategories: mainNavShowAllCategories,
        categorySidebarPosition: mainNavCategorySidebarPosition,
        navItems: navItems,
      });
    }
  };

  const handleShowAllCategoriesChange = (checked) => {
    setMainNavShowAllCategories(checked);
    if (updateNested) {
      updateNested("data.mainNav", {
        enabled: mainNavEnabled,
        logoUrl: mainNavLogoUrl,
        showSearchIcon: mainNavShowSearchIcon,
        showGridIcon: mainNavShowGridIcon,
        showWishlistIcon: mainNavShowWishlistIcon,
        showCompareIcon: mainNavShowCompareIcon,
        showCartIcon: mainNavShowCartIcon,
        showAllCategories: checked,
        categorySidebarPosition: mainNavCategorySidebarPosition,
        navItems: navItems,
      });
    }
  };

  const handleCategorySidebarPositionChange = (position) => {
    setMainNavCategorySidebarPosition(position);
    if (updateNested) {
      updateNested("data.mainNav", {
        enabled: mainNavEnabled,
        logoUrl: mainNavLogoUrl,
        showSearchIcon: mainNavShowSearchIcon,
        showGridIcon: mainNavShowGridIcon,
        showWishlistIcon: mainNavShowWishlistIcon,
        showCompareIcon: mainNavShowCompareIcon,
        showCartIcon: mainNavShowCartIcon,
        showAllCategories: mainNavShowAllCategories,
        categorySidebarPosition: position,
        navItems: navItems,
      });
    }
  };

  const handleAddNavItem = () => {
    if (newNavItem.title.trim() && newNavItem.path.trim()) {
      const newItems = [...navItems, { ...newNavItem, type: "link" }];
      setNavItems(newItems);
      setNewNavItem({ title: "", path: "" });
      if (updateNested) {
        updateNested("data.mainNav", {
          enabled: mainNavEnabled,
          logoUrl: mainNavLogoUrl,
          showSearchIcon: mainNavShowSearchIcon,
          showGridIcon: mainNavShowGridIcon,
          showWishlistIcon: mainNavShowWishlistIcon,
          showCompareIcon: mainNavShowCompareIcon,
          showCartIcon: mainNavShowCartIcon,
          showAllCategories: mainNavShowAllCategories,
          categorySidebarPosition: mainNavCategorySidebarPosition,
          navItems: newItems,
        });
      }
    }
  };

  const handleRemoveNavItem = (index) => {
    const newItems = navItems.filter((_, i) => i !== index);
    setNavItems(newItems);
    if (updateNested) {
      updateNested("data.mainNav", {
        enabled: mainNavEnabled,
        logoUrl: mainNavLogoUrl,
        showSearchIcon: mainNavShowSearchIcon,
        showGridIcon: mainNavShowGridIcon,
        showWishlistIcon: mainNavShowWishlistIcon,
        showCompareIcon: mainNavShowCompareIcon,
        showCartIcon: mainNavShowCartIcon,
        showAllCategories: mainNavShowAllCategories,
        categorySidebarPosition: mainNavCategorySidebarPosition,
        navItems: newItems,
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Bar Settings */}
      <div className="border rounded-lg p-4">
        <h3 className="text-sm font-semibold mb-4">Top Bar</h3>
        
        <div className="flex items-center justify-between mb-4">
          <Label className="text-sm font-medium">Enable Top Bar</Label>
          <Switch
            checked={topBarEnabled}
            onCheckedChange={handleTopBarEnabledChange}
          />
        </div>

        {topBarEnabled && (
          <div className="space-y-3">
            <div className="flex gap-2">
              <Input
                placeholder="Add announcement message..."
                value={topBarMessage}
                onChange={(e) => setTopBarMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleAddTopBarMessage()}
              />
              <button
                onClick={handleAddTopBarMessage}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm"
              >
                Add
              </button>
            </div>
            
            <div className="space-y-2">
              {topBarMessages.map((msg, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                  <span className="text-sm">{msg}</span>
                  <button
                    onClick={() => handleRemoveTopBarMessage(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Navigation Settings */}
      <div className="border rounded-lg p-4">
        <h3 className="text-sm font-semibold mb-4">Main Navigation</h3>
        
        <div className="flex items-center justify-between mb-4">
          <Label className="text-sm font-medium">Enable Main Navigation</Label>
          <Switch
            checked={mainNavEnabled}
            onCheckedChange={handleMainNavEnabledChange}
          />
        </div>

        {mainNavEnabled && (
          <div className="space-y-4">
            <div>
              <Label className="text-xs font-medium">Logo URL</Label>
              <Input
                placeholder="Logo URL"
                value={mainNavLogoUrl}
                onChange={(e) => handleMainNavLogoUrlChange(e.target.value)}
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-medium">Show Search Icon</Label>
                <Switch
                  checked={mainNavShowSearchIcon}
                  onCheckedChange={handleShowSearchIconChange}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-xs font-medium">Show Grid Icon</Label>
                <Switch
                  checked={mainNavShowGridIcon}
                  onCheckedChange={handleShowGridIconChange}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-xs font-medium">Show Wishlist Icon</Label>
                <Switch
                  checked={mainNavShowWishlistIcon}
                  onCheckedChange={handleShowWishlistIconChange}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-xs font-medium">Show Compare Icon</Label>
                <Switch
                  checked={mainNavShowCompareIcon}
                  onCheckedChange={handleShowCompareIconChange}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-xs font-medium">Show Cart Icon</Label>
                <Switch
                  checked={mainNavShowCartIcon}
                  onCheckedChange={handleShowCartIconChange}
                />
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex items-center justify-between mb-4">
                <Label className="text-sm font-medium">Show All Categories</Label>
                <Switch
                  checked={mainNavShowAllCategories}
                  onCheckedChange={handleShowAllCategoriesChange}
                />
              </div>

              {mainNavShowAllCategories && (
                <div className="mb-4">
                  <Label className="text-xs font-medium">Sidebar Position</Label>
                  <Select
                    value={mainNavCategorySidebarPosition}
                    onValueChange={handleCategorySidebarPositionChange}
                  >
                    <SelectTrigger className="w-full mt-1">
                      <SelectValue placeholder="Select position" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="left">Left (Dropdown)</SelectItem>
                      <SelectItem value="right">Right (Hidden)</SelectItem>
                      <SelectItem value="hidden">Hidden</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <div className="border-t pt-4">
              <h4 className="text-xs font-semibold mb-3">Navigation Items</h4>
              
              <div className="flex gap-2 mb-3">
                <Input
                  placeholder="Title"
                  value={newNavItem.title}
                  onChange={(e) => setNewNavItem({ ...newNavItem, title: e.target.value })}
                  className="flex-1"
                />
                <Input
                  placeholder="Path"
                  value={newNavItem.path}
                  onChange={(e) => setNewNavItem({ ...newNavItem, path: e.target.value })}
                  className="flex-1"
                />
                <button
                  onClick={handleAddNavItem}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm"
                >
                  Add
                </button>
              </div>

              <div className="space-y-2">
                {navItems.map((item, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                    <span className="text-sm">{item.title} ({item.path})</span>
                    <button
                      onClick={() => handleRemoveNavItem(index)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BuilderHeader;
