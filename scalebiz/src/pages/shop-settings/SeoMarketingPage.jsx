"use client";

import React from "react";
import SettingsPageLayout from "@/components/settings/SettingsPageLayout.jsx";
import SeoMarketingIntegrationsSection from "@/components/shop-settings/SeoMarketingIntegrationsSection.jsx";

const SeoMarketingPage = () => {
  return (
    <SettingsPageLayout title="SEO & Marketing Integrations">
      <SeoMarketingIntegrationsSection />
    </SettingsPageLayout>
  );
};

export default SeoMarketingPage;