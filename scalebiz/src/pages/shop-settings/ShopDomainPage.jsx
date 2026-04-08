"use client";

import React from "react";
import SettingsPageLayout from "@/components/settings/SettingsPageLayout.jsx";
import ShopDomainsSection from "@/components/shop-settings/ShopDomainsSection.jsx";

const ShopDomainPage = () => {
  return (
    <SettingsPageLayout title="Shop Domain">
      <ShopDomainsSection />
    </SettingsPageLayout>
  );
};

export default ShopDomainPage;