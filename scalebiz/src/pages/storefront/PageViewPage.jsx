"use client";

import React from "react";
import { useParams, Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "@/utils/api.js";
import { useStoreConfig } from "@/contexts/StoreConfigurationContext.jsx";
import ComponentResolver from "@/components/landing-pages/ComponentResolver.jsx";
import { Skeleton } from "@/components/ui/skeleton.jsx";
import { Button } from "@/components/ui/button.jsx";

const PageViewPage = () => {
  const { slug } = useParams();
  const { config: themeConfig } = useStoreConfig();

  const { data: page, isLoading, error } = useQuery({
    queryKey: ["page", slug],
    queryFn: async () => {
      const response = await api.get(`/pages/${slug}`);
      return response.data.data.page;
    },
    enabled: !!slug,
  });

  if (!slug) {
    return <Navigate to="/" replace />;
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-10 w-1/3 mb-6" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Page Not Found</h1>
        <p className="text-muted-foreground mb-6">The page you're looking for doesn't exist.</p>
        <Button onClick={() => window.history.back()}>Go Back</Button>
      </div>
    );
  }

  // Parse content if it's a JSON string
  let pageContent = page.content;
  if (typeof page.content === "string") {
    try {
      pageContent = JSON.parse(page.content);
    } catch (e) {
      // content is plain HTML or text
      pageContent = { html: page.content, blocks: [] };
    }
  }

  const hasBlocks = pageContent?.blocks && pageContent.blocks.length > 0;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Title */}
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: `var(--dynamic-heading-font)` }}>
          {page.title}
        </h1>
      </header>

      {/* Page Content */}
      <div className="max-w-4xl mx-auto">
        {hasBlocks ? (
          // Render block-based content using ComponentResolver
          <ComponentResolver
            components={pageContent.blocks}
            themeConfig={themeConfig}
          />
        ) : (
          // Render legacy HTML content
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: pageContent.html || page.content || "" }}
          />
        )}
      </div>
    </div>
  );
};

export default PageViewPage;
