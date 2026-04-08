"use client";

import React from "react";
import ThemeCard from "@/components/customize-theme/ThemeCard.jsx";
import { Skeleton } from "@/components/ui/skeleton.jsx";
import { useAvailableLandingPageTemplates } from "@/hooks/use-available-landing-page-templates.js"; // Corrected import
import { useProductLandingPage } from "@/hooks/use-product-landing-page.js"; // To get current landing page config

const AvailableThemesSection = ({ productId, landingPageConfig, onTemplateSelect, isUpdating }) => {
  const { data: availableTemplates, isLoading: isLoadingTemplates, error: templatesError } = useAvailableLandingPageTemplates();

  if (isLoadingTemplates) {
    return (
      <div className="mb-6">
        <Skeleton className="h-7 w-48 mb-4" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Skeleton className="h-60 w-full" />
          <Skeleton className="h-60 w-full" />
          <Skeleton className="h-60 w-full" />
        </div>
      </div>
    );
  }

  if (templatesError) {
    return (
      <div className="mb-6 text-destructive">
        <h2 className="text-xl font-semibold mb-4">Available Themes</h2>
        <p>Error loading templates: {templatesError.message}</p>
      </div>
    );
  }

  const selectedTemplateId = landingPageConfig?.template_id;

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-4">Available Themes</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {availableTemplates?.map((template) => (
          <ThemeCard
            key={template.id}
            title={template.name}
            imageSrc={template.imageSrc}
            status={template.status}
            isSelected={selectedTemplateId === template.id}
            onSelect={() => onTemplateSelect(template.id)}
            myTheme={false} // Not applicable for landing page templates in the same way as shop themes
            themeId={template.id} // Pass the template's ID as themeId
            disabled={isUpdating || template.access_level === "premium"}
          />
        ))}
        {availableTemplates?.length === 0 && !isLoadingTemplates && !templatesError && (
          <p className="col-span-full text-muted-foreground text-center">No landing page templates found.</p>
        )}
      </div>
    </div>
  );
};

export default AvailableThemesSection;