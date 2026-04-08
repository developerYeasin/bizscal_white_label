"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/utils/api.js";
import { useAuth } from "@/contexts/AuthContext.jsx"; // Import useAuth

const fetchAvailableLandingPageTemplates = async () => {
  // Corrected API endpoint to fetch landing page templates
  const response = await api.get("/owner/landing-page-templates");
  // Corrected data mapping to match the 'template' object structure from the API response
  const templates = response.data.data; // Corrected: Access data directly, not data.templates
  
  if (!templates) {
    return []; // Return an empty array if templates is undefined or null
  }

  return templates.map(template => ({
    id: template.id, // Database ID (integer)
    name: template.name,
    imageSrc: template.preview_image_url,
    status: template.access_level === 'free' ? 'active' : (template.access_level === 'standard' ? 'premium' : 'coming-soon'),
    template_config: template.template_config, // Include the full template config
    access_level: template.access_level, // Keep access_level for disabling premium templates
  }));
};

export const useAvailableLandingPageTemplates = (enabled = true) => {
  const { isAuthenticated } = useAuth(); // Get authentication status
  return useQuery({
    queryKey: ["availableLandingPageTemplates"],
    queryFn: fetchAvailableLandingPageTemplates,
    staleTime: Infinity, // These are static, so no need to refetch often
    enabled: isAuthenticated && enabled, // Only fetch if authenticated and enabled
  });
};