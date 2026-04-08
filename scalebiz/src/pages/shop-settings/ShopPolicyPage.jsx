"use client";

import React from "react";
import SettingsPageLayout from "@/components/settings/SettingsPageLayout.jsx";
import PolicySection from "@/components/shop-settings/PolicySection.jsx";

const ShopPolicyPage = () => {
  return (
    <SettingsPageLayout title="Shop Policy">
      <PolicySection
        title="About Us"
        lastUpdated="2025-07-10"
        contentPath="page_settings.policies.about_us"
      />
      <PolicySection
        title="Terms and Conditions"
        lastUpdated="2025-07-10"
        contentPath="page_settings.policies.terms_conditions"
      />
      <PolicySection
        title="Return and Cancellation Policy"
        lastUpdated="2025-07-10"
        contentPath="page_settings.policies.return_cancellation"
      />
    </SettingsPageLayout>
  );
};

export default ShopPolicyPage;