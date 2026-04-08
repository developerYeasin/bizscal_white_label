"use client";

import React from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ShieldCheck, Truck, RefreshCcw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

// Default policies if no product-specific FAQs are provided
const defaultPolicies = [
  {
    icon: ShieldCheck,
    title: "Security policy (Edit with the Customer Reassurance module)",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    icon: Truck,
    title: "Delivery policy (Edit with the Customer Reassurance module)",
    content: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  },
  {
    icon: RefreshCcw,
    title: "Return policy (Edit with the Customer Reassurance module)",
    content: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
  },
];

const iconMap = {
  ShieldCheck: ShieldCheck,
  Truck: Truck,
  RefreshCcw: RefreshCcw,
  // Add more mappings as needed for dynamic icons
};

const ProductPolicyBlocks = ({ faqs }) => { // Accept faqs prop
  const policiesToRender = (faqs && faqs.length > 0) ? faqs : defaultPolicies;

  return (
    <Card className="shadow-sm border-none">
      <CardContent className="p-0">
        <Accordion type="single" collapsible className="w-full">
          {policiesToRender.map((policy, index) => {
            // Use dynamic icon if available, otherwise fallback to a default or generic icon
            const IconComponent = iconMap[policy.icon] || (index === 0 ? ShieldCheck : index === 1 ? Truck : RefreshCcw);
            return (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="flex items-center justify-between text-base font-medium px-4 py-3 hover:no-underline">
                  <div className="flex items-center space-x-3 text-foreground">
                    <IconComponent className="h-5 w-5 text-dynamic-primary-color" />
                    <span>{policy.question || policy.title}</span> {/* Use question for dynamic, title for default */}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-3 text-sm text-muted-foreground">
                  {policy.answer || policy.content} {/* Use answer for dynamic, content for default */}
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default ProductPolicyBlocks;