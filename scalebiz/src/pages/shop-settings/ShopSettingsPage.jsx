"use client";

import React from "react";
import SettingsPageLayout from "@/components/settings/SettingsPageLayout.jsx";
import ShopBasicInfo from "@/components/shop-settings/ShopBasicInfo.jsx";
import ShopQR from "@/components/shop-settings/ShopQR.jsx";
import ShopLogo from "@/components/shop-settings/ShopLogo.jsx";
import ShopTheme from "@/components/shop-settings/ShopTheme.jsx";
import ShopSettingsSection from "@/components/shop-settings/ShopSettingsSection.jsx";

const ShopSettingsPage = () => {
  return (
    <SettingsPageLayout title="Shop Settings">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ShopBasicInfo />
          <ShopSettingsSection />
        </div>
        <div className="lg:col-span-1">
          <ShopQR />
          <ShopLogo />
          <ShopTheme />
        </div>
      </div>
    </SettingsPageLayout>
  );
};

export default ShopSettingsPage;