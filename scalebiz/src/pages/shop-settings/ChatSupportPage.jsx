"use client";

import React from "react";
import SettingsPageLayout from "@/components/settings/SettingsPageLayout.jsx";
import ChatSupportSection from "@/components/shop-settings/ChatSupportSection.jsx";

const ChatSupportPage = () => {
  return (
    <SettingsPageLayout title="Chat Support">
      <ChatSupportSection />
    </SettingsPageLayout>
  );
};

export default ChatSupportPage;