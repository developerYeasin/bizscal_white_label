"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { Plus, X } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area.jsx";
import { cn } from "@/lib/utils.js";
import { useCategories } from "@/hooks/use-categories.js";
import CreateCategoryDialog from "@/components/categories/CreateCategoryDialog.jsx";
import { showSuccess } from "@/utils/toast.js";

const AssignCategoriesDialog = ({ isOpen, onClose, selectedCategoryIds, onSelectCategories }) => {
  const { categories, isLoading, error, createCategory } = useCategories();
  const [tempSelectedCategoryIds, setTempSelectedCategoryIds] = React.useState([]);
  const [isCreateCategoryDialogOpen, setIsCreateCategoryDialogOpen] = React.useState(false);

  React.useEffect(() => {
    if (isOpen) {
      setTempSelectedCategoryIds(selectedCategoryIds);
    }
  }, [isOpen, selectedCategoryIds]);

  const handleCategoryToggle = (categoryId) => {
    setTempSelectedCategoryIds(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleRemoveSelectedCategory = (categoryId) => {
    setTempSelectedCategoryIds(prev => prev.filter(id => id !== categoryId));
  };

  const handleDone = () => {
    onSelectCategories(tempSelectedCategoryIds);
    onClose();
  };

  const handleCreateCategorySuccess = (newCategoryPayload) => {
    createCategory(newCategoryPayload, {
      onSuccess: (newCategory) => {
        setTempSelectedCategoryIds(prev => [...prev, String(newCategory.id)]);
        showSuccess(`Category '${newCategory.name}' created and selected!`);
        setIsCreateCategoryDialogOpen(false);
      },
      onError: (err) => {
        // Error handled by useCategories hook
      }
    });
  };

  const availableCategories = categories || [];

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[600px] h-[90vh] max-h-[90vh] flex flex-col overflow-hidden">
          <DialogHeader className="p-4 pb-0">
            <div className="flex items-center justify-between">
              <DialogTitle>Assign categories</DialogTitle>
              <Button
                variant="outline"
                size="icon"
                className="bg-purple-600 hover:bg-purple-700 text-white"
                onClick={() => setIsCreateCategoryDialogOpen(true)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>
          <ScrollArea className="flex-1 h-0 px-4">
            <div className="py-4">
              <h3 className="text-lg font-semibold mb-2">Selected Categories</h3>
              <div className="flex flex-wrap gap-2 mb-6 min-h-[40px] border rounded-md p-2">
                {tempSelectedCategoryIds.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No categories selected.</p>
                ) : (
                  tempSelectedCategoryIds.map(id => {
                    const category = availableCategories.find(cat => String(cat.id) === id);
                    return category ? (
                      <Badge
                        key={id}
                        variant="secondary"
                        className="bg-purple-100 text-purple-700 hover:bg-purple-200 cursor-pointer flex items-center gap-1"
                        onClick={() => handleRemoveSelectedCategory(id)}
                      >
                        {category.name}
                        <X className="h-3 w-3 ml-1" />
                      </Badge>
                    ) : null;
                  })
                )}
              </div>

              <h3 className="text-lg font-semibold mb-2">All Categories</h3>
              {isLoading ? (
                <p className="text-center text-muted-foreground">Loading categories...</p>
              ) : error ? (
                <p className="text-center text-destructive">Error loading categories: {error.message}</p>
              ) : availableCategories.length === 0 ? (
                <p className="text-center text-muted-foreground">No categories available. Click '+' to create one.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {availableCategories.map(category => (
                    <Badge
                      key={category.id}
                      variant={tempSelectedCategoryIds.includes(String(category.id)) ? "default" : "outline"}
                      className={cn(
                        "cursor-pointer",
                        tempSelectedCategoryIds.includes(String(category.id))
                          ? "bg-purple-600 text-white hover:bg-purple-700"
                          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                      )}
                      onClick={() => handleCategoryToggle(String(category.id))}
                    >
                      {category.name}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            <ScrollBar orientation="vertical" />
          </ScrollArea>
          <div className="flex justify-end gap-2 mt-4 p-4 border-t">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white" onClick={handleDone}>Done</Button>
          </div>
        </DialogContent>
      </Dialog>

      <CreateCategoryDialog
        isOpen={isCreateCategoryDialogOpen}
        onClose={() => setIsCreateCategoryDialogOpen(false)}
        onSave={handleCreateCategorySuccess}
        initialData={null}
      />
    </>
  );
};

export default AssignCategoriesDialog;