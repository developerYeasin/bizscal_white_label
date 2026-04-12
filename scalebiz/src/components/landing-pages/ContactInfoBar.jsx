import React from "react";
import { Button } from "@/components/ui/button.jsx";
import { Badge } from "@/components/ui/badge.jsx";

/**
 * Ghorer Bazar Theme - Contact Info Bar Component
 * Top contact bar with WhatsApp and phone numbers
 */
const ContactInfoBar = ({ data }) => {
  const {
    phone = "+8801321208940",
    whatsapp = "+8801321208940",
    phone2 = "+8801321208940",
    whatsapp2 = "+8801321208940",
    backgroundColor = "#FF6B35",
    textColor = "#FFFFFF",
  } = data || {};

  return (
    <div
      className="bg-[#FF6B35] text-white py-2 px-4 text-center text-sm"
      style={{ backgroundColor, color: textColor }}
    >
      <div className="flex items-center justify-center gap-4 flex-wrap">
        <span className="flex items-center gap-1">
          <span>📞</span>
          <span>{phone}</span>
        </span>
        <span className="flex items-center gap-1">
          <span>💬</span>
          <span>WhatsApp: {whatsapp}</span>
        </span>
        <span className="flex items-center gap-1">
          <span>📞</span>
          <span>{phone2}</span>
        </span>
        <span className="flex items-center gap-1">
          <span>💬</span>
          <span>WhatsApp: {whatsapp2}</span>
        </span>
      </div>
    </div>
  );
};

export default ContactInfoBar;
