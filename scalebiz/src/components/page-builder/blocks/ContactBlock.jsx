"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Textarea } from "@/components/ui/textarea.jsx";
import { Label } from "@/components/ui/label.jsx";
import { showSuccess, showError } from "@/utils/toast.js";

/**
 * Contact Block
 *
 * A contact form block.
 *
 * Expected data:
 * - title: string
 * - description: string
 * - fields: array of { name, label, type, required, placeholder }
 * - submitLabel: string
 * - showNameFields: boolean (predefined fields: name, email, subject, message)
 * - emailTo: string (where to send submissions)
 */
const ContactBlock = ({ data }) => {
  const {
    title = "Contact Us",
    description = "",
    fields = [],
    submitLabel = "Send Message",
    showNameFields = true,
    emailTo,
    className = "",
  } = data || {};

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Build default fields if using showNameFields
  const formFields = showNameFields
    ? [
        { name: "name", label: "Name", type: "text", required: true, placeholder: "Your name" },
        { name: "email", label: "Email", type: "email", required: true, placeholder: "your@email.com" },
        { name: "subject", label: "Subject", type: "text", required: false, placeholder: "How can we help?" },
        { name: "message", label: "Message", type: "textarea", required: true, placeholder: "Your message..." },
      ]
    : fields;

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = async (formData) => {
    if (!emailTo) {
      showError("Contact form not configured. Please set recipient email.");
      return;
    }

    setIsSubmitting(true);
    try {
      // TODO: Send to backend API
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: emailTo,
          ...formData,
        }),
      });

      if (response.ok) {
        showSuccess("Message sent successfully!");
        reset();
      } else {
        throw new Error("Failed to send");
      }
    } catch (err) {
      showError("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`contact-block ${className}`}>
      <div className="max-w-2xl mx-auto p-6 bg-card border rounded-lg">
        <div className="text-center mb-6">
          <h3 className="text-xl font-semibold">{title}</h3>
          {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {formFields.map((field) => (
            <div key={field.name}>
              <Label htmlFor={field.name} className="text-sm">
                {field.label} {field.required && <span className="text-destructive">*</span>}
              </Label>
              {field.type === "textarea" ? (
                <Textarea
                  id={field.name}
                  {...register(field.name, { required: field.required })}
                  placeholder={field.placeholder}
                  className="mt-1"
                  rows={4}
                  disabled={isSubmitting}
                />
              ) : (
                <Input
                  id={field.name}
                  type={field.type}
                  {...register(field.name, { required: field.required })}
                  placeholder={field.placeholder}
                  className="mt-1"
                  disabled={isSubmitting}
                />
              )}
              {errors[field.name] && (
                <p className="text-xs text-destructive mt-1">This field is required</p>
              )}
            </div>
          ))}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Sending..." : submitLabel}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ContactBlock;
