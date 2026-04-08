"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
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

const PremiumHeader = ({ layout, storeName, logoUrl, themeId }) => {
  const { cartItems } = useCart();
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const [activeMenu, setActiveMenu] = useState(null);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false); // For sticky header
  const menuTimeoutRef = useRef(null);
  const isMobile = useIsMobile();

  const navItems = layout?.header?.navItems || [];
  const headerLogoUrl = layout?.header?.mainNav?.logoUrl || logoUrl;
  const topBarConfig = layout?.header?.topBar;
  const utilityBarConfig = layout?.header?.utilityBar;
  const mainNavConfig = layout?.header?.mainNav;

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
    toast.info("This feature is coming soon!");
  };

  const toggleVisibility = useCallback(() => {
    if (window.scrollY > 200) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, [toggleVisibility]);

  return (
    <>
      <header className="bg-background text-foreground">
        {/* Marketing Banner (Top Bar) */}
        {topBarConfig?.enabled &&
          topBarConfig.messages &&
          topBarConfig.messages.length > 0 && (
            <div className="marketing-banner-gradient text-white text-xs py-1.5 text-center hidden md:block">
              <div className="container mx-auto flex justify-center items-center space-x-6">
                {topBarConfig.messages.map((message, index) => (
                  <span key={index}>{message}</span>
                ))}
              </div>
            </div>
          )}

        {/* Utility Bar */}
        {utilityBarConfig?.enabled && (
          <div className="bg-white border-b border-gray-200 py-2 px-6 hidden md:block">
            <div className="container mx-auto flex items-center justify-between text-sm text-gray-800">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <Headphones className="h-4 w-4 mr-1 text-dynamic-primary-color" />
                  <span>Support: (+64) 123 456 7890</span>
                </div>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-1 text-dynamic-primary-color" />
                  <span>Email: Contacts@yoursite.com</span>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                {utilityBarConfig.showCurrencySelector && (
                  <button
                    onClick={showComingSoon}
                    className="flex items-center hover:text-dynamic-primary-color"
                  >
                    $ USD <ChevronDown className="h-3 w-3 ml-1" />
                  </button>
                )}
                {utilityBarConfig.showLanguageSelector && (
                  <button
                    onClick={showComingSoon}
                    className="flex items-center hover:text-dynamic-primary-color"
                  >
                    <img
                      src="https://elessi.b-cdn.net/elementor/wp-content/uploads/2019/02/en.png"
                      alt="English"
                      className="h-4 w-4 mr-1"
                    />
                    English <ChevronDown className="h-3 w-3 ml-1" />
                  </button>
                )}
                {(utilityBarConfig.showLanguageSelector ||
                  utilityBarConfig.showCurrencySelector) &&
                  utilityBarConfig.showAuthLinks && (
                    <span className="h-4 border-l border-gray-300"></span>
                  )}
                {utilityBarConfig.showAuthLinks && (
                  <Link
                    to="/login"
                    className="flex items-center hover:text-dynamic-primary-color"
                  >
                    <User className="h-4 w-4 mr-1" /> Your account
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Main Header Row (Logo, Search, Icons) */}
        <div className="sticky top-0 z-40 bg-background border-b border-border">
          <div className="container mx-auto flex items-center py-4 px-6">
            <Link to="/" className="flex items-center flex-shrink-0">
              {headerLogoUrl ? (
                <img
                  src={headerLogoUrl}
                  alt={storeName}
                  className="h-10 mr-2"
                />
              ) : (
                <span className="text-xl font-bold text-foreground">
                  {storeName}
                </span>
              )}
            </Link>

            {!isMobile && (
              <div className="relative flex-grow mx-8 max-w-xl hidden lg:flex ml-auto">
                <Button
                  variant="outline"
                  className="w-full justify-start text-muted-foreground pl-4 pr-12 py-2 h-12"
                  onClick={() => setIsSearchModalOpen(true)}
                >
                  <Search className="h-5 w-5 mr-2" />
                  Enter your keyword...
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
              {mainNavConfig?.showWishlistIcon && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="hidden md:flex"
                  onClick={showComingSoon}
                >
                  <Heart className="h-6 w-6" />
                </Button>
              )}
              {mainNavConfig?.showCartIcon && (
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
              )}
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
                    navItems={navItems}
                    onClose={() => setIsMobileNavOpen(false)}
                  />
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>

        {/* Bottom Navigation Row */}
        <div className="bg-dynamic-primary-color text-dynamic-secondary-color py-3 px-6 hidden md:flex items-center">
          <div className="container mx-auto flex items-center">
            <Button
              variant="ghost"
              className="flex items-center gap-2 bg-dynamic-primary-color text-dynamic-secondary-color p-3 font-semibold text-lg -ml-6 pr-6 cursor-pointer hover:bg-dynamic-primary-color/90"
              onClick={showComingSoon}
            >
              <Menu className="h-5 w-5" />
              ALL CATEGORIES
              <ChevronDown className="h-4 w-4" />
            </Button>

            <nav className="flex-grow flex justify-center">
              <ul className="flex items-center space-x-1">
                {navItems.map((item, index) => (
                  <li
                    key={index}
                    className="relative"
                    onMouseEnter={() => handleMenuEnter(index)}
                    onMouseLeave={handleMenuLeave}
                  >
                    <Link
                      to={item.path || "#"}
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
                ))}
              </ul>
            </nav>

            <div className="flex items-center space-x-4">
              <Link
                to="/buy"
                className="text-sm font-bold px-3 py-1 rounded-full bg-blue-500 text-white"
              >
                ONLY $69 BUY
              </Link>
            </div>
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

export default PremiumHeader;