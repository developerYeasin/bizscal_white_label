"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import api from "@/utils/api.js";
import { showSuccess, showError } from "@/utils/toast.js";
import { Card, CardContent } from "@/components/ui/card.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Textarea } from "@/components/ui/textarea.jsx";
import { Switch } from "@/components/ui/switch.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { Skeleton } from "@/components/ui/skeleton.jsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.jsx";
import { Separator } from "@/components/ui/separator.jsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs.jsx";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useThemeConfig } from "@/contexts/ThemeSettingsContext.jsx";
import { useStoreConfig } from "@/contexts/StoreConfigurationContext.jsx";
import { Loader2, Plus, GripVertical, Eye, Save, ChevronLeft, ChevronRight, Undo, Redo, Dot } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu.jsx";

// Import block components for rendering in canvas
import ComponentResolver from "@/components/landing-pages/ComponentResolver.jsx";

// Import block type definitions from theme
import { useAvailableThemes } from "@/hooks/use-available-themes.js";

// Simple history hook for undo/redo
const useHistory = (initialState) => {
  const [past, setPast] = useState([]);
  const [future, setFuture] = useState([]);
  const [present, setPresent] = useState(initialState);

  const push = useCallback((newState) => {
    setPast((prev) => [...prev.slice(-49), present]); // keep last 50 states
    setFuture([]);
    setPresent(newState);
  }, [present]);

  const undo = useCallback(() => {
    if (past.length === 0) return;
    setFuture((prev) => [present, ...prev.slice(0, 49)]);
    setPast((prev) => {
      const newPast = [...prev];
      return newPast.slice(0, -1);
    });
    setPresent(past[past.length - 1]);
  }, [past, present]);

  const redo = useCallback(() => {
    if (future.length === 0) return;
    setPast((prev) => [...prev.slice(-49), present]);
    setFuture((prev) => prev.slice(1));
    setPresent(future[0]);
  }, [future, present]);

  return { state: present, push, undo, redo, canUndo: past.length > 0, canRedo: future.length > 0 };
};

