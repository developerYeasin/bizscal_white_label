"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { showSuccess, showError } from "@/utils/toast";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next"; // Import useTranslation

const NirvanaNewsletter = ({ data }) => { // Accept data prop
  const { t } = useTranslation(); // Initialize useTranslation
  const [email, setEmail] = useState("");
  const { title, subtitle, placeholder, buttonText } = data; // Destructure from data prop

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      showSuccess(t("thank_you_subscribing"));
      setEmail("");
    } else {
      showError(t("please_enter_valid_email"));
    }
  };

  return (
    <section className="py-16 md:py-24 bg-black text-white">
      <div className="container mx-auto px-4 sm:px-6 text-center">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: `var(--dynamic-heading-font)` }}>
          {title || t("subscribe_daily_updates")}
        </h2>
        <p className="text-base sm:text-lg text-gray-300 mb-6 sm:mb-8">
          {subtitle || t("really_boy_law_county")}
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-0 max-w-lg mx-auto bg-white rounded-md overflow-hidden">
          <Input
            type="email"
            placeholder={placeholder || t("enter_your_email")}
            className="flex-grow h-10 sm:h-12 text-sm sm:text-base px-4 rounded-none border-none focus-visible:ring-0 focus-visible:ring-offset-0 text-foreground"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Button
            type="submit"
            className="h-10 sm:h-12 px-6 sm:px-8 text-sm sm:text-base bg-blue-500 text-white hover:bg-blue-600 rounded-none"
          >
            {buttonText || t("subscribe")}
          </Button>
        </form>
      </div>
    </section>
  );
};

export default NirvanaNewsletter;