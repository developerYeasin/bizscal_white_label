"use client";

import React from "react";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Switch } from "@/components/ui/switch.jsx";
import { Plus, Trash2, Image as ImageIcon, X } from "lucide-react";
import { useStoreConfig } from "@/contexts/StoreConfigurationContext.jsx";
import { Skeleton } from "@/components/ui/skeleton.jsx";
import CollapsibleCard from "@/components/ui/CollapsibleCard.jsx";
import { showSuccess, showError } from "@/utils/toast.js";
import { uploadSingleImage } from "@/utils/upload.js";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.jsx";

const HeaderSettingsSection = () => {
  const { config, isLoading, updateNested, save, isUpdating } = useStoreConfig();
  const logoInputRef = React.useRef(null);

  if (isLoading || !config) {
    return (
      <div className="space-y-6">
        <CollapsibleCard title="Top Bar Settings">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-20 w-full" />
        </CollapsibleCard>
        <CollapsibleCard title="Utility Bar Settings">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </CollapsibleCard>
        <CollapsibleCard title="Main Navigation Settings">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-20 w-full" />
        </CollapsibleCard>
      </div>
    );
  }

  const header = config.layout_settings?.header || {};
  const topBar = header.topBar || {};
  const utilityBar = header.utilityBar || {};
  const mainNav = header.mainNav || {}; // Still needed for logo and icons
  const navItems = header.navItems || []; // THIS IS THE ONE TO EDIT

  // --- Top Bar Handlers ---
  const handleAddTopBarMessage = () => {
    updateNested('layout_settings.header.topBar.messages', [...topBar.messages, ""]);
  };

  const handleUpdateTopBarMessage = (index, value) => {
    const newMessages = [...topBar.messages];
    newMessages[index] = value;
    updateNested('layout_settings.header.topBar.messages', newMessages);
  };

  const handleRemoveTopBarMessage = (index) => {
    const newMessages = topBar.messages.filter((_, i) => i !== index);
    updateNested('layout_settings.header.topBar.messages', newMessages);
  };

  // --- Main Nav Handlers (for logo and icons) ---
  const handleUploadLogo = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    try {
      const { imageUrl } = await uploadSingleImage(file);
      updateNested('layout_settings.header.mainNav.logoUrl', imageUrl); // Correct path for logo
      save(); // Save immediately after successful upload
    } catch (error) {
      // Error is handled by the toast in the upload utility
    }
  };

  const handleRemoveLogo = () => {
    updateNested('layout_settings.header.mainNav.logoUrl', ''); // Correct path for logo
    save();
    showError("Logo removed.");
  };

  // --- Navigation Items Handlers (for the new structure) ---
  const handleAddNavItem = () => {
    updateNested('layout_settings.header.navItems', [...navItems, { title: '', path: '', type: 'link' }]);
  };

  const handleUpdateNavItem = (index, field, value) => {
    const newNavItems = [...navItems];
    newNavItems[index] = { ...newNavItems[index], [field]: value };
    updateNested('layout_settings.header.navItems', newNavItems);
  };

  const handleRemoveNavItem = (index) => {
    const newNavItems = navItems.filter((_, i) => i !== index);
    updateNested('layout_settings.header.navItems', newNavItems);
  };

  const handleAddSubLink = (navItemIndex) => {
    const newNavItems = [...navItems];
    if (!newNavItems[navItemIndex].subLinks) {
      newNavItems[navItemIndex].subLinks = [];
    }
    newNavItems[navItemIndex].subLinks = [...newNavItems[navItemIndex].subLinks, { title: '', path: '' }];
    updateNested('layout_settings.header.navItems', newNavItems);
  };

  const handleUpdateSubLink = (navItemIndex, subLinkIndex, field, value) => {
    const newNavItems = [...navItems];
    newNavItems[navItemIndex].subLinks[subLinkIndex] = { ...newNavItems[navItemIndex].subLinks[subLinkIndex], [field]: value };
    updateNested('layout_settings.header.navItems', newNavItems);
  };

  const handleRemoveSubLink = (navItemIndex, subLinkIndex) => {
    const newNavItems = [...navItems];
    newNavItems[navItemIndex].subLinks = newNavItems[navItemIndex].subLinks.filter((_, i) => i !== subLinkIndex);
    updateNested('layout_settings.header.navItems', newNavItems);
  };

  // --- Mega Menu Column Handlers ---
  const handleAddMenuColumn = (navItemIndex) => {
    const newNavItems = [...navItems];
    if (!newNavItems[navItemIndex].menuColumns) {
      newNavItems[navItemIndex].menuColumns = [];
    }
    newNavItems[navItemIndex].menuColumns = [...newNavItems[navItemIndex].menuColumns, { title: `Column ${newNavItems[navItemIndex].menuColumns.length + 1}`, path: '#', subCategories: [] }];
    updateNested('layout_settings.header.navItems', newNavItems);
  };

  const handleRemoveMenuColumn = (navItemIndex, colIndex) => {
    const newNavItems = [...navItems];
    newNavItems[navItemIndex].menuColumns = newNavItems[navItemIndex].menuColumns.filter((_, i) => i !== colIndex);
    updateNested('layout_settings.header.navItems', newNavItems);
  };

  const handleUpdateMenuColumnField = (navItemIndex, colIndex, field, value) => {
    const newNavItems = [...navItems];
    newNavItems[navItemIndex].menuColumns[colIndex] = { ...newNavItems[navItemIndex].menuColumns[colIndex], [field]: value };
    updateNested('layout_settings.header.navItems', newNavItems);
  };

  const handleAddMenuColumnSubCategory = (navItemIndex, colIndex) => {
    const newNavItems = [...navItems];
    if (!newNavItems[navItemIndex].menuColumns[colIndex].subCategories) {
      newNavItems[navItemIndex].menuColumns[colIndex].subCategories = [];
    }
    newNavItems[navItemIndex].menuColumns[colIndex].subCategories = [...newNavItems[navItemIndex].menuColumns[colIndex].subCategories, { title: '', path: '' }];
    updateNested('layout_settings.header.navItems', newNavItems);
  };

  const handleUpdateMenuColumnSubCategory = (navItemIndex, colIndex, subCatIndex, field, value) => {
    const newNavItems = [...navItems];
    newNavItems[navItemIndex].menuColumns[colIndex].subCategories[subCatIndex] = { ...newNavItems[navItemIndex].menuColumns[colIndex].subCategories[subCatIndex], [field]: value };
    updateNested('layout_settings.header.navItems', newNavItems);
  };

  const handleRemoveMenuColumnSubCategory = (navItemIndex, colIndex, subCatIndex) => {
    const newNavItems = [...navItems];
    newNavItems[navItemIndex].menuColumns[colIndex].subCategories = newNavItems[navItemIndex].menuColumns[colIndex].subCategories.filter((_, i) => i !== subCatIndex);
    updateNested('layout_settings.header.navItems', newNavItems);
  };


  return (
    <div className="space-y-6">
      {/* Top Bar Settings */}
      <CollapsibleCard title="Top Bar Settings">
        <div className="flex items-center justify-between mb-4">
          <Label htmlFor="topBarEnabled" className="text-base">
            Enable Top Bar
          </Label>
          <Switch
            id="topBarEnabled"
            checked={topBar.enabled}
            onCheckedChange={(checked) => updateNested('layout_settings.header.topBar.enabled', checked)}
            disabled={isUpdating}
          />
        </div>
        <h3 className="text-lg font-semibold mb-2">Messages</h3>
        <div className="space-y-2 mb-4">
          {topBar.messages.map((message, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                value={message}
                onChange={(e) => handleUpdateTopBarMessage(index, e.target.value)}
                placeholder="Enter message"
                disabled={isUpdating}
              />
              <Button variant="outline" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleRemoveTopBarMessage(index)} disabled={isUpdating}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
        <Button variant="outline" onClick={handleAddTopBarMessage} disabled={isUpdating}>
          <Plus className="h-4 w-4 mr-2" />
          Add Message
        </Button>
      </CollapsibleCard>

      {/* Utility Bar Settings */}
      <CollapsibleCard title="Utility Bar Settings">
        <div className="flex items-center justify-between mb-4">
          <Label htmlFor="utilityBarEnabled" className="text-base">
            Enable Utility Bar
          </Label>
          <Switch
            id="utilityBarEnabled"
            checked={utilityBar.enabled}
            onCheckedChange={(checked) => updateNested('layout_settings.header.utilityBar.enabled', checked)}
            disabled={isUpdating}
          />
        </div>
        <div className="mb-4">
          <Label htmlFor="announcementText">Announcement Text</Label>
          <Input
            id="announcementText"
            value={utilityBar.announcementText}
            onChange={(e) => updateNested('layout_settings.header.utilityBar.announcementText', e.target.value)}
            placeholder="Add anything here or just remove it..."
            className="mt-1"
            disabled={isUpdating}
          />
        </div>
        <div className="flex items-center justify-between mb-2">
          <Label htmlFor="showLanguageSelector" className="text-sm">
            Show Language Selector
          </Label>
          <Switch
            id="showLanguageSelector"
            checked={utilityBar.showLanguageSelector}
            onCheckedChange={(checked) => updateNested('layout_settings.header.utilityBar.showLanguageSelector', checked)}
            disabled={isUpdating}
          />
        </div>
        <div className="flex items-center justify-between mb-2">
          <Label htmlFor="showCurrencySelector" className="text-sm">
            Show Currency Selector
          </Label>
          <Switch
            id="showCurrencySelector"
            checked={utilityBar.showCurrencySelector}
            onCheckedChange={(checked) => updateNested('layout_settings.header.utilityBar.showCurrencySelector', checked)}
            disabled={isUpdating}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="showAuthLinks" className="text-sm">
            Show Login/Register Links
          </Label>
          <Switch
            id="showAuthLinks"
            checked={utilityBar.showAuthLinks}
            onCheckedChange={(checked) => updateNested('layout_settings.header.utilityBar.showAuthLinks', checked)}
            disabled={isUpdating}
          />
        </div>
      </CollapsibleCard>

      {/* Main Navigation Settings */}
      <CollapsibleCard title="Main Navigation Settings">
        <div className="flex items-center justify-between mb-4">
          <Label htmlFor="mainNavEnabled" className="text-base">
            Enable Main Navigation
          </Label>
          <Switch
            id="mainNavEnabled"
            checked={mainNav.enabled}
            onCheckedChange={(checked) => updateNested('layout_settings.header.mainNav.enabled', checked)}
            disabled={isUpdating}
          />
        </div>
        <h3 className="text-lg font-semibold mb-2">Shop Logo</h3>
        <div className="flex flex-col items-center justify-center p-4 border rounded-md mb-4 min-h-[120px]">
          {mainNav.logoUrl ? (
            <img src={mainNav.logoUrl} alt="Shop Logo" className="h-16 object-contain mb-2" />
          ) : (
            <p className="text-muted-foreground">No logo uploaded.</p>
          )}
          <p className="text-sm text-muted-foreground">Recommended size is 100×30 pixels. Max size: 4MB.</p>
        </div>
        <input
          type="file"
          ref={logoInputRef}
          onChange={handleUploadLogo}
          accept="image/png, image/jpeg, image/gif"
          style={{ display: 'none' }}
          disabled={isUpdating}
        />
        <div className="flex gap-2 mb-6">
          <Button variant="outline" className="flex-1" onClick={() => logoInputRef.current.click()} disabled={isUpdating}>
            <ImageIcon className="h-4 w-4 mr-2" />
            {mainNav.logoUrl ? "Change Logo" : "Upload Logo"}
          </Button>
          {mainNav.logoUrl && (
            <Button variant="destructive" className="flex-1" onClick={handleRemoveLogo} disabled={isUpdating}>
              <X className="h-4 w-4 mr-2" />
              Remove Logo
            </Button>
          )}
        </div>

        <h3 className="text-lg font-semibold mt-6 mb-2">Navigation Items</h3>
        <div className="space-y-4 mb-4">
          {navItems.map((item, itemIndex) => (
            <div key={itemIndex} className="border p-4 rounded-md relative">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 text-destructive hover:text-destructive"
                onClick={() => handleRemoveNavItem(itemIndex)}
                disabled={isUpdating}
              >
                <X className="h-4 w-4" />
              </Button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <Label htmlFor={`navTitle-${itemIndex}`}>Title</Label>
                  <Input
                    id={`navTitle-${itemIndex}`}
                    value={item.title}
                    onChange={(e) => handleUpdateNavItem(itemIndex, 'title', e.target.value)}
                    placeholder="e.g., Home, Shop"
                    className="mt-1"
                    disabled={isUpdating}
                  />
                </div>
                <div>
                  <Label htmlFor={`navPath-${itemIndex}`}>Path/URL</Label>
                  <Input
                    id={`navPath-${itemIndex}`}
                    value={item.path}
                    onChange={(e) => handleUpdateNavItem(itemIndex, 'path', e.target.value)}
                    placeholder="/home or https://example.com"
                    className="mt-1"
                    disabled={isUpdating}
                  />
                </div>
              </div>
              <div className="mb-4">
                <Label htmlFor={`navType-${itemIndex}`}>Navigation Type</Label>
                <Select
                  value={item.type || 'link'}
                  onValueChange={(value) => handleUpdateNavItem(itemIndex, 'type', value)}
                  disabled={isUpdating}
                >
                  <SelectTrigger id={`navType-${itemIndex}`} className="mt-1">
                    <SelectValue placeholder="Select Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="link">Simple Link</SelectItem>
                    <SelectItem value="dropdown">Dropdown</SelectItem>
                    <SelectItem value="mega-menu">Mega Menu</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {(item.type === "dropdown" && item.subLinks) && (
                <div className="ml-4 border-l pl-4 space-y-2">
                  <h4 className="font-medium mb-2">Dropdown Items</h4>
                  {(item.subLinks || []).map((subLink, subLinkIndex) => (
                    <div key={subLinkIndex} className="flex items-center gap-2">
                      <Input
                        value={subLink.title}
                        onChange={(e) => handleUpdateSubLink(itemIndex, subLinkIndex, 'title', e.target.value)}
                        placeholder="Dropdown Item Title"
                        disabled={isUpdating}
                      />
                      <Input
                        value={subLink.path}
                        onChange={(e) => handleUpdateSubLink(itemIndex, subLinkIndex, 'path', e.target.value)}
                        placeholder="Dropdown Item Path"
                        disabled={isUpdating}
                      />
                      <Button variant="outline" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleRemoveSubLink(itemIndex, subLinkIndex)} disabled={isUpdating}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" onClick={() => handleAddSubLink(itemIndex)} disabled={isUpdating}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Dropdown Item
                  </Button>
                </div>
              )}

              {(item.type === "mega-menu" && item.menuColumns) && (
                <div className="ml-4 border-l pl-4 space-y-4">
                  <h4 className="font-medium mb-2">Mega Menu Columns</h4>
                  {(item.menuColumns || []).map((column, colIndex) => (
                    <div key={colIndex} className="border p-3 rounded-md relative">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 text-destructive hover:text-destructive"
                        onClick={() => handleRemoveMenuColumn(itemIndex, colIndex)}
                        disabled={isUpdating}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <div className="mb-3">
                        <Label htmlFor={`colTitle-${itemIndex}-${colIndex}`}>Column Title</Label>
                        <Input
                          id={`colTitle-${itemIndex}-${colIndex}`}
                          value={column.title}
                          onChange={(e) => handleUpdateMenuColumnField(itemIndex, colIndex, 'title', e.target.value)}
                          placeholder={`Column ${colIndex + 1} Title`}
                          className="mt-1"
                          disabled={isUpdating}
                        />
                      </div>
                      <div className="mb-3">
                        <Label htmlFor={`colPath-${itemIndex}-${colIndex}`}>Column Path (Optional)</Label>
                        <Input
                          id={`colPath-${itemIndex}-${colIndex}`}
                          value={column.path}
                          onChange={(e) => handleUpdateMenuColumnField(itemIndex, colIndex, 'path', e.target.value)}
                          placeholder={`Column ${colIndex + 1} Path`}
                          className="mt-1"
                          disabled={isUpdating}
                        />
                      </div>
                      <h5 className="font-medium text-sm mb-2">Sub-categories</h5>
                      {(column.subCategories || []).map((subCat, subCatIndex) => (
                        <div key={subCatIndex} className="flex items-center gap-2 mb-2">
                          <Input
                            value={subCat.title}
                            onChange={(e) => handleUpdateMenuColumnSubCategory(itemIndex, colIndex, subCatIndex, 'title', e.target.value)}
                            placeholder="Sub-category Title"
                            disabled={isUpdating}
                          />
                          <Input
                            value={subCat.path}
                            onChange={(e) => handleUpdateMenuColumnSubCategory(itemIndex, colIndex, subCatIndex, 'path', e.target.value)}
                            placeholder="Sub-category Path"
                            disabled={isUpdating}
                          />
                          <Button variant="outline" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleRemoveMenuColumnSubCategory(itemIndex, colIndex, subCatIndex)} disabled={isUpdating}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button variant="outline" size="sm" onClick={() => handleAddMenuColumnSubCategory(itemIndex, colIndex)} disabled={isUpdating}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Sub-category
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" className="mt-4" onClick={() => handleAddMenuColumn(itemIndex)} disabled={isUpdating}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Column
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
        <Button variant="outline" onClick={handleAddNavItem} disabled={isUpdating}>
          <Plus className="h-4 w-4 mr-2" />
          Add Navigation Item
        </Button>

        <h3 className="text-lg font-semibold mt-6 mb-2">Utility Icons</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="showGridIcon" className="text-sm">
              Show Grid Icon
            </Label>
            <Switch
              id="showGridIcon"
              checked={mainNav.showGridIcon}
              onCheckedChange={(checked) => updateNested('layout_settings.header.mainNav.showGridIcon', checked)}
              disabled={isUpdating}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="showCartIcon" className="text-sm">
              Show Cart Icon
            </Label>
            <Switch
              id="showCartIcon"
              checked={mainNav.showCartIcon}
              onCheckedChange={(checked) => updateNested('layout_settings.header.mainNav.showCartIcon', checked)}
              disabled={isUpdating}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="showWishlistIcon" className="text-sm">
              Show Wishlist Icon
            </Label>
            <Switch
              id="showWishlistIcon"
              checked={mainNav.showWishlistIcon}
              onCheckedChange={(checked) => updateNested('layout_settings.header.mainNav.showWishlistIcon', checked)}
              disabled={isUpdating}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="showCompareIcon" className="text-sm">
              Show Compare Icon
            </Label>
            <Switch
              id="showCompareIcon"
              checked={mainNav.showCompareIcon}
              onCheckedChange={(checked) => updateNested('layout_settings.header.mainNav.showCompareIcon', checked)}
              disabled={isUpdating}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="showSearchIcon" className="text-sm">
              Show Search Icon
            </Label>
            <Switch
              id="showSearchIcon"
              checked={mainNav.showSearchIcon}
              onCheckedChange={(checked) => updateNested('layout_settings.header.mainNav.showSearchIcon', checked)}
              disabled={isUpdating}
            />
          </div>
        </div>
      </CollapsibleCard>

      <div className="flex justify-end mt-8">
        <Button onClick={save} disabled={isUpdating}>
          {isUpdating ? 'Saving...' : 'Save Header Settings'}
        </Button>
      </div>
    </div>
  );
};

export default HeaderSettingsSection;