"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/utils/api.js";
import { useAuth } from "@/contexts/AuthContext.jsx"; // Import useAuth

const fetchAvailableThemes = async () => {
  const response = await api.get("/owner/themes");
  return response.data.data.themes.map(theme => ({
    id: theme.id, // Database ID (integer)
    theme_id: theme.theme_id, // Theme identifier string (e.g., "basic-1")
    name: theme.name,
    imageSrc: theme.preview_image_url,
    status: theme.access_level === 'free' ? 'active' : (theme.access_level === 'standard' ? 'premium' : 'coming-soon'),
  }));
};

export const useAvailableThemes = () => {
  const { isAuthenticated } = useAuth(); // Get authentication status
  return useQuery({
    queryKey: ["availableThemes"],
    queryFn: fetchAvailableThemes,
    staleTime: Infinity, // These are static, so no need to refetch often
    enabled: isAuthenticated, // Only fetch if authenticated
  });
};