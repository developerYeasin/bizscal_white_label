"use client";

import React from "react";
import SettingsPageLayout from "@/components/settings/SettingsPageLayout.jsx";
import HeaderSettingsSection from "@/components/shop-settings/HeaderSettingsSection.jsx";

const HeaderSettingsPage = () => {
  return (
    <SettingsPageLayout title="Header Settings">
      <HeaderSettingsSection />
    </SettingsPageLayout>
  );
};

export default HeaderSettingsPage;