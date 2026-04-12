// "use client";

// import React from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.jsx";
// import { Link } from "react-router-dom";
// import {
//   Settings,
//   Globe,
//   FileText,
//   Truck,
//   CreditCard,
//   Megaphone,
//   MessageSquare,
//   MessageCircle,
//   Share2,
//   PanelBottom,
//   PanelTop, // New icon for Header Settings
// } from "lucide-react";

// const ManageShop = () => {
//   const settingsCards = [
//     {
//       title: "Shop Settings",
//       description: "General shop configurations customize your shop's core settings for a seamless experience.",
//       icon: Settings,
//       link: "/manage-shop/shop-settings",
//     },
//     {
//       title: "Header Settings", // New card
//       description: "Configure your shop's header, including top bar, utility bar, and main navigation.",
//       icon: PanelTop,
//       link: "/manage-shop/header-settings",
//     },
//     {
//       title: "Shop Domain",
//       description: "Manage your shop's core configurations, including domain setup and general settings.",
//       icon: Globe,
//       link: "/manage-shop/shop-domain",
//     },
//     {
//       title: "Shop Policy",
//       description: "Define and customize policies for your shop, including returns, refunds, and customer service guidelines.",
//       icon: FileText,
//       link: "/manage-shop/shop-policy",
//     },
//     {
//       title: "Delivery Support",
//       description: "Manage your shop's delivery settings to ensure smooth and efficient order fulfillment.",
//       icon: Truck,
//       link: "/manage-shop/delivery-support",
//     },
//     {
//       title: "Payment Gateway",
//       description: "Integrate and manage payment options to provide customers with secure and flexible transaction methods.",
//       icon: CreditCard,
//       link: "/manage-shop/payment-gateway",
//     },
//     {
//       title: "SEO & Marketing Integrations",
//       description: "Enhance your shop's visibility by connecting SEO tools and marketing integrations for better engagement.",
//       icon: Megaphone,
//       link: "/manage-shop/seo-marketing",
//     },
//     {
//       title: "SMS Support",
//       description: "Enable SMS notifications and support to keep your customers informed with real-time updates.",
//       icon: MessageSquare,
//       link: "/manage-shop/sms-support",
//     },
//     {
//       title: "Chat Support",
//       description: "Provide instant communication and assistance to customers with chat support system.",
//       icon: MessageCircle,
//       link: "/manage-shop/chat-support",
//     },
//     {
//       title: "Social Links",
//       description: "Connect your shop with social media platforms to enhance visibility and engagement.",
//       icon: Share2,
//       link: "/manage-shop/social-links",
//     },
//     {
//       title: "Footer Settings",
//       description: "Customize the content and layout of your shop's footer section.",
//       icon: PanelBottom,
//       link: "/manage-shop/footer-settings",
//     },
//   ];

//   return (
//     <div className="p-4 md:p-6">
//       <h1 className="text-2xl font-bold mb-2">Manage Shop</h1>
//       <p className="text-muted-foreground mb-6">
//         Set up and customize your shop to ensure a smooth and efficient experience.
//       </p>

//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//         {settingsCards.map((card) => (
//           <Link to={card.link} key={card.title}>
//             <Card className="h-full hover:shadow-lg transition-shadow">
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle className="text-lg font-semibold">{card.title}</CardTitle>
//                 <card.icon className="h-6 w-6 text-muted-foreground" />
//               </CardHeader>
//               <CardContent>
//                 <p className="text-sm text-muted-foreground">{card.description}</p>
//               </CardContent>
//             </Card>
//           </Link>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ManageShop;

"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card.jsx";
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
  ShieldAlert, // New icon for Fraud Prevention
} from "lucide-react";

