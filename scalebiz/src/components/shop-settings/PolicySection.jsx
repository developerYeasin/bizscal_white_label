"use client";

import React from "react";
import { CardContent } from "@/components/ui/card.jsx";
import { Button } from "@/components/ui/button.jsx";
import RichTextEditor from "@/components/ui/RichTextEditor.jsx";
import { useStoreConfig } from "@/contexts/StoreConfigurationContext.jsx";
import { Skeleton } from "@/components/ui/skeleton.jsx";
import CollapsibleCard from "@/components/ui/CollapsibleCard.jsx"; // Import CollapsibleCard

const PolicySection = ({ title, lastUpdated, contentPath }) => {
  const { config, isLoading, updateNested, save, isUpdating } = useStoreConfig();

  const getNestedValue = (obj, path) => {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  };

  const content = config ? getNestedValue(config, contentPath) : '';

  if (isLoading || !config) {
    return (
      <CollapsibleCard title={title}>
        <Skeleton className="h-40 w-full" />
        <div className="flex justify-end mt-4">
          <Skeleton className="h-10 w-32" />
        </div>
      </CollapsibleCard>
    );
  }

  return (
    <CollapsibleCard title={title}>
      <p className="text-sm text-muted-foreground mb-2">Last updated: {lastUpdated}</p>
      <RichTextEditor
        content={content || ''}
        onChange={(newContent) => updateNested(contentPath, newContent)}
      />
      <div className="flex justify-end mt-4">
        <Button onClick={save} disabled={isUpdating}>
          {isUpdating ? 'Saving...' : 'Update Policy'}
        </Button>
      </div>
    </CollapsibleCard>
  );
};

export default PolicySection;