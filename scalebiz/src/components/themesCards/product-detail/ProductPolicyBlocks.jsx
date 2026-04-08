"use client";

import React from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ShieldCheck, Truck, RefreshCcw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const policies = [
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

const ProductPolicyBlocks = () => {
  return (
    <Card className="shadow-sm border-none">
      <CardContent className="p-0">
        <Accordion type="single" collapsible className="w-full">
          {policies.map((policy, index) => {
            const IconComponent = policy.icon;
            return (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="flex items-center justify-between text-base font-medium px-4 py-3 hover:no-underline">
                  <div className="flex items-center space-x-3 text-foreground">
                    <IconComponent className="h-5 w-5 text-dynamic-primary-color" />
                    <span>{policy.title}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-3 text-sm text-muted-foreground">
                  {policy.content}
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