"use client";

import React from "react";
import { Link } from "react-router-dom";
import { useStorePath } from "@/hooks/use-store-path";
import { useStore } from "@/context/StoreContext.jsx";
import { Mail, Phone, MapPin, Globe, Facebook, Twitter, Instagram, Youtube } from "lucide-react";

const DynamicFooter = ({ data }) => {
  const getPath = useStorePath();
  const { storeConfig } = useStore();
  const storeConfiguration = storeConfig?.storeConfiguration || {};
  
  // Get footer settings from data prop (this is where the builder saves footer settings)
  const storeInfo = data?.storeInfo || {};
  const newsletter = data?.newsletter || {};
  const socialLinks = data?.socialLinks || [];
  const paymentIcons = data?.paymentIcons || [];
  const columns = data?.columns || [];
  const openingHours = data?.openingHours || [];
  const bottomLinks = data?.bottomLinks || [];

  return (
    <footer className="w-full bg-white border-t pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Store Info */}
          <div>
            <h3 className="text-lg font-bold mb-6 uppercase tracking-wider">Contact Us</h3>
            <ul className="space-y-4 text-sm text-gray-600">
              {storeInfo?.address && (
                <li className="flex gap-3">
                  <MapPin className="w-5 h-5 flex-shrink-0 text-gray-400" />
                  <span>{storeInfo.address}</span>
                </li>
              )}
              {storeInfo?.phone && (
                <li className="flex gap-3">
                  <Phone className="w-5 h-5 flex-shrink-0 text-gray-400" />
                  <span>{storeInfo.phone}</span>
                </li>
              )}
              {storeInfo?.email && (
                <li className="flex gap-3">
                  <Mail className="w-5 h-5 flex-shrink-0 text-gray-400" />
                  <span>{storeInfo.email}</span>
                </li>
              )}
              {storeInfo?.website && (
                <li className="flex gap-3">
                  <Globe className="w-5 h-5 flex-shrink-0 text-gray-400" />
                  <span>{storeInfo.website}</span>
                </li>
              )}
            </ul>
          </div>

          {/* Opening Hours */}
          {openingHours?.length > 0 && (
            <div>
              <h3 className="text-lg font-bold mb-6 uppercase tracking-wider">Opening Hours</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                {openingHours.map((hour, i) => (
                  <li key={i} className="flex justify-between border-b border-dashed pb-1">
                    <span>{hour.day}</span>
                    <span className="font-medium text-black">{hour.time}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Dynamic Columns */}
          {columns?.map((col, i) => (
            <div key={i}>
              <h3 className="text-lg font-bold mb-6 uppercase tracking-wider">{col.title}</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                {col.links?.map((link, li) => (
                  <li key={li}>
                    <Link to={getPath(link.path)} className="hover:text-primary transition-colors">
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter */}
          {newsletter?.enabled && (
            <div>
              <h3 className="text-lg font-bold mb-6 uppercase tracking-wider">{newsletter.title || "Newsletter"}</h3>
              <p className="text-sm text-gray-600 mb-4">{newsletter.description || "Subscribe to receive updates, access to exclusive deals, and more."}</p>
              <form className="flex flex-col gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="px-4 py-2 border rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <button className="bg-black text-white px-4 py-2 rounded-sm text-sm hover:bg-gray-800 transition-colors">
                  Subscribe
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Bottom Bar */}
        <div className="border-t pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} {storeConfiguration?.storeName || "Store"}. All rights reserved.
          </div>

          {/* Payment Icons */}
          {paymentIcons?.length > 0 && (
            <div className="flex gap-2">
              {paymentIcons.map((icon, i) => (
                <img key={i} src={icon.url} alt={icon.name} className="h-6 w-auto grayscale opacity-70" />
              ))}
            </div>
          )}

          {/* Social Links */}
          {socialLinks?.length > 0 && (
            <div className="flex gap-4">
              {socialLinks.map((social, i) => (
                <a key={i} href={social.url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-black transition-colors">
                  <span className="text-xs capitalize">{social.name}</span>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
};

export default DynamicFooter;
