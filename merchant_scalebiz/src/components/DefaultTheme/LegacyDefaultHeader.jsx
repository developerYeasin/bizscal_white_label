"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
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
import LanguageSwitcher from "../LanguageSwitcher";
import CurrencySwitcher from "../CurrencySwitcher";
import { useTranslation } from "react-i18next";
import { useStorePath } from "@/hooks/use-store-path";
import MarqueeSection from "../AnnouncementBar/MarqueeSection";
import AnnouncementBar from "../AnnouncementBar/AnnouncementBar";

const LegacyDefaultHeader = ({
  layout,
  storeName,
  logoUrl,
  onOpenCartSidebar,
  announcements, // Accept announcements prop
}) => {
  const { t, i18n } = useTranslation();
  const { cartItems } = useCart();
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const [activeMenu, setActiveMenu] = useState(null);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const menuTimeoutRef = useRef(null);
  const isMobile = useIsMobile();
  const getPath = useStorePath();

  const navItems = layout?.header?.navItems || [];
  const headerLogoUrl = layout?.header?.mainNav?.logoUrl || logoUrl;

  const handleMenuEnter = (index) => {
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

  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = useCallback(() => {
    if (window.scrollY > 200) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, [toggleVisibility]);

  const enabledAnnouncements = announcements.filter((ann) => ann.enabled);

  return (
    <>
      <header className="bg-background text-foreground top-0 z-40 border-b border-border">
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
                className={`bg-primary text-secondary`} // Default classes, overridden by inline style
                messages={[announcement.text]} // MarqueeSection expects an array of messages
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

          {!isMobile && (
            <nav className="hidden md:flex ml-8">
              <ul className="flex items-center space-x-1">
                {navItems.map((item, index) => (
                  <li
                    key={index}
                    className="relative"
                    onMouseEnter={() => handleMenuEnter(index)}
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
                            { "rotate-180": activeMenu === index }
                          )}
                          aria-hidden="true"
                        />
                      )}
                    </Link>

                    {activeMenu === index &&
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
                                            onClick={() => setActiveMenu(null)}
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
                ))}
              </ul>
            </nav>
          )}

          {!isMobile && (
            <div className="relative flex-grow mx-8 max-w-xl hidden lg:flex ml-auto">
              <Button
                variant="outline"
                className="w-full justify-start text-muted-foreground pl-4 pr-12 py-2 h-12"
                onClick={() => setIsSearchModalOpen(true)}
              >
                <Search className="h-5 w-5 mr-2" />
                {t("enter_keyword")}
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
              onClick={onOpenCartSidebar}
              className="relative"
            >
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
                  <span className="sr-only">{t("toggle_menu")}</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-full sm:max-w-xs">
                <SheetHeader>
                  <SheetTitle className="text-xl font-semibold text-dynamic-primary-color uppercase">
                    {t("megamenu")}
                  </SheetTitle>
                </SheetHeader>
                <MobileMenu
                  navItems={navItems}
                  onClose={() => setIsMobileNavOpen(false)}
                  getPath={getPath}
                />
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
      <header
        className={`bg-background text-foreground z-40 border-b border-border fixed left-0 w-full transition-all ease-in-out duration-500  ${
          isVisible
            ? "top-0 opacity-100 visible "
            : "-top-[200px] opacity-0 invisible"
        }`}
      >
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

          {!isMobile && (
            <nav className="hidden md:flex ml-8">
              <ul className="flex items-center space-x-1">
                {navItems.map((item, index) => (
                  <li
                    key={index}
                    className="relative"
                    onMouseEnter={() => handleMenuEnter(index)}
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
                            { "rotate-180": activeMenu === index }
                          )}
                          aria-hidden="true"
                        />
                      )}
                    </Link>

                    {activeMenu === index &&
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
                                            onClick={() => setActiveMenu(null)}
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
                ))}
              </ul>
            </nav>
          )}

          {!isMobile && (
            <div className="relative flex-grow mx-8 max-w-xl hidden lg:flex">
              <Button
                variant="outline"
                className="w-full justify-start text-muted-foreground pl-4 pr-12 py-2 h-12"
                onClick={() => setIsSearchModalOpen(true)}
              >
                <Search className="h-5 w-5 mr-2" />
                {t("enter_keyword")}
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
              onClick={onOpenCartSidebar}
              className="relative"
            >
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
                  <span className="sr-only">{t("toggle_menu")}</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-full sm:max-w-xs">
                <SheetHeader>
                  <SheetTitle className="text-xl font-semibold text-dynamic-primary-color uppercase">
                    {t("megamenu")}
                  </SheetTitle>
                </SheetHeader>
                <MobileMenu
                  navItems={navItems}
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

export default LegacyDefaultHeader;
