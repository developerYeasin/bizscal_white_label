"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { Link, useLocation } from "react-router-dom"; // Import useLocation
import {
  ShoppingCart,
  Heart,
  RefreshCw,
  Search,
  ChevronDown,
  Menu,
  Headphones,
  Mail,
  User, // Added User icon import
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MobileMenu } from "../MobileMenu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useTranslation } from "react-i18next";

const StickyHeader = ({
  navItems,
  headerLogoUrl,
  storeName,
  getPath,
  onOpenCartSidebar,
  isMobileNavOpen,
  setIsMobileNavOpen,
  totalItems,
  mainNavConfig,
  handleMenuLeave = () => {},
  activeMenu,
  handleMenuEnter,
}) => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = useCallback(() => {
    if (window.scrollY > 200) {
      // Show button after scrolling 300px down
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

  return (
    <div
      className={`fixed  left-0 w-full duration-500 transition-all ease-in-out z-40 bg-background border-b border-border ${
        isVisible ? "top-0 opacity-100 visible " : "-top-[200px] opacity-0 invisible"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        <Sheet open={isMobileNavOpen} onOpenChange={setIsMobileNavOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden  ">
              <Menu className="!h-7 !w-7" />
              <span className="sr-only">{t("toggle_menu")}</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[95%] sm:max-w-xs">
            <SheetHeader>
              <SheetTitle className="text-xl font-semibold text-dynamic-primary-color uppercase">
                {t("megamenu")}
              </SheetTitle>
            </SheetHeader>
            <MobileMenu
              navItems={navItems}
              onClose={() => setIsMobileNavOpen(false)}
              getPath={getPath} // Pass getPath to MobileMenu
            />
          </SheetContent>
        </Sheet>
        <Link to={getPath("/")} className="flex items-center flex-shrink-0">
          {headerLogoUrl ? (
            <img
              src={headerLogoUrl}
              alt={storeName}
              className="h-7 sm:h-7 md:h-10 mr-2"
            />
          ) : (
            <span className="text-xl font-bold text-foreground">
              {storeName}
            </span>
          )}
        </Link>
        <nav className=" flex-grow hidden lg:flex  justify-center">
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
                  className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-dynamic-secondary-color/20 focus:bg-dynamic-secondary-color/20 focus:outline-none"
                >
                  {item.title}
                  {item.title === "SHOP" && (
                    <span className="ml-2 px-2 py-0.5 text-xs font-bold rounded-full bg-red-500 text-white">
                      HOT
                    </span>
                  )}
                  {item.title === "ELEMENTS" && (
                    <span className="ml-2 px-2 py-0.5 text-xs font-bold rounded-full bg-purple-500 text-white">
                      52+ WIDGETS
                    </span>
                  )}
                  {(item.type === "dropdown" || item.type === "mega-menu") && (
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
                  (item.type === "dropdown" || item.type === "mega-menu") && (
                    <div className="absolute top-full z-[99] left-1/2 -translate-x-1/2 mt-2 w-max rounded-md shadow-lg bg-background border border-border animate-in fade-in-0 zoom-in-95">
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
                                {col.subCategories.map((subCat, subIndex) => (
                                  <li key={subIndex}>
                                    <Link
                                      to={getPath(subCat.path)}
                                      className="text-sm text-muted-foreground hover:text-dynamic-primary-color transition-colors block p-1 rounded-sm"
                                      onClick={() => setActiveMenu(null)}
                                    >
                                      {subCat.title}
                                    </Link>
                                  </li>
                                ))}
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
        <div className="flex items-center space-x-2 md:space-x-4 flex-shrink-0 lg:ml-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSearchModalOpen(true)}
          >
            <Search className="!h-7 !w-7" />
          </Button>

          {mainNavConfig?.showCartIcon && (
            // Cart Button now opens the sidebar
            <Button
              variant="ghost"
              size="icon"
              onClick={onOpenCartSidebar}
              className="relative"
            >
              <ShoppingCart className="!h-6 !w-6" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-dynamic-primary-color text-dynamic-secondary-color rounded-full h-5 w-5 flex items-center justify-center text-xs">
                  {totalItems}
                </span>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default StickyHeader;
