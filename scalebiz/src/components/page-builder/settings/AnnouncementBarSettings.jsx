"use client";

import React from "react";
import { Label } from "@/components/ui/label.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Textarea } from "@/components/ui/textarea.jsx";
import { Button } from "@/components/ui/button.jsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.jsx";

const AnnouncementBarSettings = ({
  component,
  index,
  updateNested,
  isUpdating,
}) => {
  const { data = {} } = component;

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-sm text-gray-800">Announcement Bar Settings</h3>
      
      <div className="space-y-2">
        <Label htmlFor="announcementMessage">Message</Label>
        <Input
          id="announcementMessage"
          value={data.message || ""}
          onChange={(e) =>
            updateNested("data.message", e.target.value)
          }
          placeholder="Enter announcement message..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="backgroundColor">Background Color</Label>
        <Input
          id="backgroundColor"
          type="color"
          value={data.backgroundColor || "#ef4444"}
          onChange={(e) =>
            updateNested("data.backgroundColor", e.target.value)
          }
          className="h-10"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="textColor">Text Color</Label>
        <Input
          id="textColor"
          type="color"
          value={data.textColor || "#ffffff"}
          onChange={(e) =>
            updateNested("data.textColor", e.target.value)
          }
          className="h-10"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="linkUrl">Link URL (optional)</Label>
        <Input
          id="linkUrl"
          value={data.linkUrl || ""}
          onChange={(e) =>
            updateNested("data.linkUrl", e.target.value)
          }
          placeholder="https://example.com"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="linkText">Link Text (optional)</Label>
        <Input
          id="linkText"
          value={data.linkText || ""}
          onChange={(e) =>
            updateNested("data.linkText", e.target.value)
          }
          placeholder="Shop Now"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="dismissible">Dismissible</Label>
        <Select
          value={String(data.dismissible || false)}
          onValueChange={(value) =>
            updateNested("data.dismissible", value === "true")
          }
        >
          <SelectTrigger className="h-9">
            <SelectValue placeholder="Select option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="true">Yes</SelectItem>
            <SelectItem value="false">No</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="icon">Icon (optional)</Label>
        <Select
          value={data.icon || "none"}
          onValueChange={(value) =>
            updateNested("data.icon", value === "none" ? "" : value)
          }
        >
          <SelectTrigger className="h-9">
            <SelectValue placeholder="Select icon" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None</SelectItem>
            <SelectItem value="truck">Truck</SelectItem>
            <SelectItem value="gift">Gift</SelectItem>
            <SelectItem value="star">Star</SelectItem>
            <SelectItem value="heart">Heart</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default AnnouncementBarSettings;
