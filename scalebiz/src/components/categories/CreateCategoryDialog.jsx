"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Textarea } from "@/components/ui/textarea.jsx";
import { Image, Copy } from "lucide-react"; // Import Copy icon
import { showInfo } from "@/utils/toast.js";
import { useCategories } from "@/hooks/use-categories.js";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.jsx";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area.jsx";
import { uploadSingleImage } from "@/utils/upload.js";

const CreateCategoryDialog = ({ isOpen, onClose, onSave, initialData }) => {
  const { categories: allCategories, isLoading: categoriesLoading, duplicateCategory, isDuplicatingCategory } = useCategories(); // Get duplicateCategory mutation
  const [categoryName, setCategoryName] = React.useState(initialData?.name || "");
  const [shortDescription, setShortDescription] = React.useState(initialData?.description || "");
  const [bannerImageUrl, setBannerImageUrl] = React.useState(initialData?.image_url || "");
  const [squareImageUrl, setSquareImageUrl] = React.useState(initialData?.image_url || "");
  const [parentId, setParentId] = React.useState(initialData?.parent_id ? String(initialData.parent_id) : "none");

  const bannerInputRef = React.useRef(null);
  const squareInputRef = React.useRef(null);

  React.useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setCategoryName(initialData.name || "");
        setShortDescription(initialData.description || "");
        setBannerImageUrl(initialData.image_url || "");
        setSquareImageUrl(initialData.image_url || "");
        setParentId(initialData.parent_id ? String(initialData.parent_id) : "none");
      } else {
        setCategoryName("");
        setShortDescription("");
        setBannerImageUrl("");
        setSquareImageUrl("");
        setParentId("none");
      }
    }
  }, [isOpen, initialData]);

  const handleFileSelect = async (event, imageType) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const { imageUrl } = await uploadSingleImage(file);
      if (imageType === 'banner') {
        setBannerImageUrl(imageUrl);
      } else {
        setSquareImageUrl(imageUrl);
      }
    } catch (error) {
      // Error is handled by the toast in the upload utility
    }
  };

  const handleSaveClick = () => {
    if (!categoryName) {
      showInfo("Category Name is required.");
      return;
    }

    const payload = {
      name: categoryName,
      description: shortDescription,
      image_url: bannerImageUrl || squareImageUrl || null,
      is_active: 1,
      is_featured: 0,
      sort_order: 0,
      parent_id: parentId === "none" ? null : Number(parentId),
    };
    onSave(payload);
  };

  const handleDuplicateAsDraft = () => {
    if (initialData?.id) { // Only duplicate if it's an existing category
      duplicateCategory(initialData.id, {
        onSuccess: (newCategory) => {
          onClose(); // Close the current dialog
          // The parent `Categories.jsx` will handle opening a new dialog with `newCategory`
        }
      });
    } else {
      showInfo("Cannot duplicate a category that hasn't been saved yet.");
    }
  };

  const parentCategoryOptions = React.useMemo(() => {
    if (!allCategories) return [];
    const filtered = allCategories.filter(cat => cat.id !== initialData?.id);
    return filtered.map(cat => ({ value: String(cat.id), label: cat.name }));
  }, [allCategories, initialData]);

  const selectedParentCategoryLabel = React.useMemo(() => {
    if (parentId === "none" || !parentId) {
      return "No Parent (Main Category)";
    }
    const selectedOption = parentCategoryOptions.find(option => option.value === parentId);
    return selectedOption ? selectedOption.label : "Select Parent Category";
  }, [parentId, parentCategoryOptions]);


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] h-[90vh] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Category" : "Create Category"}</DialogTitle>
          <DialogDescription>
            {initialData ? "Edit the details of your category." : "Fill in the details to create a new category."}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="flex-1 h-0">
          <div className="grid gap-4 p-4">
            <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center flex flex-col items-center justify-center">
              <input
                type="file"
                ref={bannerInputRef}
                onChange={(e) => handleFileSelect(e, 'banner')}
                accept="image/png, image/jpeg, image/gif"
                style={{ display: 'none' }}
              />
              {bannerImageUrl ? (
                <img src={bannerImageUrl} alt="Banner" className="h-24 w-auto object-contain mb-2" />
              ) : (
                <Image className="h-12 w-auto text-muted-foreground mb-2" />
              )}
              <p className="text-sm text-muted-foreground mb-2">
                Upload a banner image for the category. Recommended size is 1300×380 pixels. Maximum file size is 4MB.
              </p>
              <Button variant="outline" onClick={() => bannerInputRef.current.click()}>
                {bannerImageUrl ? "Change Image" : "Add Image"}
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center flex flex-col items-center justify-center">
                <input
                  type="file"
                  ref={squareInputRef}
                  onChange={(e) => handleFileSelect(e, 'square')}
                  accept="image/png, image/jpeg, image/gif"
                  style={{ display: 'none' }}
                />
                {squareImageUrl ? (
                  <img src={squareImageUrl} alt="Square" className="h-24 w-24 object-cover mb-2" />
                ) : (
                  <Image className="h-12 w-12 text-muted-foreground mb-2" />
                )}
                <p className="text-sm text-muted-foreground mb-2">
                  Upload a square image for the category (1:1) aspect ratio. Recommended size is 500×500 pixels. Maximum file size is 4MB.
                </p>
                <Button variant="outline" onClick={() => squareInputRef.current.click()}>
                  {squareImageUrl ? "Change Image" : "Add Image"}
                </Button>
              </div>
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="categoryName">Category Name <span className="text-destructive">*</span></Label>
                  <Input
                    id="categoryName"
                    placeholder="Category Name"
                    className="mt-1"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    maxLength={50}
                    required
                  />
                  <p className="text-xs text-muted-foreground text-right mt-1">Character limit: {50 - categoryName.length}</p>
                </div>
                <div>
                  <Label htmlFor="shortDescription">Short Description</Label>
                  <Textarea
                    id="shortDescription"
                    placeholder="Short description..."
                    className="mt-1"
                    value={shortDescription}
                    onChange={(e) => setShortDescription(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="parentId">Parent Category</Label>
                  <Select
                    value={parentId || "none"}
                    onValueChange={(value) => setParentId(value)}
                    disabled={categoriesLoading}
                  >
                    <SelectTrigger id="parentId" className="mt-1">
                      <SelectValue placeholder="Select Parent Category">
                        {selectedParentCategoryLabel}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No Parent (Main Category)</SelectItem>
                      {parentCategoryOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {categoriesLoading && <p className="text-xs text-muted-foreground mt-1">Loading parent categories...</p>}
                </div>
              </div>
            </div>
          </div>
          <ScrollBar orientation="vertical" />
        </ScrollArea>
        <div className="flex justify-end gap-2 mt-4 p-4 border-t">
          {initialData && ( // Only show "Copy as Draft" on edit mode
            <Button
              variant="outline"
              onClick={handleDuplicateAsDraft}
              disabled={isDuplicatingCategory}
            >
              <Copy className="h-4 w-4 mr-2" />
              {isDuplicatingCategory ? "Copying..." : "Copy as Draft"}
            </Button>
          )}
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSaveClick} disabled={!categoryName}>
            {initialData ? "Save Changes" : "Create Category"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCategoryDialog;