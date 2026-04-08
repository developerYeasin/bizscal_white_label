"use client";

import React, { useEffect, useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useStoreConfig } from "@/contexts/StoreConfigurationContext.jsx";
import { useAuth } from "@/contexts/AuthContext.jsx";
import { Skeleton } from "@/components/ui/skeleton.jsx";
import { ShoppingBag, Search, Menu, X, User } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet.jsx";
import AnnouncementBar from "@/components/storefront/AnnouncementBar.jsx";
import StoreHeader from "@/components/storefront/Header.jsx";
import StoreFooter from "@/components/storefront/Footer.jsx";
import CartDrawer from "@/components/storefront/CartDrawer.jsx";
import { cn } from "@/lib/utils.js";

const StorefrontLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { config: storeConfig, isLoading: storeConfigLoading } = useStoreConfig();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  // Redirect admin users to admin portal if they try to access storefront
  useEffect(() => {
    if (isAuthenticated && location.pathname === "/") {
      // Check if user is a store owner; they should be in admin dashboard
      // For now, we'll allow both - actual admin portal will be under /admin
    }
  }, [isAuthenticated, location.pathname, navigate]);

  if (storeConfigLoading || !storeConfig) {
    console.log("StorefrontLayout: storeConfigLoading:", storeConfigLoading, "storeConfig:", storeConfig);
    return (
      <div className="min-h-screen bg-red-100">
        <div className="p-4 bg-red-200 font-bold text-red-800">
          StorefrontLayout: Loading store config... {JSON.stringify({storeConfigLoading, hasConfig: !!storeConfig})}
        </div>
        <Skeleton className="h-16 w-full bg-red-300" />
        <Skeleton className="h-96 w-full bg-red-300" />
        <Skeleton className="h-64 w-full bg-red-300" />
      </div>
    );
  }

  // Get navigation items from store configuration
  const navItems = storeConfig.layout_settings?.header?.navItems || [];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Announcement Bar */}
      {storeConfig.theme_settings?.announcement_bar?.enabled && (
        <AnnouncementBar />
      )}

      {/* Header */}
      <StoreHeader />

      {/* Mobile Navigation */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <nav className="flex flex-col h-full py-6 px-4">
            {navItems.map((item, idx) => (
              <div key={idx} className="mb-4">
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
                          onClick={() => setMobileMenuOpen(false)}
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
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.title}
                  </Link>
                )}
              </div>
            ))}
            <div className="mt-auto border-t pt-4">
              <Link
                to="/cart"
                className="flex items-center gap-2 text-sm font-medium mb-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <ShoppingBag className="h-4 w-4" />
                Cart
              </Link>
              {!isAuthenticated && (
                <Link
                  to="/login"
                  className="flex items-center gap-2 text-sm"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User className="h-4 w-4" />
                  Sign In
                </Link>
              )}
            </div>
          </nav>
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <StoreFooter />

      {/* Cart Drawer */}
      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />

      {/* Floating Cart Button (mobile) */}
      <Button
        size="icon"
        className="fixed bottom-4 right-4 z-40 rounded-full shadow-lg md:hidden"
        onClick={() => setCartOpen(true)}
      >
        <ShoppingBag className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default StorefrontLayout;
