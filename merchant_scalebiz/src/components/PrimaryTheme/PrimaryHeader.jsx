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
import { showSuccess } from "@/utils/toast";
import SearchModal from "../SearchModal";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import CategorySidebar from "../CategorySidebar";
import LanguageSwitcher from "../LanguageSwitcher";
import CurrencySwitcher from "../CurrencySwitcher";
import { useTranslation } from "react-i18next";
import { useStorePath } from "@/hooks/use-store-path";
import MarqueeSection from "../AnnouncementBar/MarqueeSection"; // Import MarqueeSection
import AnnouncementBar from "../AnnouncementBar/AnnouncementBar"; // Import AnnouncementBar
import { useQuery } from "@tanstack/react-query";
import { fetchCategories } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton"; // <--- ADDED THIS LINE

const PrimaryHeader = ({ layout, storeName, logoUrl, onOpenCartSidebar, announcements }) => { // Accept announcements prop
  const { t, i18n } = useTranslation();
  const { cartItems } = useCart();
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const [activeMenu, setActiveMenu] = useState(null);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isCategoryPopoverOpen, setIsCategoryPopoverOpen] = useState(false);
  const [isCategorySheetOpen, setIsCategorySheetOpen] = useState(false);
  const menuTimeoutRef = useRef(null);
  const isMobile = useIsMobile();
  const getPath = useStorePath();

  const navItems = layout?.header?.navItems || [];
  const headerLogoUrl = layout?.header?.mainNav?.logoUrl || logoUrl;

  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ["headerCategories"],
    queryFn: fetchCategories,
    staleTime: 1000 * 60 * 60,
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
    showSuccess(t("feature_coming_soon"));
  };

  const mobileNavItems = useMemo(() => {
    const categoryLinks =
      categories?.map((cat) => ({
        title: cat.name,
        path: cat.path,
        subCategories: cat.subCategories,
        type: "category",
      })) || [];

    if (navItems.length > 0) {
      return navItems;
    } else {
      return categoryLinks;
    }
  }, [categories, navItems]);

  const enabledAnnouncements = announcements.filter(ann => ann.enabled);

  return (
    <>
      <header className="bg-background text-foreground sticky top-0 z-40 border-b border-border">
        {/* Dynamic Announcements */}
        {enabledAnnouncements.map((announcement) => {
          if (announcement.type === "alert") {
            return (
              <AnnouncementBar
                key={announcement.id}
                message={announcement.text}
                backgroundColor={announcement.background_color}
                textColor={announcement.text_color}
              />
            );
          } else if (announcement.type === "marquee") {
            return (
              <MarqueeSection
                key={announcement.id}
                className={`py-2 border-b ${isMobile ? 'block' : 'hidden md:block'}`}
                messages={[announcement.text]}
                backgroundColor={announcement.background_color}
                textColor={announcement.text_color}
              />
            );
          }
          return null;
        })}

        <div className="container mx-auto flex items-center py-4 px-6">
          <Link to={getPath("/")} className="flex items-center flex-shrink-0">
            {headerLogoUrl ? (
              <img src={headerLogoUrl} alt={storeName} className="h-10 mr-2" />
            ) : (
              <span className="text-xl font-bold text-foreground">
                {storeName}
              </span>
            )}
          </Link>

          {/* Desktop: All Categories Button (Popover) */}
          {!isMobile && (
            <Popover
              open={isCategoryPopoverOpen}
              onOpenChange={setIsCategoryPopoverOpen}
            >
              <PopoverTrigger asChild>
                <Button
                  key={`all-categories-desktop-${i18n.language}`}
                  variant="ghost"
                  className="flex items-center gap-2 text-foreground p-3 font-semibold text-lg ml-4 hover:text-dynamic-primary-color cursor-pointer"
                >
                  <Menu className="h-5 w-5" />
                  {t("all_categories")}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-[300px] p-0"
                align="start"
                sideOffset={10}
              >
                {isLoadingCategories ? (
                  <div className="p-4 space-y-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Skeleton key={i} className="h-6 w-full" />
                    ))}
                  </div>
                ) : (
                  <CategorySidebar
                    onLinkClick={() => setIsCategoryPopoverOpen(false)}
                    className="w-full"
                  />
                )}
              </PopoverContent>
            </Popover>
          )}

          {/* Mobile: All Categories Button (Sheet) */}
          {isMobile && (
            <Sheet open={isCategorySheetOpen} onOpenChange={setIsCategorySheetOpen}>
              <SheetTrigger asChild>
                {/* <Button
                  key={`all-categories-mobile-${i18n.language}`}
                  variant="ghost"
                  className="flex items-center gap-2 text-foreground p-3 font-semibold text-lg ml-4 hover:text-dynamic-primary-color cursor-pointer"
                >
                  <Menu className="h-5 w-5" />
                  {t("all_categories")}
                  <ChevronDown className="h-4 w-4" />
                </Button> */}
              </SheetTrigger>
              <SheetContent side="left" className="w-full sm:max-w-xs">
                <SheetHeader>
                  <SheetTitle className="text-xl font-semibold text-dynamic-primary-color uppercase">
                    {t("all_categories")}
                  </SheetTitle>
                </SheetHeader>
                <div className="py-4">
                  {isLoadingCategories ? (
                    <div className="p-4 space-y-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Skeleton key={i} className="h-6 w-full" />
                      ))}
                    </div>
                  ) : (
                    <CategorySidebar
                      onLinkClick={() => setIsCategorySheetOpen(false)}
                      className="w-full"
                    />
                  )}
                </div>
              </SheetContent>
            </Sheet>
          )}

          {/* Desktop: Main Navigation Items (if navItems exist) */}
          {!isMobile && navItems.length > 0 && (
            <nav className="hidden md:flex ml-8">
              <ul className="flex items-center space-x-1">
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
                        to={getPath(item.path || "#")}
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
                                        to={getPath(col.path)}
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
                                              to={getPath(subCat.path)}
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
                                      to={getPath(link.path)}
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

          {/* Search Input (Desktop) */}
          {!isMobile && (
            <div className="relative flex-grow mx-8 max-w-xl hidden lg:flex ml-auto">
              <Input
                type="text"
                placeholder={t('enter_keyword')}
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
            <LanguageSwitcher className="hidden md:flex" />
            <CurrencySwitcher className="hidden md:flex" />
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
            <Button variant="ghost" size="icon" onClick={onOpenCartSidebar} className="relative">
              <ShoppingCart className="h-6 w-6" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-dynamic-primary-color text-dynamic-secondary-color rounded-full h-5 w-5 flex items-center justify-center text-xs">
                  {totalItems}
                </span>
              )}
            </Button>

            <Sheet open={isMobileNavOpen} onOpenChange={setIsMobileNavOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">{t('toggle_menu')}</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-full sm:max-w-xs">
                <SheetHeader>
                  <SheetTitle className="text-xl font-semibold text-dynamic-primary-color uppercase">
                    {t('megamenu')}
                  </SheetTitle>
                </SheetHeader>
                <MobileMenu
                  navItems={mobileNavItems}
                  onClose={() => setIsMobileNavOpen(false)}
                  getPath={getPath}
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