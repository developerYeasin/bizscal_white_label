"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import { Link } from "react-router-dom";
import {
  Settings,
  Globe,
  FileText,
  Truck,
  CreditCard,
  Megaphone,
  MessageSquare,
  MessageCircle,
  Share2,
  PanelBottom,
  PanelTop, // New icon for Header Settings
} from "lucide-react";

const ManageShop = () => {
  const settingsCards = [
    {
      title: "Shop Settings",
      description: "General shop configurations customize your shop's core settings for a seamless experience.",
      icon: Settings,
      link: "/manage-shop/shop-settings",
    },
    {
      title: "Header Settings", // New card
      description: "Configure your shop's header, including top bar, utility bar, and main navigation.",
      icon: PanelTop,
      link: "/manage-shop/header-settings",
    },
    {
      title: "Shop Domain",
      description: "Manage your shop's core configurations, including domain setup and general settings.",
      icon: Globe,
      link: "/manage-shop/shop-domain",
    },
    {
      title: "Shop Policy",
      description: "Define and customize policies for your shop, including returns, refunds, and customer service guidelines.",
      icon: FileText,
      link: "/manage-shop/shop-policy",
    },
    {
      title: "Delivery Support",
      description: "Manage your shop's delivery settings to ensure smooth and efficient order fulfillment.",
      icon: Truck,
      link: "/manage-shop/delivery-support",
    },
    {
      title: "Payment Gateway",
      description: "Integrate and manage payment options to provide customers with secure and flexible transaction methods.",
      icon: CreditCard,
      link: "/manage-shop/payment-gateway",
    },
    {
      title: "SEO & Marketing Integrations",
      description: "Enhance your shop's visibility by connecting SEO tools and marketing integrations for better engagement.",
      icon: Megaphone,
      link: "/manage-shop/seo-marketing",
    },
    {
      title: "SMS Support",
      description: "Enable SMS notifications and support to keep your customers informed with real-time updates.",
      icon: MessageSquare,
      link: "/manage-shop/sms-support",
    },
    {
      title: "Chat Support",
      description: "Provide instant communication and assistance to customers with chat support system.",
      icon: MessageCircle,
      link: "/manage-shop/chat-support",
    },
    {
      title: "Social Links",
      description: "Connect your shop with social media platforms to enhance visibility and engagement.",
      icon: Share2,
      link: "/manage-shop/social-links",
    },
    {
      title: "Footer Settings",
      description: "Customize the content and layout of your shop's footer section.",
      icon: PanelBottom,
      link: "/manage-shop/footer-settings",
    },
  ];

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-2">Manage Shop</h1>
      <p className="text-muted-foreground mb-6">
        Set up and customize your shop to ensure a smooth and efficient experience.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {settingsCards.map((card) => (
          <Link to={card.link} key={card.title}>
            <Card className="h-full hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-semibold">{card.title}</CardTitle>
                <card.icon className="h-6 w-6 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{card.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ManageShop;