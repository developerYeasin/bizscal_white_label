"use client";

import React from "react";
import {
  Settings,
  PanelTop,
  PanelBottom,
  Search,
  Globe,
  FileText,
  CreditCard,
  Truck,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button.jsx";

const AppSettings = ({ navigate }) => {
  const settingsItems = [
    {
      label: "Shop Settings",
      icon: Settings,
      path: "/manage-shop/shop-settings",
    },
    {
      label: "Header",
      icon: PanelTop,
      path: "/manage-shop/header-settings",
    },
    {
      label: "Footer",
      icon: PanelBottom,
      path: "/manage-shop/footer-settings",
    },
    {
      label: "SEO & Marketing",
      icon: Search,
      path: "/manage-shop/seo-marketing",
    },
    {
      label: "Domain",
      icon: Globe,
      path: "/manage-shop/shop-domain",
    },
    {
      label: "Shop Policy",
      icon: FileText,
      path: "/manage-shop/shop-policy",
    },
    {
      label: "Payment Gateway",
      icon: CreditCard,
      path: "/manage-shop/payment-gateway",
    },
    {
      label: "Delivery & Support",
      icon: Truck,
      path: "/manage-shop/delivery-support",
    },
    {
      label: "Social Links",
      icon: Share2,
      path: "/manage-shop/social-links",
    },
  ];

  return (
    <>
      <h2 className="font-semibold text-sm text-gray-800 mb-4">
        Settings
      </h2>
      <div className="space-y-1">
        {settingsItems.map((item) => (
          <Button
            key={item.path}
            variant="ghost"
            className="w-full justify-start h-8 px-2"
            onClick={() => {
              navigate(item.path);
            }}
          >
            <item.icon className="w-4 h-4 mr-2" /> {item.label}
          </Button>
        ))}
      </div>
    </>
  );
};

export default AppSettings;
