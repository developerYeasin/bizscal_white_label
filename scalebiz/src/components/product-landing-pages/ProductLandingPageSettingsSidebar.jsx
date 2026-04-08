"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.jsx";
import { Sparkles, Trash2, Loader2 } from "lucide-react";
import { useProductLandingPage } from "@/hooks/use-product-landing-page.js";
import { useAvailableLandingPageTemplates } from "@/hooks/use-available-landing-page-templates.js";
import { Skeleton } from "@/components/ui/skeleton.jsx";
import DeleteConfirmationDialog from "@/components/ui/DeleteConfirmationDialog.jsx"; // Import DeleteConfirmationDialog
import { showError, showSuccess } from "@/utils/toast.js";

const ProductLandingPageSettingsSidebar = ({
  productId,
  landingPageConfig,
  updateNested,
  onSave,
  isSaving,
  onDeleteLandingPage,
  isDeleting,
  onTemplateSelect,
}) => {
  // Removed useAvailableLandingPageTemplates as it's now used in the parent component
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);

  // The template selection logic is now handled by the parent component and passed via onTemplateSelect
  // No longer need to fetch templates directly here.

  // Removed template selection UI from here

  return (
    <div className="space-y-6">
      {/* The 'Templates' card was here and has been moved to the main page */}

      <Card>
        <CardHeader>
          <CardTitle>Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white" onClick={onSave} disabled={isSaving}>
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Sparkles className="h-4 w-4 mr-2" />}
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
          {landingPageConfig && ( // Only show delete if a landing page exists
            <Button variant="destructive" className="w-full" onClick={() => setIsDeleteDialogOpen(true)} disabled={isDeleting}>
              {isDeleting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Trash2 className="h-4 w-4 mr-2" />}
              {isDeleting ? 'Deleting...' : 'Delete Landing Page'}
            </Button>
          )}
        </CardContent>
      </Card>

      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={onDeleteLandingPage}
        title="Are you absolutely sure?"
        description="This action cannot be undone. This will permanently delete this product's custom landing page configuration."
      />
    </div>
  );
};

export default ProductLandingPageSettingsSidebar;