"use client";

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext.jsx";
import api from "@/utils/api.js";
import { showSuccess, showError } from "@/utils/toast.js";
import { Button } from "@/components/ui/button.jsx";
import { Card, CardContent } from "@/components/ui/card.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { Skeleton } from "@/components/ui/skeleton.jsx";
import { Plus, Edit2, Trash2, Eye, Palette } from "lucide-react";

const ThemeManagement = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: themes, isLoading, refetch } = useQuery({
    queryKey: ["adminThemes"],
    queryFn: async () => {
      const response = await api.get("/admin/themes");
      return response.data.data;
    },
    enabled: isAuthenticated,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await api.delete(`/admin/themes/${id}`);
    },
    onSuccess: () => {
      showSuccess("Theme deleted.");
      queryClient.invalidateQueries({ queryKey: ["adminThemes"] });
    },
    onError: (err) => {
      showError(err.response?.data?.message || "Failed to delete theme.");
    },
  });

  const handleDelete = (id, name) => {
    if (window.confirm(`Delete theme "${name}"? This action cannot be undone.`)) {
      deleteMutation.mutate(id);
    }
  };

  if (!isAuthenticated) {
    return <div className="p-6">Please login.</div>;
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col p-4 md:p-6 overflow-auto bg-gray-50">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Theme Management</h1>
          <p className="text-sm text-gray-500">Create and manage store themes</p>
        </div>
        <Button onClick={() => navigate("/theme-builder")}>
          <Plus className="h-4 w-4 mr-2" /> Create Theme
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <Skeleton className="h-48 w-full" />
              <CardContent className="p-4 space-y-2">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : themes?.data?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {themes.data.map((theme) => (
            <Card key={theme.id} className="overflow-hidden">
              <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 relative">
                {theme.preview_image_url ? (
                  <img
                    src={theme.preview_image_url}
                    alt={theme.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white">
                    <Palette className="h-16 w-16 opacity-50" />
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <Badge variant={theme.status === "published" ? "default" : "secondary"}>
                    {theme.status}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-lg">{theme.name}</h3>
                </div>
                <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                  {theme.description || "No description"}
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
                  <span>v{theme.version}</span>
                  <span>•</span>
                  <span className="capitalize">{theme.category}</span>
                  <span>•</span>
                  <span className="capitalize">{theme.access_level}</span>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => navigate(`/theme-builder?themeId=${theme.id}`)}
                  >
                    <Edit2 className="h-4 w-4 mr-1" /> Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(theme.id, theme.name)}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <Palette className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No themes yet</h3>
            <p className="text-gray-500 mb-4">Create your first theme to get started.</p>
            <Button onClick={() => navigate("/theme-builder")}>
              <Plus className="h-4 w-4 mr-2" /> Create Theme
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ThemeManagement;
