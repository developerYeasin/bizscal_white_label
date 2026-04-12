"use client";

import React from "react";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Textarea } from "@/components/ui/textarea.jsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.jsx";
import { Switch } from "@/components/ui/switch.jsx";
import { Button } from "@/components/ui/button.jsx";

/**
 * ContactFormSettings - Settings component for contact form blocks
 */
const ContactFormSettings = ({ component, index, updateNested, isUpdating }) => {
  const { data = {} } = component;

  const handleUpdate = (path, value) => {
    updateNested(path, value);
  };

  return (
    <div className="space-y-4">
      <div className="border-b pb-4">
        <h3 className="text-sm font-semibold text-gray-800 mb-3">Form Settings</h3>
        
        {/* Form Title */}
        <div className="space-y-2">
          <Label htmlFor="formTitle">Form Title</Label>
          <Input
            id="formTitle"
            value={data.formTitle || "Contact Us"}
            onChange={(e) => handleUpdate("formTitle", e.target.value)}
            placeholder="Form title"
          />
        </div>

        {/* Form Description */}
        <div className="space-y-2">
          <Label htmlFor="formDescription">Form Description</Label>
          <Textarea
            id="formDescription"
            value={data.formDescription || ""}
            onChange={(e) => handleUpdate("formDescription", e.target.value)}
            placeholder="Form description"
            rows={3}
          />
        </div>

        {/* Form Fields */}
        <div className="space-y-2">
          <Label htmlFor="fields">Form Fields</Label>
          <Select
            value={data.fields || "standard"}
            onValueChange={(value) => handleUpdate("fields", value)}
          >
            <SelectTrigger id="fields">
              <SelectValue placeholder="Select fields" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standard">Standard (Name, Email, Phone, Message)</SelectItem>
              <SelectItem value="extended">Extended (Name, Email, Phone, Subject, Message)</SelectItem>
              <SelectItem value="minimal">Minimal (Name, Email, Message)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Show Submit Button */}
        <div className="flex items-center justify-between">
          <Label htmlFor="showSubmit">Show Submit Button</Label>
          <Switch
            id="showSubmit"
            checked={data.showSubmit !== false}
            onCheckedChange={(checked) => handleUpdate("showSubmit", checked)}
          />
        </div>

        {/* Show Success Message */}
        <div className="flex items-center justify-between">
          <Label htmlFor="showSuccess">Show Success Message</Label>
          <Switch
            id="showSuccess"
            checked={data.showSuccess !== false}
            onCheckedChange={(checked) => handleUpdate("showSuccess", checked)}
          />
        </div>

        {/* Success Message */}
        <div className="space-y-2">
          <Label htmlFor="successMessage">Success Message</Label>
          <Input
            id="successMessage"
            value={data.successMessage || "Thank you for contacting us! We will get back to you soon."}
            onChange={(e) => handleUpdate("successMessage", e.target.value)}
            placeholder="Success message"
          />
        </div>
      </div>

      {/* Email Settings */}
      <div className="border-b pb-4">
        <h3 className="text-sm font-semibold text-gray-800 mb-3">Email Settings</h3>
        
        <div className="space-y-2">
          <Label htmlFor="recipientEmail">Recipient Email</Label>
          <Input
            id="recipientEmail"
            type="email"
            value={data.recipientEmail || ""}
            onChange={(e) => handleUpdate("recipientEmail", e.target.value)}
            placeholder="recipient@example.com"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="emailSubject">Email Subject</Label>
          <Input
            id="emailSubject"
            value={data.emailSubject || "New Contact Form Submission"}
            onChange={(e) => handleUpdate("emailSubject", e.target.value)}
            placeholder="Email subject"
          />
        </div>
      </div>

      {/* Display Settings */}
      <div>
        <h3 className="text-sm font-semibold text-gray-800 mb-3">Display Settings</h3>
        
        <div className="space-y-2">
          <Label htmlFor="backgroundColor">Background Color</Label>
          <Input
            type="color"
            id="backgroundColor"
            value={data.backgroundColor || "#ffffff"}
            onChange={(e) => handleUpdate("backgroundColor", e.target.value)}
            className="h-10 w-full"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="paddingTop">Top Padding (px)</Label>
          <Input
            type="number"
            id="paddingTop"
            value={data.paddingTop || 40}
            onChange={(e) => handleUpdate("paddingTop", parseInt(e.target.value) || 40)}
            min="0"
            max="100"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="paddingBottom">Bottom Padding (px)</Label>
          <Input
            type="number"
            id="paddingBottom"
            value={data.paddingBottom || 40}
            onChange={(e) => handleUpdate("paddingBottom", parseInt(e.target.value) || 40)}
            min="0"
            max="100"
          />
        </div>
      </div>
    </div>
  );
};

export default ContactFormSettings;
