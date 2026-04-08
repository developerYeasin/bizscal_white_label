"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { showSuccess, showError } from "@/utils/toast";
import { useTranslation } from "react-i18next"; // Import useTranslation

const NewsletterSectionOne = ({ data }) => { // Accept data prop
  const { t } = useTranslation(); // Initialize useTranslation
  const [email, setEmail] = useState("");
  const { title, subtitle, placeholder, buttonText } = data; // Destructure from data prop

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      // In a real application, you would send the email to a subscription service.
      showSuccess(t("thank_you_subscribing"));
      setEmail(""); // Clear the input
    } else {
      showError(t("please_enter_valid_email"));
    }
  };

  return (
    <section className="py-12 md:py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: `var(--dynamic-heading-font)` }}>
          {title || t("subscribe_newsletter_latest_updates")}
        </h2>
        <p className="text-lg text-muted-foreground mb-8">
          {subtitle || t("enter_email_newsletter_notifications")}
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-0 max-w-lg mx-auto border border-gray-300 rounded-md overflow-hidden"> {/* Added border and rounded-md */}
          <Input
            type="email"
            placeholder={placeholder || t("enter_your_email")}
            className="flex-grow h-12 text-base px-4 rounded-none border-none focus-visible:ring-0 focus-visible:ring-offset-0" // Removed individual border/rounded
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Button
            type="submit"
            className="h-12 px-8 text-base bg-red-500 text-white hover:bg-red-600 rounded-none" // Changed button color and removed individual rounded
          >
            {buttonText || t("get_start")}
          </Button>
        </form>
      </div>
    </section>
  );
};

export default NewsletterSectionOne;