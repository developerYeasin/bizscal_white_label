"use client";

import React from "react";
import { cn } from "@/lib/utils.js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/**
 * ReadyMadeSection - A reusable section component with predefined layouts
 * Supports: hero, features, testimonials, pricing, faq, team, contact, cta, announcementBar, trustBadges,
 * promotionalBannerGrid, saleBanner, newsletterCouponBanner, productTabsFilter, contactInfoBar, heroBannerWithProduct
 */
const ReadyMadeSection = ({ data = {}, children = [], className = "" }) => {
  const {
    sectionType: explicitSectionType,
    title = "Section Title",
    subtitle = "",
    backgroundColor = "#ffffff",
    textColor = "#1f2937",
    padding = "large",
    items = [], // For features, testimonials, pricing, team
    faqs = [], // For FAQ section
    pricingPlans = [], // For pricing section
    ctaText = "Get Started",
    ctaLink = "#",
    // Announcement Bar
    message = "",
    // Trust Badges
    badges = [],
    // Contact Bar
    phone = "",
    phone2 = "",
    whatsapp = "",
    whatsapp2 = "",
    // Hero Banner with Product
    heroImageUrl = "",
    heroTitle = "",
    heroSubtitle = "",
    // Promotional Banner Grid
    banners = [],
    // Sale Banner
    saleTitle = "",
    saleSubtitle = "",
    saleImageUrl = "",
    ctaButton = {},
    // Newsletter Coupon Banner
    newsletterTitle = "",
    newsletterSubtitle = "",
    buttonText = "",
    placeholder = "",
    // Product Tabs Filter
    tabs = [],
  } = data;

  // Auto-detect section type based on data structure if not explicitly provided
  const detectSectionType = () => {
    if (explicitSectionType) return explicitSectionType;
    
    // Check for specific data patterns
    if (banners && banners.length > 0) return "promotionalBannerGrid";
    if (saleImageUrl || (saleTitle && saleSubtitle)) return "saleBanner";
    if (badges && badges.length > 0) return "trustBadges";
    if (message) return "announcementBar";
    if (phone || whatsapp || phone2 || whatsapp2) return "contactInfoBar";
    if (heroImageUrl && heroTitle) return "heroBannerWithProduct";
    if (newsletterTitle || newsletterSubtitle || placeholder) return "newsletterCouponBanner";
    if (tabs && tabs.length > 0) return "productTabsFilter";
    
    // Default to hero
    return "hero";
  };

  const sectionType = detectSectionType();

  // Padding sizes
  const paddingSizes = {
    small: "py-8 px-4",
    medium: "py-12 px-6",
    large: "py-16 px-8",
    xlarge: "py-20 px-10",
  };

  // Hero Section Layout
  const renderHero = () => (
    <div className="text-center">
      <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: textColor }}>
        {title}
      </h2>
      {subtitle && (
        <p className="text-xl md:text-2xl mb-8" style={{ color: textColor }}>
          {subtitle}
        </p>
      )}
      {children}
    </div>
  );

  // Features Section Layout
  const renderFeatures = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {items.map((item, index) => (
        <div
          key={index}
          className="text-center p-6 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
        >
          {item.icon && (
            <div className="text-4xl mb-4">{item.icon}</div>
          )}
          <h3 className="text-xl font-semibold mb-2" style={{ color: textColor }}>
            {item.title}
          </h3>
          <p style={{ color: textColor }}>{item.description}</p>
        </div>
      ))}
    </div>
  );

  // Testimonials Section Layout
  const renderTestimonials = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {items.map((item, index) => (
        <div
          key={index}
          className="p-6 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center mb-4">
            {item.avatar && (
              <img
                src={item.avatar}
                alt={item.name}
                className="w-12 h-12 rounded-full mr-4"
              />
            )}
            <div>
              <h4 className="font-semibold" style={{ color: textColor }}>
                {item.name}
              </h4>
              {item.role && (
                <p className="text-sm" style={{ color: textColor }}>
                  {item.role}
                </p>
              )}
            </div>
          </div>
          <p className="italic" style={{ color: textColor }}>
            "{item.content}"
          </p>
        </div>
      ))}
    </div>
  );

  // Pricing Section Layout
  const renderPricing = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {pricingPlans.map((plan, index) => (
        <div
          key={index}
          className={cn(
            "p-6 rounded-lg border-2",
            plan.featured ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-white"
          )}
        >
          <h3 className="text-2xl font-bold mb-2" style={{ color: textColor }}>
            {plan.name}
          </h3>
          <div className="mb-4">
            <span className="text-4xl font-bold" style={{ color: textColor }}>
              {plan.price}
            </span>
            {plan.period && (
              <span className="text-gray-500">/{plan.period}</span>
            )}
          </div>
          <ul className="mb-6 space-y-2">
            {plan.features.map((feature, idx) => (
              <li key={idx} className="flex items-center" style={{ color: textColor }}>
                <span className="text-green-500 mr-2">✓</span>
                {feature}
              </li>
            ))}
          </ul>
          <Button className="w-full" variant={plan.featured ? "default" : "outline"}>
            {ctaText}
          </Button>
        </div>
      ))}
    </div>
  );

  // FAQ Section Layout
  const renderFaq = () => (
    <div className="max-w-3xl mx-auto space-y-4">
      {faqs.map((faq, index) => (
        <div
          key={index}
          className="p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
        >
          <h3 className="font-semibold text-lg mb-2" style={{ color: textColor }}>
            {faq.question}
          </h3>
          <p style={{ color: textColor }}>{faq.answer}</p>
        </div>
      ))}
    </div>
  );

  // Team Section Layout
  const renderTeam = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {items.map((member, index) => (
        <div
          key={index}
          className="text-center p-6 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
        >
          {member.avatar && (
            <img
              src={member.avatar}
              alt={member.name}
              className="w-24 h-24 rounded-full mx-auto mb-4"
            />
          )}
          <h3 className="text-lg font-semibold mb-1" style={{ color: textColor }}>
            {member.name}
          </h3>
          <p className="text-sm" style={{ color: textColor }}>
            {member.role}
          </p>
          {member.bio && (
            <p className="text-sm mt-2" style={{ color: textColor }}>
              {member.bio}
            </p>
          )}
        </div>
      ))}
    </div>
  );

  // Contact Section Layout
  const renderContact = () => (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4" style={{ color: textColor }}>
          {title}
        </h2>
        <p style={{ color: textColor }}>{subtitle}</p>
      </div>
      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="flex items-center p-4 rounded-lg bg-gray-50">
            {item.icon && <span className="text-2xl mr-4">{item.icon}</span>}
            <div>
              <p className="font-semibold" style={{ color: textColor }}>
                {item.label}
              </p>
              <p style={{ color: textColor }}>{item.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // CTA Section Layout
  const renderCta = () => (
    <div className="text-center">
      <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: textColor }}>
        {title}
      </h2>
      {subtitle && (
        <p className="text-xl mb-8" style={{ color: textColor }}>
          {subtitle}
        </p>
      )}
      <Button size="lg" className="mr-4">
        {ctaText}
      </Button>
      {children}
    </div>
  );

  // Announcement Bar Layout
  const renderAnnouncementBar = () => (
    <div className="text-center py-2 px-4" style={{ backgroundColor: backgroundColor }}>
      <p className="text-sm" style={{ color: textColor }}>
        {message}
      </p>
    </div>
  );

  // Trust Badges Layout
  const renderTrustBadges = () => (
    <div className="flex flex-wrap justify-center gap-6 py-8">
      {badges.map((badge, index) => (
        <div key={index} className="flex items-center gap-2">
          {badge.icon && <span className="text-2xl">{badge.icon}</span>}
          {badge.title && (
            <span className="text-sm font-medium" style={{ color: textColor }}>
              {badge.title}
            </span>
          )}
          {badge.subtitle && (
            <span className="text-xs" style={{ color: textColor }}>
              {badge.subtitle}
            </span>
          )}
        </div>
      ))}
    </div>
  );

  // Contact Info Bar Layout
  const renderContactInfoBar = () => (
    <div className="flex flex-wrap justify-center gap-6 py-2 px-4" style={{ backgroundColor: backgroundColor }}>
      {phone && (
        <div className="flex items-center gap-2">
          <span>📞</span>
          <span className="text-sm" style={{ color: textColor }}>{phone}</span>
        </div>
      )}
      {phone2 && (
        <div className="flex items-center gap-2">
          <span>📞</span>
          <span className="text-sm" style={{ color: textColor }}>{phone2}</span>
        </div>
      )}
      {whatsapp && (
        <div className="flex items-center gap-2">
          <span>💬</span>
          <span className="text-sm" style={{ color: textColor }}>{whatsapp}</span>
        </div>
      )}
      {whatsapp2 && (
        <div className="flex items-center gap-2">
          <span>💬</span>
          <span className="text-sm" style={{ color: textColor }}>{whatsapp2}</span>
        </div>
      )}
    </div>
  );

  // Hero Banner with Product Layout
  const renderHeroBannerWithProduct = () => (
    <div className="flex flex-col md:flex-row items-center gap-8">
      {heroImageUrl && (
        <div className="flex-1">
          <img
            src={heroImageUrl}
            alt={heroTitle}
            className="w-full rounded-lg shadow-lg"
          />
        </div>
      )}
      <div className="flex-1 text-center md:text-left">
        <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: textColor }}>
          {heroTitle}
        </h2>
        <p className="text-lg mb-6" style={{ color: textColor }}>
          {heroSubtitle}
        </p>
        <Button size="lg">Shop Now</Button>
      </div>
    </div>
  );

  // Promotional Banner Grid Layout
  const renderPromotionalBannerGrid = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {banners.map((banner, index) => (
        <div
          key={index}
          className="relative rounded-lg overflow-hidden group"
        >
          {banner.imageUrl && (
            <img
              src={banner.imageUrl}
              alt={banner.title}
              className="w-full h-48 object-cover transition-transform group-hover:scale-105"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
            <h3 className="text-white text-xl font-bold mb-1">
              {banner.title}
            </h3>
            {banner.subtitle && (
              <p className="text-white text-sm mb-2">{banner.subtitle}</p>
            )}
            {banner.ctaButton && (
              <Button size="sm" className="bg-white text-black hover:bg-gray-200">
                {banner.ctaButton.text}
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  // Sale Banner Layout
  const renderSaleBanner = () => (
    <div className="relative rounded-lg overflow-hidden">
      {saleImageUrl && (
        <img
          src={saleImageUrl}
          alt={saleTitle}
          className="w-full h-64 object-cover"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex items-center p-8">
        <div className="text-white">
          <h2 className="text-4xl font-bold mb-2">{saleTitle}</h2>
          {saleSubtitle && (
            <p className="text-2xl mb-4">{saleSubtitle}</p>
          )}
          {ctaButton && ctaButton.text && (
            <Button size="lg" className="bg-white text-black hover:bg-gray-200">
              {ctaButton.text}
            </Button>
          )}
        </div>
      </div>
    </div>
  );

  // Newsletter Coupon Banner Layout
  const renderNewsletterCouponBanner = () => (
    <div className="flex flex-col md:flex-row items-center gap-6 p-6 rounded-lg" style={{ backgroundColor: backgroundColor }}>
      <div className="flex-1 text-center md:text-left">
        <h3 className="text-2xl font-bold mb-2" style={{ color: textColor }}>
          {newsletterTitle}
        </h3>
        <p style={{ color: textColor }}>{newsletterSubtitle}</p>
      </div>
      <div className="flex-1 w-full max-w-md">
        <div className="flex gap-2">
          <Input
            type="email"
            placeholder={placeholder}
            className="flex-1"
          />
          <Button>{buttonText || "Subscribe"}</Button>
        </div>
      </div>
    </div>
  );

  // Product Tabs Filter Layout
  const renderProductTabsFilter = () => (
    <div className="flex flex-wrap justify-center gap-2">
      {tabs.map((tab, index) => (
        <Button
          key={index}
          variant={tab.active ? "default" : "outline"}
          className="px-6"
        >
          {tab.name}
        </Button>
      ))}
    </div>
  );

  // Render based on section type
  const renderSection = () => {
    switch (sectionType) {
      case "hero":
        return renderHero();
      case "features":
        return renderFeatures();
      case "testimonials":
        return renderTestimonials();
      case "pricing":
        return renderPricing();
      case "faq":
        return renderFaq();
      case "team":
        return renderTeam();
      case "contact":
        return renderContact();
      case "cta":
        return renderCta();
      case "announcementBar":
        return renderAnnouncementBar();
      case "trustBadges":
        return renderTrustBadges();
      case "contactInfoBar":
        return renderContactInfoBar();
      case "heroBannerWithProduct":
        return renderHeroBannerWithProduct();
      case "promotionalBannerGrid":
        return renderPromotionalBannerGrid();
      case "saleBanner":
        return renderSaleBanner();
      case "newsletterCouponBanner":
        return renderNewsletterCouponBanner();
      case "productTabsFilter":
        return renderProductTabsFilter();
      default:
        return renderHero();
    }
  };

  // Debug log for section type detection
  React.useEffect(() => {
    console.log("ReadyMadeSection - Detected section type:", sectionType, "with data:", data);
  }, [sectionType, data]);

  return (
    <section
      className={cn(
        "w-full",
        paddingSizes[padding] || paddingSizes.large,
        className
      )}
      style={{
        backgroundColor: backgroundColor,
      }}
    >
      <div className="container mx-auto">
        {renderSection()}
      </div>
    </section>
  );
};

export default ReadyMadeSection;
