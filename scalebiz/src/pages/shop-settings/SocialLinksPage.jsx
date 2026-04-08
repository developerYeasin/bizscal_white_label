"use client";

import React from "react";
import SettingsPageLayout from "@/components/settings/SettingsPageLayout.jsx";
import SocialLinksSection from "@/components/shop-settings/SocialLinksSection.jsx";

const SocialLinksPage = () => {
  return (
    <SettingsPageLayout title="Social Links">
      <SocialLinksSection />
    </SettingsPageLayout>
  );
};

export default SocialLinksPage;