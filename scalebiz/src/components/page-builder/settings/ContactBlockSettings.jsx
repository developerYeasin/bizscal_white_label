"use client";

import React, { useCallback } from "react";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Textarea } from "@/components/ui/textarea.jsx";
import { Separator } from "@/components/ui/separator.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Plus, Trash2 } from "lucide-react";

/**
 * Contact Block Settings
 *
 * Configure form fields, email recipient, and appearance.
 */
const ContactBlockSettings = ({ component, updateNested, isUpdating }) => {
  const { data } = component;

  const handleChange = useCallback((field, value) => {
    updateNested(`data.${field}`, value);
  }, [updateNested]);

  const handleFieldChange = useCallback((index, field, value) => {
    const fields = [...(data.fields || [])];
    fields[index] = { ...fields[index], [field]: value };
    updateNested("data.fields", fields);
  }, [data.fields, updateNested]);

  const addField = () => {
    const newField = {
      name: `field_${Date.now()}`,
      label: "New Field",
      type: "text",
      required: false,
      placeholder: "",
    };
    updateNested("data.fields", [...(data.fields || []), newField]);
  };

  const removeField = (index) => {
    const fields = data.fields?.filter((_, i) => i !== index) || [];
    updateNested("data.fields", fields);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-xs">Title</Label>
        <Input
          value={data.title || ""}
          onChange={(e) => handleChange("title", e.target.value)}
          placeholder="Contact Us"
          className="h-8"
          disabled={isUpdating}
        />
      </div>

      <div className="space-y-2">
        <Label className="text-xs">Description</Label>
        <Textarea
          value={data.description || ""}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder="Short description"
          className="h-16 text-xs"
          disabled={isUpdating}
        />
      </div>

      <div className="space-y-2">
        <Label className="text-xs">Recipient Email</Label>
        <Input
          type="email"
          value={data.emailTo || ""}
          onChange={(e) => handleChange("emailTo", e.target.value)}
          placeholder="contact@example.com"
          className="h-8"
          disabled={isUpdating}
        />
      </div>

      <div className="space-y-2">
        <Label className="text-xs flex items-center justify-between">
          <span>Custom Fields</span>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 text-xs"
            onClick={addField}
            disabled={isUpdating}
          >
            <Plus className="h-3 w-3 mr-1" /> Add
          </Button>
        </Label>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {(data.fields || []).map((field, index) => (
            <div key={index} className="p-2 border rounded bg-muted/30 space-y-1">
              <div className="flex items-center gap-2">
                <Input
                  value={field.label || ""}
                  onChange={(e) => handleFieldChange(index, "label", e.target.value)}
                  className="h-6 text-xs flex-1"
                  placeholder="Label"
                  disabled={isUpdating}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => removeField(index)}
                  disabled={isUpdating}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
              <div className="flex gap-2">
                <Input
                  value={field.name || ""}
                  onChange={(e) => handleFieldChange(index, "name", e.target.value)}
                  className="h-6 text-xs flex-1"
                  placeholder="Field name"
                  disabled={isUpdating}
                />
                <select
                  value={field.type || "text"}
                  onChange={(e) => handleFieldChange(index, "type", e.target.value)}
                  className="h-6 text-xs border rounded px-1"
                  disabled={isUpdating}
                >
                  <option value="text">Text</option>
                  <option value="email">Email</option>
                  <option value="phone">Phone</option>
                  <option value="textarea">Textarea</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <div className="space-y-2">
        <Label className="text-xs">Submit Button Text</Label>
        <Input
          value={data.submitLabel || "Send Message"}
          onChange={(e) => handleChange("submitLabel", e.target.value)}
          className="h-8"
          disabled={isUpdating}
        />
      </div>
    </div>
  );
};

export default ContactBlockSettings;