const PageBuilder = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { config: themeConfig } = useThemeConfig();
  const { config: storeConfig } = useStoreConfig();
  const { data: availableThemes } = useAvailableThemes();

  // State for page editing
  const [creating, setCreating] = useState(false);
  const [editingPage, setEditingPage] = useState(null);
  const [activeTab, setActiveTab] = useState("blocks");

  // Use history for blocks
  const { state: blocks, push: setBlocks, undo, redo, canUndo, canRedo } = useHistory([]);

  // Form data state
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    meta_title: "",
    meta_description: "",
    status: "draft",
  });

  // Selected block for editing
  const [selectedBlockId, setSelectedBlockId] = useState(null);

  // Fetch all theme blocks available for current theme
  const currentTheme = useMemo(() => {
    if (!storeConfig || !availableThemes) return null;
    return availableThemes.find(t => t.id === storeConfig.theme_id) || availableThemes[0];
  }, [storeConfig, availableThemes]);

  const themeBlocks = useMemo(() => {
    if (!currentTheme?.theme_blocks) return [];
    // Sort by sort_order
    return [...currentTheme.theme_blocks].sort((a, b) => a.sort_order - b.sort_order);
  }, [currentTheme]);

  // Fetch pages list
  const { data: pagesData, isLoading: pagesLoading } = useQuery({
    queryKey: ["customPages"],
    queryFn: async () => {
      const response = await api.get("/owner/custom-pages");
      return response.data.data.pages;
    },
    enabled: isAuthenticated,
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (data) => {
      const response = await api.post("/owner/custom-pages", {
        ...data,
        content: { blocks: data.blocks || [] }
      });
      return response.data;
    },
    onSuccess: () => {
      showSuccess("Page created successfully!");
      setCreating(false);
      resetForm();
      queryClient.invalidateQueries({ queryKey: ["customPages"] });
    },
    onError: (err) => {
      showError(err.response?.data?.message || "Failed to create page.");
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await api.put(`/owner/custom-pages/${id}`, {
        ...data,
        content: { blocks: data.blocks || [] }
      });
      return response.data;
    },
    onSuccess: () => {
      showSuccess("Page updated successfully!");
      setEditingPage(null);
      resetForm();
      queryClient.invalidateQueries({ queryKey: ["customPages"] });
    },
    onError: (err) => {
      showError(err.response?.data?.message || "Failed to update page.");
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await api.delete(`/owner/custom-pages/${id}`);
    },
    onSuccess: () => {
      showSuccess("Page deleted.");
      queryClient.invalidateQueries({ queryKey: ["customPages"] });
    },
    onError: (err) => {
      showError(err.response?.data?.message || "Failed to delete page.");
    },
  });

  // Auto-save draft when blocks change (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (editingPage && blocks.length > 0) {
        // Could auto-save here as draft
        // For now, we'll wait for manual save
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [blocks, editingPage]);

  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      meta_title: "",
      meta_description: "",
      status: "draft",
    });
    setBlocks([]);
    setEditingPage(null);
    setSelectedBlockId(null);
  };

  const handleCreate = () => {
    if (!formData.title || !formData.slug) {
      showError("Title and slug are required.");
      return;
    }
    createMutation.mutate({ ...formData, blocks });
  };

  const handleUpdate = () => {
    if (!formData.title || !formData.slug) {
      showError("Title and slug are required.");
      return;
    }
    updateMutation.mutate({ id: editingPage.id, data: { ...formData, blocks } });
  };

  const handleEdit = (page) => {
    setEditingPage(page);
    setFormData({
      title: page.title,
      slug: page.slug,
      meta_title: page.meta_title || "",
      meta_description: page.meta_description || "",
      status: page.status || "draft",
    });
    const pageBlocks = page.content?.blocks || [];
    setBlocks(Array.isArray(pageBlocks) ? pageBlocks : []);
    setCreating(false);
    setSelectedBlockId(null);
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this page? This action cannot be undone.")) {
      deleteMutation.mutate(id);
    }
  };

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setBlocks((items) => {
        const oldIndex = items.findIndex((b) => b.id === active.id);
        const newIndex = items.findIndex((b) => b.id === over.id);
        const newBlocks = arrayMove(items, oldIndex, newIndex);
        return newBlocks;
      });
    }
  };

  const addBlock = (blockType) => {
    const themeBlock = themeBlocks.find(b => b.block_type === blockType);
    const newBlock = {
      id: Date.now() + Math.random(),
      type: blockType,
      data: themeBlock?.default_config ? JSON.parse(JSON.stringify(themeBlock.default_config)) : {},
    };
    setBlocks((prev) => [...prev, newBlock]);
    setSelectedBlockId(newBlock.id);
    setActiveTab("properties");
  };

  const updateBlock = (blockId, updates) => {
    setBlocks((prev) =>
      prev.map((block) =>
        block.id === blockId ? { ...block, ...updates } : block
      )
    );
  };

  const updateBlockData = (blockId, dataKey, dataValue) => {
    setBlocks((prev) =>
      prev.map((block) =>
        block.id === blockId
          ? { ...block, data: { ...block.data, [dataKey]: dataValue } }
          : block
      )
    );
  };

  const removeBlock = (blockId) => {
    setBlocks((prev) => prev.filter((b) => b.id !== blockId));
    if (selectedBlockId === blockId) {
      setSelectedBlockId(null);
    }
  };

  const selectedBlock = blocks.find(b => b.id === selectedBlockId);

  // Preview for live canvas
  const renderPreview = () => {
    if (blocks.length === 0) {
      return (
        <div className="h-full flex items-center justify-center text-muted-foreground border-2 border-dashed rounded-lg">
          <div className="text-center">
            <p className="mb-2">Your page preview will appear here.</p>
            <p className="text-sm">Add blocks from the left panel to get started.</p>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {blocks.map((block) => (
          <div
            key={block.id}
            className={`relative border-2 rounded-lg overflow-hidden transition-colors cursor-pointer ${
              selectedBlockId === block.id ? "border-primary" : "border-transparent"
            }`}
            onClick={() => setSelectedBlockId(block.id)}
          >
            <button
              className="absolute top-2 right-2 z-10 bg-background border rounded p-1 shadow-sm opacity-0 group-hover:opacity-100"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedBlockId(block.id);
              }}
            >
              <GripVertical className="h-4 w-4" />
            </button>
            {/* We'll render the actual component in full page preview, but here we show a thumbnail */}
            <div className="p-4">
              <p className="text-xs font-medium mb-1">{block.type}</p>
              <ComponentResolver
                components={[block]}
                themeConfig={themeConfig}
                storeConfig={storeConfig}
              />
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Get block settings component
  const getBlockSettingsComponent = (blockType) => {
    const settingsMap = {
      heroBanner: () => import("@/components/landing-pages/settings/HeroBannerSettings.jsx").then(m => m.default),
      productCarousel: () => import("@/components/landing-pages/settings/ProductCarouselSettings.jsx").then(m => m.default),
      featuredCategories: () => import("@/components/landing-pages/settings/FeaturedCategoriesSettings.jsx").then(m => m.default),
      // Add more as needed
    };
    return settingsMap[blockType] || null;
  };

  // Loading state for settings component
  const [SettingsComponent, setSettingsComponent] = useState(null);
  useEffect(() => {
    if (selectedBlock) {
      const loadSettings = async () => {
        const comp = await getBlockSettingsComponent(selectedBlock.type);
        setSettingsComponent(() => comp);
      };
      loadSettings();
    } else {
      setSettingsComponent(null);
    }
  }, [selectedBlock?.type]);

  if (!isAuthenticated) {
    return <div className="p-6">Please login.</div>;
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col p-4 md:p-6 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ChevronLeft className="h-4 w-4 mr-1" /> Back
          </Button>
          <h1 className="text-2xl font-bold">
            {editingPage ? `Edit Page: ${editingPage.title}` : creating ? "Create New Page" : "Page Builder"}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={undo}
            disabled={!canUndo}
          >
            <Undo className="h-4 w-4 mr-1" /> Undo
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={redo}
            disabled={!canRedo}
          >
            <Redo className="h-4 w-4 mr-1" /> Redo
          </Button>
          <Separator orientation="vertical" className="h-6 mx-2" />
          {editingPage ? (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (window.confirm("Delete this page?")) {
                    handleDelete(editingPage.id);
                  }
                }}
              >
                Delete
              </Button>
              <Button size="sm" onClick={handleUpdate} disabled={updateMutation.isPending}>
                {updateMutation.isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                <Save className="h-4 w-4 mr-2" /> Save Changes
              </Button>
            </>
          ) : creating ? (
            <>
              <Button variant="outline" size="sm" onClick={() => { setCreating(false); resetForm(); }}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleCreate} disabled={createMutation.isPending}>
                {createMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                Create Page
              </Button>
            </>
          ) : (
            <Button size="sm" onClick={() => setCreating(true)}>
              <Plus className="h-4 w-4 mr-2" /> Create New Page
            </Button>
          )}
        </div>
      </div>

      {/* Main Content */}
      {creating || editingPage ? (
        <div className="flex-1 flex gap-4 overflow-hidden">
          {/* Left Sidebar: Block Library */}
          <div className="w-64 flex-shrink-0 border rounded-lg p-4 overflow-y-auto">
            <h3 className="font-semibold mb-3">Blocks</h3>
            {!currentTheme ? (
              <p className="text-sm text-muted-foreground">No theme selected. Apply a theme first.</p>
            ) : (
              <div className="space-y-2">
                {themeBlocks.map((block) => (
                  <Card
                    key={block.id}
                    className="cursor-pointer hover:bg-accent p-3"
                    onClick={() => addBlock(block.block_type)}
                  >
                    <CardContent className="p-0">
                      <p className="text-sm font-medium">{block.name || block.block_type}</p>
                      <p className="text-xs text-muted-foreground">{block.description || ""}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Center: Live Canvas Preview */}
          <div className="flex-1 border rounded-lg p-6 overflow-y-auto bg-muted/20">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold">Live Preview</h3>
              <Button
                variant="outline"
                size="sm"
                asChild
              >
                <a href={`/pages/${formData.slug || 'preview'}`} target="_blank" rel="noopener noreferrer">
                  <Eye className="h-4 w-4 mr-2" /> Open in New Tab
                </a>
              </Button>
            </div>
            {/* Render the full page preview with ComponentResolver */}
            <div className="min-h-[500px]">
              <ComponentResolver
                components={blocks}
                themeConfig={themeConfig}
                storeConfig={storeConfig}
              />
            </div>
          </div>

          {/* Right Sidebar: Properties */}
          <div className="w-80 flex-shrink-0 border rounded-lg p-4 overflow-y-auto">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full mb-4">
                <TabsTrigger value="properties" className="flex-1">Properties</TabsTrigger>
                <TabsTrigger value="seo" className="flex-1">SEO</TabsTrigger>
              </TabsList>

              <TabsContent value="properties" className="space-y-4">
                {!selectedBlock ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    Select a block to edit its properties.
                  </p>
                ) : SettingsComponent ? (
                  <SettingsComponent
                    block={selectedBlock}
                    onChange={(updates) => updateBlock(selectedBlock.id, updates)}
                    onDataChange={(key, value) => updateBlockData(selectedBlock.id, key, value)}
                  />
                ) : (
                  <p className="text-sm text-muted-foreground">No settings available for this block type.</p>
                )}
              </TabsContent>

              <TabsContent value="seo" className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Page Title</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Page Title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">URL Slug</label>
                  <Input
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: generateSlug(e.target.value) })}
                    placeholder="page-url"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Meta Title (SEO)</label>
                  <Input
                    value={formData.meta_title}
                    onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                    placeholder="SEO title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Meta Description (SEO)</label>
                  <Textarea
                    value={formData.meta_description}
                    onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                    placeholder="SEO description"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>
            </Tabs>

            <div className="mt-6 pt-4 border-t">
              <Button
                variant="destructive"
                size="sm"
                className="w-full"
                onClick={() => {
                  if (selectedBlockId && window.confirm("Remove this block?")) {
                    removeBlock(selectedBlockId);
                  }
                }}
                disabled={!selectedBlockId}
              >
                Remove Selected Block
              </Button>
            </div>
          </div>
        </div>
      ) : (
        // List View
        <div className="flex-1 overflow-auto">
          {pagesLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : pagesData?.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground mb-4">No pages created yet.</p>
                <Button onClick={() => setCreating(true)}>Create Your First Page</Button>
              </CardContent>
            </Card>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-border">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Title</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Slug</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Blocks</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Updated</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {pagesData?.map((page) => (
                    <tr key={page.id} className="hover:bg-muted/50">
                      <td className="px-4 py-3 text-sm font-medium">{page.title}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">/pages/{page.slug}</td>
                      <td className="px-4 py-3 text-sm">
                        <Badge variant={page.status === "published" ? "default" : "secondary"}>
                          {page.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {page.content?.blocks?.length || 0} blocks
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {new Date(page.updated_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-sm text-right space-x-2">
                        <div className="relative">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button size="sm" variant="ghost" className="p-1">
                                <Dot className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-[80px]">
                              <DropdownMenuItem onClick={() => handleEdit(page)}>
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDelete(page.id)} disabled={deleteMutation.isPending}>
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PageBuilder;
