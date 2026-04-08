"use client";

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useStoreConfig } from "@/contexts/StoreConfigurationContext.jsx";
import { useAuth } from "@/contexts/AuthContext.jsx";
import { useCart } from "@/hooks/use-cart"; // will create this hook
import { Search, ShoppingBag, Heart, User, Menu, Grid3X3 } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { cn } from "@/lib/utils.js";

const StoreHeader = () => {
  const navigate = useNavigate();
  const { config: storeConfig } = useStoreConfig();
  const { cartItems } = useCart(); // will implement this hook
  const { isAuthenticated } = useAuth();

  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const mainNav = storeConfig.layout_settings?.header?.mainNav || {};
  const navItems = storeConfig.layout_settings?.header?.navItems || [];

  const cartItemCount = cartItems?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-background border-b shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Mobile Menu Button */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <MobileNav
                navItems={navItems}
                onNavigate={() => setMobileMenuOpen(false)}
              />
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link to="/" className="flex items-center" onClick={() => setMobileMenuOpen(false)}>
            {mainNav.logoUrl ? (
              <img
                src={mainNav.logoUrl}
                alt={storeConfig.store_name}
                className="h-8 w-auto object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            ) : (
              <span className="text-xl font-bold">{storeConfig.store_name}</span>
            )}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item, idx) => (
              item.type === "dropdown" ? (
                <div key={idx} className="relative group">
                  <button className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-1">
                    {item.title}
                  </button>
                  <div className="absolute left-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                    <div className="bg-background border rounded-md shadow-lg min-w-[160px] py-2">
                      {item.subLinks?.map((sub, subIdx) => (
                        <Link
                          key={subIdx}
                          to={sub.path}
                          className="block px-4 py-2 text-sm hover:bg-muted transition-colors"
                        >
                          {sub.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={idx}
                  to={item.path}
                  className="text-sm font-medium hover:text-primary transition-colors"
                >
                  {item.title}
                </Link>
              )
            ))}
          </nav>

          {/* Search Bar (Desktop) */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
              <Button
                type="submit"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </form>

          {/* Action Icons */}
          <div className="flex items-center space-x-2">
            {mainNav.showCompareIcon && (
              <Button variant="ghost" size="icon" className="hidden sm:flex">
                <Grid3X3 className="h-5 w-5" />
              </Button>
            )}
            {mainNav.showWishlistIcon && (
              <Button variant="ghost" size="icon" className="hidden sm:flex">
                <Heart className="h-5 w-5" />
              </Button>
            )}
            {mainNav.showCartIcon && (
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={() => navigate('/cart')}
              >
                <ShoppingBag className="h-5 w-5" />
                {cartItemCount > 0 && (
                  <Badge
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                    variant="destructive"
                  >
                    {cartItemCount}
                  </Badge>
                )}
              </Button>
            )}
            {mainNav.showAuthLinks && !isAuthenticated && (
              <Button
                variant="default"
                size="sm"
                className="hidden sm:flex"
                onClick={() => navigate('/login')}
              >
                Sign In
              </Button>
            )}
            {isAuthenticated && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/profile')}
                className="hidden sm:flex"
              >
                <User className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

// Mobile Navigation Menu Component
const MobileNav = ({ navItems, onNavigate }) => {
  return (
    <div className="flex flex-col h-full py-6 px-4">
      <div className="mb-6">
        <Link to="/" className="text-xl font-bold" onClick={onNavigate}>
          {navItems[0]?.title || "Menu"}
        </Link>
      </div>
      <nav className="flex-1 space-y-4">
        {navItems.map((item, idx) => (
          <div key={idx}>
            {item.type === "dropdown" ? (
              <div>
                <span className="font-semibold text-sm text-muted-foreground mb-2 block">
                  {item.title}
                </span>
                <div className="pl-2 space-y-2">
                  {item.subLinks?.map((sub, subIdx) => (
                    <Link
                      key={subIdx}
                      to={sub.path}
                      className="block text-sm hover:text-primary transition-colors"
                      onClick={onNavigate}
                    >
                      {sub.title}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link
                to={item.path}
                className="block text-sm font-medium hover:text-primary transition-colors"
                onClick={onNavigate}
              >
                {item.title}
              </Link>
            )}
          </div>
        ))}
      </nav>
      <div className="border-t pt-4 mt-4 space-y-2">
        <Link
          to="/cart"
          className="flex items-center gap-2 text-sm font-medium"
          onClick={onNavigate}
        >
          View Cart
        </Link>
        {!isAuthenticated && (
          <Link
            to="/login"
            className="flex items-center gap-2 text-sm"
            onClick={onNavigate}
          >
            Sign In
          </Link>
        )}
      </div>
    </div>
  );
};

export default StoreHeader;
