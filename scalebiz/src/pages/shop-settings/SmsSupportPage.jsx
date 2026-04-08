"use client";

import React from "react";
import SettingsPageLayout from "@/components/settings/SettingsPageLayout.jsx";
import SmsServiceSection from "@/components/shop-settings/SmsServiceSection.jsx";

const SmsSupportPage = () => {
  return (
    <SettingsPageLayout title="SMS Support">
      <SmsServiceSection />
    </SettingsPageLayout>
  );
};

export default SmsSupportPage;