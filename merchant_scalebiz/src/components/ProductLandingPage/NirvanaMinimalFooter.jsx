"use client";

import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram } from "lucide-react"; // Using Twitter for the 'X' icon
import { useTranslation } from "react-i18next"; // Import useTranslation
import { useStorePath } from "@/hooks/use-store-path"; // Import useStorePath

const NirvanaMinimalFooter = ({ storeName, logoUrl }) => {
  const { t } = useTranslation(); // Initialize useTranslation
  const currentYear = new Date().getFullYear();
  const getPath = useStorePath(); // Initialize useStorePath

  return (
    <footer className="bg-white py-8 md:py-12 border-t border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between">
        <div className="flex flex-col sm:flex-row items-center mb-4 md:mb-0 text-center sm:text-left">
          {logoUrl ? (
            <img src={logoUrl} alt={storeName || "AR-SHAKIR"} className="h-7 sm:h-8 mr-2 mb-2 sm:mb-0" />
          ) : (
            <span className="text-lg sm:text-xl font-bold text-foreground mr-2 mb-2 sm:mb-0">AR-SHAKIR</span>
          )}
          <p className="text-sm text-muted-foreground">
            {t('copyright', { year: currentYear, storeName: "ar-shakir" })}
          </p>
        </div>
        <div className="flex space-x-3 sm:space-x-4">
          <a href="#" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-dynamic-primary-color transition-colors">
            <Facebook className="h-5 w-5 sm:h-6 sm:w-6" />
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-dynamic-primary-color transition-colors">
            <Twitter className="h-5 w-5 sm:h-6 sm:w-6" />
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-dynamic-primary-color transition-colors">
            <Instagram className="h-5 w-5 sm:h-6 sm:w-6" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default NirvanaMinimalFooter;