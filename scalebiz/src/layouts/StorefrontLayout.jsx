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

  if (storeConfigLoading) {
    console.log("StorefrontLayout: storeConfigLoading:", storeConfigLoading, "storeConfig:", storeConfig);
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="p-4 bg-gray-100 font-bold text-gray-800">
          StorefrontLayout: Loading store configuration...
        </div>
        <Skeleton className="h-16 w-full bg-gray-200" />
        <Skeleton className="h-96 w-full bg-gray-200" />
        <Skeleton className="h-64 w-full bg-gray-200" />
      </div>
    );
  }

  // If loading is done but config is null, show error or fallback UI
  if (!storeConfig) {
    console.error("StorefrontLayout: No store configuration available after loading.");
    return (
      <div className="min-h-screen bg-red-50">
        <div className="p-4 bg-red-100 font-bold text-red-800">
          StorefrontLayout: Unable to load store configuration. Please check your authentication or store setup.
        </div>
        <div className="p-8 text-center">
          <p className="mb-4">The store configuration could not be loaded. This may be because:</p>
          <ul className="list-disc text-left max-w-md mx-auto">
            <li>You are not authenticated as a store owner.</li>
            <li>Your store has not been configured yet.</li>
            <li>The backend API is unavailable.</li>
          </ul>
          <button
            className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={() => window.location.href = '/login'}
          >
            Go to login
          </button>
        </div>
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
