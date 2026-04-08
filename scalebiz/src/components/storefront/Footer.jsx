"use client";

import React from "react";
import { Link } from "react-router-dom";
import { useStoreConfig } from "@/contexts/StoreConfigurationContext.jsx";
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";

const StoreFooter = () => {
  const { config: storeConfig } = useStoreConfig();
  const footerSettings = storeConfig.layout_settings?.footer || {};
  const columns = footerSettings.columns || [];
  const storeInfo = footerSettings.storeInfo || {};
  const socialLinks = footerSettings.socialLinks || [];
  const paymentIcons = footerSettings.paymentIcons || [];
  const bottomLinks = footerSettings.bottomLinks || [];
  const newsletter = footerSettings.newsletter || {};

  return (
    <footer className="bg-muted/50 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Store Info Column */}
          {storeInfo.showInfo && (
            <div>
              <h3 className="font-bold text-lg mb-4">{storeConfig.store_name}</h3>
              <div className="space-y-3 text-sm text-muted-foreground">
                {storeInfo.address && (
                  <p className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>{storeInfo.address}</span>
                  </p>
                )}
                {storeInfo.phone && (
                  <p className="flex items-center gap-2">
                    <Phone className="h-4 w-4 flex-shrink-0" />
                    <a href={`tel:${storeInfo.phone}`} className="hover:text-primary">
                      {storeInfo.phone}
                    </a>
                  </p>
                )}
                {storeInfo.email && (
                  <p className="flex items-center gap-2">
                    <Mail className="h-4 w-4 flex-shrink-0" />
                    <a href={`mailto:${storeInfo.email}`} className="hover:text-primary">
                      {storeInfo.email}
                    </a>
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Custom Columns */}
          {columns.map((column, idx) => (
            <div key={idx}>
              <h4 className="font-semibold text-sm uppercase tracking-wider mb-4">
                {column.title}
              </h4>
              <ul className="space-y-2">
                {column.links?.map((link, linkIdx) => (
                  <li key={linkIdx}>
                    <Link
                      to={link.path}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter */}
          {newsletter.enabled && (
            <div>
              <h4 className="font-semibold text-sm uppercase tracking-wider mb-4">
                Newsletter
              </h4>
              <p className="text-sm text-muted-foreground mb-4">
                {newsletter.description || "Subscribe to get updates on new arrivals and special offers."}
              </p>
              <form className="space-y-2" onSubmit={(e) => e.preventDefault()}>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full"
                />
                <Button type="submit" className="w-full">
                  Subscribe
                </Button>
              </form>
            </div>
          )}
        </div>

        {/* Social Links & Bottom Bar */}
        <div className="mt-12 pt-8 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Social Links */}
            {socialLinks.length > 0 && (
              <div className="flex items-center gap-4">
                {socialLinks.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                    aria-label={link.platform}
                  >
                    {React.createElement(getSocialIcon(link.platform), { className: "h-5 w-5" })}
                  </a>
                ))}
              </div>
            )}

            {/* Bottom Links */}
            {bottomLinks.length > 0 && (
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                {bottomLinks.map((link, idx) => (
                  <Link
                    key={idx}
                    to={link.path}
                    className="hover:text-primary transition-colors"
                  >
                    {link.title}
                  </Link>
                ))}
              </div>
            )}

            {/* Payment Icons */}
            {paymentIcons.length > 0 && (
              <div className="flex items-center gap-2">
                {paymentIcons.map((icon, idx) => (
                  <div
                    key={idx}
                    className="h-6 w-10 bg-muted rounded flex items-center justify-center text-xs font-medium"
                    title={icon.name}
                  >
                    {icon.name.slice(0, 2).toUpperCase()}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Copyright */}
          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} {storeConfig.store_name}. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Helper function to get social icon component
const getSocialIcon = (platform) => {
  const icons = {
    facebook: Facebook,
    twitter: Twitter,
    instagram: Instagram,
    linkedin: Linkedin,
  };
  return icons[platform.toLowerCase()] || Mail;
};

export default StoreFooter;
