"use client";

import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion.jsx";

const FAQSection = () => {
  const faqs = [
    {
      question: "Can I change my plan anytime?",
      answer: "Yes! You can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.",
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept various payment methods, including credit/debit cards, mobile banking, and other local payment gateways. You can see the full list during checkout.",
    },
    {
      question: "Is there a free trial?",
      answer: "Yes, we offer a free trial period for new users to explore our platform's basic features before committing to a paid plan.",
    },
    {
      question: "Can I cancel my subscription?",
      answer: "Yes, you can cancel your subscription at any time from your account settings. Your plan will remain active until the end of your current billing cycle.",
    },
  ];

  return (
    <div className="mb-12 max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
      <p className="text-muted-foreground text-center mb-8">
        Everything you need to know about our subscription plans
      </p>
      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="text-lg font-medium text-left">{faq.question}</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default FAQSection;