const ManageShop = () => {
  const settingsCards = [
    {
      title: "Shop Settings",
      description:
        "General shop configurations customize your shop's core settings for a seamless experience.",
      icon: Settings,
      link: "/manage-shop/shop-settings",
    },
    {
      title: "Header Settings", // New card
      description:
        "Configure your shop's header, including top bar, utility bar, and main navigation.",
      icon: PanelTop,
      link: "/manage-shop/header-settings",
    },
    {
      title: "Shop Domain",
      description:
        "Manage your shop's core configurations, including domain setup and general settings.",
      icon: Globe,
      link: "/manage-shop/shop-domain",
    },
    {
      title: "Shop Policy",
      description:
        "Define and customize policies for your shop, including returns, refunds, and customer service guidelines.",
      icon: FileText,
      link: "/manage-shop/shop-policy",
    },
    {
      title: "Delivery Support",
      description:
        "Manage your shop's delivery settings to ensure smooth and efficient order fulfillment.",
      icon: Truck,
      link: "/manage-shop/delivery-support",
    },
    {
      title: "Payment Gateway",
      description:
        "Integrate and manage payment options to provide customers with secure and flexible transaction methods.",
      icon: CreditCard,
      link: "/manage-shop/payment-gateway",
    },
    {
      title: "SEO & Marketing Integrations",
      description:
        "Enhance your shop's visibility by connecting SEO tools and marketing integrations for better engagement.",
      icon: Megaphone,
      link: "/manage-shop/seo-marketing",
    },
    {
      title: "SMS Support",
      description:
        "Enable SMS notifications and support to keep your customers informed with real-time updates.",
      icon: MessageSquare,
      link: "/manage-shop/sms-support",
    },
    {
      title: "Chat Support",
      description:
        "Provide instant communication and assistance to customers with chat support system.",
      icon: MessageCircle,
      link: "/manage-shop/chat-support",
    },
    {
      title: "Social Links",
      description:
        "Connect your shop with social media platforms to enhance visibility and engagement.",
      icon: Share2,
      link: "/manage-shop/social-links",
    },
    {
      title: "Footer Settings",
      description:
        "Customize the content and layout of your shop's footer section.",
      icon: PanelBottom,
      link: "/manage-shop/footer-settings",
    },
    {
      title: "Fraud Prevention",
      description:
        "Configure settings to prevent fraudulent orders and manage customer order success rates.",
      icon: ShieldAlert,
      link: "/manage-shop/fraud-prevention",
    },
    {
      title: "RBC Buttons",
      description:
        "Configure WhatsApp, Messenger, and Back to Top buttons for your storefront.",
      icon: MessageCircle,
      link: "/manage-shop/rbc-buttons",
    },
  ];

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-2">Manage Shop</h1>
      <p className="text-muted-foreground mb-6">
        Set up and customize your shop to ensure a smooth and efficient
        experience.
      </p>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {settingsCards.map((card) => (
          <Link to={card.link} key={card.title}>
            <Card className="group relative flex flex-col justify-between h-full transition-all duration-300 hover:border-blue-500 hover:shadow-lg hover:scale-[1.02]">
              <CardHeader className="p-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <span
                      className={`inline-flex h-12 w-12 items-center justify-center rounded-full ${
                        card.title === "Shop Settings" ||
                        card.title === "Header Settings" ||
                        card.title === "Shop Domain"
                          ? "bg-blue-100 text-blue-600"
                          : card.title === "Shop Policy" ||
                              card.title === "Delivery Support" ||
                              card.title === "Payment Gateway"
                            ? "bg-green-100 text-green-600"
                            : card.title === "SEO & Marketing Integrations" ||
                                card.title === "SMS Support" ||
                                card.title === "Chat Support"
                              ? "bg-purple-100 text-purple-600"
                              : "bg-indigo-100 text-indigo-600"
                      }`}
                    >
                      <card.icon className="h-6 w-6" />
                    </span>
                  </div>
                  <CardTitle className="text-lg font-semibold text-gray-800 group-hover:text-blue-600">
                    {card.title}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="mt-3 text-sm text-gray-500">{card.description}</p>
              </CardContent>
              <CardFooter className="pt-4 border-t border-gray-100">
                <span className="text-sm font-medium text-blue-600 group-hover:underline">
                  Configure &rarr;
                </span>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ManageShop;
