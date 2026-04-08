"use client";

import React from "react";
import SettingsPageLayout from "@/components/settings/SettingsPageLayout.jsx";
import FooterSettingsSection from "@/components/shop-settings/FooterSettingsSection.jsx";

const FooterSettingsPage = () => {
  return (
    <SettingsPageLayout title="Footer Settings">
      <FooterSettingsSection />
    </SettingsPageLayout>
  );
};

export default FooterSettingsPage;