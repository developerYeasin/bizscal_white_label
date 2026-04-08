"use client";

import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Youtube, Linkedin } from "lucide-react"; // Using Linkedin for the 'in' icon
import { useTranslation } from "react-i18next"; // Import useTranslation
import { useStorePath } from "@/hooks/use-store-path"; // Import useStorePath

const MinimalProductLandingPageFooter = ({ storeName, logoUrl }) => {
  const { t } = useTranslation(); // Initialize useTranslation
  const currentYear = new Date().getFullYear();
  const getPath = useStorePath(); // Initialize useStorePath

  return (
    <footer className="bg-white py-8 md:py-12 border-t border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between">
        <div className="flex flex-col sm:flex-row items-center mb-4 md:mb-0 text-center sm:text-left">
          {logoUrl ? (
            <img src={logoUrl} alt={storeName || "Store"} className="h-7 sm:h-8 mr-2 mb-2 sm:mb-0" />
          ) : (
            <span className="text-lg sm:text-xl font-bold text-foreground mr-2 mb-2 sm:mb-0">{storeName || "Store"}</span>
          )}
          <p className="text-sm text-muted-foreground">
            {t('copyright', { year: currentYear, storeName: "@arshakir" })}
          </p>
        </div>
        <div className="flex space-x-3 sm:space-x-4 mb-4 md:mb-0">
          <a href="#" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-dynamic-primary-color transition-colors">
            <Facebook className="h-5 w-5 sm:h-6 sm:w-6" />
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-dynamic-primary-color transition-colors">
            <Instagram className="h-5 w-5 sm:h-6 sm:w-6" />
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-dynamic-primary-color transition-colors">
            <Linkedin className="h-5 w-5 sm:h-6 sm:w-6" /> {/* Using Linkedin for 'in' icon */}
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-dynamic-primary-color transition-colors">
            <Youtube className="h-5 w-5 sm:h-6 sm:w-6" />
          </a>
        </div>
        <div className="flex flex-wrap justify-center items-center space-x-2 mt-4 md:mt-0">
          <img src="https://elessi.b-cdn.net/elementor/wp-content/uploads/2019/02/payment-01.png" alt="Payment Method" className="h-5 sm:h-6" />
          <img src="https://elessi.b-cdn.net/elementor/wp-content/uploads/2019/02/payment-02.png" alt="Payment Method" className="h-5 sm:h-6" />
          <img src="https://elessi.b-cdn.net/elementor/wp-content/uploads/2019/02/payment-03.png" alt="Payment Method" className="h-5 sm:h-6" />
          <img src="https://elessi.b-cdn.net/elementor/wp-content/uploads/2019/02/payment-04.png" alt="Payment Method" className="h-5 sm:h-6" />
        </div>
      </div>
    </footer>
  );
};

export default MinimalProductLandingPageFooter;