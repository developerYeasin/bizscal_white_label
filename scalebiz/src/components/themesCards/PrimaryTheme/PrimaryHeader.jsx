"use client";

import React, {
  useState,
  useRef,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Heart, Search, ChevronDown, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/context/CartContext";
import { cn } from "@/lib/utils";
import { MobileMenu } from "../MobileMenu";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";
import SearchModal from "../SearchModal";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useQuery } from "@tanstack/react-query";
import { fetchCategories } from "@/lib/api.js";
import { Skeleton } from "@/components/ui/skeleton";
import MegaMenuContentColumns from "../MegaMenuContentColumns";

const PrimaryHeader = ({ layout, storeName, logoUrl }) => {
  const { cartItems } = useCart();
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const [activeMenu, setActiveMenu] = useState(null); // State for desktop mega menu
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const menuTimeoutRef = useRef(null);
  const isMobile = useIsMobile();

  const navItems = layout?.header?.navItems || [];
  const headerLogoUrl = layout?.header?.mainNav?.logoUrl || logoUrl;

  // Fetch categories for the header
  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ["headerCategories"],
    queryFn: fetchCategories,
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  const handleMenuEnter = (item, index) => {
    if (menuTimeoutRef.current) {
      clearTimeout(menuTimeoutRef.current);
    }
    setActiveMenu(index);
  };

  const handleMenuLeave = () => {
    menuTimeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 200);
  };

  const showComingSoon = () => {
    toast.info("This feature is coming soon!");
  };

  const MAX_CATEGORIES_TO_SHOW = 5;
  const visibleCategories = categories?.slice(0, MAX_CATEGORIES_TO_SHOW) || [];
  const hasMoreCategories = (categories?.length || 0) > MAX_CATEGORIES_TO_SHOW;

  // Combine categories and existing nav items for mobile menu
  const mobileNavItems = useMemo(() => {
    if (navItems.length > 0) {
      // If navItems exist, only show navItems in mobile menu
      return navItems;
    } else {
      // If navItems are empty, show categories with 'More' button logic
      const categoryLinks =
        visibleCategories.map((cat) => ({
          title: cat.name,
          path: cat.path,
          subCategories: cat.subCategories,
          type: "category",
        })) || [];

      if (hasMoreCategories) {
        categoryLinks.push({
          title: "More Categories",
          path: "/collections/all",
          type: "link",
        });
      }
      return categoryLinks;
    }
  }, [categories, navItems, visibleCategories, hasMoreCategories]);

  return (
    <>
      <header className="bg-background text-foreground sticky top-0 z-40 border-b border-border">
        <div className="container mx-auto flex items-center py-4 px-6">
          <Link to="/" className="flex items-center flex-shrink-0">
            {headerLogoUrl ? (
              <img src={headerLogoUrl} alt={storeName} className="h-10 mr-2" />
            ) : (
              <span className="text-xl font-bold text-foreground">
                {storeName}
              </span>
            )}
          </Link>

          {!isMobile && (
            <nav className="hidden md:flex ml-8">
              <ul className="flex items-center space-x-1">
                {/* Conditional: Display categories ONLY if navItems is empty */}
                {navItems.length === 0 && (
                  <>
                    {isLoadingCategories ? (
                      Array.from({ length: MAX_CATEGORIES_TO_SHOW }).map((_, i) => (
                        <li key={`cat-skeleton-${i}`} className="relative">
                          <Skeleton className="h-10 w-24 rounded-md px-4 py-2" />
                        </li>
                      ))
                    ) : (
                      visibleCategories.map((category, index) => {
                        const hasSubCategories =
                          category.subCategories && category.subCategories.length > 0;
                        const isCategoryActive = activeMenu === `category-${index}`;

                        return (
                          <li
                            key={category.id}
                            className="relative"
                            onMouseEnter={() => handleMenuEnter(category, `category-${index}`)}
                            onMouseLeave={handleMenuLeave}
                          >
                            <Link
                              to={category.path}
                              className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-dynamic-primary-color focus:bg-accent focus:text-dynamic-primary-color focus:outline-none"
                              onClick={() => setActiveMenu(null)} // Close menu on click
                            >
                              {category.name}
                              {hasSubCategories && (
                                <ChevronDown
                                  className={cn(
                                    "relative top-[1px] ml-1 h-3 w-3 transition duration-200",
                                    { "rotate-180": isCategoryActive }
                                  )}
                                  aria-hidden="true"
                                />
                              )}
                            </Link>

                            {isCategoryActive && hasSubCategories && (
                              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-max min-w-[600px] rounded-md shadow-lg bg-background border border-border animate-in fade-in-0 zoom-in-95">
                                <MegaMenuContentColumns
                                  categories={category.subCategories}
                                  onLinkClick={() => setActiveMenu(null)} // Close menu when a sub-link is clicked
                                />
                              </div>
                            )}
                          </li>
                        );
                      })
                    )}
                    {hasMoreCategories && (
                      <li>
                        <Link
                          to="/collections/all"
                          className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-dynamic-primary-color focus:bg-accent focus:text-dynamic-primary-color focus:outline-none"
                          onClick={() => setActiveMenu(null)}
                        >
                          More <ChevronDown className="relative top-[1px] ml-1 h-3 w-3 transition duration-200" />
                        </Link>
                      </li>
                    )}
                  </>
                )}

                {/* Existing Nav Items for Desktop (always shown if present) */}
                {navItems.map((item, index) => {
                  const isNavItemActive = activeMenu === `nav-${index}`;
                  return (
                    <li
                      key={index}
                      className="relative"
                      onMouseEnter={() => handleMenuEnter(item, `nav-${index}`)}
                      onMouseLeave={handleMenuLeave}
                    >
                      <Link
                        to={item.path || "#"}
                        className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-dynamic-primary-color focus:bg-accent focus:text-dynamic-primary-color focus:outline-none"
                      >
                        {item.title}
                        {(item.type === "dropdown" ||
                          item.type === "mega-menu") && (
                          <ChevronDown
                            className={cn(
                              "relative top-[1px] ml-1 h-3 w-3 transition duration-200",
                              { "rotate-180": isNavItemActive }
                            )}
                            aria-hidden="true"
                          />
                        )}
                      </Link>

                      {isNavItemActive &&
                        (item.type === "dropdown" ||
                          item.type === "mega-menu") && (
                          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-max rounded-md shadow-lg bg-background border border-border animate-in fade-in-0 zoom-in-95">
                            {item.type === "mega-menu" ? (
                              <div className="p-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-4 min-w-[700px]">
                                {item.menuColumns.map((col, colIndex) => (
                                  <div
                                    key={colIndex}
                                    className="flex flex-col space-y-2"
                                  >
                                    <h3 className="font-bold text-dynamic-primary-color text-lg mb-2">
                                      <Link
                                        to={col.path}
                                        className="hover:underline"
                                        onClick={() => setActiveMenu(null)}
                                      >
                                        {col.title}
                                      </Link>
                                    </h3>
                                    <ul className="space-y-1">
                                      {col.subCategories.map(
                                        (subCat, subIndex) => (
                                          <li key={subIndex}>
                                            <Link
                                              to={subCat.path}
                                              className="text-sm text-muted-foreground hover:text-dynamic-primary-color transition-colors block p-1 rounded-sm"
                                              onClick={() =>
                                                setActiveMenu(null)
                                              }
                                            >
                                              {subCat.title}
                                            </Link>
                                          </li>
                                        )
                                      )}
                                    </ul>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <ul className="grid w-[200px] gap-1 p-2">
                                {item.subLinks.map((link) => (
                                  <li key={link.title}>
                                    <Link
                                      to={link.path}
                                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                      onClick={() => setActiveMenu(null)}
                                    >
                                      <div className="text-sm font-medium leading-none">
                                        {link.title}
                                      </div>
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        )}
                    </li>
                  );
                })}
              </ul>
            </nav>
          )}

          {!isMobile && (
            <div className="relative flex-grow mx-8 max-w-xl hidden lg:flex ml-auto">
              <Input
                type="text"
                placeholder="Enter your keyword..."
                className="w-full pl-4 pr-12 py-2 rounded-md border border-input focus:ring-dynamic-primary-color focus:border-dynamic-primary-color"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full w-12 rounded-l-none rounded-r-md bg-dynamic-primary-color hover:bg-dynamic-primary-color/90 text-dynamic-secondary-color"
                onClick={() => setIsSearchModalOpen(true)}
              >
                <Search className="h-5 w-5" />
              </Button>
            </div>
          )}

          <div className="flex items-center space-x-2 md:space-x-4 flex-shrink-0 ml-auto lg:ml-0">
            <Button
              variant="ghost"
              size="icon"
              className="flex lg:hidden"
              onClick={() => setIsSearchModalOpen(true)}
            >
              <Search className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="hidden md:flex"
              onClick={showComingSoon}
            >
              <Heart className="h-6 w-6" />
            </Button>
            <Link to="/cart" className="relative">
              <Button variant="ghost" size="icon">
                <ShoppingCart className="h-6 w-6" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-dynamic-primary-color text-dynamic-secondary-color rounded-full h-5 w-5 flex items-center justify-center text-xs">
                    {totalItems}
                  </span>
                )}
              </Button>
            </Link>

            <Sheet open={isMobileNavOpen} onOpenChange={setIsMobileNavOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-full sm:max-w-xs">
                <SheetHeader>
                  <SheetTitle className="text-xl font-semibold text-dynamic-primary-color uppercase">
                    MEGAMENU
                  </SheetTitle>
                </SheetHeader>
                <MobileMenu
                  navItems={mobileNavItems}
                  onClose={() => setIsMobileNavOpen(false)}
                />
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
      />
    </>
  );
};

export default PrimaryHeader;