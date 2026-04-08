import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { showSuccess } from "@/utils/toast";
import { useTranslation } from "react-i18next"; // Import useTranslation

const NewsletterSubscription = ({ data, className }) => {
  const { t } = useTranslation(); // Initialize useTranslation
  const { title, subtitle, placeholder, buttonText, imageUrl } = data;

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real application, you would send the email to a subscription service.
    showSuccess(t("thank_you_subscribing"));
    e.target.reset(); // Clear the form
  };

  if (!title && !subtitle) {
    return null;
  }

  return (
    <section
      className={cn(
        "relative w-full py-16 md:py-24 bg-cover bg-center flex items-center justify-center text-center",
        className
      )}
      style={{ backgroundImage: `url(${imageUrl})` }}
    >
      <div className="absolute inset-0 bg-black/50"></div> {/* Dark overlay */}
      <div className="relative z-10 text-white px-4 max-w-2xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: `var(--dynamic-heading-font)` }}>
          {title}
        </h2>
        {subtitle && (
          <p className="text-lg mb-8">
            {subtitle}
          </p>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
          <Input
            type="email"
            placeholder={placeholder || t("your_email_address")}
            className="flex-grow h-12 text-base px-4 rounded-md bg-white/90 text-foreground border-none focus-visible:ring-2 focus-visible:ring-dynamic-primary-color"
            required
          />
          <Button
            type="submit"
            className="h-12 px-8 text-base bg-dynamic-primary-color text-dynamic-secondary-color hover:brightness-110"
          >
            {buttonText || t("subscribe")}
          </Button>
        </form>
        <div className="flex items-center justify-center mt-6 space-x-2">
          <Checkbox id="newsletter-consent" className="border-white data-[state=checked]:bg-dynamic-primary-color data-[state=checked]:text-dynamic-secondary-color" />
          <Label htmlFor="newsletter-consent" className="text-sm text-gray-200 cursor-pointer">
            {t("i_agree_terms_conditions")}
          </Label>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSubscription;