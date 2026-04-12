"use client";

import React from "react";
import { useStoreConfig } from "@/contexts/StoreConfigurationContext.jsx";

/**
 * SystemFooter Block Component for Page Builder
 *
 * Simplified preview of the storefront footer based on layout_settings.footer
 */
const SystemFooter = ({ data, config }) => {
  const { config: storeConfig, isLoading } = useStoreConfig();

  if (isLoading || (!storeConfig && !data)) {
    return (
      <div className="w-full bg-muted/30 border-t h-20 flex items-center justify-center text-sm text-muted-foreground">
        Loading footer...
      </div>
    );
  }

  const footer = data ? (data.footer || data) : (storeConfig.layout_settings?.footer || {});
  const storeInfo = footer.storeInfo || {};
  const newsletter = footer.newsletter || {};
  const bottomLinks = footer.bottomLinks || [];
  const socialLinks = footer.socialLinks || [];
  const openingHours = footer.openingHours || [];
  const paymentIcons = footer.paymentIcons || [];
  const copyrightText = footer.copyrightText;

  const storeName = storeConfig?.store_name || "Store";

  const currentYear = new Date().getFullYear();

  // Determine number of columns based on which sections are populated
  const columns = [];
  if (storeInfo.email || storeInfo.phone || storeInfo.address || storeInfo.website) {
    columns.push({ title: "Contact", items: [{ label: "Email", value: storeInfo.email }, { label: "Phone", value: storeInfo.phone }, { label: "Address", value: storeInfo.address }, { label: "Website", value: storeInfo.website }].filter(i => i.value) });
  }
  if (Object.keys(newsletter).length > 0 || (footer.newsletter && typeof footer.newsletter === 'object')) {
    columns.push({ title: "Newsletter", items: [] });
  }
  if (openingHours.length > 0) {
    columns.push({ title: "Hours", items: openingHours.map(h => ({ label: h.day, value: h.hours })) });
  }
  if (bottomLinks.length > 0) {
    columns.push({ title: "Links", items: bottomLinks.map(l => ({ label: l.title, value: l.path })) });
  }

  return (
    <div className="w-full bg-muted/30 border-t py-8 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {columns.map((col, idx) => (
            <div key={idx}>
              <h4 className="font-semibold text-sm mb-3">{col.title}</h4>
              {col.title === "Newsletter" ? (
                <div className="text-xs text-muted-foreground">
                  <p className="mb-2">{newsletter.placeholder || "Enter your email"}</p>
                  <div className="flex gap-2">
                    <input type="email" placeholder={newsletter.placeholder || "Email"} className="flex-1 px-2 py-1 text-xs border rounded" />
                    <button className="px-3 py-1 bg-primary text-primary-foreground text-xs rounded hover:opacity-90">{newsletter.buttonText || "Subscribe"}</button>
                  </div>
                </div>
              ) : (
                <ul className="space-y-2 text-xs text-muted-foreground">
                  {col.items.map((item, i) => (
                    <li key={i}>
                      {item.label && <span className="font-medium">{item.label}: </span>}
                      {item.value ? (
                        item.label === "Address" ? (
                          <span className="whitespace-pre-line">{item.value}</span>
                        ) : (
                          <a href={item.value.startsWith('http') ? item.value : `/${item.value}`} className="hover:underline">{item.value}</a>
                        )
                      ) : null}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}

          {/* Social Links */}
          {socialLinks.length > 0 && (
            <div>
              <h4 className="font-semibold text-sm mb-3">Follow Us</h4>
              <div className="flex gap-3">
                {socialLinks.map((link, i) => (
                  <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
                    {link.platform}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Payment Icons */}
        {paymentIcons.length > 0 && (
          <div className="mt-6 pt-4 border-t">
            <p className="text-xs font-semibold mb-2">Payment Methods</p>
            <div className="flex flex-wrap gap-2">
              {paymentIcons.map((src, i) => (
                <img key={i} src={src} alt={`Payment ${i+1}`} className="h-6 object-contain" />
              ))}
            </div>
          </div>
        )}

        {/* Copyright */}
        {(copyrightText || storeName) && (
          <div className="mt-6 pt-4 border-t text-center text-xs text-muted-foreground">
            {copyrightText ? copyrightText.replace('{year}', currentYear).replace('{storeName}', storeName) : `© ${currentYear} ${storeName}. All rights reserved.`}
          </div>
        )}
      </div>
    </div>
  );
};

export default SystemFooter;
