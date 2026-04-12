"use client";

import React from "react";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Textarea } from "@/components/ui/textarea.jsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.jsx";
import { Switch } from "@/components/ui/switch.jsx";
import { Button } from "@/components/ui/button.jsx";

/**
 * PolicyPageSettings - Settings component for policy page blocks
 */
const PolicyPageSettings = ({ component, index, updateNested, isUpdating }) => {
  const { data = {} } = component;

  const handleUpdate = (path, value) => {
    updateNested(path, value);
  };

  return (
    <div className="space-y-4">
      <div className="border-b pb-4">
        <h3 className="text-sm font-semibold text-gray-800 mb-3">Page Settings</h3>
        
        {/* Page Title */}
        <div className="space-y-2">
          <Label htmlFor="pageTitle">Page Title</Label>
          <Input
            id="pageTitle"
            value={data.pageTitle || "Policy Page"}
            onChange={(e) => handleUpdate("pageTitle", e.target.value)}
            placeholder="Page title"
          />
        </div>

        {/* Policy Type */}
        <div className="space-y-2">
          <Label htmlFor="policyType">Policy Type</Label>
          <Select
            value={data.policyType || "privacy"}
            onValueChange={(value) => handleUpdate("policyType", value)}
          >
            <SelectTrigger id="policyType">
              <SelectValue placeholder="Select policy type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="privacy">Privacy Policy</SelectItem>
              <SelectItem value="terms">Terms of Service</SelectItem>
              <SelectItem value="shipping">Shipping Policy</SelectItem>
              <SelectItem value="returns">Return Policy</SelectItem>
              <SelectItem value="refund">Refund Policy</SelectItem>
              <SelectItem value="custom">Custom Policy</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Policy Content */}
        <div className="space-y-2">
          <Label htmlFor="policyContent">Policy Content (HTML)</Label>
          <Textarea
            id="policyContent"
            value={data.policyContent || ""}
            onChange={(e) => handleUpdate("policyContent", e.target.value)}
            placeholder="Policy content in HTML format"
            rows={10}
          />
        </div>

        {/* Show Back Button */}
        <div className="flex items-center justify-between">
          <Label htmlFor="showBackButton">Show Back Button</Label>
          <Switch
            id="showBackButton"
            checked={data.showBackButton !== false}
            onCheckedChange={(checked) => handleUpdate("showBackButton", checked)}
          />
        </div>

        {/* Back Button Text */}
        <div className="space-y-2">
          <Label htmlFor="backButtonText">Back Button Text</Label>
          <Input
            id="backButtonText"
            value={data.backButtonText || "Back to Home"}
            onChange={(e) => handleUpdate("backButtonText", e.target.value)}
            placeholder="Back button text"
          />
        </div>
      </div>

      {/* SEO Settings */}
      <div className="border-b pb-4">
        <h3 className="text-sm font-semibold text-gray-800 mb-3">SEO Settings</h3>
        
        <div className="space-y-2">
          <Label htmlFor="metaTitle">Meta Title</Label>
          <Input
            id="metaTitle"
            value={data.metaTitle || ""}
            onChange={(e) => handleUpdate("metaTitle", e.target.value)}
            placeholder="Page meta title"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="metaDescription">Meta Description</Label>
          <Textarea
            id="metaDescription"
            value={data.metaDescription || ""}
            onChange={(e) => handleUpdate("metaDescription", e.target.value)}
            placeholder="Page meta description"
            rows={3}
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

export default PolicyPageSettings;
