"use client";

import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Switch } from "@/components/ui/switch.jsx";
import { Button } from "@/components/ui/button.jsx";

/**
 * BuilderFooter - Footer component for the page builder
 * This component saves settings to the block data, not the global store config
 */
const BuilderFooter = ({ data, updateNested }) => {
  const [storeInfo, setStoreInfo] = useState(data.storeInfo || {
    address: "",
    phone: "",
    email: "",
    website: "",
  });
  
  const [newsletterEnabled, setNewsletterEnabled] = useState(data.newsletter?.enabled || false);
  const [newsletterTitle, setNewsletterTitle] = useState(data.newsletter?.title || "Newsletter");
  const [newsletterDescription, setNewsletterDescription] = useState(data.newsletter?.description || "Subscribe to receive updates, access to exclusive deals, and more.");
  
  const [socialLinks, setSocialLinks] = useState(data.socialLinks || []);
  const [newSocialLink, setNewSocialLink] = useState({ name: "", url: "" });
  
  const [paymentIcons, setPaymentIcons] = useState(data.paymentIcons || []);
  const [newPaymentIcon, setNewPaymentIcon] = useState({ name: "", url: "" });
  
  const [columns, setColumns] = useState(data.columns || []);
  const [newColumn, setNewColumn] = useState({ title: "", links: [] });
  const [columnLinks, setColumnLinks] = useState([]);
  const [newColumnLink, setNewColumnLink] = useState({ title: "", path: "" });
  
  const [openingHours, setOpeningHours] = useState(data.openingHours || []);
  const [newOpeningHour, setNewOpeningHour] = useState({ day: "", time: "" });
  
  const [bottomLinks, setBottomLinks] = useState(data.bottomLinks || []);
  const [newBottomLink, setNewBottomLink] = useState({ title: "", path: "" });

  // Sync state with props when data changes
  useEffect(() => {
    setStoreInfo(data.storeInfo || {
      address: "",
      phone: "",
      email: "",
      website: "",
    });
    setNewsletterEnabled(data.newsletter?.enabled || false);
    setNewsletterTitle(data.newsletter?.title || "Newsletter");
    setNewsletterDescription(data.newsletter?.description || "Subscribe to receive updates, access to exclusive deals, and more.");
    setSocialLinks(data.socialLinks || []);
    setPaymentIcons(data.paymentIcons || []);
    setColumns(data.columns || []);
    setOpeningHours(data.openingHours || []);
    setBottomLinks(data.bottomLinks || []);
  }, [data]);

  // Update block data when store info changes
  const handleStoreInfoChange = (field, value) => {
    const newStoreInfo = { ...storeInfo, [field]: value };
    setStoreInfo(newStoreInfo);
    if (updateNested) {
      updateNested("data.storeInfo", newStoreInfo);
    }
  };

  // Update block data when newsletter settings change
  const handleNewsletterEnabledChange = (checked) => {
    setNewsletterEnabled(checked);
    if (updateNested) {
      updateNested("data.newsletter", {
        enabled: checked,
        title: newsletterTitle,
        description: newsletterDescription,
      });
    }
  };

  const handleNewsletterTitleChange = (value) => {
    setNewsletterTitle(value);
    if (updateNested) {
      updateNested("data.newsletter", {
        enabled: newsletterEnabled,
        title: value,
        description: newsletterDescription,
      });
    }
  };

  const handleNewsletterDescriptionChange = (value) => {
    setNewsletterDescription(value);
    if (updateNested) {
      updateNested("data.newsletter", {
        enabled: newsletterEnabled,
        title: newsletterTitle,
        description: value,
      });
    }
  };

  // Update block data when social links change
  const handleAddSocialLink = () => {
    if (newSocialLink.name.trim() && newSocialLink.url.trim()) {
      const newLinks = [...socialLinks, { ...newSocialLink }];
      setSocialLinks(newLinks);
      setNewSocialLink({ name: "", url: "" });
      if (updateNested) {
        updateNested("data.socialLinks", newLinks);
      }
    }
  };

  const handleRemoveSocialLink = (index) => {
    const newLinks = socialLinks.filter((_, i) => i !== index);
    setSocialLinks(newLinks);
    if (updateNested) {
      updateNested("data.socialLinks", newLinks);
    }
  };

  // Update block data when payment icons change
  const handleAddPaymentIcon = () => {
    if (newPaymentIcon.name.trim() && newPaymentIcon.url.trim()) {
      const newIcons = [...paymentIcons, { ...newPaymentIcon }];
      setPaymentIcons(newIcons);
      setNewPaymentIcon({ name: "", url: "" });
      if (updateNested) {
        updateNested("data.paymentIcons", newIcons);
      }
    }
  };

  const handleRemovePaymentIcon = (index) => {
    const newIcons = paymentIcons.filter((_, i) => i !== index);
    setPaymentIcons(newIcons);
    if (updateNested) {
      updateNested("data.paymentIcons", newIcons);
    }
  };

  // Update block data when columns change
  const handleAddColumn = () => {
    if (newColumn.title.trim()) {
      const newCols = [...columns, { ...newColumn, links: [] }];
      setColumns(newCols);
      setNewColumn({ title: "", links: [] });
      if (updateNested) {
        updateNested("data.columns", newCols);
      }
    }
  };

  const handleRemoveColumn = (index) => {
    const newCols = columns.filter((_, i) => i !== index);
    setColumns(newCols);
    if (updateNested) {
      updateNested("data.columns", newCols);
    }
  };

  const handleAddColumnLink = (columnIndex) => {
    if (newColumnLink.title.trim() && newColumnLink.path.trim()) {
      const updatedCols = [...columns];
      updatedCols[columnIndex].links = [...(updatedCols[columnIndex].links || []), { ...newColumnLink }];
      setColumns(updatedCols);
      setNewColumnLink({ title: "", path: "" });
      if (updateNested) {
        updateNested("data.columns", updatedCols);
      }
    }
  };

  const handleRemoveColumnLink = (columnIndex, linkIndex) => {
    const updatedCols = [...columns];
    updatedCols[columnIndex].links = updatedCols[columnIndex].links.filter((_, i) => i !== linkIndex);
    setColumns(updatedCols);
    if (updateNested) {
      updateNested("data.columns", updatedCols);
    }
  };

  // Update block data when opening hours change
  const handleAddOpeningHour = () => {
    if (newOpeningHour.day.trim() && newOpeningHour.time.trim()) {
      const newHours = [...openingHours, { ...newOpeningHour }];
      setOpeningHours(newHours);
      setNewOpeningHour({ day: "", time: "" });
      if (updateNested) {
        updateNested("data.openingHours", newHours);
      }
    }
  };

  const handleRemoveOpeningHour = (index) => {
    const newHours = openingHours.filter((_, i) => i !== index);
    setOpeningHours(newHours);
    if (updateNested) {
      updateNested("data.openingHours", newHours);
    }
  };

  // Update block data when bottom links change
  const handleAddBottomLink = () => {
    if (newBottomLink.title.trim() && newBottomLink.path.trim()) {
      const newLinks = [...bottomLinks, { ...newBottomLink }];
      setBottomLinks(newLinks);
      setNewBottomLink({ title: "", path: "" });
      if (updateNested) {
        updateNested("data.bottomLinks", newLinks);
      }
    }
  };

  const handleRemoveBottomLink = (index) => {
    const newLinks = bottomLinks.filter((_, i) => i !== index);
    setBottomLinks(newLinks);
    if (updateNested) {
      updateNested("data.bottomLinks", newLinks);
    }
  };

  return (
    <div className="space-y-6">
      {/* Store Info Settings */}
      <div className="border rounded-lg p-4">
        <h3 className="text-sm font-semibold mb-4">Store Info</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-xs font-medium">Address</Label>
            <Input
              placeholder="Address"
              value={storeInfo.address}
              onChange={(e) => handleStoreInfoChange("address", e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-xs font-medium">Phone</Label>
            <Input
              placeholder="Phone"
              value={storeInfo.phone}
              onChange={(e) => handleStoreInfoChange("phone", e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-xs font-medium">Email</Label>
            <Input
              placeholder="Email"
              value={storeInfo.email}
              onChange={(e) => handleStoreInfoChange("email", e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-xs font-medium">Website</Label>
            <Input
              placeholder="Website"
              value={storeInfo.website}
              onChange={(e) => handleStoreInfoChange("website", e.target.value)}
              className="mt-1"
            />
          </div>
        </div>
      </div>

      {/* Newsletter Settings */}
      <div className="border rounded-lg p-4">
        <h3 className="text-sm font-semibold mb-4">Newsletter</h3>
        
        <div className="flex items-center justify-between mb-4">
          <Label className="text-sm font-medium">Enable Newsletter</Label>
          <Switch
            checked={newsletterEnabled}
            onCheckedChange={handleNewsletterEnabledChange}
          />
        </div>

        {newsletterEnabled && (
          <div className="space-y-3">
            <div>
              <Label className="text-xs font-medium">Title</Label>
              <Input
                placeholder="Title"
                value={newsletterTitle}
                onChange={(e) => handleNewsletterTitleChange(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-xs font-medium">Description</Label>
              <Input
                placeholder="Description"
                value={newsletterDescription}
                onChange={(e) => handleNewsletterDescriptionChange(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
        )}
      </div>

      {/* Social Links Settings */}
      <div className="border rounded-lg p-4">
        <h3 className="text-sm font-semibold mb-4">Social Links</h3>
        
        <div className="flex gap-2 mb-3">
          <Input
            placeholder="Name (e.g., Facebook)"
            value={newSocialLink.name}
            onChange={(e) => setNewSocialLink({ ...newSocialLink, name: e.target.value })}
            className="flex-1"
          />
          <Input
            placeholder="URL"
            value={newSocialLink.url}
            onChange={(e) => setNewSocialLink({ ...newSocialLink, url: e.target.value })}
            className="flex-1"
          />
          <button
            onClick={handleAddSocialLink}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm"
          >
            Add
          </button>
        </div>

        <div className="space-y-2">
          {socialLinks.map((link, index) => (
            <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
              <span className="text-sm">{link.name}: {link.url}</span>
              <button
                onClick={() => handleRemoveSocialLink(index)}
                className="text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Icons Settings */}
      <div className="border rounded-lg p-4">
        <h3 className="text-sm font-semibold mb-4">Payment Icons</h3>
        
        <div className="flex gap-2 mb-3">
          <Input
            placeholder="Name (e.g., Visa)"
            value={newPaymentIcon.name}
            onChange={(e) => setNewPaymentIcon({ ...newPaymentIcon, name: e.target.value })}
            className="flex-1"
          />
          <Input
            placeholder="URL"
            value={newPaymentIcon.url}
            onChange={(e) => setNewPaymentIcon({ ...newPaymentIcon, url: e.target.value })}
            className="flex-1"
          />
          <button
            onClick={handleAddPaymentIcon}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm"
          >
            Add
          </button>
        </div>

        <div className="space-y-2">
          {paymentIcons.map((icon, index) => (
            <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
              <span className="text-sm">{icon.name}: {icon.url}</span>
              <button
                onClick={() => handleRemovePaymentIcon(index)}
                className="text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Columns Settings */}
      <div className="border rounded-lg p-4">
        <h3 className="text-sm font-semibold mb-4">Footer Columns</h3>
        
        <div className="flex gap-2 mb-3">
          <Input
            placeholder="Column Title"
            value={newColumn.title}
            onChange={(e) => setNewColumn({ ...newColumn, title: e.target.value })}
            className="flex-1"
          />
          <button
            onClick={handleAddColumn}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm"
          >
            Add Column
          </button>
        </div>

        <div className="space-y-4">
          {columns.map((column, columnIndex) => (
            <div key={columnIndex} className="border rounded p-3">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium">{column.title}</h4>
                <button
                  onClick={() => handleRemoveColumn(columnIndex)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Remove Column
                </button>
              </div>

              <div className="flex gap-2 mb-2">
                <Input
                  placeholder="Link Title"
                  value={newColumnLink.title}
                  onChange={(e) => setNewColumnLink({ ...newColumnLink, title: e.target.value })}
                  className="flex-1"
                />
                <Input
                  placeholder="Link Path"
                  value={newColumnLink.path}
                  onChange={(e) => setNewColumnLink({ ...newColumnLink, path: e.target.value })}
                  className="flex-1"
                />
                <button
                  onClick={() => handleAddColumnLink(columnIndex)}
                  className="px-3 py-1 bg-secondary text-secondary-foreground rounded-md text-sm"
                >
                  Add Link
                </button>
              </div>

              <div className="space-y-1">
                {column.links?.map((link, linkIndex) => (
                  <div key={linkIndex} className="flex items-center justify-between bg-gray-50 p-1 rounded text-sm">
                    <span>{link.title} ({link.path})</span>
                    <button
                      onClick={() => handleRemoveColumnLink(columnIndex, linkIndex)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Opening Hours Settings */}
      <div className="border rounded-lg p-4">
        <h3 className="text-sm font-semibold mb-4">Opening Hours</h3>
        
        <div className="flex gap-2 mb-3">
          <Input
            placeholder="Day (e.g., Monday)"
            value={newOpeningHour.day}
            onChange={(e) => setNewOpeningHour({ ...newOpeningHour, day: e.target.value })}
            className="flex-1"
          />
          <Input
            placeholder="Time (e.g., 9AM - 6PM)"
            value={newOpeningHour.time}
            onChange={(e) => setNewOpeningHour({ ...newOpeningHour, time: e.target.value })}
            className="flex-1"
          />
          <button
            onClick={handleAddOpeningHour}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm"
          >
            Add
          </button>
        </div>

        <div className="space-y-2">
          {openingHours.map((hour, index) => (
            <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
              <span className="text-sm">{hour.day}: {hour.time}</span>
              <button
                onClick={() => handleRemoveOpeningHour(index)}
                className="text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Links Settings */}
      <div className="border rounded-lg p-4">
        <h3 className="text-sm font-semibold mb-4">Bottom Links</h3>
        
        <div className="flex gap-2 mb-3">
          <Input
            placeholder="Title"
            value={newBottomLink.title}
            onChange={(e) => setNewBottomLink({ ...newBottomLink, title: e.target.value })}
            className="flex-1"
          />
          <Input
            placeholder="Path"
            value={newBottomLink.path}
            onChange={(e) => setNewBottomLink({ ...newBottomLink, path: e.target.value })}
            className="flex-1"
          />
          <button
            onClick={handleAddBottomLink}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm"
          >
            Add
          </button>
        </div>

        <div className="space-y-2">
          {bottomLinks.map((link, index) => (
            <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
              <span className="text-sm">{link.title} ({link.path})</span>
              <button
                onClick={() => handleRemoveBottomLink(index)}
                className="text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BuilderFooter;
