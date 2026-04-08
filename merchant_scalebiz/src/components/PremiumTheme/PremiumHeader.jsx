"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ShoppingCart,
  Heart,
  RefreshCw,
  Search,
  ChevronDown,
  Menu,
  Headphones,
  Mail,
  User,
} from "lucide-react";
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
import MarqueeSection from "../AnnouncementBar/MarqueeSection";
import StickyHeader from "./StickyHeader";
import AnnouncementBar from "../AnnouncementBar/AnnouncementBar"; // Import AnnouncementBar

const PremiumHeader = ({
  layout,
  storeName,
  logoUrl,
  themeId,
  onOpenCartSidebar,
  announcements, // Accept announcements prop
}) => {
  const { t, i18n } = useTranslation();
  const { cartItems } = useCart();
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const [activeMenu, setActiveMenu] = useState(null);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [isCategoryPopoverOpen, setIsCategoryPopoverOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const menuTimeoutRef = useRef(null);
  const isMobile = useIsMobile();
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const getPath = useStorePath();

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
    showSuccess(t("feature_coming_soon"));
  };

  const enabledAnnouncements = announcements.filter((ann) => ann.enabled);

  return (
    <>
      <header className="bg-background text-foreground">
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
                className={`py-2 border-b ${
                  isMobile ? "block" : "block md:hidden"
                }`}
                messages={[announcement.text]}
                backgroundColor={announcement.background_color}
                textColor={announcement.text_color}
              />
            );
          }
          return null;
        })}
        {topBarConfig.messages.length > 0 && (
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
                  <span>{t("support")}: (+64) 123 456 7890</span>
                </div>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-1 text-dynamic-primary-color" />
                  <span>{t("email_contact")}: Contacts@yoursite.com</span>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                {utilityBarConfig.showCurrencySelector && <CurrencySwitcher />}
                {utilityBarConfig.showLanguageSelector && <LanguageSwitcher />}
              </div>
            </div>
          </div>
        )}

        {/* Main Header Row (Logo, Search, Icons) */}
        <div className="z-40 bg-background border-b border-border">
          <div className="container mx-auto flex items-center justify-between py-4 px-6">
            <Sheet open={isMobileNavOpen} onOpenChange={setIsMobileNavOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="!h-7 !w-7" />
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
            {/* Marquee section for desktop, if enabled and type is marquee */}
            {enabledAnnouncements.map((announcement) => {
              if (announcement.type === "marquee") {
                return (
                  <MarqueeSection
                    key={`main-nav-${announcement.id}`}
                    className={`hidden md:block flex-grow mx-8 max-w-[90%]`}
                    messages={[announcement.text]}
                    backgroundColor="transparent"
                    textColor="currentColor"
                  />
                );
              }
              return null;
            })}

            <div className="flex items-center space-x-2 md:space-x-4 flex-shrink-0 lg:ml-0">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSearchModalOpen(true)}
              >
                <Search className="!h-7 !w-7" />
              </Button>
              {mainNavConfig?.showCartIcon && (
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
              <div className="block md:hidden">
                <LanguageSwitcher />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Navigation Row */}
        <div className="bg-dynamic-primary-color text-dynamic-secondary-color py-3 px-6 hidden lg:flex items-center">
          <div className="container mx-auto flex px- items-center">
            {isHomePage ? (
              <Sheet
                open={isCategoryMenuOpen}
                // onOpenChange={setIsCategoryMenuOpen} // Removed to keep it open on home page
              >
                <SheetTrigger asChild>
                  <Button
                    key={`all-categories-desktop-${i18n.language}`}
                    variant="ghost"
                    className="flex items-center gap-2 bg-dynamic-primary-color text-dynamic-secondary-color p-3 font-semibold text-lg pr-6 cursor-default hover:bg-dynamic-primary-color/90"
                  >
                    <Menu className="h-5 w-5" />
                    {t("all_categories")}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-full sm:max-w-xs">
                  <SheetHeader>
                    <SheetTitle className="text-xl font-semibold">
                      {t("all_categories")}
                    </SheetTitle>
                  </SheetHeader>
                  <div className="py-4">
                    <CategorySidebar
                      onLinkClick={() => setIsCategoryMenuOpen(false)}
                    />
                  </div>
                </SheetContent>
              </Sheet>
            ) : (
              <Popover
                open={isCategoryPopoverOpen}
                onOpenChange={setIsCategoryPopoverOpen}
              >
                <PopoverTrigger asChild>
                  <Button
                    key={`all-categories-desktop-${i18n.language}`}
                    variant="ghost"
                    className="flex items-center gap-2 bg-dynamic-primary-color text-dynamic-secondary-color p-3 font-semibold text-lg pr-6 cursor-pointer hover:bg-dynamic-primary-color/90"
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
                  <CategorySidebar
                    onLinkClick={() => setIsCategoryPopoverOpen(false)}
                    className="w-full"
                  />
                </PopoverContent>
              </Popover>
            )}

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
                        <div className="absolute top-full z-[999999999] left-1/2 -translate-x-1/2 mt-2 w-max rounded-md shadow-lg bg-background border border-border animate-in fade-in-0 zoom-in-95">
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

            <div className="flex items-center space-x-4">
              <Link
                to={getPath("/buy")}
                className="text-sm font-bold px-3 py-1 rounded-full bg-blue-500 text-white"
              >
                {t("only_69_buy")}
              </Link>
            </div>
          </div>
        </div>
      </header>
      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
      />
      <StickyHeader
        navItems={navItems}
        headerLogoUrl={headerLogoUrl}
        storeName={storeName}
        getPath={getPath}
        onOpenCartSidebar={onOpenCartSidebar}
        isMobileNavOpen={isMobileNavOpen}
        setIsMobileNavOpen={setIsMobileNavOpen}
        totalItems={totalItems}
        mainNavConfig={mainNavConfig}
        handleMenuLeave={handleMenuLeave}
        activeMenu={activeMenu}
        handleMenuEnter={handleMenuEnter}
      />
    </>
  );
};

export default PremiumHeader;
