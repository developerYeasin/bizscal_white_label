"use client";

import React, { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import api from "@/utils/api.js";
import { showSuccess, showError } from "@/utils/toast.js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { Check, Loader2, Sparkles } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton.jsx";
import { Separator } from "@/components/ui/separator.jsx";

const ThemeMarketplace = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: themesData, isLoading, error } = useQuery({
    queryKey: ["adminThemes"],
    queryFn: async () => {
      const response = await api.get("/owner/themes/detailed");
      return response.data.data.themes;
    },
    enabled: isAuthenticated,
  });

  const applyMutation = useMutation({
    mutationFn: async (themeId) => {
      const response = await api.post("/owner/themes/apply", { theme_id: themeId });
      return response.data;
    },
    onSuccess: () => {
      showSuccess("Theme applied successfully!");
      queryClient.invalidateQueries({ queryKey: ["storeConfiguration"] });
    },
    onError: (err) => {
      showError(err.response?.data?.message || "Failed to apply theme.");
    },
  });

  const handleApply = (theme) => {
    if (window.confirm(`Apply "${theme.name}" theme? This will update your store's appearance.`)) {
      applyMutation.mutate(theme.id);
    }
  };

  const getAccessLevelBadge = (accessLevel) => {
    const variants = {
      free: "bg-green-100 text-green-800",
      standard: "bg-blue-100 text-blue-800",
      premium: "bg-purple-100 text-purple-800",
    };
    return variants[accessLevel] || "bg-gray-100 text-gray-800";
  };

  if (error) {
    return (
      <div className="p-6">
        <p className="text-destructive">Error loading themes: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Theme Marketplace</h1>
        <Button variant="outline" onClick={() => navigate("/customize-theme")}>
          Customize Theme Settings
        </Button>
      </div>

      <p className="text-muted-foreground mb-6">
        Choose a theme for your store. Each theme comes with its own design, layout blocks, and customization options.
      </p>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <Skeleton className="h-48 w-full" />
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {themesData?.map((theme) => (
            <Card key={theme.id} className="flex flex-col">
              <div className="relative h-48 bg-muted overflow-hidden">
                {theme.preview_image_url ? (
                  <img
                    src={theme.preview_image_url}
                    alt={theme.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    No Preview
                  </div>
                )}
                <Badge className={`absolute top-2 right-2 ${getAccessLevelBadge(theme.access_level)}`}>
                  {theme.access_level}
                </Badge>
              </div>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>{theme.name}</span>
                  <span className="text-sm font-normal text-muted-foreground">
                    v{theme.version}
                  </span>
                </CardTitle>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {theme.description || "No description provided."}
                </p>
              </CardHeader>
              <CardContent className="flex flex-col space-y-4 mt-auto">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Sparkles className="h-4 w-4 mr-2" />
                  {theme.block_count} blocks available
                </div>
                <div className="flex gap-2">
                  <Button
                    className="flex-1"
                    onClick={() => handleApply(theme)}
                    disabled={applyMutation.isPending}
                  >
                    {applyMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Check className="h-4 w-4 mr-2" />
                    )}
                    Apply Theme
                  </Button>
                  {theme.live_demo_url && (
                    <Button variant="outline" asChild>
                      <a href={theme.live_demo_url} target="_blank" rel="noopener noreferrer">
                        Preview
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Separator className="my-8" />

      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4">Applied Theme</h2>
        {themesData && (
          <Card>
            <CardContent className="p-4">
              <p className="font-medium">
                Current theme: {themesData.find(t => t.id === parseInt(themesData[0]?.id || "0"))?.name || 'Unknown'}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Go to Customize Theme to adjust colors, fonts, and layout.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ThemeMarketplace;
