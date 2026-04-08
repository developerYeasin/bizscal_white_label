"use client";

import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useStore } from "@/context/StoreContext.jsx";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useTranslation } from "react-i18next"; // Import useTranslation
import { useStorePath } from "@/hooks/use-store-path"; // Import useStorePath
import { Link } from "react-router-dom"; // Import Link for home button

const PolicyPage = () => {
  const { t } = useTranslation(); // Initialize useTranslation
  const { policyKey } = useParams();
  const { storeConfig, isLoading, error } = useStore();
  const getPath = useStorePath(); // Initialize useStorePath

  useEffect(() => {
    if (policyKey) {
      // console.log(`Loading policy for key: ${policyKey}`);
    }
  }, [policyKey]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
        <p className="text-lg text-gray-500">Loading policy content...</p>
      </div>
    );
  }

  if (error || !storeConfig || !storeConfig.pages || !storeConfig.pages.policies) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-100 dark:bg-red-900 p-4">
        <p className="text-lg text-red-600">Error loading store configuration or policies.</p>
      </div>
    );
  }

  const policies = storeConfig.pages.policies;
  const content = policies[policyKey];

  if (!content) {
    return (
      <div className="min-h-screen flex flex-col">
        {storeConfig && (
          <Header layout={storeConfig.layout} storeName={storeConfig.storeConfiguration.storeName} logoUrl={storeConfig.storeConfiguration.logoUrl} themeId={storeConfig.storeConfiguration.themeId} />
        )}
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="text-center bg-card p-8 rounded-lg shadow-sm">
            <h1 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: `var(--dynamic-heading-font)` }}>
              {t('policy_not_found')}
            </h1>
            <p className="text-lg text-muted-foreground">
              {t('policy_not_exist')}
            </p>
            <Link to={getPath("/")} className="text-blue-500 hover:text-blue-700 underline mt-4 block">
              {t('return_to_home')}
            </Link>
          </div>
        </main>
        {storeConfig && (
          <Footer layout={storeConfig.layout.footer} copyrightText={storeConfig.layout.footer.copyrightText} socialLinks={storeConfig.layout.footer.socialLinks} logoUrl={storeConfig.storeConfiguration.logoUrl} storeName={storeConfig.storeConfiguration.storeName} />
        )}
      </div>
    );
  }

  // Function to convert snake_case to Title Case for display
  const formatPolicyTitle = (key) => {
    return key
      .replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="min-h-screen flex flex-col">
      {storeConfig && (
        <Header layout={storeConfig.layout} storeName={storeConfig.storeConfiguration.storeName} logoUrl={storeConfig.storeConfiguration.logoUrl} themeId={storeConfig.storeConfiguration.themeId} />
      )}
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="bg-card p-6 sm:p-8 rounded-lg shadow-md">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center" style={{ color: `var(--dynamic-primary-color)`, fontFamily: `var(--dynamic-heading-font)` }}>
            {formatPolicyTitle(policyKey)}
          </h1>
          <div
            className="prose dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      </main>
      {storeConfig && (
        <Footer layout={storeConfig.layout.footer} copyrightText={storeConfig.layout.footer.copyrightText} socialLinks={storeConfig.layout.footer.socialLinks} logoUrl={storeConfig.storeConfiguration.logoUrl} storeName={storeConfig.storeConfiguration.storeName} />
      )}
    </div>
  );
};

export default PolicyPage;