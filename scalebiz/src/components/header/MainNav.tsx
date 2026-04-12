"use client";

import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Grid, ShoppingCart, Heart, RefreshCw, Search, ChevronDown, Menu } from "lucide-react";
import { cn } from "@/lib/utils.js";
import { showInfo } from "@/utils/toast.js";

interface NavItem {
  title: string;
  path: string;
  type?: "link" | "dropdown" | "mega-menu";
  subLinks?: { path: string; title: string }[];
  menuColumns?: { title: string; path: string; subCategories: { path: string; title: string }[] }[];
}

interface CategoryItem {
  id: number;
  name: string;
  path: string;
  imageUrl?: string;
  subCategories?: { path: string; title: string }[];
}

interface MainNavProps {
  logoUrl: string;
  navItems: NavItem[];
  categories?: CategoryItem[];
  showGridIcon: boolean;
  showCartIcon: boolean;
  showWishlistIcon: boolean;
  showCompareIcon: boolean;
  showSearchIcon: boolean;
  showCategorySidebar: boolean;
  categorySidebarPosition?: "left" | "right" | "hidden";
  enabled: boolean;
  onCategorySidebarToggle?: () => void;
}

const MainNav: React.FC<MainNavProps> = ({
  logoUrl,
  navItems,
  categories = [],
  showGridIcon,
  showCartIcon,
  showWishlistIcon,
  showCompareIcon,
  showSearchIcon,
  showCategorySidebar,
  categorySidebarPosition = "left",
  enabled,
  onCategorySidebarToggle,
}) => {
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

  // Debug logging
  console.log("MainNav props:", {
    enabled,
    showCategorySidebar,
    categorySidebarPosition,
    categoriesCount: categories?.length,
    categories: categories?.slice(0, 3),
  });

  if (!enabled) return null;

  return (
    <nav className="bg-white py-4 px-4 border-b shadow-sm">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center">
            <img src={logoUrl} alt="Shop Logo" className="h-8 w-auto" />
          </Link>
          
          {/* Category Dropdown */}
          {showCategorySidebar && categories && categories.length > 0 && (
            <DropdownMenu open={isCategoryDropdownOpen} onOpenChange={setIsCategoryDropdownOpen}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="text-base font-medium flex items-center gap-2"
                >
                  <Menu className="h-4 w-4" />
                  All Categories
                  <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[300px] p-0">
                {categories.map((category) => (
                  <DropdownMenuItem key={category.id} asChild className="cursor-pointer">
                    <Link to={category.path} onClick={() => setIsCategoryDropdownOpen(false)}>
                      <div className="flex items-center gap-3">
                        {category.imageUrl && (
                          <img
                            src={category.imageUrl}
                            alt={category.name}
                            className="h-8 w-8 object-cover rounded"
                          />
                        )}
                        <span className="flex-1">{category.name}</span>
                        {category.subCategories && category.subCategories.length > 0 && (
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          
          <ul className="hidden lg:flex items-center space-x-6">
            {navItems.map((item, index) => (
              <li key={index}>
                {item.type === "dropdown" || item.type === "mega-menu" ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="text-base font-medium">
                        {item.title} <ChevronDown className="ml-1 h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {item.type === "dropdown" && item.subLinks?.map((subLink, subIndex) => (
                        <DropdownMenuItem key={subIndex} asChild>
                          <Link to={subLink.path}>{subLink.title}</Link>
                        </DropdownMenuItem>
                      ))}
                      {item.type === "mega-menu" && item.menuColumns?.map((column, colIndex) => (
                        // For mega-menu, simplify to just showing subCategories from all columns as flat list
                        <React.Fragment key={colIndex}>
                          {column.subCategories?.map((subCat, subCatIndex) => (
                            <DropdownMenuItem key={`${colIndex}-${subCatIndex}`} asChild>
                              <Link to={subCat.path}>{subCat.title}</Link>
                            </DropdownMenuItem>
                          ))}
                        </React.Fragment>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Button variant="ghost" asChild className="text-base font-medium">
                    <Link to={item.path}>{item.title}</Link>
                  </Button>
                )}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex items-center gap-2">
          {showGridIcon && (
            <Button variant="ghost" size="icon" onClick={() => showInfo("Grid icon clicked")}>
              <Grid className="h-5 w-5" />
            </Button>
          )}
          {showCartIcon && (
            <Button variant="ghost" size="icon" onClick={() => showInfo("Shopping cart clicked")}>
              <ShoppingCart className="h-5 w-5" />
            </Button>
          )}
          {showWishlistIcon && (
            <Button variant="ghost" size="icon" onClick={() => showInfo("Wishlist clicked")}>
              <Heart className="h-5 w-5" />
            </Button>
          )}
          {showCompareIcon && (
            <Button variant="ghost" size="icon" onClick={() => showInfo("Compare clicked")}>
              <RefreshCw className="h-5 w-5" />
            </Button>
          )}
          {showSearchIcon && (
            <Button variant="ghost" size="icon" onClick={() => showInfo("Search clicked")}>
              <Search className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default MainNav;