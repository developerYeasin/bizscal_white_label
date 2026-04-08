"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext.jsx";
import api from "@/utils/api.js";
import { showSuccess, showError } from "@/utils/toast.js";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Textarea } from "@/components/ui/textarea.jsx";
import { Switch } from "@/components/ui/switch.jsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.jsx";
import { Card, CardContent } from "@/components/ui/card.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { Skeleton } from "@/components/ui/skeleton.jsx";
import { Separator } from "@/components/ui/separator.jsx";
import {
  Save,
  ArrowLeft,
  Plus,
  Trash2,
  GripVertical,
  Eye,
  Palette,
  Layout,
  Settings,
} from "lucide-react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, arrayMove, verticalListSortingStrategy } from "@dnd-kit/sortable";

// Import block settings components (for preview)
// Not using ComponentResolver for preview
import { useThemeConfig } from "@/contexts/ThemeSettingsContext.jsx";
import { useStoreConfig } from "@/contexts/StoreConfigurationContext.jsx";

const ThemeBuilder = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const themeId = searchParams.get("themeId");

  const isEditing = !!themeId;

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "Modern",
    version: "1.0.0",
    status: "active",
    access_level: "public",
    features: {},
    preview_image_url: "",
    live_demo_url: "",
    config: {
      primary_color: "#6B46C1",
      secondary_color: "#FFFFFF",
      theme_mode: "Light",
      buy_now_button_enabled: true,
    },
  });

  // Theme blocks state - the blocks that belong to this theme
  const [themeBlocks, setThemeBlocks] = useState([]);
  const [selectedBlockId, setSelectedBlockId] = useState(null);

  // Fetch all available block types (from theme_blocks table, distinct block_type)
  const { data: allBlockTypes, isLoading: blocksLoading } = useQuery({
    queryKey: ["allBlockTypes"],
    queryFn: async () => {
      const response = await api.get("/owner/theme-blocks");
      const blocks = response.data.data.theme_blocks || [];
      // Get unique block types
      const typesMap = {};
      blocks.forEach(block => {
        if (!typesMap[block.block_type]) {
          typesMap[block.block_type] = {
            block_type: block.block_type,
            name: block.name,
            description: block.description,
            category: block.category,
          };
        }
      });
      return Object.values(typesMap);
    },
    enabled: isAuthenticated,
  });

  // Fetch theme data if editing
  const { data: themeData, isLoading: themeLoading } = useQuery({
    queryKey: ["theme", themeId],
    queryFn: async () => {
      const response = await api.get(`/admin/themes/${themeId}`);
      return response.data.data;
    },
    enabled: isAuthenticated && isEditing,
  });

  // Load theme data into form when fetched
  useEffect(() => {
    if (themeData) {
      setFormData({
        name: themeData.name || "",
        description: themeData.description || "",
        category: themeData.category || "Modern",
        version: themeData.version || "1.0.0",
        status: themeData.status || "active",
        access_level: themeData.access_level || "public",
        features: themeData.features || {},
        preview_image_url: themeData.preview_image_url || "",
        live_demo_url: themeData.live_demo_url || "",
        config: themeData.config || {
          primary_color: "#6B46C1",
          secondary_color: "#FFFFFF",
          theme_mode: "Light",
          buy_now_button_enabled: true,
        },
      });

      // Load theme blocks
      if (themeData.theme_blocks) {
        setThemeBlocks(
          themeData.theme_blocks.map(b => ({
            id: b.id,
            block_type: b.block_type,
            name: b.name,
            description: b.description,
            category: b.category,
            default_config: b.default_config || {},
            sort_order: b.sort_order,
          }))
        );
      }
    }
  }, [themeData]);

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (data) => {
      const response = await api.post("/admin/themes", {
        ...data,
        blocks: data.blocks || [],
      });
      return response.data;
    },
    onSuccess: () => {
      showSuccess("Theme created successfully!");
      queryClient.invalidateQueries({ queryKey: ["themes"] });
      navigate("/customize-theme");
    },
    onError: (err) => {
      showError(err.response?.data?.message || "Failed to create theme.");
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await api.put(`/admin/themes/${id}`, {
        ...data,
        blocks: data.blocks || [],
      });
      return response.data;
    },
    onSuccess: () => {
      showSuccess("Theme updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["themes"] });
      navigate("/customize-theme");
    },
    onError: (err) => {
      showError(err.response?.data?.message || "Failed to update theme.");
    },
  });

  const handleSave = () => {
    if (!formData.name.trim()) {
      showError("Theme name is required.");
      return;
    }

    const payload = {
      ...formData,
      blocks: themeBlocks.map((b, idx) => ({
        block_type: b.block_type,
        name: b.name,
        description: b.description,
        category: b.category,
        default_config: b.default_config || {},
        sort_order: idx,
      })),
    };

    if (isEditing) {
      updateMutation.mutate({ id: themeId, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleAddBlock = (blockTypeInfo) => {
    const newBlock = {
      id: Date.now() + Math.random(),
      block_type: blockTypeInfo.block_type,
      name: blockTypeInfo.name,
      description: blockTypeInfo.description || "",
      category: blockTypeInfo.category || "Components",
      default_config: {},
      sort_order: themeBlocks.length,
    };
    setThemeBlocks((prev) => [...prev, newBlock]);
  };

  const handleRemoveBlock = (blockId) => {
    setThemeBlocks((prev) => prev.filter((b) => b.id !== blockId));
    if (selectedBlockId === blockId) {
      setSelectedBlockId(null);
    }
  };

  const handleUpdateBlock = (blockId, updates) => {
    setThemeBlocks((prev) =>
      prev.map((b) => (b.id === blockId ? { ...b, ...updates } : b))
    );
  };

  const handleUpdateBlockConfig = (blockId, config) => {
    setThemeBlocks((prev) =>
      prev.map((b) =>
        b.id === blockId ? { ...b, default_config: config } : b
      )
    );
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setThemeBlocks((items) => {
      const oldIndex = items.findIndex((b) => b.id === active.id);
      const newIndex = items.findIndex((b) => b.id === over.id);
      return arrayMove(items, oldIndex, newIndex);
    });
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: undefined })
  );

  const selectedBlock = themeBlocks.find((b) => b.id === selectedBlockId);

  // Get block renderer for preview (not used currently)

  if (!isAuthenticated) {
    return <div className="p-6">Please login.</div>;
  }

  if (isEditing && themeLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col p-4 md:p-6 overflow-hidden bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </Button>
          <h1 className="text-2xl font-bold">
            {isEditing ? `Edit Theme: ${formData.name}` : "Create New Theme"}
          </h1>
        </div>
        <Button onClick={handleSave} disabled={createMutation.isPending || updateMutation.isPending}>
          {createMutation.isPending || updateMutation.isPending ? (
            <>Saving...</>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" /> {isEditing ? "Update Theme" : "Create Theme"}
            </>
          )}
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex gap-4 overflow-hidden">
        {/* Left Panel - Theme Settings & Block Palette */}
        <div className="w-96 flex flex-col gap-4 overflow-y-auto">
          {/* Theme Basic Info */}
          <Card>
            <CardContent className="p-4 space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Palette className="h-4 w-4" /> Theme Information
              </h3>
              <div>
                <label className="text-xs font-medium text-gray-600">Theme Name</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="My Awesome Theme"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600">Description</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of this theme"
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-600">Category</label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Modern">Modern</SelectItem>
                      <SelectItem value="Minimalist">Minimalist</SelectItem>
                      <SelectItem value="Ecommerce">Ecommerce</SelectItem>
                      <SelectItem value="Corporate">Corporate</SelectItem>
                      <SelectItem value="Creative">Creative</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">Access Level</label>
                  <Select value={formData.access_level} onValueChange={(value) => setFormData({ ...formData, access_level: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Access" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-600">Version</label>
                  <Input
                    value={formData.version}
                    onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                    placeholder="1.0.0"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">Status</label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Theme Colors */}
          <Card>
            <CardContent className="p-4 space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Settings className="h-4 w-4" /> Theme Colors
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-600">Primary Color</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Input
                      type="color"
                      value={formData.config.primary_color}
                      onChange={(e) => setFormData({
                        ...formData,
                        config: { ...formData.config, primary_color: e.target.value }
                      })}
                      className="w-10 h-10 p-1"
                    />
                    <Input
                      value={formData.config.primary_color}
                      onChange={(e) => setFormData({
                        ...formData,
                        config: { ...formData.config, primary_color: e.target.value }
                      })}
                      className="flex-1"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">Secondary Color</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Input
                      type="color"
                      value={formData.config.secondary_color}
                      onChange={(e) => setFormData({
                        ...formData,
                        config: { ...formData.config, secondary_color: e.target.value }
                      })}
                      className="w-10 h-10 p-1"
                    />
                    <Input
                      value={formData.config.secondary_color}
                      onChange={(e) => setFormData({
                        ...formData,
                        config: { ...formData.config, secondary_color: e.target.value }
                      })}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-600">Theme Mode</label>
                  <Select value={formData.config.theme_mode} onValueChange={(value) => setFormData({
                    ...formData,
                    config: { ...formData.config, theme_mode: value }
                  })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Light">Light</SelectItem>
                      <SelectItem value="Dark">Dark</SelectItem>
                      <SelectItem value="Auto">Auto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2 mt-6">
                  <Switch
                    checked={formData.config.buy_now_button_enabled}
                    onCheckedChange={(checked) => setFormData({
                      ...formData,
                      config: { ...formData.config, buy_now_button_enabled: checked }
                    })}
                  />
                  <label className="text-xs font-medium">Buy Now Button</label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Theme Blocks Palette */}
          <Card className="flex-1 min-h-0">
            <CardContent className="p-4 flex flex-col h-full">
              <h3 className="font-semibold flex items-center gap-2 mb-3">
                <Layout className="h-4 w-4" /> Theme Blocks ({themeBlocks.length})
              </h3>
              <div className="text-xs text-gray-500 mb-3">
                Click to add blocks to this theme. Blocks will be available in the page builder.
              </div>
              <div className="flex-1 overflow-y-auto space-y-2">
                {blocksLoading ? (
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-16 w-full" />
                    ))}
                  </div>
                ) : allBlockTypes && allBlockTypes.length > 0 ? (
                  allBlockTypes
                    .filter(bt => !themeBlocks.some(tb => tb.block_type === bt.block_type))
                    .map((blockType) => (
                      <div
                        key={blockType.block_type}
                        className="border rounded-lg p-3 cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors"
                        onClick={() => handleAddBlock(blockType)}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-sm font-medium">{blockType.name}</p>
                            <p className="text-xs text-gray-500 line-clamp-2">{blockType.description}</p>
                          </div>
                          <Plus className="h-4 w-4 text-gray-400" />
                        </div>
                      </div>
                    ))
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">No available block types</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Center - Theme Blocks Preview */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <Card className="flex-1 flex flex-col overflow-hidden">
            <CardContent className="p-4 flex flex-col h-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Theme Blocks Preview</h3>
                <span className="text-xs text-gray-500">
                  Drag to reorder • Click to configure
                </span>
              </div>

              {themeBlocks.length === 0 ? (
                <div className="flex-1 flex items-center justify-center border-2 border-dashed rounded-lg">
                  <div className="text-center">
                    <Layout className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No blocks added yet</p>
                    <p className="text-sm text-gray-400">Add blocks from the left panel</p>
                  </div>
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto space-y-3">
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={themeBlocks.map(b => b.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      {themeBlocks.map((block) => (
                        <div
                          key={block.id}
                          className={`border-2 rounded-lg overflow-hidden cursor-pointer transition-colors ${
                            selectedBlockId === block.id
                              ? "border-primary bg-accent/30"
                              : "border-transparent hover:border-gray-300"
                          }`}
                          onClick={() => setSelectedBlockId(block.id)}
                        >
                          <div className="p-3">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <div className="cursor-grab p-1 text-gray-400 hover:text-gray-600">
                                  <GripVertical className="h-4 w-4" />
                                </div>
                                <div>
                                  <p className="text-sm font-medium">{block.name}</p>
                                  <p className="text-xs text-gray-500">{block.block_type}</p>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemoveBlock(block.id);
                                }}
                              >
                                <Trash2 className="h-3 w-3 text-red-500" />
                              </Button>
                            </div>
                            {/* Preview of block with its default config */}
                            <div className="border rounded bg-gray-50 p-2 mt-2">
                              <div className="text-xs text-gray-500 mb-1">Preview</div>
                              <div className="h-24 flex items-center justify-center">
                                <BlockPreview block={block} />
                              </div>
                            </div>
                          </div>

                          {selectedBlockId === block.id && (
                            <div className="border-t p-3 bg-white">
                              <h4 className="text-sm font-semibold mb-2">Default Configuration</h4>
                              <BlockConfigEditor
                                blockType={block.block_type}
                                config={block.default_config}
                                onChange={(newConfig) => handleUpdateBlockConfig(block.id, newConfig)}
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </SortableContext>
                  </DndContext>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Panel - Selected Block Details */}
        {selectedBlock && (
          <div className="w-80 bg-white border rounded-lg p-4 overflow-y-auto">
            <h3 className="font-semibold mb-4">Block Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-600">Block Name</label>
                <Input
                  value={selectedBlock.name}
                  onChange={(e) => handleUpdateBlock(selectedBlock.id, { name: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600">Description</label>
                <Textarea
                  value={selectedBlock.description}
                  onChange={(e) => handleUpdateBlock(selectedBlock.id, { description: e.target.value })}
                  rows={2}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600">Category</label>
                <Select
                  value={selectedBlock.category}
                  onValueChange={(value) => handleUpdateBlock(selectedBlock.id, { category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Layout">Layout</SelectItem>
                    <SelectItem value="Content">Content</SelectItem>
                    <SelectItem value="Ecommerce">Ecommerce</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Separator />
              <div>
                <label className="text-xs font-medium text-gray-600">Default Configuration</label>
                <BlockConfigEditor
                  blockType={selectedBlock.block_type}
                  config={selectedBlock.default_config}
                  onChange={(newConfig) => handleUpdateBlockConfig(selectedBlock.id, newConfig)}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Simple block preview component
const BlockPreview = ({ block }) => {
  try {
    // We'll render a simple placeholder for now
    return (
      <div className="text-center">
        <div className="text-2xl mb-2">📦</div>
        <div className="text-xs font-medium">{block.block_type}</div>
      </div>
    );
  } catch (error) {
    return (
      <div className="text-xs text-red-500">Preview not available</div>
    );
  }
};

// Block configuration editor based on block type
const BlockConfigEditor = ({ blockType, config, onChange }) => {
  // Different config editors for different block types
  const renderConfigFields = () => {
    switch (blockType) {
      case "heroBanner":
        return (
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium">Title</label>
              <Input
                value={config.title || ""}
                onChange={(e) => onChange({ ...config, title: e.target.value })}
                placeholder="Hero title"
              />
            </div>
            <div>
              <label className="text-xs font-medium">Subtitle</label>
              <Textarea
                value={config.subtitle || ""}
                onChange={(e) => onChange({ ...config, subtitle: e.target.value })}
                rows={2}
              />
            </div>
            <div>
              <label className="text-xs font-medium">CTA Button Text</label>
              <Input
                value={config.ctaButton?.text || ""}
                onChange={(e) => onChange({ ...config, ctaButton: { ...config.ctaButton, text: e.target.value } })}
                placeholder="Shop Now"
              />
            </div>
          </div>
        );
      case "productCarousel":
        return (
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium">Products Count</label>
              <Input
                type="number"
                value={config.product_count || 8}
                onChange={(e) => onChange({ ...config, product_count: parseInt(e.target.value) })}
                min={1}
                max={20}
              />
            </div>
            <div>
              <label className="text-xs font-medium">Auto Play</label>
              <Switch
                checked={config.auto_play || false}
                onCheckedChange={(checked) => onChange({ ...config, auto_play: checked })}
              />
            </div>
          </div>
        );
      default:
        return (
          <div className="text-xs text-gray-500">
            No configuration options available for this block type.
          </div>
        );
    }
  };

  return renderConfigFields();
};

export default ThemeBuilder;
