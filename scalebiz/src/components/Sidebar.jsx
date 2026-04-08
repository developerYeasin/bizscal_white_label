"use client";

import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils.js";
import { Button } from "@/components/ui/button.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import {
  LayoutDashboard,
  Tag,
  Package,
  Layers,
  Users,
  Store,
  Palette,
  FileText,
  Gift,
  LineChart,
  PanelLeftClose,
  PanelRightOpen,
  ReceiptText,
  Gem,
  HelpCircle,
  Building,
  Sparkles,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area.jsx";
import { usePendingOrdersCount } from "@/hooks/usePendingOrdersCount.js";
import { useAuth } from "@/contexts/AuthContext.jsx"; // New import

const Sidebar = ({ onClose, isCollapsed, onToggleCollapse }) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const { data: orderCounts, isLoading: ordersCountLoading } = usePendingOrdersCount();
  const { user, hasPermission, hasRole, loading: authLoading } = useAuth(); // Use useAuth hook

  const pendingOrdersCount = orderCounts?.pending || 0;

  // Define navigation items with their required permissions
  const navSections = [
    {
      title: "Main Navigation",
      items: [
        { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard }, // Removed permissions: ["read_dashboard"]
        { name: "Orders", href: "/orders", icon: Tag, permissions: ["read_orders"], badge: !ordersCountLoading && pendingOrdersCount > 0 ? String(pendingOrdersCount) : null },
        { name: "Products", href: "/products", icon: Package, permissions: ["read_products"] },
        { name: "Categories", href: "/categories", icon: Layers, permissions: ["read_categories"] },
        { name: "Customers", href: "/customers", icon: Users, permissions: ["read_customers"] },
      ],
    },
    {
      title: "Configuration",
      items: [
        { name: "Manage Shop", href: "/manage-shop", icon: Store, permissions: ["manage_shop_settings", "edit_shop_settings", "edit_header_settings", "edit_shop_domain", "edit_shop_policy", "edit_delivery_settings", "edit_payment_settings", "edit_seo_marketing", "edit_sms_settings", "edit_chat_settings", "edit_social_links", "edit_footer_settings"] },
        { name: "Theme Marketplace", href: "/theme-marketplace", icon: Sparkles, permissions: ["customize_theme"] },
        { name: "Page Builder", href: "/custom-pages", icon: FileText, permissions: ["customize_theme"] },
        { name: "Single Product Pages", href: "/single-product-pages", icon: FileText, permissions: ["manage_landing_pages"] }, // Updated name and href
        { name: "Promo Codes", href: "/promo-codes", icon: Gift, permissions: ["read_promo_codes"] },
        { name: "Users & Permissions", href: "/users-and-permissions", icon: Users, permissions: ["manage_users"] },
      ],
    },
    {
      title: "Reports",
      items: [
        { name: "Analytics", href: "/analytics", icon: LineChart, permissions: ["read_analytics"] },
      ],
    },
    {
      title: "Payment",
      items: [
        { name: "Billing", href: "/billing", icon: ReceiptText, permissions: ["read_billing"] },
        { name: "Subscription", href: "/subscription", icon: Gem, permissions: ["manage_subscription"] },
      ],
    },
    {
      title: "Academy",
      items: [
        { name: "Scalebiz Academy", href: "/zatiq-academy", icon: HelpCircle, permissions: ["access_academy"] },
      ],
    },
    {
      title: "Vendor",
      items: [
        { name: "Vendor Dashboard", href: "/vendor-dashboard", icon: Building, permissions: ["access_vendor_dashboard"] },
      ],
    },
  ];

  const isActive = (href) => {
    if (href === "/dashboard") {
      return currentPath === href;
    }
    return currentPath.startsWith(href);
  };

  if (authLoading) {
    return (
      <div className={cn(
        "flex h-full flex-col border-r bg-sidebar text-sidebar-foreground transition-all duration-200",
        isCollapsed ? "w-16" : "w-64"
      )}>
        <div className="flex h-16 items-center justify-between border-b px-4">
          {!isCollapsed && <h1 className="text-xl font-semibold text-sidebar-primary-foreground">Loading...</h1>}
          <Button variant="ghost" size="icon" className="text-sidebar-foreground" onClick={onToggleCollapse}>
            {isCollapsed ? <PanelRightOpen className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
          </Button>
        </div>
        <div className="flex-1 p-4">
          <div className="h-8 w-full bg-gray-200 rounded mb-2"></div>
          <div className="h-8 w-full bg-gray-200 rounded mb-2"></div>
          <div className="h-8 w-full bg-gray-200 rounded mb-2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "flex h-full flex-col border-r bg-sidebar text-sidebar-foreground transition-all duration-200",
      isCollapsed ? "w-16" : "w-64"
    )}>
      <div className="flex h-16 items-center justify-between border-b px-4">
        <div className="flex items-center gap-2">
          {!isCollapsed && (
            <>
              <div className="w-6 h-6 bg-purple-600 rounded-md flex items-center justify-center text-white font-bold text-sm">S</div>
              <h1 className="text-xl font-semibold text-sidebar-primary-foreground">Scalebiz</h1>
            </>
          )}
        </div>
        <Button variant="ghost" size="icon" className="text-sidebar-foreground" onClick={onToggleCollapse}>
          {isCollapsed ? <PanelRightOpen className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <nav className="py-4">
          {navSections.map((section, sectionIndex) => {
            // Filter items based on permissions, but always include Dashboard if no permissions are specified for it
            const visibleItems = section.items.filter(item => {
              if (!item.permissions) { // If no permissions array, it's visible to all authenticated users
                return true;
              }
              return hasPermission(item.permissions);
            });
            
            if (visibleItems.length === 0 && user?.role !== 'owner') return null; // Hide section if no items are visible and not owner

            return (
              <React.Fragment key={sectionIndex}>
                {!isCollapsed && (
                  <h2 className={cn(
                    "px-4 pt-6 pb-2 text-xs font-semibold uppercase text-muted-foreground",
                    sectionIndex === 0 ? "pt-0" : "" // No top padding for the first section title
                  )}>
                    {section.title}
                  </h2>
                )}
                <ul className="space-y-1 px-2">
                  {visibleItems.map((item) => (
                    <li key={item.name}>
                      <Button
                        asChild
                        variant="ghost"
                        className={cn(
                          "w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                          isActive(item.href) && "bg-sidebar-accent text-sidebar-accent-foreground",
                          isCollapsed ? "px-2" : "px-4"
                        )}
                        onClick={onClose}
                      >
                        <Link to={item.href} className="flex items-center gap-3">
                          <item.icon className="h-5 w-5" />
                          {!isCollapsed && item.name}
                          {item.badge && (
                            <Badge className={cn(
                              "ml-auto bg-sidebar-accent text-sidebar-accent-foreground",
                              isCollapsed && "absolute top-1 right-1"
                            )}>
                              {item.badge}
                            </Badge>
                          )}
                        </Link>
                      </Button>
                    </li>
                  ))}
                </ul>
              </React.Fragment>
            );
          })}
        </nav>
      </ScrollArea>
      {!isCollapsed && (
        <div className="mt-auto p-4 border-t">
          <p className="text-xs text-muted-foreground">Version 1.0</p>
        </div>
      )}
    </div>
  );
};

export default Sidebar;