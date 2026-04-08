"use client";

import React from "react";
import SettingsPageLayout from "@/components/settings/SettingsPageLayout.jsx";
import PaymentMethodsSection from "@/components/shop-settings/PaymentMethodsSection.jsx";

const PaymentGatewayPage = () => {
  return (
    <SettingsPageLayout title="Payment Gateway">
      <PaymentMethodsSection />
    </SettingsPageLayout>
  );
};

export default PaymentGatewayPage;