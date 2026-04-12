"use client";

import React, { useEffect, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useStore } from "@/context/StoreContext.jsx";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import ComponentResolver from "@/components/ComponentResolver";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { useStorePath } from "@/hooks/use-store-path";
import { showError } from "@/utils/toast.js";
import { apiClient } from "@/lib/api.js";

const StorePage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { storeConfig, isLoading: isStoreLoading } = useStore();
  const getPath = useStorePath();

  // Check if we are previewing a custom page from the page builder
  const previewPage = storeConfig?.preview_custom_page;
  const isPreviewMode = previewPage && previewPage.slug === slug;

  const {
    data: apiPageData,
    isLoading: isPageLoading,
    error: pageError,
  } = useQuery({
    queryKey: ["storePage", slug, { preview: !!previewPage }],
    queryFn: async () => {
      if (isPreviewMode) {
        // In preview mode, don't fetch from API; use the preview data
        return null;
      }
      // Normal mode: fetch from backend
      const response = await apiClient.get(`/pages/${slug}`);
      return response.data.data.page;
    },
    enabled: !!slug && !isPreviewMode,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });

  // Determine which page data to use
  const pageData = useMemo(() => {
    if (isPreviewMode && previewPage) {
      return previewPage;
    }
    return apiPageData;
  }, [isPreviewMode, previewPage, apiPageData]);

  // Parse content if it's a string (e.g., stringified JSON from API)
  const pageContent = useMemo(() => {
    if (!pageData?.content) return null;
    if (typeof pageData.content === "string") {
      try {
        return JSON.parse(pageData.content);
      } catch (e) {
        return pageData.content; // It's likely raw HTML
      }
    }
    return pageData.content;
  }, [pageData?.content]);

  const isLoading = isStoreLoading || (!isPreviewMode && isPageLoading);
  const error = isPreviewMode ? null : pageError;

  const blocks = useMemo(() => {
    if (!pageContent) return [];
    if (Array.isArray(pageContent)) return pageContent;
    return pageContent.blocks || [];
  }, [pageContent]);

  const hasSystemHeader = useMemo(
    () => blocks.some((b) => b.type === "systemHeader"),
    [blocks],
  );
  const hasSystemFooter = useMemo(
    () => blocks.some((b) => b.type === "systemFooter"),
    [blocks],
  );

  const isLegacyHtml = useMemo(
    () => typeof pageContent === "string",
    [pageContent],
  );

  useEffect(() => {
    if (pageError) {
      console.error("Page not found:", pageError);
      showError("Page not found.");
      // Optionally navigate to 404
    }
  }, [pageError]);

  // SEO: set document title and meta description
  useEffect(() => {
    if (pageData) {
      const title = pageData.meta_title || pageData.title;
      document.title =
        `${title} | ${storeConfig?.storeConfiguration?.storeName || ""}`.trim();
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute("content", pageData.meta_description || "");
      }
    }
  }, [pageData, storeConfig]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header
          layout={storeConfig?.layout}
          storeName={storeConfig?.storeConfiguration?.storeName}
          logoUrl={storeConfig?.storeConfiguration?.logoUrl}
          themeId={storeConfig?.storeConfiguration?.themeId}
        />
        <main className="flex-grow container mx-auto px-4 py-8">
          <Skeleton className="h-8 w-1/3 mb-6" />
          <Skeleton className="h-64 w-full" />
        </main>
        <Footer
          layout={storeConfig?.layout?.footer}
          copyrightText={storeConfig?.layout?.footer?.copyrightText}
          socialLinks={storeConfig?.layout?.footer?.socialLinks}
          logoUrl={storeConfig?.storeConfiguration?.logoUrl}
          storeName={storeConfig?.storeConfiguration?.storeName}
        />
      </div>
    );
  }

  if (pageError || !pageData) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header
          layout={storeConfig?.layout}
          storeName={storeConfig?.storeConfiguration?.storeName}
          logoUrl={storeConfig?.storeConfiguration?.logoUrl}
          themeId={storeConfig?.storeConfiguration?.themeId}
        />
        <main className="flex-grow container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Page Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The page you are looking for does not exist.
          </p>
          <Button onClick={() => navigate("/")}>Go to Homepage</Button>
        </main>
        <Footer
          layout={storeConfig?.layout?.footer}
          copyrightText={storeConfig?.layout?.footer?.copyrightText}
          socialLinks={storeConfig?.layout?.footer?.socialLinks}
          logoUrl={storeConfig?.storeConfiguration?.logoUrl}
          storeName={storeConfig?.storeConfiguration?.storeName}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        {/* Render Content */}
        <div
          className={blocks.length > 0 ? "" : "container mx-auto px-4 pb-12"}
        >
          {blocks.length > 0 ? (
            // Modern page with blocks
            blocks.map((block, index) => (
              <ComponentResolver
                key={block.id || index}
                type={block.type}
                data={block.data}
                children={block.children}
                themeConfig={storeConfig?.theme}
                isStorefront={true}
                // Pass layout and store info for system blocks
                layout={
                  block.type === "systemHeader"
                    ? storeConfig?.layout
                    : block.type === "systemFooter"
                      ? storeConfig?.layout?.footer
                      : undefined
                }
                storeName={storeConfig?.storeConfiguration?.storeName}
                logoUrl={storeConfig?.storeConfiguration?.logoUrl}
                themeId={storeConfig?.storeConfiguration?.themeId}
                copyrightText={storeConfig?.layout?.footer?.copyrightText}
                socialLinks={storeConfig?.layout?.footer?.socialLinks}
              />
            ))
          ) : isLegacyHtml ? (
            // Legacy page with HTML content
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: pageContent }}
            />
          ) : (
            // No content
            <div className="text-center py-12 text-muted-foreground">
              <p>This page has no content yet.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default StorePage;
